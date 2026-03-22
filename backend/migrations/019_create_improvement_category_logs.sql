CREATE TABLE improvement_category_logs (
  log_id      UUID                 PRIMARY KEY REFERENCES work_logs(id) ON DELETE CASCADE,
  log_type    work_log_type        NOT NULL DEFAULT 'category_change' CHECK (log_type = 'category_change'),
  from_value  improvement_category,
  to_value    improvement_category NOT NULL,
  CHECK (from_value IS DISTINCT FROM to_value)
);
