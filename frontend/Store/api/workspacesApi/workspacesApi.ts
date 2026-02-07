import baseApi from "../baseApi";
import type { GetAllWorkspaces } from "./schema/getAllWorkspaceSchema";

const workspaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserAllWorkspaces: builder.query<GetAllWorkspaces, null>({
      query: () => `/api/workspace/get-all-workspace`,
      providesTags: ["Workspaces"],
    }),
  }),
});

export const { useGetUserAllWorkspacesQuery } = workspaceApi;
