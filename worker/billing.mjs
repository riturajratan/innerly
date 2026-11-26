import { fail, id, objectFields, validWebhook, bodyText } from './security.mjs';

const openStates = new Set(['creating', 'created', 'authenticated', 'active', 'pending', 'halted', 'paused']);
const providerStates = new Set(['created', 'authenticated', 'active', 'pending', 'halted', 'paused', 'cancelled', 'completed', 'expired']);
export function plans(env) {
  let values;
  try { values = JSON.parse(env.BILLING_PLANS || '[]'); } catch { fail(503, 'billing_not_configured'); }
  if (!Array.isArray(values)) fail(503, 'billing_not_configured');
  const seen = new Set();
  for (const plan of values) {
    if (!plan || !/^[a-z0-9_-]{1,50}$/.test(plan.key || '') || seen.has(plan.key) || !/^plan_[A-Za-z0-9]+$/.test(plan.providerId || '') ||
      !Number.isSafeInteger(plan.amount) || plan.amount <= 0 || !/^[A-Z]{3}$/.test(plan.currency || '') ||
      !['monthly', 'yearly'].includes(plan.period) || !Number.isInteger(plan.totalCount) || plan.totalCount < 1 || plan.totalCount > 100 ||
      typeof plan.label !== 'string' || plan.label.length > 80) fail(503, 'billing_not_configured');
    seen.add(plan.key);
  }
  return values;
}
export function billingReady(env) {
  return env.BILLING_ENABLED === 'true' && !!(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET && env.RAZORPAY_WEBHOOK_SECRET) && plans(env).length > 0;
}
export function publicPlans(env) {
  return billingReady(env) ? plans(env).map(({ key, label, amount, currency, period, totalCount }) => ({ key, label, amount, currency, period, totalCount })) : [];
}
export function razorpay(env, fetcher = fetch) {
  return async (path, method = 'GET', body) => {
    if (!(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET)) fail(503, 'billing_not_configured');
    let response;
    try {
      response = await fetcher(`https://api.razorpay.com/v1/${path}`, {
        method, headers: { Authorization: `Basic ${btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`)}`, 'Content-Type': 'application/json' },
        ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(12000), redirect: 'manual',
      });
    } catch { fail(502, 'payment_provider_unavailable'); }
    if (!response.ok) fail(502, 'payment_provider_unavailable');
    try { return await response.json(); } catch { fail(502, 'payment_provider_unavailable'); }
  };
}
export async function entitlement(db, userId, now) {
  const row = await db.prepare(`SELECT MAX(p.period_end) AS valid_until FROM payments p
    JOIN subscriptions s ON s.id = p.subscription_id
    WHERE s.user_id = ? AND p.period_start <= ? AND p.period_end > ? AND p.refunded_amount < p.amount`).bind(userId, now, now).first();
  return { active: !!row?.valid_until, validUntil: row?.valid_until || null };
}
export async function requireSubscription(db, userId, now) {
  if (!(await entitlement(db, userId, now)).active) fail(402, 'subscription_required');
}
export async function billingStatus(db, userId, now) {
  const rows = await db.prepare(`SELECT id, plan_key AS plan, status, cancel_scheduled AS cancelScheduled,
    created_at AS createdAt FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT 10`).bind(userId).all();
  return { ...(await entitlement(db, userId, now)), subscriptions: rows.results };
}

function checkout(row, env) {
  if (!row.provider_id) fail(409, 'checkout_pending_reconciliation');
  return { id: row.id, subscriptionId: row.provider_id, keyId: env.RAZORPAY_KEY_ID,
    amount: row.amount, currency: row.currency, status: row.status };
}
export async function createSubscription(db, userId, input, env, now, provider) {
  if (!billingReady(env)) fail(503, 'checkout_not_enabled');
  objectFields(input, ['plan', 'requestId']);
  if (!id(input.requestId)) fail(400, 'invalid_request_id');
  const plan = plans(env).find(p => p.key === input.plan);
  if (!plan) fail(400, 'invalid_plan');
  const existing = await db.prepare('SELECT * FROM subscriptions WHERE user_id = ? AND request_id = ?').bind(userId, input.requestId).first();
  if (existing) {
    if (existing.plan_key !== plan.key) fail(409, 'request_id_reused');
    if (!openStates.has(existing.status)) fail(409, 'subscription_finished');
    return checkout(existing, env);
  }
  if ((await entitlement(db, userId, now)).active) fail(409, 'subscription_already_exists');
  const remotePlan = await provider(`plans/${plan.providerId}`);
  if (remotePlan.id !== plan.providerId || remotePlan.item?.amount !== plan.amount || remotePlan.item?.currency !== plan.currency || remotePlan.period !== plan.period || remotePlan.interval !== 1) fail(503, 'plan_configuration_mismatch');
  const localId = crypto.randomUUID();
  const inserted = await db.prepare(`INSERT OR IGNORE INTO subscriptions
    (id,user_id,request_id,plan_key,provider_plan_id,amount,currency,status,created_at,updated_at)
    VALUES (?,?,?,?,?,?,?,'creating',?,?)`).bind(localId, userId, input.requestId, plan.key, plan.providerId, plan.amount, plan.currency, now, now).run();
  if (inserted.meta.changes !== 1) fail(409, 'subscription_already_exists');
  // Reserve the slot before the external call. An ambiguous timeout MUST NOT create
  // a second subscription on retry. A webhook can recover it using this opaque ID.
  const remote = await provider('subscriptions', 'POST', {
    plan_id: plan.providerId, total_count: plan.totalCount, quantity: 1,
    customer_notify: true, expire_by: now + 86400, notes: { app_subscription_id: localId },
  });
  if (!/^sub_[A-Za-z0-9]+$/.test(remote.id || '') || remote.plan_id !== plan.providerId) fail(502, 'invalid_provider_subscription');
  await db.prepare(`UPDATE subscriptions SET provider_id = ?, status = CASE WHEN status = 'creating' THEN 'created' ELSE status END,
    updated_at = ? WHERE id = ?`).bind(remote.id, now, localId).run();
  return checkout(await db.prepare('SELECT * FROM subscriptions WHERE id = ?').bind(localId).first(), env);
}

function verifyRemoteSubscription(remote, row) {
  if (!remote || !/^sub_[A-Za-z0-9]+$/.test(remote.id || '') || remote.plan_id !== row.provider_plan_id || remote.quantity !== 1 ||
    (row.provider_id && remote.id !== row.provider_id) || !providerStates.has(remote.status)) fail(502, 'subscription_verification_failed');
}

// Refresh authoritative provider data instead of trusting event ordering or a
// checkout redirect. Invoice billing periods, not current subscription dates,
// determine the entitlement for each independently verified captured payment.
export async function reconciliation(db, row, remote, provider, now, extraPaymentId) {
  verifyRemoteSubscription(remote, row);
  const invoices = await provider(`invoices?subscription_id=${remote.id}&count=10`);
  if (!Array.isArray(invoices.items)) fail(502, 'invoice_verification_failed');
  const paymentIds = new Set(invoices.items.filter(i => i.status === 'paid' && i.payment_id).map(i => i.payment_id));
  if (extraPaymentId) paymentIds.add(extraPaymentId);
  const statements = [];
  for (const paymentId of paymentIds) {
    if (!/^pay_[A-Za-z0-9]+$/.test(paymentId)) fail(502, 'payment_verification_failed');
    const payment = await provider(`payments/${paymentId}`);
    if (!/^inv_[A-Za-z0-9]+$/.test(payment.invoice_id || '')) continue; // Mandate authentication is not a subscription period.
    const invoice = await provider(`invoices/${payment.invoice_id}`);
    if (invoice.subscription_id !== remote.id || invoice.payment_id !== payment.id || invoice.id !== payment.invoice_id ||
      payment.id !== paymentId || !['captured', 'refunded'].includes(payment.status) || invoice.status !== 'paid' ||
      payment.amount !== row.amount || payment.currency !== row.currency || invoice.amount_paid !== row.amount ||
      invoice.currency !== row.currency || !Number.isInteger(invoice.billing_start) || !Number.isInteger(invoice.billing_end) ||
      invoice.billing_end <= invoice.billing_start || !Number.isInteger(payment.amount_refunded) ||
      payment.amount_refunded < 0 || payment.amount_refunded > payment.amount) fail(502, 'payment_verification_failed');
    statements.push(db.prepare(`INSERT INTO payments
      (provider_id,subscription_id,invoice_id,amount,currency,refunded_amount,period_start,period_end,verified_at)
      VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(provider_id) DO UPDATE SET
      refunded_amount = MAX(payments.refunded_amount, excluded.refunded_amount), verified_at = excluded.verified_at
      WHERE payments.subscription_id = excluded.subscription_id AND payments.invoice_id = excluded.invoice_id`)
      .bind(payment.id, row.id, invoice.id, payment.amount, payment.currency, payment.amount_refunded, invoice.billing_start, invoice.billing_end, now));
  }
  statements.push(db.prepare(`UPDATE subscriptions SET provider_id = ?, status = ?, updated_at = ?, last_event_at = ?
    WHERE id = ? AND last_event_at <= ?`).bind(remote.id, remote.status, now, now, row.id, now));
  return statements;
}

export async function refreshSubscription(db, userId, localId, provider, now) {
  const row = await db.prepare('SELECT * FROM subscriptions WHERE id = ? AND user_id = ?').bind(localId, userId).first();
  if (!row) fail(404, 'subscription_not_found');
  if (!row.provider_id) fail(409, 'checkout_pending_reconciliation');
  const remote = await provider(`subscriptions/${row.provider_id}`);
  await db.batch(await reconciliation(db, row, remote, provider, now));
  return billingStatus(db, userId, now);
}
export async function cancelSubscription(db, userId, localId, provider, now) {
  const row = await db.prepare('SELECT * FROM subscriptions WHERE id = ? AND user_id = ?').bind(localId, userId).first();
  if (!row) fail(404, 'subscription_not_found');
  if (!row.provider_id) fail(409, 'checkout_pending_reconciliation');
  if (row.cancel_scheduled || !openStates.has(row.status)) return billingStatus(db, userId, now);
  const current = await provider(`subscriptions/${row.provider_id}`);
  verifyRemoteSubscription(current, row);
  if (openStates.has(current.status)) {
    // Unauthenticated subscriptions have no paid cycle to finish.
    const atCycleEnd = ['active', 'authenticated', 'pending', 'halted', 'paused'].includes(current.status) && current.current_end > now;
    const cancelled = await provider(`subscriptions/${row.provider_id}/cancel`, 'POST', { cancel_at_cycle_end: atCycleEnd ? 1 : 0 });
    verifyRemoteSubscription(cancelled, row);
    await db.prepare('UPDATE subscriptions SET status = ?, cancel_scheduled = 1, updated_at = ? WHERE id = ?')
      .bind(cancelled.status, now, row.id).run();
  } else {
    await db.prepare('UPDATE subscriptions SET status = ?, updated_at = ? WHERE id = ?').bind(current.status, now, row.id).run();
  }
  return billingStatus(db, userId, now);
}

export async function webhook(request, env, provider, now) {
  if (!env.RAZORPAY_WEBHOOK_SECRET) fail(503, 'webhook_not_configured');
  const raw = await bodyText(request, 262144);
  if (!await validWebhook(raw, request.headers.get('x-razorpay-signature'), env.RAZORPAY_WEBHOOK_SECRET)) fail(401, 'invalid_webhook_signature');
  const eventId = request.headers.get('x-razorpay-event-id');
  if (!eventId || !/^[A-Za-z0-9_-]{1,150}$/.test(eventId)) fail(400, 'missing_event_id');
  let event;
  try { event = JSON.parse(raw); } catch { fail(400, 'invalid_json'); }
  if (typeof event.event !== 'string') fail(400, 'invalid_event');
  const db = env.DB;
  if (await db.prepare('SELECT id FROM payment_events WHERE id = ?').bind(eventId).first()) return { received: true, duplicate: true };
  let subscriptionId = event.payload?.subscription?.entity?.id;
  const paymentId = event.payload?.payment?.entity?.id || event.payload?.refund?.entity?.payment_id;
  if (!subscriptionId && /^pay_[A-Za-z0-9]+$/.test(paymentId || '')) {
    const payment = await provider(`payments/${paymentId}`);
    if (/^inv_[A-Za-z0-9]+$/.test(payment.invoice_id || '')) {
      subscriptionId = (await provider(`invoices/${payment.invoice_id}`)).subscription_id;
    }
  }
  const statements = [];
  if (/^sub_[A-Za-z0-9]+$/.test(subscriptionId || '')) {
    const remote = await provider(`subscriptions/${subscriptionId}`);
    let row = await db.prepare('SELECT * FROM subscriptions WHERE provider_id = ?').bind(subscriptionId).first();
    if (!row && id(remote.notes?.app_subscription_id)) {
      row = await db.prepare('SELECT * FROM subscriptions WHERE id = ? AND provider_id IS NULL').bind(remote.notes.app_subscription_id).first();
    }
    if (row) statements.push(...await reconciliation(db, row, remote, provider, now,
      ['subscription.charged', 'payment.captured', 'payment.refunded', 'refund.processed'].includes(event.event) ? paymentId : undefined));
  }
  statements.push(db.prepare('INSERT OR IGNORE INTO payment_events(id,type,processed_at) VALUES (?,?,?)').bind(eventId, event.event, now));
  await db.batch(statements); // Failed reconciliation remains retryable; no receipt is written early.
  return { received: true };
}
