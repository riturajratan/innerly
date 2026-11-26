-- Delivery bookkeeping only. Never persist Clerk's raw user webhook or email.
CREATE TABLE signup_notifications (
  user_id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  claim_token TEXT NOT NULL,
  lease_until INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  sent_at INTEGER
);
