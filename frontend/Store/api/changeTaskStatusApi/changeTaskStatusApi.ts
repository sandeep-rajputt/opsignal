import baseApi from "../baseApi";
import type { ChangeTaskStatusResponse } from "./schema/changeTaskStatusResponseSchema";
import type { TaskStatus } from "@/schemas/common/taskStatusSchema";

interface ChangeTaskStatusParams {
  workspaceId: string;
  taskId: string;
  data: {
    status: TaskStatus;
  };
}

const changeTaskStatusApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    changeTaskStatus: builder.mutation<
      ChangeTaskStatusResponse,
      ChangeTaskStatusParams
    >({
      query: ({ workspaceId, taskId, data }) => ({
        url: `/api/workspace/${workspaceId}/work/task/${taskId}/status`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const { useChangeTaskStatusMutation } = changeTaskStatusApi;
