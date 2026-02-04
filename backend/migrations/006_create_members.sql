CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,

  role member_role NOT NULL DEFAULT 'owner',

  invited_by UUID REFERENCES users(id) ON DELETE SET NULL,

  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,


  UNIQUE(user_id, workspace_id, team_id),


  CHECK (
    (role = 'owner' AND team_id IS NULL)
    OR
    (role <> 'owner' AND team_id IS NOT NULL)
  )
);



CREATE INDEX idx_members_user_active
ON members(user_id)
WHERE deleted_at IS NULL;


CREATE INDEX idx_members_workspace_active
ON members(workspace_id)
WHERE deleted_at IS NULL;


CREATE INDEX idx_members_team_active
ON members(team_id)
WHERE deleted_at IS NULL;


CREATE INDEX idx_members_role
ON members(role);


CREATE INDEX idx_members_workspace_user_active
ON members(workspace_id, user_id)
WHERE deleted_at IS NULL;

