ALTER TABLE users
ADD CONSTRAINT fk_primary_workspace
FOREIGN KEY (primary_workspace)
REFERENCES workspaces(id)
ON DELETE RESTRICT;