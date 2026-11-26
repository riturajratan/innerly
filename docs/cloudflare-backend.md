# KnowYourMind backend and Cloudflare deployment

The website and `/api/*` backend run in one Cloudflare Worker. The existing
questionnaire and local reports remain available. `cloud-account.html` provides
Clerk sign-in, explicit per-report uploads, cloud report reading/export/deletion,
subscription checkout, billing refresh and cancellation.

## Release state and product boundaries

- Cloudflare account: `72dbaa9606b6dd363b5a50e3e0d656c4`.
- D1 database: `knowyourmind-production`, ID `bb0c3e32-1e6d-4c07-b170-d22a50d7959a`.
- Created in the user's Cloudflare account on 26 November 2026. Migration 0001
  was applied through the D1 console and recorded in `d1_migrations`; the six
  application tables and migration table were verified in that console.
- Worker name: `knowyourmind`; static assets: `dist/`.
- Production origin: `https://knowyourmind.ai`. The domain is registered; the
  Worker custom domain and Clerk DNS cutover remain separate deployment steps.
- Checkout is **disabled** in the checked-in configuration. No price has been
  chosen and no live plan or merchant credential has been configured.
- Existing local reports stay free. This implementation gates **new cloud saves**
  on an active, verified subscription. Previously saved cloud data remains
  readable/exportable/deletable after expiry. This is not a paywall around the
  existing public local report generator. Final paid benefits and prices still
  need a product decision before opening checkout.
- The old USD 1 single-report proposal is historical. This backend uses recurring
  subscriptions, following the owner's latest direction; it does not create any
  live subscription automatically.
- No AI analysis, transactional report email service, or server PDF generation
  is enabled by this work. Report export is JSON; existing browser printing works.

## Local development and verification

Use Node 22 or later. Run `npm ci`, copy `.dev.vars.example` to `.dev.vars`, and
enter development-only configuration there. It is ignored by Git. Generate a
32-byte report encryption key once with `openssl rand -base64 32`, store it in the
ignored file and back it up securely. Do not print or paste real service secrets
in chat, committed files or build logs.

```sh
npm run test
npm run build
npm run db:migrate:local
npm run dev
```

Open `http://localhost:8787/cloud-account.html`. Use a Clerk development instance
and set `APP_ORIGIN=http://localhost:8787`. All private API calls use a Clerk session
Bearer token. Cookies alone are deliberately not sufficient; browser writes also
require the exact configured Origin. Tests use genuine RSA-signed synthetic JWTs
through the installed Clerk SDK, SQLite with the real migration, and a simulated
payment provider. Test plan prices are fixtures, not approved production prices.
`npm run test:runtime` additionally exercises the actual local workerd runtime
and D1 with synthetic signed sessions and an isolated temporary database, then
removes its fixture credentials and data.

## Production configuration

`wrangler.jsonc` is the source of truth for public variables and D1 bindings.
Update its public fields before deploying; a later Wrangler deployment can replace
dashboard variables. Secrets are configured separately and never committed.

| Variable | Where / purpose |
| --- | --- |
| `APP_ORIGIN` | Public var: exact origin, no trailing slash. |
| `CLERK_PUBLISHABLE_KEY` | Public var: production key for the existing Clerk application after its domain is configured. |
| `CLERK_ISSUER` | Public var: exact JWT issuer URL from that same Clerk instance. |
| `CLERK_SECRET_KEY` | Worker secret: corresponding backend secret. Required by Clerk authenticateRequest. |
| `CLERK_JWT_KEY` | Optional PEM public key: avoids JWKS network requests; update it on Clerk key rotation. |
| `REPORT_ENCRYPTION_KEY` | Worker secret: 32 random bytes, base64. Stable across deploys. |
| `RAZORPAY_KEY_ID` | Worker secret: merchant API key ID, returned only to its checkout owner when needed. |
| `RAZORPAY_KEY_SECRET` | Worker secret: matching merchant API secret. |
| `RAZORPAY_WEBHOOK_SECRET` | Worker secret: separate secret used to verify raw webhook bodies. |
| `BILLING_PLANS` | Public var: JSON catalog described below. Empty until plans are approved. |
| `BILLING_ENABLED` | Public var: keep `false` until test-mode and live configuration checks pass. |

Use `npx wrangler secret put NAME` to enter each secret interactively, or use the
Worker dashboard's Variables and Secrets section. Existing report encryption
keys must not be replaced without a controlled data re-encryption migration;
otherwise existing cloud reports cannot be decrypted. Application ciphertext is
AES-256-GCM, bound to owner ID, report ID and questionnaire version.

The current Clerk production application serves the older portfolio domain.
Configure the new domain and callback/return URLs in that existing application,
apply its displayed DNS records and verify login on the new origin. Keep its
user identities. Never copy the old domain's issuer blindly. The Worker serves
`/auth-config.mjs` dynamically so frontend and backend share the same public key.
Google production login remains off until separately configured.

## GitHub and deployment

Repository: `https://github.com/riturajratan/innerly`, production branch `main`.
Backend work was integrated in an isolated checkout to preserve unrelated local
changes. Cloudflare GitHub access is connected to this repository.
The existing GitHub Pages deployment workflow is retained during migration.

1. Commit the reviewed source to the correct repository, excluding `.env.local`,
   `.dev.vars`, credentials, `node_modules`, `.wrangler` and local logs.
2. Cloudflare > Workers & Pages > Create application > GitHub. Select only the
   intended repository. Production branch: `main`. Root directory: the directory
   containing `package.json` and `wrangler.jsonc` (repo root if this checkout is
   pushed as-is).
3. Build command: `npm ci && npm test && npm run build`.
4. Deploy command: `npx wrangler d1 migrations apply DB --remote && npx wrangler deploy`.
   These are additive schema migrations. Review future destructive migrations
   separately. Do not run a production DB migration from an untrusted PR build.
