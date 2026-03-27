import z from "zod";

const incidentStatusSchema = z.enum([
  "open",
  "investigating",
  "identified",
  "monitoring",
  "resolved",
]);

export type IncidentStatus = z.infer<typeof incidentStatusSchema>;
export default incidentStatusSchema;
