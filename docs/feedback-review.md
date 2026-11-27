# Feedback inbox

Cloudflare dashboard → Workers & Pages → D1 → knowyourmind-production → Console.
New submissions are stored in `feedback`. There is deliberately no public feedback listing API.

Review latest entries (email is private; never include it in published copy):

```sql
SELECT id, datetime(created_at,'unixepoch') AS received_utc,
       kind, name, email, message, testimonial_consent, review_status
FROM feedback ORDER BY created_at DESC LIMIT 100;
```

Find testimonial candidates:

```sql
SELECT id, name, message, consent_version, datetime(consented_at,'unixepoch') AS consent_utc
FROM feedback WHERE kind='love' AND testimonial_consent=1 AND review_status='new'
ORDER BY created_at DESC;
```

All entries start as `new`, including opt-ins. Review authenticity, remove private information, and obtain any clarification before choosing a testimonial. Email is supplied by the visitor, not verified. No feedback is automatically published. The database prevents approving a row without opt-in. Use a bound ID when updating review status; statuses are new, reviewed, approved, rejected. To withdraw permission set review_status='rejected', testimonial_consent=0, consent_version=NULL, consented_at=NULL for the specific ID, and remove any published copy separately. A public testimonial display is not enabled by this change.

POST /api/feedback accepts visitors without login, validates length/type/origin, limits requests to five per minute per IP hash, and deduplicates retries by client ID plus content hash. No report answers or analytics events are attached. Success is displayed only after a database write and readback; failures retain the form for retry. Older browser-only notes are not uploaded automatically.
