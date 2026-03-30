import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const getOverviewResponseSchema = baseApiResponseSchema.extend({
  data: z.object({
    name: z.string(),
    plan: z.string(),
    memberLimit: z.number().nullable(),
    totalTeams: z.number().nullable(),
    totalMembers: z.number(),
    totalIncidents: z.number(),
    totalTasks: z.number(),
    totalImprovements: z.number(),
  }),
});

export type GetOverviewResponse = z.infer<typeof getOverviewResponseSchema>;

export default getOverviewResponseSchema;
