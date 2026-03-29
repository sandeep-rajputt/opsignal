import baseApi from "../baseApi";
import type { GetImprovementsResponse } from "./schema/getImprovementsResponseSchema";

interface GetImprovementsParams {
  workspaceId: string;
}

const getImprovementsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getImprovements: builder.query<
      GetImprovementsResponse,
      GetImprovementsParams
    >({
      query: ({ workspaceId }) =>
        `/api/workspace/${workspaceId}/work/improvements`,
    }),
  }),
});

export const { useGetImprovementsQuery } = getImprovementsApi;
export default getImprovementsApi;
