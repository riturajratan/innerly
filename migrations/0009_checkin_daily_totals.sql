CREATE TABLE IF NOT EXISTS checkin_daily_totals (
  day TEXT PRIMARY KEY,
  starts INTEGER NOT NULL DEFAULT 0 CHECK (starts >= 0),
  completions INTEGER NOT NULL DEFAULT 0 CHECK (completions >= 0)
);
