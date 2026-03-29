import baseApi from "../baseApi";
import type { UpdateWorkspaceSettingsResponse } from "./schema/updateWorkspaceSettingsResponseSchema";
import type { UpdateWorkspaceSettingsRequest } from "./schema/updateWorkspaceSettingsRequestSchema";

interface UpdateWorkspaceSettingsParams {
  workspaceId: string;
  data: UpdateWorkspaceSettingsRequest;
}

const updateWorkspaceSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateWorkspaceSettings: builder.mutation<
      UpdateWorkspaceSettingsResponse,
      UpdateWorkspaceSettingsParams
    >({
      query: ({ workspaceId, data }) => ({
        url: `/api/workspace/${workspaceId}/settings`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Workspaces"],
    }),
  }),
});

export const { useUpdateWorkspaceSettingsMutation } =
  updateWorkspaceSettingsApi;
