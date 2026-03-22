CREATE TABLE task_priority_logs (
  log_id      UUID          PRIMARY KEY REFERENCES work_logs(id) ON DELETE CASCADE,
  log_type    work_log_type NOT NULL DEFAULT 'priority_change' CHECK (log_type = 'priority_change'),
  from_value  task_priority,
  to_value    task_priority NOT NULL,
  CHECK (from_value IS DISTINCT FROM to_value)
);
