import z from "zod";

const incidentSeveritySchema = z.enum(["critical", "high", "medium", "low"]);

export type IncidentSeverity = z.infer<typeof incidentSeveritySchema>;
export default incidentSeveritySchema;
