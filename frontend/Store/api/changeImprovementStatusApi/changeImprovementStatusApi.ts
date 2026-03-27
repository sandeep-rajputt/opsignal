import baseApi from "../baseApi";
import type { ChangeImprovementStatusResponse } from "./schema/changeImprovementStatusResponseSchema";
import type { ImprovementStatus } from "@/schemas/common/improvementStatusSchema";

interface ChangeImprovementStatusParams {
  workspaceId: string;
  improvementId: string;
  data: {
    status: ImprovementStatus;
  };
}

const changeImprovementStatusApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    changeImprovementStatus: builder.mutation<
      ChangeImprovementStatusResponse,
      ChangeImprovementStatusParams
    >({
      query: ({ workspaceId, improvementId, data }) => ({
        url: `/api/workspace/${workspaceId}/work/improvement/${improvementId}/status`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const { useChangeImprovementStatusMutation } =
  changeImprovementStatusApi;
