-- Account timelines are ordered by the original check-in time, not upload time.
CREATE INDEX IF NOT EXISTS assessments_owner_checkin
  ON assessments(user_id, assessed_at DESC, id DESC);
