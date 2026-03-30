import baseApi from "../baseApi";
import type { GetRecentActivityResponse } from "./schema/getRecentActivityResponseSchema";

interface GetRecentActivityParams {
  workspaceId: string;
  activityType: "workspace" | "team";
}

const getRecentActivityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecentActivity: builder.query<
      GetRecentActivityResponse,
      GetRecentActivityParams
    >({
      query: ({ workspaceId, activityType }) =>
        `/api/workspace/${workspaceId}/work/${activityType}-recent-activity`,
    }),
  }),
});

export const { useGetRecentActivityQuery } = getRecentActivityApi;
export default getRecentActivityApi;
