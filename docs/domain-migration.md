# Know Your Mind domain migration

Production: **https://knowyourmind.ai/**, repository `riturajratan/innerly`.

## Completed on 26 November 2026

- Cloudflare Worker `knowyourmind`, connected to GitHub main with preview builds
  disabled. Builds run tests, render assets, apply D1 migrations and deploy.
- D1 `knowyourmind-production` (`bb0c3e32-1e6d-4c07-b170-d22a50d7959a`).
- Apex Worker Custom Domain and valid HTTPS. Homepage and health returned 200;
  anonymous private API access returned 401.
- `www` redirects to HTTPS apex with 301, preserving path and query string.
- Existing Clerk app renamed/rebranded and migrated to the new domain; Google +
  email configured. See [current auth status](clerk-setup.md).
- Google Search Console domain ownership verified using a root TXT record. Keep
  this record so verification remains valid. OAuth branding review must be retried
  after Google's requested 24-hour wait; it has not yet been approved.
- Limited build token has Workers Scripts edit, D1 edit and Account Settings read
  for this account. Temporary Builds Configuration edit was removed after token
  registration, and the temporary token file was deleted.

## Remaining launch checks

A real production Google signup and its Slack notification are confirmed. Email
login still needs an owner end-to-end check. Configure report encryption with a
securely backed-up key before enabling cloud writes. Cloudflare dashboard access
currently returns Page not found / Request timed out in both the owner and agent
browsers; the live public API still responds with cloudEnabled=false. See
[reports, Analytics and SEO status](reports-analytics-seo.md).
Billing remains off: the owner has not created a Razorpay merchant account, and
prices, merchant approval and provider sandbox testing are still outstanding.
See [backend setup](cloudflare-backend.md) and [signup alerts](signup-notifications.md).

## Earlier reports

The old GitHub Pages origin stays available as a guest/local-report archive.
Browser storage is origin-specific: existing reports/drafts cannot automatically
appear on the new domain. Users can export old reports from their original browser.
Do not claim account login transfers reports. The new domain belongs to the Worker;
do not point it at GitHub Pages.
