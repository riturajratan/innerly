ALTER TABLE feedback ADD COLUMN review_revision INTEGER NOT NULL DEFAULT 0;
ALTER TABLE feedback ADD COLUMN reviewed_by TEXT;
ALTER TABLE feedback ADD COLUMN reviewed_at INTEGER;
CREATE TABLE feedback_review_audit (
 id TEXT PRIMARY KEY, feedback_id TEXT NOT NULL REFERENCES feedback(id),
 actor_id TEXT NOT NULL, action TEXT NOT NULL, created_at INTEGER NOT NULL
);
