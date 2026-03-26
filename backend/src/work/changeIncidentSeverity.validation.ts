import z from "zod";

export const changeIncidentSeverityValidation = z.object({
  severity: z.enum(["critical", "high", "medium", "low"]),
});

export type ChangeIncidentSeverityInput = z.infer<
  typeof changeIncidentSeverityValidation
>;
