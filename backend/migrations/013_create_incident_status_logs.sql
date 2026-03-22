CREATE TABLE incident_status_logs (
  log_id      UUID             PRIMARY KEY REFERENCES work_logs(id) ON DELETE CASCADE,
  log_type    work_log_type    NOT NULL DEFAULT 'status_change' CHECK (log_type = 'status_change'),
  from_value  incident_status,
  to_value    incident_status  NOT NULL,
  CHECK (from_value IS DISTINCT FROM to_value)
);
