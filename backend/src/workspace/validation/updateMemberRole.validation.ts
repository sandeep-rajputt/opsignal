import { z } from "zod";
import { ROLE } from "../../rbac/roles.js";

export const updateMemberRoleSchema = z.object({
  role: z.nativeEnum(ROLE, {
    message: "Invalid role. Must be one of: owner, admin, moderator, member",
  }),
});

export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
