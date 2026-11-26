import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { createApp } from '../../worker/app.mjs';
import { environment, timestamp } from './helpers.mjs';

const secretBytes = Buffer.alloc(32, 13);
function setup(fetcher = async () => new Response('ok')) {
  const env = { ...environment(), CLERK_WEBHOOK_INSTANCE_ID: 'ins_Production',
    CLERK_WEBHOOK_SIGNING_SECRET: `whsec_${secretBytes.toString('base64')}`,
    SLACK_SIGNUP_WEBHOOK_URL: 'https://hooks.slack.com/services/TTEST/BTEST/testonly' };
  return { env, app: createApp({ fetcher, now: () => timestamp }) };
}
const user = { id: 'user_NewAccount', created_at: (timestamp - 1) * 1000, first_name: 'Test', last_name: 'Person',
  primary_email_address_id: 'id_primary', email_addresses: [{ id: 'id_primary', email_address: 'test@example.com', verification: { status: 'verified' } }],
  external_accounts: [{ provider: 'oauth_google' }], private_metadata: { answers: [1,2,3] } };
function delivery({ data = user, type = 'user.created', instance = 'ins_Production', eventId = 'msg_SignupEvent', time = timestamp, body, signature } = {}) {
  const raw = body ?? JSON.stringify({ type, instance_id: instance, data });
  const sig = signature ?? `v1,${createHmac('sha256', secretBytes).update(`${eventId}.${time}.${raw}`).digest('base64')}`;
  return new Request('https://knowyourmind.ai/api/webhooks/clerk', { method: 'POST', body: raw,
    headers: { 'svix-id': eventId, 'svix-timestamp': String(time), 'svix-signature': sig, 'Content-Type': 'application/json' } });
}
test('verified signup sends only selected identity details and deduplicates by user', async () => {
  const calls = []; const { app, env } = setup(async (url, options) => { calls.push({ url, options }); return new Response('ok'); });
  assert.equal((await app.fetch(delivery(), env)).status, 200);
  const payload = JSON.parse(calls[0].options.body);
  assert.match(JSON.stringify(payload), /test@example.com/);
  assert.match(JSON.stringify(payload), /Google/);
  assert.doesNotMatch(JSON.stringify(payload), /private_metadata|answers/);
  assert.equal(payload.blocks[1].text.type, 'plain_text');
  assert.equal(calls[0].options.redirect, 'manual');
  assert.deepEqual(await (await app.fetch(delivery({ eventId: 'msg_Redelivery' }), env)).json(), { duplicate: true });
  assert.equal(calls.length, 1);
  const stored = JSON.stringify(env.DB.sqlite.prepare('SELECT * FROM signup_notifications').all());
  assert.doesNotMatch(stored, /test@example.com|Test Person/);
});
test('invalid, expired, future and wrong-instance events cannot post to Slack', async () => {
  let posts = 0; const { app, env } = setup(async () => { posts++; return new Response('ok'); });
  for (const options of [{ signature: 'v1,invalid' }, { time: timestamp - 600 }, { time: timestamp + 600 }, { instance: 'ins_Other' }, { body: '{invalid' }]) {
    assert.equal((await app.fetch(delivery(options), env)).status, 400);
  }
  assert.equal(posts, 0);
  assert.equal(env.DB.sqlite.prepare('SELECT count(*) AS count FROM signup_notifications').get().count, 0);
});
test('normal logins and profile edits are ignored, even with Slack not configured', async () => {
  const { app, env } = setup(() => { throw new Error('must not post'); });
  delete env.SLACK_SIGNUP_WEBHOOK_URL;
  for (const type of ['session.created', 'user.updated', 'user.deleted']) {
    assert.deepEqual(await (await app.fetch(delivery({ type }), env)).json(), { ignored: true });
  }
});
test('missing configuration, malformed users and oversized bodies fail without acknowledging delivery', async () => {
  const { app, env } = setup(() => { throw new Error('must not post'); });
  assert.equal((await app.fetch(delivery(), { ...env, CLERK_WEBHOOK_SIGNING_SECRET: '' })).status, 503);
  assert.equal((await app.fetch(delivery(), { ...env, SLACK_SIGNUP_WEBHOOK_URL: '' })).status, 503);
  assert.equal((await app.fetch(delivery({ data: { ...user, created_at: null } }), env)).status, 400);
  assert.equal((await app.fetch(delivery({ body: 'x'.repeat(65537) }), env)).status, 413);
});
test('Slack destination cannot be redirected to an arbitrary server', async () => {
  const { app, env } = setup(() => { throw new Error('must not post'); });
  for (const url of ['http://hooks.slack.com/services/A/B/C', 'https://evil.example/services/A/B/C', 'https://hooks.slack.com.evil.example/services/A/B/C', 'https://hooks.slack.com/services/A/B/C?token=1', 'https://user:pass@hooks.slack.com/services/A/B/C']) {
    assert.equal((await app.fetch(delivery(), { ...env, SLACK_SIGNUP_WEBHOOK_URL: url })).status, 503);
  }
});
test('delivery failures return retryable errors and release the claim for a later attempt', async () => {
  for (const failure of [async () => new Response(null, { status: 302, headers: { Location: 'https://example.com/' } }), async () => new Response('rate_limited', { status: 429 }), async () => new Response('not_ok'), async () => { throw new Error('secret-url'); }]) {
    let attempt = 0;
    const { app, env } = setup(async () => { attempt++; return attempt === 1 ? failure() : new Response('ok'); });
    const response = await app.fetch(delivery(), env);
    assert.equal(response.status, 503); assert.doesNotMatch(await response.text(), /secret-url|hooks.slack/);
    assert.equal((await app.fetch(delivery(), env)).status, 200);
    assert.equal(env.DB.sqlite.prepare('SELECT attempts FROM signup_notifications').get().attempts, 2);
  }
});
test('concurrent delivery cannot send twice; a stale claim can be retried', async () => {
  let release; let started;
  const waiting = new Promise(resolve => { started = resolve; });
  let posts = 0;
  const { app, env } = setup(async () => { posts++; started(); await new Promise(resolve => { release = resolve; }); return new Response('ok'); });
  const first = app.fetch(delivery(), env); await waiting;
  assert.equal((await app.fetch(delivery({ eventId: 'msg_Concurrent' }), env)).status, 503);
  release(); assert.equal((await first).status, 200); assert.equal(posts, 1);
  env.DB.sqlite.prepare('UPDATE signup_notifications SET sent_at = NULL, lease_until = ?').run(timestamp - 1);
  const retryApp = createApp({ fetcher: async () => new Response('ok'), now: () => timestamp });
  assert.equal((await retryApp.fetch(delivery(), env)).status, 200);
});
test('names cannot inject Slack formatting and unverified email is excluded', async () => {
  let payload; const { app, env } = setup(async (_, options) => { payload = JSON.parse(options.body); return new Response('ok'); });
  const data = { ...user, first_name: '<!channel>\nInjected', external_accounts: [], email_addresses: [{ id:'id_primary', email_address: 'unverified@example.com', verification: { status: 'unverified' } }] };
  assert.equal((await app.fetch(delivery({ data }), env)).status, 200);
  assert.equal(payload.blocks[1].text.type, 'plain_text');
  assert.doesNotMatch(JSON.stringify(payload), /unverified@example.com/);
  assert.match(payload.blocks[1].text.text, /Sign-in method: Email/);
});
