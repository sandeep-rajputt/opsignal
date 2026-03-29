import baseApi from "../baseApi";
import type { GetIncidentsResponse } from "./schema/getIncidentsResponseSchema";

interface GetIncidentsParams {
  workspaceId: string;
}

const getIncidentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIncidents: builder.query<GetIncidentsResponse, GetIncidentsParams>({
      query: ({ workspaceId }) =>
        `/api/workspace/${workspaceId}/work/incidents`,
    }),
  }),
});

export const { useGetIncidentsQuery } = getIncidentsApi;
export default getIncidentsApi;
