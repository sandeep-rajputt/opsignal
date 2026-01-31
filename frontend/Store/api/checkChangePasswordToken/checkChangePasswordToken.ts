import { NullApiResponse } from "@/schemas/common/nullApiResponse";
import baseApi from "@/Store/api/baseApi";

const checkChangePasswordToken = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkChangePasswordToken: builder.mutation<
      NullApiResponse,
      { token: string; id: string }
    >({
      query: (data) => ({
        url: "api/user/check-change-password-token",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCheckChangePasswordTokenMutation } = checkChangePasswordToken;
