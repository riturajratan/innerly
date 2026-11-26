PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL
);

CREATE TABLE assessments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  client_id TEXT NOT NULL,
  version TEXT NOT NULL,
  language TEXT NOT NULL,
  responses_ciphertext TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  consent_at INTEGER NOT NULL,
  assessed_at TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(user_id, client_id)
);
CREATE INDEX assessments_owner_date ON assessments(user_id, created_at DESC, id DESC);

CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  request_id TEXT NOT NULL,
  plan_key TEXT NOT NULL,
  provider_plan_id TEXT NOT NULL,
  provider_id TEXT UNIQUE,
  amount INTEGER NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  cancel_scheduled INTEGER NOT NULL DEFAULT 0,
  last_event_at INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(user_id, request_id)
);
CREATE UNIQUE INDEX one_open_subscription ON subscriptions(user_id)
  WHERE status IN ('creating','created','authenticated','active','pending','halted','paused');
CREATE INDEX subscriptions_owner ON subscriptions(user_id, created_at DESC);

CREATE TABLE payments (
  provider_id TEXT PRIMARY KEY,
  subscription_id TEXT NOT NULL REFERENCES subscriptions(id),
  invoice_id TEXT NOT NULL UNIQUE,
  amount INTEGER NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL,
  refunded_amount INTEGER NOT NULL DEFAULT 0,
  period_start INTEGER NOT NULL,
  period_end INTEGER NOT NULL,
  verified_at INTEGER NOT NULL
);
CREATE INDEX payments_subscription_period ON payments(subscription_id, period_end);

CREATE TABLE payment_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  processed_at INTEGER NOT NULL
);

CREATE TABLE rate_limits (
  key TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL
);
