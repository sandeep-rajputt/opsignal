import z from "zod";

const createIncidentSchema = z.object({
  title: z
    .string()
    .min(10, "Title too short — must mention the affected region")
    .max(50, "Title must be 50 characters or less"),
  severity: z.enum(["critical", "high", "medium", "low"], {
    error: "Select a valid severity level",
  }),
  teamId: z.string().min(1, "Select a team").max(36, "Invalid team ID"),
  commanderId: z
    .string()
    .min(1, "Select an incident commander")
    .max(36, "Invalid commander ID"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional(),
});

export type CreateIncident = z.infer<typeof createIncidentSchema>;

export default createIncidentSchema;
