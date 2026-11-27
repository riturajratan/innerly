CREATE TABLE feedback (
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 email TEXT NOT NULL,
 message TEXT NOT NULL,
 kind TEXT NOT NULL CHECK(kind IN ('idea','problem','love')),
 content_hash TEXT NOT NULL,
 testimonial_consent INTEGER NOT NULL DEFAULT 0 CHECK(testimonial_consent IN (0,1)),
 consent_version TEXT,
 consented_at INTEGER,
 review_status TEXT NOT NULL DEFAULT 'new' CHECK(review_status IN ('new','reviewed','approved','rejected')),
 created_at INTEGER NOT NULL,
 CHECK(testimonial_consent=0 OR (kind='love' AND consent_version IS NOT NULL AND consented_at IS NOT NULL)),
 CHECK(review_status!='approved' OR testimonial_consent=1)
);
CREATE INDEX feedback_review_date ON feedback(review_status,created_at DESC);
