import baseApi from "../baseApi";
import type { ChangeImprovementStatusResponse } from "./schema/changeImprovementStatusResponseSchema";
import type { ImprovementStatus } from "@/schemas/common/improvementStatusSchema";
import type { GetImprovementLogsResponse } from "../getImprovementLogsApi/schema/getImprovementLogsResponseSchema";
import type { WorkLog } from "@/schemas/workLogsSchema";
import getImprovementLogsApi from "../getImprovementLogsApi/getImprovementLogsApi";

interface ChangeImprovementStatusParams {
  workspaceId: string;
  improvementId: string;
  data: {
    status: ImprovementStatus;
  };
  currentStatus: ImprovementStatus;
  userName: string;
  userId: string;
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
      async onQueryStarted(
        { workspaceId, improvementId, data, currentStatus, userName, userId },
        { dispatch, queryFulfilled },
      ) {
        const optimisticLog: WorkLog = {
          name: "status_change",
          data: {
            from: currentStatus,
            to: data.status,
            by: {
              id: userId,
              name: userName,
            },
            at: new Date().toISOString(),
          },
        };

        const patchResult = dispatch(
          getImprovementLogsApi.util.updateQueryData(
            "getImprovementLogs",
            { workspaceId, improvementId },
            (draft: GetImprovementLogsResponse) => {
              draft.data.unshift(optimisticLog);
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useChangeImprovementStatusMutation } =
  changeImprovementStatusApi;
