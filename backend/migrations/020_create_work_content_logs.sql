CREATE TABLE work_content_logs (
  log_id      UUID          PRIMARY KEY REFERENCES work_logs(id) ON DELETE CASCADE,
  log_type    work_log_type NOT NULL DEFAULT 'content_update' CHECK (log_type = 'content_update'),
  field_name  VARCHAR(50)   NOT NULL CHECK (field_name IN ('title', 'description', 'expected_impact')),
  old_value   TEXT,
  new_value   TEXT,
  CHECK (old_value IS DISTINCT FROM new_value)
);
