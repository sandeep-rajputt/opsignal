import { NullApiResponse } from "@/schemas/common/nullApiResponse";
import baseApi from "@/Store/api/baseApi";
import { type ChangeUserPasswordCredential } from "@/Store/api/changeUserPasswordApi/schemas/changeUserPasswordCredentialSchema";

const changeUserPasswordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    changeUserPassword: builder.mutation<
      NullApiResponse,
      ChangeUserPasswordCredential
    >({
      query: (data) => ({
        url: "api/user/change-user-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useChangeUserPasswordMutation } = changeUserPasswordApi;
