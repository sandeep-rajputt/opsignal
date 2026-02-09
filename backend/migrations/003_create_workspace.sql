CREATE TYPE workspace_plan AS ENUM ('free', 'premium');


CREATE TABLE workspaces (
  slug VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  
  plan workspace_plan DEFAULT 'free',
  
  logo_url VARCHAR(500) DEFAULT NULL,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,

  CHECK (
  slug ~* '^[a-z0-9-]+$'
  OR
  slug ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
)

);

CREATE INDEX idx_workspaces_owner_id ON workspaces(owner_id);
CREATE INDEX idx_workspaces_slug ON workspaces(slug);
CREATE INDEX idx_workspaces_deleted_at ON workspaces(deleted_at) WHERE deleted_at IS NULL;
