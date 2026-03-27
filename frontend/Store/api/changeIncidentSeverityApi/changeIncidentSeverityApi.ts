import baseApi from "../baseApi";
import type { ChangeIncidentSeverityResponse } from "./schema/changeIncidentSeverityResponseSchema";
import type { IncidentSeverity } from "@/schemas/common/incidentSeveritySchema";

interface ChangeIncidentSeverityParams {
  workspaceId: string;
  incidentId: string;
  data: {
    severity: IncidentSeverity;
  };
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
    }),
  }),
});

export const { useChangeIncidentSeverityMutation } = changeIncidentSeverityApi;
