import baseApi from "@/Store/api/baseApi";
import { type CreateOrderResponseSchema } from "./schema/createOrderResponseSchema";
import { type VerifyPaymentRequestSchema } from "./schema/verifyPaymentRequestSchema";
import { type VerifyPaymentResponseSchema } from "./schema/verifyPaymentResponseSchema";
import { type VerifySlotPaymentRequestSchema } from "./schema/verifySlotPaymentRequestSchema";
import { type VerifySlotPaymentResponseSchema } from "./schema/verifySlotPaymentResponseSchema";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<
      CreateOrderResponseSchema,
      { workspaceId: string; plan: "premium" }
    >({
      query: (data) => ({
        url: `/api/payment/create-order`,
        method: "POST",
        body: data,
      }),
    }),
    verifyPayment: builder.mutation<
      VerifyPaymentResponseSchema,
      VerifyPaymentRequestSchema
    >({
      query: (data) => ({
        url: `/api/payment/verify-payment`,
        method: "POST",
        body: data,
      }),
    }),
    createSlotOrder: builder.mutation<CreateOrderResponseSchema, void>({
      query: () => ({
        url: `/api/payment/create-slot-order`,
        method: "POST",
      }),
    }),
    verifySlotPayment: builder.mutation<
      VerifySlotPaymentResponseSchema,
      VerifySlotPaymentRequestSchema
    >({
      query: (data) => ({
        url: `/api/payment/verify-slot-payment`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useCreateSlotOrderMutation,
  useVerifySlotPaymentMutation,
} = paymentApi;
