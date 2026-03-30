import baseApi from "../baseApi";
import type { GetIncidentsBySeverityResponse } from "./schema/getIncidentsBySeverityResponseSchema";

interface GetIncidentsBySeverityParams {
  workspaceId: string;
  severityType: "workspace" | "team";
}

const getIncidentsBySeverityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIncidentsBySeverity: builder.query<
      GetIncidentsBySeverityResponse,
      GetIncidentsBySeverityParams
    >({
      query: ({ workspaceId, severityType }) =>
        `/api/workspace/${workspaceId}/work/${severityType}-incidents-by-severity`,
    }),
  }),
});

export const { useGetIncidentsBySeverityQuery } = getIncidentsBySeverityApi;
export default getIncidentsBySeverityApi;
