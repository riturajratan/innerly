# Feedback inbox

Cloudflare dashboard → Workers & Pages → D1 → knowyourmind-production → Console.
Text feedback and photo metadata are stored in `feedback`; optional photos are private objects in the `knowyourmind-feedback-media` R2 bucket. The public API lists only approved, opted-in testimonials.

Review latest entries (email is private; never include it in published copy):

```sql
SELECT id, datetime(created_at,'unixepoch') AS received_utc,
       kind, name, email, message, testimonial_consent,
       testimonial_photo_consent, photo_key, review_status
FROM feedback ORDER BY created_at DESC LIMIT 100;
```

Find testimonial candidates:

```sql
SELECT id, name, message, consent_version, datetime(consented_at,'unixepoch') AS consent_utc
FROM feedback WHERE kind='love' AND testimonial_consent=1 AND review_status='new'
ORDER BY created_at DESC;
```

All entries start as `new`, including opt-ins. Review authenticity, remove private information, and obtain any clarification before choosing a testimonial. Email is supplied by the visitor, not verified. No visitor feedback is automatically published. The database prevents approving a row without testimonial opt-in. Photo display requires separate opt-in, then approval; admin photo preview is authenticated. Use a bound ID when updating review status; statuses are new, reviewed, approved, rejected. Withdrawing permission revokes public access to its photo and testimonial.

POST /api/feedback accepts visitors without login, validates length/type/origin, limits requests to five per minute per IP hash, and deduplicates retries by client ID plus content hash. No report answers or analytics events are attached. Success is displayed only after a database write and readback; failures retain the form for retry. Older browser-only notes are not uploaded automatically.

## Slack alerts

New submissions notify the existing signup Slack destination using its existing Worker secret. Alerts include name, kind, message, received time (IST), feedback ID and testimonial/photo permission indicators; email and photo bytes stay private. All visitor text uses Slack plain_text blocks, preventing user-supplied mentions/markup. Feedback is saved before notification. Delivery runs in the background, and a five-minute Cron Trigger retries pending rows with backoff. Existing feedback is not backfilled. `slack_sent_at`, `slack_next_attempt`, `slack_attempts` track delivery. A 60-second atomic lease prevents concurrent sends; as with most webhooks a crash after Slack accepts but before D1 records success can still cause a duplicate on retry.

## Admin review and homepage

Open https://knowyourmind.ai/admin and sign in with the designated account. `FEEDBACK_ADMIN_USER_IDS` is a server-only comma-separated allowlist of Clerk user IDs; missing configuration denies access. The owner ID was matched to riturajratan@gmail.com in the production Clerk users page. No browser-provided role or email grants access.

The inbox filters New, Reviewed, Published, Rejected/withdrawn and All, with 25-item pagination. Approve & publish requires explicit testimonial consent and publishes the original name and message. Reject/Unpublish or Mark reviewed removes an approved entry from the homepage. Withdraw permission also clears consent and prevents reapproval until new explicit consent is collected. Review changes use revisions to reject stale edits and append an audit row recording the admin, action and time.

The public endpoint returns only the names, messages and consented photo URLs of up to three latest approved, opted-in love submissions. No email, account identifier or private feedback is exposed. Photo access checks current approval and separate photo consent each time. Images are served from the private R2 bucket through the Worker, not a public bucket URL.

## Photo storage

The Worker requires the `FEEDBACK_MEDIA` R2 binding to `knowyourmind-feedback-media`. Enable R2 in the Cloudflare account before deploying the binding; this activates usage billing beyond the included monthly free allowance. Apply migration `0008_feedback_photos.sql` before accepting photo uploads. The form accepts JPEG, PNG and WebP up to 3 MB, checks image signatures, and applies the same five-per-minute IP-hash rate limit. Uploaded files remain private even when the submitter does not allow public photo display.
