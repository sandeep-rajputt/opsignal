import z from "zod";

export const changeIncidentStatusValidation = z.object({
  status: z.enum([
    "open",
    "investigating",
    "identified",
    "monitoring",
    "resolved",
  ]),
});

export type ChangeIncidentStatusInput = z.infer<
  typeof changeIncidentStatusValidation
>;
