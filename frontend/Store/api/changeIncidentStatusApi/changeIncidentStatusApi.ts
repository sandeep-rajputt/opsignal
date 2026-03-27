import baseApi from "../baseApi";
import type { ChangeIncidentStatusResponse } from "./schema/changeIncidentStatusResponseSchema";
import type { IncidentStatus } from "@/schemas/common/incidentStatusSchema";

interface ChangeIncidentStatusParams {
  workspaceId: string;
  incidentId: string;
  data: {
    status: IncidentStatus;
  };
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
    }),
  }),
});

export const { useChangeIncidentStatusMutation } = changeIncidentStatusApi;
