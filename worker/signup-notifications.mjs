import { verifyWebhook } from '@clerk/backend/webhooks';
import { bodyText, fail } from './security.mjs';

function slackDestination(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname !== 'hooks.slack.com' || url.port || url.username || url.password || url.search || url.hash || !/^\/services\/[A-Za-z0-9]+\/[A-Za-z0-9]+\/[A-Za-z0-9]+$/.test(url.pathname)) throw new Error();
    return url.href;
  } catch { fail(503, 'signup_notifications_not_configured'); }
}
const clean = (value, max = 160) => typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : '';
const slackText = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function signupMessage(user) {
  const email = (user.email_addresses || []).find(item => item.id === user.primary_email_address_id && item.verification?.status === 'verified');
  const provider = (user.external_accounts || []).some(account => account.provider === 'oauth_google') ? 'Google' : 'Email';
  const name = clean([user.first_name, user.last_name].filter(value => typeof value === 'string').join(' '));
  const signedUp = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date(user.created_at));
  const field = (label, value) => ({ type: 'mrkdwn', text: `*${label}*\n${slackText(value)}`, verbatim: true });
  return {
    text: 'New Know Your Mind signup',
    // Escape user values and disable auto-linking/mentions; labels alone use markup.
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: '🌱 New Know Your Mind signup', emoji: true } },
      { type: 'divider' },
      { type: 'section', fields: [field('Name', name || 'Not provided'), field('Verified email', clean(email?.email_address, 254) || 'Not supplied'), field('Login method', provider), field('Signed up · IST', signedUp)] },
      { type: 'section', text: { type: 'mrkdwn', text: `*Account ID*\n\`${user.id}\``, verbatim: true } },
      { type: 'context', elements: [{ type: 'plain_text', text: 'knowyourmind.ai · New accounts only', emoji: false }] },
    ],
    unfurl_links: false, unfurl_media: false,
  };
}

export async function signupWebhook(request, env, fetcher, now) {
  if (!env.CLERK_WEBHOOK_SIGNING_SECRET || !env.CLERK_WEBHOOK_INSTANCE_ID) fail(503, 'signup_webhook_not_configured');
  const raw = await bodyText(request, 65536);
  let event;
  try {
    event = await verifyWebhook(new Request(request.url, { method: 'POST', headers: request.headers, body: raw }), { signingSecret: env.CLERK_WEBHOOK_SIGNING_SECRET });
  } catch { fail(400, 'invalid_webhook_signature'); }
  if (event.instance_id !== env.CLERK_WEBHOOK_INSTANCE_ID) fail(400, 'wrong_webhook_instance');
  if (event.type !== 'user.created') return { ignored: true };
  const user = event.data;
  const eventId = request.headers.get('svix-id')?.trim();
  if (!/^[A-Za-z0-9_-]{8,200}$/.test(eventId || '') || !/^user_[A-Za-z0-9]+$/.test(user?.id || '') ||
      !Number.isSafeInteger(user.created_at) || user.created_at <= 0 || user.created_at > (now + 300) * 1000 ||
      !Array.isArray(user.email_addresses) || !Array.isArray(user.external_accounts)) fail(400, 'invalid_signup_event');
  const destination = slackDestination(env.SLACK_SIGNUP_WEBHOOK_URL);
  const claim = crypto.randomUUID();
  // A lease blocks simultaneous deliveries but allows a crashed Worker to retry.
  // Deduplicate by user, since redeliveries may receive a different message ID.
  const result = await env.DB.prepare(`INSERT INTO signup_notifications
    (user_id,event_id,claim_token,lease_until,created_at) VALUES (?,?,?,?,?)
    ON CONFLICT(user_id) DO UPDATE SET event_id=excluded.event_id,claim_token=excluded.claim_token,
      lease_until=excluded.lease_until,attempts=signup_notifications.attempts+1
    WHERE signup_notifications.sent_at IS NULL AND signup_notifications.lease_until <= ?`)
    .bind(user.id, eventId, claim, now + 60, now, now).run();
  if (result.meta.changes !== 1) {
    const previous = await env.DB.prepare('SELECT sent_at FROM signup_notifications WHERE user_id = ?').bind(user.id).first();
    if (previous?.sent_at != null) return { duplicate: true };
    fail(503, 'signup_notification_in_progress');
  }
  try {
    const response = await fetcher(destination, { method: 'POST', headers: { 'Content-Type': 'application/json' },
      // workerd supports manual/follow only; reject 3xx via response.ok below.
      body: JSON.stringify(signupMessage(user)), redirect: 'manual', signal: AbortSignal.timeout(8000) });
    if (!response.ok || (await bodyText(response, 1024)).trim() !== 'ok') throw new Error('delivery_failed');
    await env.DB.prepare('UPDATE signup_notifications SET sent_at = ?, lease_until = 0 WHERE user_id = ? AND claim_token = ?')
      .bind(now, user.id, claim).run();
    return { notified: true };
  } catch {
    await env.DB.prepare('UPDATE signup_notifications SET lease_until = 0 WHERE user_id = ? AND claim_token = ? AND sent_at IS NULL')
      .bind(user.id, claim).run();
    // Non-2xx makes Clerk retry. Never log the webhook URL, body or identity data.
    fail(503, 'signup_notification_unavailable');
  }
}
