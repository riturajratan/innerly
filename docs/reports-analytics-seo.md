## Verified SEO and Analytics — 26 November 2026

Search Console accepted `https://knowyourmind.ai/sitemap.xml`: **Success, 6 discovered pages**. The domain property is accessible in the owner account. All six live canonical pages return successfully with one title, one meta description and one H1; homepage JSON-LD parses correctly. Private history routes return `X-Robots-Tag: noindex, nofollow`.

GA4 property 565919101 / G-RCRXJ28CSM receives events: Realtime showed 18 page_view events, including public homepage and FAQ views. Standard reports still show their initial processing message. Consent and private-view exclusion tests pass. Search sitelinks and rankings are selected by Google, not guaranteed by sitemap submission.

Comparison UI now shows a return-check-in invitation for one report. Graphs and “Notice what has changed” require two distinct reports in the same questionnaire language; language selection defaults to an available comparable pair.

## Automatic saving update — 26 November 2026

Replaces the earlier opt-in autosave flow: signed-in check-ins now sync encrypted partial drafts (`0004_checkin_drafts.sql`) and save completed, dated reports automatically. Guest drafts stay local. New tests have independent IDs; completed reports stay in history. Browser recovery queues retry network failures; account switches and revision conflicts prevent accidental cross-account uploads or stale overwrites. Privacy and FAQ copy reflect the automatic behavior.

Validated with 212 tests, actual workerd/D1 migrations and encryption round-trips, and synthetic browser checks for refresh/resume, automatic completion, dated history and starting a blank new test. Production real-user save remains an owner check; no real questionnaire answers were entered for QA.

Earlier release notes below are historical where they describe manual or opt-in saving.

# Reports, Analytics and SEO release status

Updated 26 November 2026, after production release `54068a4`. Cloudflare build
`e30ea22c-f804-4051-b2fb-98655bb24b49` completed successfully (version `902b9922`).
`REPORT_ENCRYPTION_KEY` is saved as an encrypted Worker secret. Live config confirms
cloudEnabled=true and cloudAccess=free; billing remains disabled. No copy of the
key was stored in chat or local files; maintain the existing Worker secret.

The six-page sitemap and FAQ are live. The GA4 script loads after explicit consent
on the production FAQ. GA4 Realtime receipt and Search Console sitemap submission
remain unverified. Owner-controlled production report save/reload confirmation is
pending; local real-workerd encryption/owner-isolation checks and 205 tests passed.

## Report history and comparison

- My reports separates account reports from reports saved in this browser.
- Saving an individual report requires explicit storage consent. Auto-save is a
  separate opt-in for this account/browser; signing in never imports old reports.
- Account answers stay in memory and are cleared on sign-out/account change.
  API requests capture the account before obtaining a token and reject a switch.
- Owner-only history decrypts up to 25 reports per page, ordered by original
  check-in time. Migration 0003 adds an index for this order.
- The question timeline shows actual dated responses. Before/After also compares
  all 36 answers. Different questionnaire versions/languages are kept separate.
- At the bottom, an overall consolidated comparison shows the same Strengths,
  Room to grow and Sometimes categories as each report, with count differences
  and six area charts. Reverse-worded questions use the existing interpretation.
  Counts are not clinical scores or evidence of treatment effects.
- JSON-export controls were removed at the owner's request. Reports retain
  Print / PDF. The authenticated export endpoint is retained for data-access
  support; there is no export button in either account UI.
- `CLOUD_REPORTS_ACCESS=free` enables the preview once encryption is configured.
  The default without this explicit flag remains subscription-gated. Billing is
  still disabled, and no Razorpay account or production prices are configured.

## Google Analytics

Created in the existing maddyzone Analytics account (`44786250`):

- Property: **Know Your Mind**, `565919101`.
- Web stream: **Know Your Mind website**, `16423143447`.
- URL: `https://knowyourmind.ai`; measurement ID: **G-RCRXJ28CSM**.
- India reporting timezone and INR currency. Enhanced measurement is verified
  off in the stream UI. Installation is live; Analytics report receipt has not yet been independently confirmed.
- The frontend loads gtag only after optional consent on six public pages.
  Private app views disable measurement. No identity, answer, report, query or
  fragment data enters analytics payloads. Advertising features are disabled.
- Footer preferences allow withdrawal and remove this site's analytics cookies.
  Only the direct G-ID is installed; the wizard's GTM container is not added.

After deployment, verify a consented public-page view in Realtime. Do not use a
personal report for the test or interpret a tag-checker's consent-blocked state
as a reason to remove consent gating.

## SEO

The build renders six canonical public pages: homepage, How it works, FAQs,
fictional sample report, Privacy and Terms. Each has unique head metadata,
Open Graph tags, stable favicon, internal navigation and a sitemap entry.
Homepage structured data describes the website, organization and web application.
Legacy experiments and private query routes are noindex. No private report is
included in the sitemap or page HTML.

Search Console domain ownership is already verified. Submit the six-page sitemap
after deployment, then request homepage indexing if available. Google chooses
snippets, site names and sitelinks; these changes do not guarantee their display.
OAuth branding review is separate and still has Google's 24-hour retry wait.

## Verification and remaining deployment steps

Local checks: unit tests; real workerd + isolated D1 encrypted round-trip and
account isolation; deployment bundle dry run; idempotent SEO build, canonical
metadata, structured data and links. Browser QA uses synthetic local identities,
not production report contents. It covers report opening, explicit save,
auto-save controls, account switching and desktop/mobile layouts.

Remaining follow-up (deployment and encryption are now complete):

3. Complete an owner-controlled signed-in save, reload and cross-device read.
4. Verify public analytics after consent and submit the updated sitemap.

The local synthetic UI preview is available while its temporary server is running
at `http://127.0.0.1:8791/?view=history`. Its identities and reports are fictional.
