import { z } from "zod";
import { timezoneSchema } from "./common/timezoneSchema";

const ownerWorkspaceSchema = z.object({
  id: z.string().uuidv4(),
  role: z.literal("owner"),
  name: z
    .string()
    .min(2, { message: "Workspace name must be at least 2 characters long." })
    .max(50, { message: "Workspace name cannot exceed 50 characters." })
    .trim(),
});

const workspaceSchema = z.object({
  id: z.string().uuidv4(),
  role: z.literal(["admin", "manager", "member"]),
  name: z
    .string()
    .min(2, { message: "Workspace name must be at least 2 characters long." })
    .max(50, { message: "Workspace name cannot exceed 50 characters." })
    .trim(),
  team: z.object({
    id: z.string().uuidv4(),
    name: z
      .string()
      .min(2, { message: "Team name must be at least 2 characters long." })
      .max(50, { message: "Team name cannot exceed 50 characters." })
      .trim(),
  }),
});

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  timezone: timezoneSchema,
  primaryWorkspace: z.string(),
  workspaces: z.array(z.union([workspaceSchema, ownerWorkspaceSchema])),
});

export type User = z.infer<typeof userSchema>;
