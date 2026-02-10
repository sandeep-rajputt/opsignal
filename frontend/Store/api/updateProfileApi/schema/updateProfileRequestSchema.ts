import z from "zod";
import nameSchema from "@/schemas/common/nameSchema";

const updateProfileRequestSchema = z.object({
  name: nameSchema,
  avatarUrl: z.string().url().optional(),
  avatarPublicId: z.string().optional(),
});

export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;
