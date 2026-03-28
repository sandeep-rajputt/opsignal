import baseApi from "../baseApi";
import type { ChangeTaskStatusResponse } from "./schema/changeTaskStatusResponseSchema";
import type { TaskStatus } from "@/schemas/common/taskStatusSchema";
import type { GetTaskLogsResponse } from "../getTaskLogsApi/schema/getTaskLogsResponseSchema";
import type { WorkLog } from "@/schemas/workLogsSchema";
import getTaskLogsApi from "../getTaskLogsApi/getTaskLogsApi";

interface ChangeTaskStatusParams {
  workspaceId: string;
  taskId: string;
  data: {
    status: TaskStatus;
  };
  currentStatus: TaskStatus;
  userName: string;
  userId: string;
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
      async onQueryStarted(
        { workspaceId, taskId, data, currentStatus, userName, userId },
        { dispatch, queryFulfilled },
      ) {
        const optimisticLog: WorkLog = {
          name: "status_change",
          data: {
            from: currentStatus,
            to: data.status,
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

export const { useChangeTaskStatusMutation } = changeTaskStatusApi;
