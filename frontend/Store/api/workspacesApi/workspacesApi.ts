import baseApi from "../baseApi";
import type { GetAllWorkspaces } from "./schema/getAllWorkspaceSchema";

const workspaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserAllWorkspaces: builder.query<GetAllWorkspaces, null>({
      query: () => `/api/workspace/get-all-workspace`,
    }),
  }),
});

export const { useGetUserAllWorkspacesQuery } = workspaceApi;
