ALTER TABLE users
ADD CONSTRAINT fk_primary_workspace
FOREIGN KEY (primary_workspace)
REFERENCES workspaces(slug)
ON DELETE RESTRICT;