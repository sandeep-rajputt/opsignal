export enum ROLE {
  OWNER = "owner",
  ADMIN = "admin",
  MODERATOR = "moderator",
  MEMBER = "member",
}

export const ROLE_HIERARCHY: Record<ROLE, number> = {
  [ROLE.OWNER]: 4,
  [ROLE.ADMIN]: 3,
  [ROLE.MODERATOR]: 2,
  [ROLE.MEMBER]: 1,
};
