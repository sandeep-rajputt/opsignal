import baseApi from "../baseApi";
import type { GetOverviewResponse } from "./schema/getOverviewResponseSchema";

interface GetOverviewParams {
  workspaceId: string;
  overviewType: "workspace" | "team";
}

const getOverviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOverview: builder.query<GetOverviewResponse, GetOverviewParams>({
      query: ({ workspaceId, overviewType }) =>
        `/api/workspace/${workspaceId}/work/${overviewType}-overview`,
    }),
  }),
});

export const { useGetOverviewQuery } = getOverviewApi;
export default getOverviewApi;
