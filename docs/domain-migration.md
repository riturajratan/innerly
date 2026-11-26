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

On 26 November 2026, both `knowyourmind.ai` and `www.knowyourmind.ai` failed DNS resolution. The owner confirmed Cloudflare as the domain provider. Cloudflare and GitHub settings must be verified before marking this domain live.

This repository publishes with a custom GitHub Actions workflow. A CNAME file alone does not configure its custom domain; GitHub Pages ignores that file for this workflow.

1. Verify domain ownership and set the repository's Pages custom domain to `knowyourmind.ai`.
2. In Cloudflare, configure the apex for GitHub Pages, preserving unrelated records:
   - `A @ 185.199.108.153`
   - `A @ 185.199.109.153`
   - `A @ 185.199.110.153`
   - `A @ 185.199.111.153`
   - `CNAME www riturajratan.github.io`
3. Confirm DNS, certificate issuance, HTTPS and the preferred-host redirect.
4. Verify the homepage, questionnaire, saved-report flow, sample report, privacy and terms, and both PDF modes.

Source: [GitHub custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Clerk cutover pending

The existing production application is documented in `clerk-setup.md`; it currently uses `riturajratan.com`. Preserve the existing application and users.

1. Update the display name to Know Your Mind.
2. Change the production primary domain to `knowyourmind.ai` and the application home/sign-out URL to `https://knowyourmind.ai/`.
3. Copy the newly displayed Clerk DNS records into Cloudflare; do not assume the previous domain's mail/DKIM targets are reusable.
4. Wait for DNS verification and SSL issuance. Update the repository's `CLERK_PUBLISHABLE_KEY` Actions variable with the new public key, then redeploy.
5. Verify email-code login, logout and guest access. Preserve the existing email-only production configuration; Google sign-in remains disabled.

Source: [Clerk domain-change documentation](https://clerk.com/docs/guides/development/deployment/changing-domains).

## Existing local reports

Browser storage is scoped to an origin. Reports/drafts saved on the old domain are not automatically accessible on the new domain, even though their storage identifiers are unchanged. Keep the prior origin accessible long enough for users to save their reports as PDFs. Do not claim an account login transfers these reports; reports are currently local, not account-synced.
