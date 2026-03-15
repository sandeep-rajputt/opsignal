CREATE TYPE task_priority AS ENUM ('urgent', 'high', 'medium', 'low');
CREATE TYPE task_status AS ENUM ('open', 'in_progress', 'blocked', 'done', 'cancelled');

CREATE TABLE tasks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  workspace_id  VARCHAR(255) NOT NULL REFERENCES workspaces(slug) ON DELETE CASCADE,
  team_id       UUID REFERENCES teams(id) ON DELETE SET NULL,
  scope         work_scope NOT NULL DEFAULT 'team',
  created_by    UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

  incident_id   UUID REFERENCES incidents(id) ON DELETE SET NULL,

  title         VARCHAR(100) NOT NULL,
  description   TEXT,
  priority      task_priority NOT NULL,
  status        task_status NOT NULL DEFAULT 'open',

  due_date      DATE,
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);

CREATE INDEX idx_tasks_workspace  ON tasks(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_team       ON tasks(team_id)      WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_incident   ON tasks(incident_id)  WHERE incident_id IS NOT NULL;
CREATE INDEX idx_tasks_status     ON tasks(status)       WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_due_date   ON tasks(due_date)     WHERE deleted_at IS NULL;
