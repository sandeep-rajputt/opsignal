import z from "zod";
import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";

const updateProfileDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().nullable(),
});

const updateProfileResponseSchema = baseApiResponseSchema.extend({
  data: updateProfileDataSchema,
});

export type UpdateProfileResponse = z.infer<typeof updateProfileResponseSchema>;
