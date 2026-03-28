import baseApi from "../baseApi";
import type { GetImprovementLogsResponse } from "./schema/getImprovementLogsResponseSchema";

interface GetImprovementLogsParams {
  workspaceId: string;
  improvementId: string;
}

const getImprovementLogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getImprovementLogs: builder.query<
      GetImprovementLogsResponse,
      GetImprovementLogsParams
    >({
      query: ({ workspaceId, improvementId }) =>
        `/api/workspace/${workspaceId}/work/improvement/${improvementId}/logs`,
    }),
  }),
});

export const { useGetImprovementLogsQuery } = getImprovementLogsApi;
export default getImprovementLogsApi;
