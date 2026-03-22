import baseApi from "../baseApi";
import type { DeleteTaskResponse } from "./schema/deleteTaskResponseSchema";

interface DeleteTaskParams {
  workspaceId: string;
  taskId: string;
}

const deleteTaskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteTask: builder.mutation<DeleteTaskResponse, DeleteTaskParams>({
      query: ({ workspaceId, taskId }) => ({
        url: `/api/workspace/${workspaceId}/work/task/${taskId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useDeleteTaskMutation } = deleteTaskApi;
