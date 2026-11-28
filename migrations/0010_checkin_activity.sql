CREATE TABLE IF NOT EXISTS checkin_presence (
  token TEXT PRIMARY KEY,
  seen_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS checkin_presence_seen_at ON checkin_presence(seen_at);
