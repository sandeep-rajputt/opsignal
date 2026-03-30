import baseApi from "../baseApi";
import type { GetTasksByStatusResponse } from "./schema/getTasksByStatusResponseSchema";

interface GetTasksByStatusParams {
  workspaceId: string;
  statusType: "workspace" | "team";
}

const getTasksByStatusApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasksByStatus: builder.query<
      GetTasksByStatusResponse,
      GetTasksByStatusParams
    >({
      query: ({ workspaceId, statusType }) =>
        `/api/workspace/${workspaceId}/work/${statusType}-tasks-by-status`,
    }),
  }),
});

export const { useGetTasksByStatusQuery } = getTasksByStatusApi;
export default getTasksByStatusApi;
