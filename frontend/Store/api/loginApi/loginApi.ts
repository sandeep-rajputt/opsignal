import baseApi from "@/Store/api/baseApi";
import type { LoginCredential } from "@/Store/api/loginApi/schemas/loginCredentialSchema";
import { type LoginResponse } from "@/Store/api/loginApi/schemas/loginResponseSchema";

const loginApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredential>({
      query: (data) => {
        return {
          url: "api/user/login",
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const { useLoginMutation } = loginApi;
