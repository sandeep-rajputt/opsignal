import z from "zod";
import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";

const checkSlugAvailabilityResponseSchema = baseApiResponseSchema.extend({
  data: z.object({
    available: z.boolean(),
  }),
});

export type CheckSlugAvailabilityResponse = z.infer<
  typeof checkSlugAvailabilityResponseSchema
>;
