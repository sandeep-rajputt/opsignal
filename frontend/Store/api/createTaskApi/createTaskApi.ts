import baseApi from "../baseApi";
import type { CreateTaskResponse } from "./schema/createTaskResponseSchema";
import type { CreateTask } from "@/schemas/createTaskSchema";

interface CreateTaskParams {
  workspaceId: string;
  data: CreateTask;
}

const createTaskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTask: builder.mutation<CreateTaskResponse, CreateTaskParams>({
      query: ({ workspaceId, data }) => ({
        url: `/api/workspace/${workspaceId}/work/task`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateTaskMutation } = createTaskApi;
