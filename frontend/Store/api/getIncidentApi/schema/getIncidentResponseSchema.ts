import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const getIncidentResponseSchema = baseApiResponseSchema.extend({
  data: z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
    severity: z.string(),
    description: z.string().nullable(),
    scope: z.string(),
    workspace: z.object({
      id: z.string(),
      name: z.string(),
    }),
    team: z
      .object({
        id: z.string(),
        name: z.string(),
      })
      .nullable(),
    createdBy: z.string(),
    createdById: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

export type GetIncidentResponse = z.infer<typeof getIncidentResponseSchema>;

export default getIncidentResponseSchema;
