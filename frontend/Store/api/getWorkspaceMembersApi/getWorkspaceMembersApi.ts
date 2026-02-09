import baseApi from "../baseApi";
import type { GetWorkspaceMembersResponse } from "./schema/getWorkspaceMembersResponseSchema";

interface GetWorkspaceMembersParams {
  workspaceId: string;
  role?: string | null;
  team?: string | null;
  page?: number;
  limit?: number;
}

const getWorkspaceMembersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkspaceMembers: builder.query<
      GetWorkspaceMembersResponse,
      GetWorkspaceMembersParams
    >({
      query: ({ workspaceId, role, team, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        if (role) params.append("role", role);
        if (team) params.append("team", team);
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        return `/api/workspace/${workspaceId}/members?${params.toString()}`;
      },
    }),
  }),
});

export const { useGetWorkspaceMembersQuery } = getWorkspaceMembersApi;
