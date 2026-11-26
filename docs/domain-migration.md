# Know Your Mind domain migration

Target: **https://knowyourmind.ai/**. Brand: **Know Your Mind**.
Repository: `riturajratan/innerly`; the repository and existing storage/version identifiers stay unchanged.

## Prepared in source

- Website, account UI, report/PDF labels, navigation and policy-page branding.
- Canonical URLs, Open Graph metadata, JSON-LD, sitemap and root robots.txt.
- New 1200 x 630 share image and responsive wordmark sizing.
- Authentication return URLs already resolve to the current installation; covered for the new root domain and existing subpath.
- Question text, questionnaire source attribution, saved report formats and browser storage keys stay compatible.

## Hosting cutover pending

On 26 November 2026, both `knowyourmind.ai` and `www.knowyourmind.ai` failed DNS resolution. Cloudflare confirms the registration is Active through 26 November 2028, with zero DNS records. The website rebrand was deployed successfully in commit `67556a4`.

GitHub Pages accepted the new custom domain, but Chrome blocked the next DNS action because an extension popup was open while the Mac was locked. No DNS record was saved. The previous Pages domain and HTTPS enforcement were restored, and `https://www.riturajratan.com/innerly/` returned HTTP 200 with the new branding. Resume the cutover after the browser popup is dismissed; the new domain must not be described as live yet.

The current hosting target is now a **Cloudflare Worker**, following the owner's
backend deployment decision. Keep the earlier GitHub Pages deployment available
for existing users during migration. Do not point the new apex at GitHub Pages.

1. Deploy the repository's `wrangler.jsonc` as Worker `knowyourmind`, with the
   existing D1 database binding. See [backend setup](cloudflare-backend.md).
2. Add `knowyourmind.ai` as the Worker's Custom Domain. Cloudflare manages the
   corresponding DNS record and certificate.
3. Configure `www` to redirect to the apex separately, then verify DNS, HTTPS,
   the homepage, questionnaire, saved-report flow, sample report and policy pages.
4. Complete the existing Clerk application's domain setup below, and verify login
   before describing cloud accounts as available. Billing remains disabled until
   merchant configuration, prices and real provider testing are complete.

Source: [Cloudflare Worker custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).

## Clerk cutover pending

The existing production application is documented in `clerk-setup.md`; it currently uses `riturajratan.com`. Preserve the existing application and users.

1. Update the display name to Know Your Mind.
2. Change the production primary domain to `knowyourmind.ai` and the application home/sign-out URL to `https://knowyourmind.ai/`.
3. Copy the newly displayed Clerk DNS records into Cloudflare; do not assume the previous domain's mail/DKIM targets are reusable.
4. Wait for DNS verification and SSL issuance. Update the repository's `CLERK_PUBLISHABLE_KEY` Actions variable with the new public key, then redeploy.
5. Verify email-code login, logout and guest access. Preserve the existing email-only production configuration; Google sign-in remains disabled.

Source: [Clerk domain-change documentation](https://clerk.com/docs/guides/development/deployment/changing-domains).

## Existing local reports

Browser storage is scoped to an origin. Reports/drafts saved on the old domain are not automatically accessible on the new domain, even though their storage identifiers are unchanged. Keep the prior origin accessible long enough for users to save their reports as PDFs. Do not claim an account login transfers these reports; existing reports stay local unless the user explicitly uploads a selected report
through the configured cloud account.
