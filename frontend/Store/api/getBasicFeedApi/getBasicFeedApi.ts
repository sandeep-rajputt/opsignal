import baseApi from "../baseApi";
import type { GetBasicFeedResponse } from "./schema/getBasicFeedResponseSchema";

interface GetBasicFeedParams {
  workspaceId: string;
  feedType: "workspace" | "team";
}

const getBasicFeedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBasicFeed: builder.query<GetBasicFeedResponse, GetBasicFeedParams>({
      query: ({ workspaceId, feedType }) =>
        `/api/workspace/${workspaceId}/work/${feedType}-feed`,
    }),
  }),
});

export const { useGetBasicFeedQuery } = getBasicFeedApi;
export default getBasicFeedApi;
