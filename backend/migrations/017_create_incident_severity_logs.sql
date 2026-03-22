CREATE TABLE incident_severity_logs (
  log_id      UUID              PRIMARY KEY REFERENCES work_logs(id) ON DELETE CASCADE,
  log_type    work_log_type     NOT NULL DEFAULT 'severity_change' CHECK (log_type = 'severity_change'),
  from_value  incident_severity,
  to_value    incident_severity NOT NULL,
  CHECK (from_value IS DISTINCT FROM to_value)
);
