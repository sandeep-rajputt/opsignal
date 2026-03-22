CREATE TYPE work_type AS ENUM ('incident', 'task', 'improvement');

CREATE TYPE work_log_type AS ENUM (
  'status_change',
  'severity_change',
  'priority_change',
  'category_change',
  'message',
  'content_update'
);

CREATE TABLE work_logs (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  work_type     work_type     NOT NULL,
  work_id       UUID          NOT NULL,
  workspace_id  VARCHAR(255)  NOT NULL REFERENCES workspaces(slug) ON DELETE CASCADE,
  log_type      work_log_type NOT NULL,
  actor_id      UUID          NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_work_logs_work           ON work_logs(work_type, work_id);
CREATE INDEX idx_work_logs_workspace      ON work_logs(workspace_id);
CREATE INDEX idx_work_logs_workspace_work ON work_logs(workspace_id, work_type, work_id);
CREATE INDEX idx_work_logs_work_time      ON work_logs(work_type, work_id, created_at DESC);
CREATE INDEX idx_work_logs_actor          ON work_logs(actor_id);
CREATE INDEX idx_work_logs_log_type       ON work_logs(log_type);
