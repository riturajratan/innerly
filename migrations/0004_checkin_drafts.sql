CREATE TABLE checkin_drafts (
 user_id TEXT PRIMARY KEY REFERENCES users(id),
 draft_id TEXT,
 language TEXT,
 responses_ciphertext TEXT,
 revision INTEGER NOT NULL DEFAULT 0,
 updated_at INTEGER NOT NULL
);
