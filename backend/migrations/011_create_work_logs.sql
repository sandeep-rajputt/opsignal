CREATE TYPE work_type AS ENUM ('incident', 'task', 'improvement');

CREATE TYPE work_log_event AS ENUM (
  'created',
  'status_changed',
  'priority_changed',
  'severity_changed',
  'category_changed',
  'message_added',
  'assigned',
  'unassigned',
  'linked_incident',
  'unlinked_incident',
  'deleted',
  'restored'
);

CREATE TABLE work_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id     UUID NOT NULL,
  work_type   work_type NOT NULL,
  actor_id    UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  event       work_log_event NOT NULL,
  from_value  VARCHAR(100),
  to_value    VARCHAR(100),
  meta        JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_work_logs_work       ON work_logs(work_id, work_type);
CREATE INDEX idx_work_logs_actor      ON work_logs(actor_id);
CREATE INDEX idx_work_logs_event      ON work_logs(event);
CREATE INDEX idx_work_logs_created_at ON work_logs(created_at);
