import baseApi from "@/Store/api/baseApi";
import { type RegisterCredential } from "@/Store/api/registerApi/schemas/registerCredentialSchema";
import { type RegisterResponse } from "@/Store/api/registerApi/schemas/registerResponseSchema";

const registerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterCredential>({
      query: (data) => {
        return {
          url: "/api/user/register",
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const { useRegisterMutation } = registerApi;
