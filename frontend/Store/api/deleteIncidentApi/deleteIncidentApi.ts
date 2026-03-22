import baseApi from "../baseApi";
import type { DeleteIncidentResponse } from "./schema/deleteIncidentResponseSchema";

interface DeleteIncidentParams {
  workspaceId: string;
  incidentId: string;
}

const deleteIncidentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteIncident: builder.mutation<
      DeleteIncidentResponse,
      DeleteIncidentParams
    >({
      query: ({ workspaceId, incidentId }) => ({
        url: `/api/workspace/${workspaceId}/work/incident/${incidentId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useDeleteIncidentMutation } = deleteIncidentApi;