5. Set runtime secrets and public variables. Test development/staging with its
   own D1 database and test payment keys. Do not bind preview deployments to the
   production D1 database or production payment credentials.
6. Verify the deployment, then add `knowyourmind.ai` under the Worker's Domains &
   Routes > Custom Domain. Configure `www` to redirect to the apex separately.
7. Update existing canonical URLs, sitemap, public branding and legal/support
   pages for the new domain before a public launch. Old browser storage is tied
   to the old origin; it does not automatically follow the domain change.
8. Retire the old GitHub Pages publish job only after the new site and login pass
   live checks. Backend tests are also run in the added GitHub CI workflow.

## Subscription setup

For an India-based merchant, complete Razorpay onboarding, enable Subscriptions,
and obtain approval for international recurring cards as appropriate to the
business account. INR and international plan prices must be chosen explicitly.
UPI recurring payments are for supported INR methods, not foreign currencies.

Create monthly/yearly plans in Razorpay **test mode first**. Add catalog entries
with these fields to `BILLING_PLANS`:

- `key`: internal choice, for example `monthly_inr`.
- `label`: user-facing plan name.
- `providerId`: exact Razorpay `plan_...` ID.
- `amount`: integer minor units matching the provider's plan (INR/USD use 100
  minor units per unit).
- `currency`: uppercase currency code; `period`: `monthly` or `yearly`.
- `totalCount`: approved finite number of renewal cycles, between 1 and 100.

Do not use the test fixtures' prices as production defaults. The server verifies
the provider plan's price, currency, interval and period before creating checkout.
Client amounts, arbitrary plan IDs, user IDs and paid flags are rejected.

Webhook URL: `https://knowyourmind.ai/api/webhooks/razorpay`. Enable subscription
lifecycle events, `subscription.charged`, `payment.captured`, `payment.refunded`
and `refund.processed`. Use separate test and live webhook secrets.

Webhook signatures are checked over the original raw body. Processing refetches
the subscription, invoices and captured payments from Razorpay. Entitlements use
the verified invoice's billing period. Duplicate receipts and payment IDs are
idempotent; DB changes and the receipt commit in one batch. Full refunds remove
that payment's access; partial refunds preserve the remaining paid access.
Cancellation is scheduled for period end when a paid cycle exists. Existing
verified periods expire by timestamp, even without another webhook.

Account billing refresh provides reconciliation after delayed or missed webhooks,
including checkout completion. It checks the latest ten provider invoices;
individual payment/refund webhooks also reconcile their specific invoice. There
is no background reconciliation scheduler yet; monitor webhook delivery in
Razorpay and replay failures. For launch, test renewal, mandate authorization,
declines, duplicate/out-of-order events, full/partial refunds and cancellation
with the real provider sandbox.

Creation reserves a unique open-subscription slot before calling Razorpay. An
ambiguous timeout deliberately keeps that reservation to avoid double recurring
charges. A provider webhook recovers the row using `notes.app_subscription_id`.
If the provider never created a subscription, an operator must verify that in
Razorpay before marking the reservation `expired`; never automatically retry a
potentially successful external create.

## API contract

All private responses are `Cache-Control: private, no-store`. All private routes
require a valid Clerk session belonging to the configured issuer and origin.

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/api/health` | Public process health; not a full external-service readiness check. |
| GET | `/api/config` | Public capability flags and approved public prices, no secrets. |
| GET | `/api/me` | Account ID, paid-until timestamp and recent subscription states. |
| POST | `/api/reports` | Active subscription; save one complete 36-answer report with explicit consent. |
| GET | `/api/reports?cursor=...` | Owner's report metadata, 50 per page, next cursor. |
| GET | `/api/reports/:id` | Owner's decrypted report. |
| GET | `/api/reports/:id/export` | Owner's JSON export, including after subscription expiry. |
| DELETE | `/api/reports/:id` | Owner-only permanent deletion of the cloud row. |
| POST | `/api/billing/subscriptions` | `{plan, requestId}`; returns provider checkout ID, not paid access. |
| POST | `/api/billing/subscriptions/:id/refresh` | `{}`; reconciles provider state and returns billing status. |
| POST | `/api/billing/subscriptions/:id/cancel` | `{}`; cancels renewals, retaining paid period access. |
| POST | `/api/webhooks/razorpay` | Provider HMAC signature instead of a user session. |

Report POST: `{clientId, version:"innerly-workbook-v1", language, answers:[36 integers
0..4], assessedAt:ISO timestamp, consent:"cloud-reports-v1"}`. Identical client IDs
are idempotent per user; conflicting content is rejected. Skipped/legacy reports
remain local and are not silently transformed into the current schema.

API limits: 60 authenticated requests per user/minute; billing routes 6/minute;
16 KiB normal request bodies and 256 KiB webhook bodies. Database queries are
parameterized. No questionnaire data is stored in Clerk or payment metadata.
Private request/response bodies and credentials are not logged. No static asset
contains a saved cloud report. Application failures return a request ID without
internal exception details.

User deletion removes the live row. D1 recovery snapshots may retain prior data
for the provider's retention period; describe this in the final privacy policy.
Set up a recovery/export process and test restoration before relying on cloud
storage as users' only copy.

Official references: [Workers assets](https://developers.cloudflare.com/workers/static-assets/),
[Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/),
[D1](https://developers.cloudflare.com/d1/get-started/),
[Clerk request authentication](https://clerk.com/docs/reference/backend/authenticate-request),
[Razorpay Subscriptions](https://razorpay.com/docs/payments/subscriptions/integration-guide),
[Webhook validation](https://razorpay.com/docs/webhooks/validate-test).
