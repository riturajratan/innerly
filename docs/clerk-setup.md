# Clerk sign-in

Innerly is a static GitHub Pages app. Clerk handles accounts and authentication;
the questionnaire remains available to guests. This integration uses ClerkJS 6
and Clerk UI 1, loaded from the Frontend API associated with the public key.

## Current status

Local sign-in is working. A **production instance was created with the user's
approval on 10 November 2026** for `www.riturajratan.com/innerly/`. The email-only
website integration is included in this release; its deployment status is
tracked by the repository's GitHub Pages workflow.

- Clerk application: **Innerly** (`app_3Lue4T0hoZDzw3d37cE1uRxTE6s`).
- Development instance: `ins_3Lue4UJ3KmSBD5LlGL6xSX8KWjU`.
- Production instance: `ins_3Luh0pkr7SXTlwfBAnUN0eFh1pg`.
- Production primary domain: `riturajratan.com`; application host:
  `www.riturajratan.com`. Home and after-sign-out URLs are saved as
  `https://www.riturajratan.com/innerly/`.
- Frontend API: `https://thorough-moccasin-5426.clerk.accounts.dev`.
- Verified email-code signup/sign-in is enabled; password is not required at signup.
- Google sign-in is enabled using Clerk's development shared credentials.
- `.env.local` contains the development Publishable Key only. No secret key was
  read, copied, generated or added to the app.
- Real SDK loading, email-code account creation, account management and sign-out
  were verified locally. Google OAuth completion still needs a real Google
  account test; the provider option itself is configured and renders correctly.
- A reserved development test user, `innerly-qa-20261110+clerk_test@example.com`,
  was created for verification. Clerk sends no email to this address in test mode.
- 103 automated tests pass. A separate temporary test-double preview also
  verified cancelling sign-in, preserving an unfinished check-in, restoring a
  completed 36-answer report, and preserving a draft after sign-out.
- All five production CNAME records were saved in Namecheap after explicit user
  approval and verified by Clerk. Existing GitHub Pages A/CNAME records were
  preserved. Clerk shows both SSL certificates as **Issued**. The hosted
  `https://accounts.riturajratan.com/sign-in` page opens over HTTPS and displays
  an email address field and Continue button, with no Google option. No
  production account was created and no real email-code delivery was tested.
- Production email-code signup and sign-in are enabled, with email verification
  required and no password required at signup. Google is **disabled in
  production**, as requested; local development still has Google enabled.
- The production public key is configured and verified in the repository's
  `CLERK_PUBLISHABLE_KEY` Actions variable. The Pages workflow injects it into
  the deployed build. The tracked configuration starts empty; local development
  uses `.env.local`. Missing public configuration leaves guest mode usable.

## Production DNS

These values were read directly from the production Clerk Dashboard on
10 November 2026 and saved with automatic TTL in Namecheap → Domain List →
riturajratan.com → Manage → Advanced DNS. All five records show **Verified** in
Clerk. There were no pre-existing records with these hosts.

| Host | CNAME target |
| --- | --- |
| `clerk` | `frontend-api.clerk.services` |
| `accounts` | `accounts.clerk.services` |
| `clkmail` | `mail.ydshqx4lmv0q.clerk.services` |
| `clk._domainkey` | `dkim1.ydshqx4lmv0q.clerk.services` |
| `clk2._domainkey` | `dkim2.ydshqx4lmv0q.clerk.services` |

Both SSL certificates are issued. The hosted email login screen was verified.
The records above are DNS names, not secrets. Do not put `/innerly/` into DNS.

## Google setup deferred

The production Google connection is **Disabled**, following the user's choice
to start with email login and add Google later. Its Client ID and Client Secret
are empty; development shared credentials do not work in production. When
Google is requested, create a Google OAuth web client for Innerly, then enter its
credentials directly into Clerk (never in chat, frontend source or Git) and
enable the connection.

- Authorized JavaScript origin: `https://www.riturajratan.com`.
- Authorized redirect URI, copied from the production Google connection:
  `https://clerk.riturajratan.com/v1/oauth_callback`.
- Application homepage: `https://www.riturajratan.com/innerly/`.
- Keep only the default identity scopes (`openid`, email and profile).

The production publishable key shown by Clerk is
`pk_live_Y2xlcmsucml0dXJhanJhdGFuLmNvbSQ`. This public identifier is configured in
the GitHub Actions variable. It must not replace the working local development
key. Domain verification and certificate issuance are complete.

## Configuration reference

