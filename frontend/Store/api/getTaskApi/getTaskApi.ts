import baseApi from "../baseApi";
import type { GetTaskResponse } from "./schema/getTaskResponseSchema";

interface GetTaskParams {
  workspaceId: string;
  taskId: string;
}

const getTaskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTask: builder.query<GetTaskResponse, GetTaskParams>({
      query: ({ workspaceId, taskId }) =>
        `/api/workspace/${workspaceId}/work/task/${taskId}`,
    }),
  }),
});

export const { useGetTaskQuery } = getTaskApi;
export default getTaskApi;
