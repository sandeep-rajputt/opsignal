CREATE TABLE work_msg_logs (
  log_id    UUID          PRIMARY KEY REFERENCES work_logs(id) ON DELETE CASCADE,
  log_type  work_log_type NOT NULL DEFAULT 'message' CHECK (log_type = 'message'),
  body      TEXT          NOT NULL CHECK (length(trim(body)) > 0)
);
