import baseApi from "../baseApi";
import type { ChangeIncidentStatusResponse } from "./schema/changeIncidentStatusResponseSchema";
import type { IncidentStatus } from "@/schemas/common/incidentStatusSchema";
import type { GetIncidentLogsResponse } from "../getIncidentLogsApi/schema/getIncidentLogsResponseSchema";
import type { WorkLog } from "@/schemas/workLogsSchema";
import getIncidentLogsApi from "../getIncidentLogsApi/getIncidentLogsApi";

interface ChangeIncidentStatusParams {
  workspaceId: string;
  incidentId: string;
  data: {
    status: IncidentStatus;
  };
  currentStatus: IncidentStatus;
  userName: string;
  userId: string;
}

const changeIncidentStatusApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    changeIncidentStatus: builder.mutation<
      ChangeIncidentStatusResponse,
      ChangeIncidentStatusParams
    >({
      query: ({ workspaceId, incidentId, data }) => ({
        url: `/api/workspace/${workspaceId}/work/incident/${incidentId}/status`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(
        { workspaceId, incidentId, data, currentStatus, userName, userId },
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
          getIncidentLogsApi.util.updateQueryData(
            "getIncidentLogs",
            { workspaceId, incidentId },
            (draft: GetIncidentLogsResponse) => {
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

export const { useChangeIncidentStatusMutation } = changeIncidentStatusApi;
