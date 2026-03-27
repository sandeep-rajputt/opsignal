import baseApi from "../baseApi";
import type { GetImprovementResponse } from "./schema/getImprovementResponseSchema";

interface GetImprovementParams {
  workspaceId: string;
  improvementId: string;
}

const getImprovementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getImprovement: builder.query<GetImprovementResponse, GetImprovementParams>(
      {
        query: ({ workspaceId, improvementId }) =>
          `/api/workspace/${workspaceId}/work/improvement/${improvementId}`,
      },
    ),
  }),
});

export const { useGetImprovementQuery } = getImprovementApi;
export default getImprovementApi;
