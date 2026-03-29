import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const getIncidentsResponseSchema = baseApiResponseSchema.extend({
  data: z.array(
    z.object({
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
  ),
});

export type GetIncidentsResponse = z.infer<typeof getIncidentsResponseSchema>;

export default getIncidentsResponseSchema;
