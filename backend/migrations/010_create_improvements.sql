CREATE TYPE improvement_category AS ENUM ('process', 'technical', 'documentation', 'other');
CREATE TYPE improvement_status AS ENUM ('proposed', 'approved', 'in_progress', 'done', 'rejected');

CREATE TABLE improvements (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  workspace_id  VARCHAR(255) NOT NULL REFERENCES workspaces(slug) ON DELETE CASCADE,
  team_id       UUID REFERENCES teams(id) ON DELETE SET NULL,
  scope         work_scope NOT NULL DEFAULT 'team',
  created_by    UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

  incident_id   UUID REFERENCES incidents(id) ON DELETE SET NULL,

  title           VARCHAR(100) NOT NULL,
  description     TEXT,
  expected_impact TEXT,
  category        improvement_category NOT NULL,
  status          improvement_status NOT NULL DEFAULT 'proposed',

  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);

CREATE INDEX idx_improvements_workspace ON improvements(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_improvements_team      ON improvements(team_id)      WHERE deleted_at IS NULL;
CREATE INDEX idx_improvements_incident  ON improvements(incident_id)  WHERE incident_id IS NOT NULL;
CREATE INDEX idx_improvements_status    ON improvements(status)       WHERE deleted_at IS NULL;
CREATE INDEX idx_improvements_category  ON improvements(category);
