import baseApi from "../baseApi";
import type { GetIncidentLogsResponse } from "./schema/getIncidentLogsResponseSchema";

interface GetIncidentLogsParams {
  workspaceId: string;
  incidentId: string;
}

const getIncidentLogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIncidentLogs: builder.query<
      GetIncidentLogsResponse,
      GetIncidentLogsParams
    >({
      query: ({ workspaceId, incidentId }) =>
        `/api/workspace/${workspaceId}/work/incident/${incidentId}/logs`,
    }),
  }),
});

export const { useGetIncidentLogsQuery } = getIncidentLogsApi;
export default getIncidentLogsApi;
