import { z } from "zod";
import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";

const createOrderDataSchema = z.object({
  orderId: z.string(),
  amount: z.number(),
  currency: z.string(),
  key: z.string(),
});

export const createOrderResponseSchema = baseApiResponseSchema.extend({
  data: createOrderDataSchema,
});

export type CreateOrderResponseSchema = z.infer<
  typeof createOrderResponseSchema
>;
