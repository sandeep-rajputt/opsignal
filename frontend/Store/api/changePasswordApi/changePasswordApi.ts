import baseApi from "../baseApi";
import { NullApiResponse } from "@/schemas/common/nullApiResponse";
import type { ChangePasswordRequest } from "./schema/changePasswordRequestSchema";

const changePasswordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    changePassword: builder.mutation<NullApiResponse, ChangePasswordRequest>({
      query: (data) => ({
        url: `/api/user/change-pass-using-password`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useChangePasswordMutation } = changePasswordApi;
