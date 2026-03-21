CREATE TABLE work_assignees (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id     UUID NOT NULL,
  work_type   work_type NOT NULL,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(work_id, work_type, user_id)
);

CREATE INDEX idx_work_assignees_work ON work_assignees(work_id, work_type);
CREATE INDEX idx_work_assignees_user ON work_assignees(user_id);
