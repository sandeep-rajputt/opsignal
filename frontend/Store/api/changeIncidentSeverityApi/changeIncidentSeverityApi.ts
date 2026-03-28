import baseApi from "../baseApi";
import type { ChangeIncidentSeverityResponse } from "./schema/changeIncidentSeverityResponseSchema";
import type { IncidentSeverity } from "@/schemas/common/incidentSeveritySchema";
import type { GetIncidentLogsResponse } from "../getIncidentLogsApi/schema/getIncidentLogsResponseSchema";
import type { WorkLog } from "@/schemas/workLogsSchema";
import getIncidentLogsApi from "../getIncidentLogsApi/getIncidentLogsApi";

interface ChangeIncidentSeverityParams {
  workspaceId: string;
  incidentId: string;
  data: {
    severity: IncidentSeverity;
  };
  currentSeverity: IncidentSeverity;
  userName: string;
  userId: string;
}

const changeIncidentSeverityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    changeIncidentSeverity: builder.mutation<
      ChangeIncidentSeverityResponse,
      ChangeIncidentSeverityParams
    >({
      query: ({ workspaceId, incidentId, data }) => ({
        url: `/api/workspace/${workspaceId}/work/incident/${incidentId}/severity`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(
        { workspaceId, incidentId, data, currentSeverity, userName, userId },
        { dispatch, queryFulfilled },
      ) {
        const optimisticLog: WorkLog = {
          name: "severity_change",
          data: {
            from: currentSeverity,
            to: data.severity,
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

export const { useChangeIncidentSeverityMutation } = changeIncidentSeverityApi;
