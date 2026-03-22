import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const getTaskResponseSchema = baseApiResponseSchema.extend({
  data: z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
    priority: z.string(),
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
    dueDate: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

export type GetTaskResponse = z.infer<typeof getTaskResponseSchema>;

export default getTaskResponseSchema;
