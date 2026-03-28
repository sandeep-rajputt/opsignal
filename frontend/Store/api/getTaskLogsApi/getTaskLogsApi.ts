import baseApi from "../baseApi";
import type { GetTaskLogsResponse } from "./schema/getTaskLogsResponseSchema";

interface GetTaskLogsParams {
  workspaceId: string;
  taskId: string;
}

const getTaskLogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTaskLogs: builder.query<GetTaskLogsResponse, GetTaskLogsParams>({
      query: ({ workspaceId, taskId }) =>
        `/api/workspace/${workspaceId}/work/task/${taskId}/logs`,
    }),
  }),
});

export const { useGetTaskLogsQuery } = getTaskLogsApi;
export default getTaskLogsApi;
