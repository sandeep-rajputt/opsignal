import baseApi from "../baseApi";
import type { CreateIncidentResponse } from "./schema/createIncidentResponseSchema";
import type { CreateIncident } from "@/schemas/createIncidentSchema";

interface CreateIncidentParams {
  workspaceId: string;
  data: CreateIncident;
}

const createIncidentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createIncident: builder.mutation<
      CreateIncidentResponse,
      CreateIncidentParams
    >({
      query: ({ workspaceId, data }) => ({
        url: `/api/workspace/${workspaceId}/work/incident`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateIncidentMutation } = createIncidentApi;
