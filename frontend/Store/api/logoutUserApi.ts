import { NullApiResponse } from "@/schemas/common/nullApiResponse";
import baseApi from "@/Store/api/baseApi";

const logoutUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    logoutUser: builder.mutation<NullApiResponse, null>({
      query: () => ({ url: `/api/user/logout`, method: "POST" }),
    }),
  }),
});

export const { useLogoutUserMutation } = logoutUserApi;
