# Clerk sign-in

Know Your Mind runs on Cloudflare Workers at **https://knowyourmind.ai/**.
Guests can complete a local check-in without an account. ClerkJS 6 and Clerk UI 1
provide the Google and email sign-in flow. The site has one Sign in / My account
entry; there is no separate Cloud account navigation link.

## Production configuration — 26 November 2026

The existing application and users were retained:
- App: `app_3Lue4T0hoZDzw3d37cE1uRxTE6s`, name **Know Your Mind**.
- Production instance: `ins_3Luh0pkr7SXTlwfBAnUN0eFh1pg`.
- Development instance: `ins_3Lue4UJ3KmSBD5LlGL6xSX8KWjU`.
- Primary domain: `knowyourmind.ai`.
- Frontend API: `https://clerk.knowyourmind.ai`.
- Hosted account portal: `https://accounts.knowyourmind.ai`.
- Home and after-sign-out: `https://knowyourmind.ai/`.
- Application logo and favicon match the website's existing head-and-wave mark.
- Login methods: **Google + verified email code**, explicitly selected by the owner.

All six DNS records were verified in Clerk. The hosted sign-in page opens over
HTTPS and shows Google and email. Completion of a real production Google/email
sign-in and email delivery still requires an owner test; UI rendering alone is
not proof of end-to-end authentication.

## Google OAuth

Reuse Google Cloud project `innerly-514510` and its existing web OAuth client,
now named **Know Your Mind Web**. No OAuth secret was rotated.

- Authorized JavaScript origin: `https://knowyourmind.ai`.
- Redirect: `https://clerk.knowyourmind.ai/v1/oauth_callback`.
- Scopes remain basic identity only: `openid`, email and profile.
- Audience: External, **In production**.
- Google app name/logo, homepage, privacy/terms links and authorized domain were
  updated. Developer contact was corrected to the existing support email.
- Google data-access verification is not required for these basic scopes.
- Brand verification is still pending: the first check required domain ownership.
  Google Search Console ownership was then verified using Cloudflare DNS on
  26 November 2026. Google instructed waiting **24 hours** before requesting
  brand verification again. Until approval and publication, Google may show the
  domain rather than the app name/logo. Do not describe branding as approved.

## Public-key backend verification

`wrangler.jsonc` supplies the public publishable key, issuer and PEM signing key.
The API accepts explicit Bearer session JWTs, verifies signature/expiry and pins
issuer, authorized origin, session ID and user ID. No Clerk administrator secret
is deployed. Update `CLERK_JWT_KEY` and redeploy when Clerk rotates its signing key.

Signup webhooks use a separate endpoint signing secret; see
[signup notifications](signup-notifications.md). It is not a Clerk admin secret.

## DNS (Cloudflare, DNS only)

| Host | Type | Content |
| --- | --- | --- |
| clerk | CNAME | frontend-api.clerk.services |
| accounts | CNAME | accounts.clerk.services |
| clkmail | CNAME | mail.kw3coeqzzq02.clerk.services |
| clk._domainkey | CNAME | dkim1.kw3coeqzzq02.clerk.services |
| clk2._domainkey | CNAME | dkim2.kw3coeqzzq02.clerk.services |
| _dmarc | TXT | v=DMARC1; p=none; |

## Local development and earlier hosting

Use the development publishable key in ignored `.env.local`, then run
`node --env-file=.env.local scripts/render-auth-config.mjs` and serve only `dist`.
Do not use production Clerk credentials on localhost. `node
scripts/render-auth-config.mjs` without a key restores guest-only static config.

The old GitHub Pages origin remains available for browser-saved reports. Its
workflow deliberately emits an empty Clerk key. Do not restore the retired
`riturajratan.com` production key or point the new domain at Pages.

Browser reports and drafts remain scoped to their original browser origin.
Signing in does not transfer or upload them. Selected cloud reports need separate
consent and configured encryption/access. No answers or scores are copied into
Clerk profile metadata. Sign-out does not erase local browser saves.

References: [changing domains](https://clerk.com/docs/guides/development/deployment/changing-domains),
[verifyToken](https://clerk.com/docs/reference/backend/verify-token),
[Google branding](https://support.google.com/cloud/answer/15549049).