1. Sign in to [Clerk Dashboard](https://dashboard.clerk.com/) and select the
   existing **Innerly** application above. Do not create a replacement app.
2. Enable **Email**. For email-only login, enable email verification
   codes; passwords and extra profile fields are not necessary for this version.
   These methods are controlled in Clerk Dashboard, not hard-coded by this app.
3. Begin with a development instance and its **Publishable Key** (`pk_test_…`).
   No Clerk Secret Key is needed in the frontend or the Pages workflow.
4. For the live site, create a production instance for `www.riturajratan.com`.
   Configure Clerk's required DNS records and verify its certificates. The app
   URL is `https://www.riturajratan.com/innerly/`, including the subpath.
5. Keep production Google disabled for this email-only launch. When Google is
   requested later, configure production OAuth credentials and use the exact
   callback URI displayed by Clerk. Development's shared Google credentials are
   insufficient for production. Verify each enabled method; do not assume all
   settings were copied from development.
6. Set application home and after-sign-out URLs to the app URL above. The app
   also forces sign-in/sign-up returns to its own directory, with `?lang=…`.
   Modal authentication avoids adding a route that GitHub Pages cannot serve.

## Run locally

Copy `.env.example` to `.env.local` and set `CLERK_PUBLISHABLE_KEY` to the
development **publishable** key. `.env.local` is ignored by Git.

```sh
node --env-file=.env.local scripts/render-auth-config.mjs
node scripts/render-mental-home.mjs
python3 -m http.server 4298 --bind 127.0.0.1 --directory dist
```

Serve only `dist`, never the repository root containing environment files. To
restore the unconfigured build, run `node scripts/render-auth-config.mjs` without
the environment variable.

## GitHub Pages

In repository **Settings → Secrets and variables → Actions → Variables**, set
`CLERK_PUBLISHABLE_KEY` to the production `pk_live_…` key. This identifier is
intended to be public. The Pages workflow generates the public module before
rendering and testing. A missing key leaves guest mode available; an invalid key,
secret key, or development key in the public deployment fails the build.

Push or run the existing Pages workflow after configuring the variable. Changing
the Dashboard or GitHub variable alone does not update the deployed JS module.

## Data and session behavior

- The header switches from **Sign in** to **My account** when Clerk has a session.
  Account management uses Clerk's UI; sign-out uses Clerk's session API.
- Accounts never gate starting, completing or viewing a local check-in.
- No questionnaire response, score or report is sent to Clerk or placed in user
  metadata. No backend, database or cross-device report sync is implemented.
- Before an account action can reload the page, unsaved check-in data requires
  explicit permission to save in this browser. Cancelling keeps it in memory;
  storage failure stops navigation. Existing consented drafts keep autosaving.
- A short-lived session-storage marker restores the quiz/report after redirects.
  The marker contains navigation only, not answers or authentication tokens.
- Browser saves remain device-wide, including after sign-out/account changes.
  Login does not encrypt or make them private to an account. The account dialog
  and report history explain this; saved reports can be deleted from My reports.
- Provider failure leaves guest work usable and offers a retry. Session events
  update only the header, so answering does not flicker or reset.
- Account entry, explanations and errors support English/Hindi. Clerk's own UI
  currently uses its default English text. Questionnaire translations are
  unchanged; this does not claim 20-language account UI support.

For future cloud reports, add a backend that verifies Clerk sessions, checks
ownership on every request, and obtains separate consent for storing health data.
Client-side login alone cannot protect server records.

## Verify with a configured application

Automated tests exercise config validation, script failure/timeout/retry,
sign-in/sign-up return URLs, session changes, sign-out and continuation expiry.
Those automated tests use a test double. The real development email flow was also
checked manually as described above. Before any production launch:

1. Have the owner test email-code delivery, signup, sign-out and sign-in with
   their chosen email. Do not create production test users without permission.
2. When Google is enabled later, complete its sign-in and verify the return
   stays under `/innerly/`.
3. Answer a few questions, select Sign in, cancel saving, and verify no answers
   are lost. Repeat with saving and confirm the returned quiz resumes correctly.
4. Complete a report, sign in, and verify the same saved report opens on return.
5. Check mobile/header, account management, sign-out, and a blocked Clerk request.

Official references: [JavaScript quickstart](https://clerk.com/docs/js-frontend/getting-started/quickstart),
[SignIn component](https://clerk.com/docs/js-frontend/reference/components/authentication/sign-in),
[production deployment](https://clerk.com/docs/guides/development/deployment/production).
