import baseApi from "../baseApi";
import type { GetWorkspaceTeamsResponse } from "./schema/getWorkspaceTeamsResponseSchema";

const getWorkspaceTeamsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkspaceTeams: builder.query<GetWorkspaceTeamsResponse, string>({
      query: (workspaceId) => `/api/workspace/${workspaceId}/teams`,
    }),
  }),
});

export const { useGetWorkspaceTeamsQuery } = getWorkspaceTeamsApi;
