import { NullApiResponse } from "@/schemas/common/nullApiResponse";
import baseApi from "./baseApi";

const verifyAccountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    verify: builder.mutation<NullApiResponse, string>({
      query: (token) => ({
        url: `/api/user/verify?token=${token}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useVerifyMutation } = verifyAccountApi;
