import baseApi from "../baseApi";
import type { GetUserTeamResponse } from "./schema/getUserTeamResponseSchema";

const getUserTeamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserTeam: builder.query<GetUserTeamResponse, string>({
      query: (workspaceId) => `/api/workspace/${workspaceId}/team`,
    }),
  }),
});

export const { useGetUserTeamQuery } = getUserTeamApi;
