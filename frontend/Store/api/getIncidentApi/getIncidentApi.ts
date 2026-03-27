import baseApi from "../baseApi";
import type { GetIncidentResponse } from "./schema/getIncidentResponseSchema";

interface GetIncidentParams {
  workspaceId: string;
  incidentId: string;
}

const getIncidentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIncident: builder.query<GetIncidentResponse, GetIncidentParams>({
      query: ({ workspaceId, incidentId }) =>
        `/api/workspace/${workspaceId}/work/incident/${incidentId}`,
    }),
  }),
});

export const { useGetIncidentQuery } = getIncidentApi;
export default getIncidentApi;
