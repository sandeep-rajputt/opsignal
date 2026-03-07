import baseApi from "../baseApi";
import type { UpdateMemberRoleResponse } from "./schema/updateMemberRoleResponseSchema";
import { ROLE } from "@/rbac/roles";

interface UpdateMemberRoleParams {
  workspaceId: string;
  memberId: string;
  role: ROLE;
}

const updateMemberRoleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateMemberRole: builder.mutation<
      UpdateMemberRoleResponse,
      UpdateMemberRoleParams
    >({
      query: ({ workspaceId, memberId, role }) => ({
        url: `/api/workspace/${workspaceId}/members/${memberId}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["Members"],
    }),
  }),
});

export const { useUpdateMemberRoleMutation } = updateMemberRoleApi;
