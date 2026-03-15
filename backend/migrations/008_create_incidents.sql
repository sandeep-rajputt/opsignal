CREATE TYPE incident_severity AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE incident_status AS ENUM ('open', 'investigating', 'identified', 'monitoring', 'resolved');
CREATE TYPE work_scope AS ENUM ('global', 'team');

CREATE TABLE incidents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  workspace_id  VARCHAR(255) NOT NULL REFERENCES workspaces(slug) ON DELETE CASCADE,
  team_id       UUID REFERENCES teams(id) ON DELETE SET NULL,
  scope         work_scope NOT NULL DEFAULT 'team',
  created_by    UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

  title         VARCHAR(50) NOT NULL,
  description   TEXT,
  severity      incident_severity NOT NULL,
  status        incident_status NOT NULL DEFAULT 'open',

  acknowledged_at  TIMESTAMPTZ,
  resolved_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at       TIMESTAMPTZ
);

CREATE INDEX idx_incidents_workspace        ON incidents(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_incidents_team             ON incidents(team_id)      WHERE deleted_at IS NULL;
CREATE INDEX idx_incidents_status           ON incidents(status)       WHERE deleted_at IS NULL;
CREATE INDEX idx_incidents_severity         ON incidents(severity);
CREATE INDEX idx_incidents_workspace_status ON incidents(workspace_id, status) WHERE deleted_at IS NULL;
