-- Existing feedback is not backfilled into Slack.
ALTER TABLE feedback ADD COLUMN slack_next_attempt INTEGER;
ALTER TABLE feedback ADD COLUMN slack_sent_at INTEGER;
ALTER TABLE feedback ADD COLUMN slack_claim TEXT;
ALTER TABLE feedback ADD COLUMN slack_attempts INTEGER NOT NULL DEFAULT 0;
CREATE INDEX feedback_slack_pending ON feedback(slack_next_attempt) WHERE slack_sent_at IS NULL;
