import { z } from "zod";
import { timezoneSchema } from "./timezoneSchema.js";

const onboardingSchema = z.object({
  workspaceName: z
    .string()
    .min(2, { message: "Workspace name must be at least 2 characters long." })
    .max(50, { message: "Workspace name cannot exceed 50 characters." })
    .trim(),

  workspaceDescription: z
    .string()
    .max(200, { message: "Description cannot exceed 200 characters." })
    .optional(),

  teamName: z
    .string()
    .min(2, { message: "Team name must be at least 2 characters long." })
    .max(50, { message: "Team name cannot exceed 50 characters." })
    .trim(),

  timezone: timezoneSchema,

  plan: z.enum(["free", "premium"], {
    message: "Please select a valid plan.",
  }),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;

export default onboardingSchema;
