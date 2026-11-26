import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp, CONSENT_VERSION } from '../../worker/app.mjs';
import { environment, request, timestamp, seedAccess, seededSubscription, fakeProvider, webhookRequest } from './helpers.mjs';

const makeApp = (fetcher) => createApp({authenticateUser:async r=>r.headers.get('authorization').replace('Bearer ',''),now:()=>timestamp,fetcher});
const report = () => ({clientId:'client_report_ABC',version:'innerly-workbook-v1',language:'en',answers:Array(36).fill(2),assessedAt:new Date(timestamp*1000).toISOString(),consent:CONSENT_VERSION});
const charged = {event:'subscription.charged',payload:{subscription:{entity:{id:'sub_ABC'}},payment:{entity:{id:'pay_ABC'}}}};

test('subscription-gated save, encrypted storage, owner-only list/read/export/delete and retry idempotency', async () => {
  const env=environment(),app=makeApp();
  assert.equal((await app.fetch(request('/api/reports','POST',report()),env)).status,402);
  await seedAccess(env);
  const response=await app.fetch(request('/api/reports','POST',report()),env); assert.equal(response.status,201);
  const saved=await response.json();
  assert.equal((await app.fetch(request('/api/reports','POST',report()),env)).status,200);
  assert.equal((await app.fetch(request('/api/reports','POST',{...report(),answers:Array(36).fill(4)}),env)).status,409);
  assert.equal(env.DB.sqlite.prepare('SELECT count(*) AS n FROM assessments').get().n,1);
  const stored=env.DB.sqlite.prepare('SELECT * FROM assessments').get();
  assert.ok(!stored.responses_ciphertext.includes(JSON.stringify(report().answers)));
  assert.equal(stored.consent_version,CONSENT_VERSION);
  assert.equal((await app.fetch(request(`/api/reports/${saved.id}`,'GET',undefined,'user_Bob'),env)).status,404);
  assert.deepEqual((await (await app.fetch(request('/api/reports','GET',undefined,'user_Bob'),env)).json()).reports,[]);
  assert.equal((await app.fetch(request(`/api/reports/${saved.id}`,'DELETE',undefined,'user_Bob'),env)).status,404);
  assert.deepEqual((await (await app.fetch(request(`/api/reports/${saved.id}/export`),env)).json()).answers,report().answers);
  // Data remains readable/exportable after expiry. New cloud saves require an active subscription.
  env.DB.sqlite.exec(`UPDATE payments SET period_end=${timestamp-1}`);
  assert.equal((await app.fetch(request(`/api/reports/${saved.id}`),env)).status,200);
  assert.equal((await app.fetch(request('/api/reports','POST',{...report(),clientId:'client_report_NEW'}),env)).status,402);
  assert.equal((await app.fetch(request(`/api/reports/${saved.id}`,'DELETE'),env)).status,200);
  assert.equal((await app.fetch(request(`/api/reports/${saved.id}`),env)).status,404);
});
test('report validation rejects consent omission, skips, extra fields, bad dates, unknown versions and wrong answer count', async () => {
  const env=environment(),app=makeApp(); await seedAccess(env);
  for (const edit of [{consent:null},{answers:[0]},{answers:Array(36).fill('skip')},{answers:Array(36).fill(5)},{version:'other'},{language:'xx'},{userId:'user_Bob'},{assessedAt:'tomorrow'}]) {
    assert.equal((await app.fetch(request('/api/reports','POST',{...report(),...edit}),env)).status,400);
  }
});
test('checkout validates server catalog, reserves once and returns same subscription on retry', async () => {
  const env=environment(),provider=fakeProvider(),app=makeApp(provider.fetcher);
  const body={plan:'monthly_inr',requestId:'checkout_ABC'};
  assert.equal((await app.fetch(request('/api/billing/subscriptions','POST',{...body,amount:1}),env)).status,400);
  const first=await app.fetch(request('/api/billing/subscriptions','POST',body),env); assert.equal(first.status,201);
  const data=await first.json(); assert.equal(data.amount,29900);
  assert.equal((await app.fetch(request('/api/billing/subscriptions','POST',body),env)).status,201);
  assert.equal(provider.calls.filter(c=>c.path==='subscriptions').length,1);
  assert.equal((await app.fetch(request('/api/billing/subscriptions','POST',{...body,requestId:'checkout_NEW'}),env)).status,409);
  assert.equal((await (await app.fetch(request('/api/me'),env)).json()).billing.active,false);
});
test('ambiguous provider failures reserve checkout and never create duplicate recurring subscriptions', async () => {
  const env=environment(),provider=fakeProvider({subscriptions:null}),app=makeApp(provider.fetcher),body={plan:'monthly_inr',requestId:'checkout_ABC'};
  assert.equal((await app.fetch(request('/api/billing/subscriptions','POST',body),env)).status,502);
  assert.equal((await app.fetch(request('/api/billing/subscriptions','POST',body),env)).status,409);
  assert.equal(provider.calls.filter(c=>c.path==='subscriptions').length,1);
});
test('missing billing configuration fails closed; public config never exposes secret keys', async () => {
  const env=environment();env.BILLING_ENABLED='false';const app=makeApp();
  const config=await (await app.fetch(request('/api/config'),env)).json();
  assert.deepEqual(config.plans,[]);assert.equal(config.billingEnabled,false);
  assert.ok(!JSON.stringify(config).includes(env.RAZORPAY_KEY_SECRET));
  assert.equal((await app.fetch(request('/api/billing/subscriptions','POST',{plan:'monthly_inr',requestId:'checkout_ABC'}),env)).status,503);
  env.CLERK_PUBLISHABLE_KEY='sk_live_misconfigured_secret';
  const badConfig=await app.fetch(request('/auth-config.mjs'),env);
  assert.equal(badConfig.status,503);assert.ok(!(await badConfig.text()).includes(env.CLERK_PUBLISHABLE_KEY));
});
test('D1 batch rolls back entitlement writes and receipts together on a failure', async () => {
  const env=environment();await seededSubscription(env);
  await assert.rejects(env.DB.batch([
    env.DB.prepare('INSERT INTO payments VALUES (?,?,?,?,?,?,?,?,?)').bind('pay_ABC','local_subscription_A','inv_ABC',29900,'INR',0,timestamp-1,timestamp+3600,timestamp),
    env.DB.prepare('INSERT INTO payments VALUES (?,?,?,?,?,?,?,?,?)').bind('pay_DEF','nonexistent_subscription','inv_DEF',29900,'INR',0,timestamp-1,timestamp+3600,timestamp),
    env.DB.prepare('INSERT INTO payment_events VALUES (?,?,?)').bind('evt_ABC','subscription.charged',timestamp),
  ]));
  assert.equal(env.DB.sqlite.prepare('SELECT count(*) AS n FROM payments').get().n,0);
  assert.equal(env.DB.sqlite.prepare('SELECT count(*) AS n FROM payment_events').get().n,0);
});
test('signed webhook verifies captured payment and invoice, handles duplicates, stale events and full refunds', async () => {
  const env=environment(),provider=fakeProvider(),app=makeApp(provider.fetcher); await seededSubscription(env);
  assert.equal((await app.fetch(webhookRequest(charged,'evt_bad','wrong-secret'),env)).status,401);
  assert.equal((await app.fetch(webhookRequest(charged),env)).status,200);
  assert.equal((await (await app.fetch(request('/api/me'),env)).json()).billing.active,true);
  const calls=provider.calls.length;
  assert.equal((await (await app.fetch(webhookRequest(charged),env)).json()).duplicate,true);
  assert.equal(provider.calls.length,calls);
  provider.subscription.status='cancelled';
  const old={...charged,event:'subscription.activated',created_at:timestamp-1000};
  assert.equal((await app.fetch(webhookRequest(old,'evt_old'),env)).status,200);
  assert.equal(env.DB.sqlite.prepare('SELECT status FROM subscriptions').get().status,'cancelled');
  assert.equal(env.DB.sqlite.prepare('SELECT count(*) AS n FROM payments').get().n,1);
  provider.payment.amount_refunded=29900;provider.payment.status='refunded';
  assert.equal((await app.fetch(webhookRequest({event:'refund.processed',payload:{refund:{entity:{payment_id:'pay_ABC'}}}},'evt_refund'),env)).status,200);
  assert.equal((await (await app.fetch(request('/api/me'),env)).json()).billing.active,false);
});
test('wrong amount/currency/invoice ownership cannot grant entitlement or acknowledge a failed webhook', async () => {
  for (const change of ['amount','currency','owner']) {
    const env=environment(),provider=fakeProvider(),app=makeApp(provider.fetcher);await seededSubscription(env);
    if(change==='amount')provider.payment.amount=1;
    if(change==='currency')provider.payment.currency='USD';
    if(change==='owner')provider.invoice.subscription_id='sub_OTHER';
    assert.equal((await app.fetch(webhookRequest(charged),env)).status,502);
    assert.equal(env.DB.sqlite.prepare('SELECT count(*) AS n FROM payments').get().n,0);
    assert.equal(env.DB.sqlite.prepare('SELECT count(*) AS n FROM payment_events').get().n,0);
  }
});
test('owner-only refresh recovers missed webhooks; cancel preserves already paid period', async () => {
  const env=environment(),provider=fakeProvider(),app=makeApp(provider.fetcher);const localId=await seededSubscription(env);
  assert.equal((await app.fetch(request(`/api/billing/subscriptions/${localId}/refresh`,'POST',{},'user_Bob'),env)).status,404);
  assert.equal((await app.fetch(request(`/api/billing/subscriptions/${localId}/cancel`,'POST',{},'user_Bob'),env)).status,404);
  assert.equal((await app.fetch(request(`/api/billing/subscriptions/${localId}/refresh`,'POST',{}),env)).status,200);
  assert.equal((await (await app.fetch(request(`/api/billing/subscriptions/${localId}/cancel`,'POST',{}),env)).json()).active,true);
  assert.deepEqual(JSON.parse(provider.calls.find(c=>c.path.endsWith('/cancel')).options.body),{cancel_at_cycle_end:1});
});
test('user API rate limits are enforced in the database', async () => {
  const env=environment(),app=makeApp();
  for(let i=0;i<60;i++)assert.equal((await app.fetch(request('/api/me'),env)).status,200);
  const response=await app.fetch(request('/api/me'),env);assert.equal(response.status,429);assert.equal(response.headers.get('retry-after'),'60');
});
