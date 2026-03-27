import baseApi from "../baseApi";
import type { ChangeTaskPriorityResponse } from "./schema/changeTaskPriorityResponseSchema";
import type { TaskPriority } from "@/schemas/common/taskPrioritySchema";

interface ChangeTaskPriorityParams {
  workspaceId: string;
  taskId: string;
  data: {
    priority: TaskPriority;
  };
}

const changeTaskPriorityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    changeTaskPriority: builder.mutation<
      ChangeTaskPriorityResponse,
      ChangeTaskPriorityParams
    >({
      query: ({ workspaceId, taskId, data }) => ({
        url: `/api/workspace/${workspaceId}/work/task/${taskId}/priority`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const { useChangeTaskPriorityMutation } = changeTaskPriorityApi;
