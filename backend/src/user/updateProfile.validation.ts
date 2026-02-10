import z from "zod";
import nameSchema from "../schemas/common/nameSchema.js";

const updateProfileSchema = z.object({
  name: nameSchema,
  avatarUrl: z.string().url().optional(),
  avatarPublicId: z.string().optional(),
});

export default updateProfileSchema;
