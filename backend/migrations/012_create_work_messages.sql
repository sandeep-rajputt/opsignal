CREATE TABLE work_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id     UUID NOT NULL,
  work_type   work_type NOT NULL,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_work_messages_work ON work_messages(work_id, work_type);
CREATE INDEX idx_work_messages_user ON work_messages(user_id);
