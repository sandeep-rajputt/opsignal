import baseApi from "../baseApi";
import type { GetTasksResponse } from "./schema/getTasksResponseSchema";

interface GetTasksParams {
  workspaceId: string;
}

const getTasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<GetTasksResponse, GetTasksParams>({
      query: ({ workspaceId }) => `/api/workspace/${workspaceId}/work/tasks`,
    }),
  }),
});

export const { useGetTasksQuery } = getTasksApi;
export default getTasksApi;
