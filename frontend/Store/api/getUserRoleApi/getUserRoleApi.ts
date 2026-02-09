import baseApi from "../baseApi";
import type { GetUserRoleResponse } from "./schema/getUserRoleResponseSchema";

const getUserRoleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserRole: builder.query<GetUserRoleResponse, string>({
      query: (workspaceId: string) => `/api/workspace/${workspaceId}/role`,
    }),
  }),
});

export const { useGetUserRoleQuery } = getUserRoleApi;
