import { NullApiResponse } from "@/schemas/common/nullApiResponse";
import baseApi from "@/Store/api/baseApi";

const resetPasswordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    resetPassword: builder.mutation<NullApiResponse, { email: string }>({
      query: (data) => ({
        url: `/api/user/reset-password`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useResetPasswordMutation } = resetPasswordApi;
