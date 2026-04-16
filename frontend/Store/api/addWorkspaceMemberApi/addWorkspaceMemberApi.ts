import baseApi from "../baseApi";
import type { AddWorkspaceMemberResponse } from "./schema/addWorkspaceMemberResponseSchema";
import type { AddWorkspaceMemberData } from "@/schemas/addWorkspaceMemberSchema";

interface AddWorkspaceMemberParams extends AddWorkspaceMemberData {
  workspaceId: string;
}

const addWorkspaceMemberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addWorkspaceMember: builder.mutation<
      AddWorkspaceMemberResponse,
      AddWorkspaceMemberParams
    >({
      query: ({ workspaceId, email, role, teamId }) => ({
        url: `/api/workspace/${workspaceId}/members`,
        method: "POST",
        body: { email, role, teamId },
      }),
      invalidatesTags: ["Members"],
    }),
  }),
});

export const { useAddWorkspaceMemberMutation } = addWorkspaceMemberApi;
