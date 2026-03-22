import baseApi from "../baseApi";
import type { DeleteImprovementResponse } from "./schema/deleteImprovementResponseSchema";

interface DeleteImprovementParams {
  workspaceId: string;
  improvementId: string;
}

const deleteImprovementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteImprovement: builder.mutation<
      DeleteImprovementResponse,
      DeleteImprovementParams
    >({
      query: ({ workspaceId, improvementId }) => ({
        url: `/api/workspace/${workspaceId}/work/improvement/${improvementId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useDeleteImprovementMutation } = deleteImprovementApi;
