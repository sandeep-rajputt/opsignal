import baseApi from "../baseApi";
import type { ChangeTaskPriorityResponse } from "./schema/changeTaskPriorityResponseSchema";
import type { TaskPriority } from "@/schemas/common/taskPrioritySchema";
import type { GetTaskLogsResponse } from "../getTaskLogsApi/schema/getTaskLogsResponseSchema";
import type { WorkLog } from "@/schemas/workLogsSchema";
import getTaskLogsApi from "../getTaskLogsApi/getTaskLogsApi";

interface ChangeTaskPriorityParams {
  workspaceId: string;
  taskId: string;
  data: {
    priority: TaskPriority;
  };
  currentPriority: TaskPriority;
  userName: string;
  userId: string;
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
      async onQueryStarted(
        { workspaceId, taskId, data, currentPriority, userName, userId },
        { dispatch, queryFulfilled },
      ) {
        const optimisticLog: WorkLog = {
          name: "priority_change",
          data: {
            from: currentPriority,
            to: data.priority,
            by: {
              id: userId,
              name: userName,
            },
            at: new Date().toISOString(),
          },
        };

        const patchResult = dispatch(
          getTaskLogsApi.util.updateQueryData(
            "getTaskLogs",
            { workspaceId, taskId },
            (draft: GetTaskLogsResponse) => {
              draft.data.unshift(optimisticLog);
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useChangeTaskPriorityMutation } = changeTaskPriorityApi;
