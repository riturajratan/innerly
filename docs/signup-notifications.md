# New signup alerts

`POST https://knowyourmind.ai/api/webhooks/clerk` handles Clerk's `user.created`
event. Google and email account creation use this same endpoint. Logins, profile
updates and questionnaire completion are ignored.

## Production setup

- Slack workspace: **maddyzone** (`T0CM5NJ9N3Y`).
- Destination: **#knowyourmind-feedbacks** (`C0CLSAU7SKZ`).
- Slack app: **Know Your Mind Alerts** (`A0CLT02N8CX`). Only `incoming-webhook`
  is needed, authorized for the destination channel; no message/history read scope.
- Clerk production instance: `ins_3Luh0pkr7SXTlwfBAnUN0eFh1pg`.
- In Clerk Webhooks, add the endpoint above and subscribe only to `user.created`.
- Store the endpoint's signing secret as `CLERK_WEBHOOK_SIGNING_SECRET` and Slack's
  channel webhook URL as `SLACK_SIGNUP_WEBHOOK_URL` in Cloudflare Worker **Secrets**.
  Do not put either value in chat, public vars, source, build output or GitHub.
- `CLERK_WEBHOOK_INSTANCE_ID` is a public environment variable pinned in wrangler.
- Migration `0002_signup_notifications.sql` is applied by the deployment command.

Setup is not live until both secrets and the Clerk endpoint are configured and a
Clerk test delivery appears in the selected Slack channel. This file does not
assert provider setup or a test delivery has happened.

## Message and delivery behavior

Alerts contain name, verified primary email, account ID, Google/email method and
signup time. Names and email are rendered as plain text, so user input cannot
mention a Slack channel or inject message formatting. No questionnaire answers,
reports, scores, tokens, private metadata or IP addresses are included.

Clerk's SDK verifies the signature and timestamp of the bounded raw request. The
handler pins the production instance, only posts to HTTPS `hooks.slack.com`, does
not follow redirects, and times out a Slack request after 8 seconds.

D1 stores only user/event IDs, attempt count and delivery timestamps. A 60-second
claim prevents parallel deliveries from posting twice. Successful deliveries are
deduplicated by user, including redelivery with a new event ID. Failed/in-progress
requests return a retryable error; Clerk manages retries and manual redelivery.
If retries are exhausted, inspect the Clerk endpoint's delivery attempts and
resend after fixing the destination. Missing secrets return an error, not a false
success. No provider response body or identity payload is logged.

Slack incoming webhooks have no idempotency-key support. A timeout after Slack
accepted a message, or a crash before D1 recorded success, can produce a duplicate
on retry. This is at-least-once delivery, not an exactly-once guarantee.

## Validation

Run `npm test`, `npm run test:runtime`, and `npm run check:deploy`. Automated tests
cover valid signatures, expiry, tampering, instance mismatch, ignored login/edit
events, concurrency, failure/retry, deduplication, URL restrictions, plain-text
identity fields and exclusion of unverified email and private metadata. Use a
synthetic Clerk test event for the live smoke test; never send questionnaire data.

References: [Clerk webhook verification](https://clerk.com/docs/reference/backend/verify-webhook),
[Slack incoming webhooks](https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks/).
