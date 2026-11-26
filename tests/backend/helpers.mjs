import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { createHmac, generateKeyPairSync, sign } from 'node:crypto';

export function database() {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(readFileSync(new URL('../../migrations/0001_accounts_reports_billing.sql', import.meta.url), 'utf8'));
  const statement = (sql, args = []) => ({
    bind: (...values) => statement(sql, values),
    async first() { return sqlite.prepare(sql).get(...args) || null; },
    async all() { return { results: sqlite.prepare(sql).all(...args) }; },
    async run() { const result = sqlite.prepare(sql).run(...args); return { meta: { changes: result.changes } }; },
    _sql: sql, _args: args,
  });
  return { sqlite, prepare: statement, async batch(statements) {
    sqlite.exec('BEGIN');
    try {
      const results = statements.map(s => { const r = sqlite.prepare(s._sql).run(...s._args); return { meta: { changes: r.changes } }; });
      sqlite.exec('COMMIT'); return results;
    } catch (e) { sqlite.exec('ROLLBACK'); throw e; }
  }};
}
export const timestamp = Math.floor(Date.now() / 1000);
export const plan = { key: 'monthly_inr', label: 'Monthly cloud access', providerId: 'plan_ABC', amount: 29900, currency: 'INR', period: 'monthly', totalCount: 12 };
export function environment(DB = database()) {
  return { DB, APP_ORIGIN: 'https://knowyourmind.ai', CLERK_ISSUER: 'https://clerk.knowyourmind.ai', CLERK_PUBLISHABLE_KEY: `pk_test_${Buffer.from('clerk.knowyourmind.ai$').toString('base64')}`,
    CLERK_SECRET_KEY: 'sk_test_synthetic_only', REPORT_ENCRYPTION_KEY: Buffer.alloc(32, 7).toString('base64'),
    BILLING_ENABLED: 'true', BILLING_PLANS: JSON.stringify([plan]), RAZORPAY_KEY_ID: 'rzp_test_example',
    RAZORPAY_KEY_SECRET: 'test-only', RAZORPAY_WEBHOOK_SECRET: 'test-webhook-only',
    ASSETS: { fetch: async () => new Response('static') },
  };
}
export function request(path, method = 'GET', body, user = 'user_Alice') {
  return new Request(`https://knowyourmind.ai${path}`, { method,
    headers: { Authorization: `Bearer ${user}`, Origin: 'https://knowyourmind.ai', 'Content-Type': 'application/json' },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}
export function webhookRequest(event, eventId = 'evt_ABC', secret = 'test-webhook-only') {
  const raw = JSON.stringify(event);
  return new Request('https://knowyourmind.ai/api/webhooks/razorpay', { method: 'POST', body: raw,
    headers: { 'x-razorpay-event-id': eventId, 'x-razorpay-signature': createHmac('sha256', secret).update(raw).digest('hex') },
  });
}
export async function seededSubscription(env, userId = 'user_Alice') {
  await env.DB.prepare('INSERT OR IGNORE INTO users VALUES (?,?)').bind(userId, timestamp).run();
  const localId = userId === 'user_Alice' ? 'local_subscription_A' : 'local_subscription_B';
  await env.DB.prepare(`INSERT INTO subscriptions(id,user_id,request_id,plan_key,provider_plan_id,provider_id,amount,currency,status,created_at,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)`).bind(localId,userId,'request_ABC',plan.key,plan.providerId,userId === 'user_Alice' ? 'sub_ABC' : 'sub_DEF',plan.amount,plan.currency,'created',timestamp,timestamp).run();
  return localId;
}
export async function seedAccess(env, userId = 'user_Alice', end = timestamp + 3600) {
  const localId = await seededSubscription(env, userId);
  await env.DB.prepare('INSERT INTO payments VALUES (?,?,?,?,?,?,?,?,?)').bind(`pay_${userId}`,localId,`inv_${userId}`,29900,'INR',0,timestamp-60,end,timestamp).run();
}
export function fakeProvider(overrides = {}) {
  const subscription = { id: 'sub_ABC', plan_id: 'plan_ABC', status: 'active', quantity: 1, current_end: timestamp + 3600, notes: {} };
  const invoice = { id: 'inv_ABC', subscription_id: 'sub_ABC', payment_id: 'pay_ABC', status: 'paid', amount_paid: 29900, currency: 'INR', billing_start: timestamp-60, billing_end: timestamp+3600 };
  const payment = { id: 'pay_ABC', invoice_id: 'inv_ABC', status: 'captured', amount: 29900, currency: 'INR', amount_refunded: 0 };
  const calls = [];
  const fetcher = async (url, options) => {
    const path = String(url).split('/v1/')[1]; calls.push({ path, options });
    const result = path in overrides ? overrides[path] : path === 'plans/plan_ABC' ? { id:'plan_ABC',item:{amount:29900,currency:'INR'},period:'monthly',interval:1 } :
      path === 'subscriptions' || path === 'subscriptions/sub_ABC' || path === 'subscriptions/sub_ABC/cancel' ? subscription :
      path.startsWith('invoices?') ? { items:[invoice] } : path === 'invoices/inv_ABC' ? invoice : path === 'payments/pay_ABC' ? payment : null;
    if (!result) return new Response('{}', { status: 500 });
    return Response.json(result);
  };
  return { fetcher, calls, subscription, invoice, payment };
}
export const keyPair = generateKeyPairSync('rsa', { modulusLength: 2048 });
export const jwtKey = keyPair.publicKey.export({ format: 'pem', type: 'spki' }).toString();
export function token(extra = {}) {
  const encoded = x => Buffer.from(JSON.stringify(x)).toString('base64url');
  const body = `${encoded({alg:'RS256',typ:'JWT',kid:'test-key',cat:'cl_B7d4PD111AAA'})}.${encoded({sub:'user_Alice',sid:'sess_ABC',iss:'https://clerk.knowyourmind.ai',azp:'https://knowyourmind.ai',iat:timestamp,nbf:timestamp-10,exp:timestamp+3600,...extra})}`;
  return `${body}.${sign('RSA-SHA256', Buffer.from(body), keyPair.privateKey).toString('base64url')}`;
}
