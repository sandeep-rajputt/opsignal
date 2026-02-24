import baseApi from "../baseApi";
import type { RemoveMemberResponse } from "./schema/removeMemberResponseSchema";

interface RemoveMemberParams {
  workspaceId: string;
  memberId: string;
}

const removeMemberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    removeMember: builder.mutation<RemoveMemberResponse, RemoveMemberParams>({
      query: ({ workspaceId, memberId }) => ({
        url: `/api/workspace/${workspaceId}/members/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Members"],
    }),
  }),
});

export const { useRemoveMemberMutation } = removeMemberApi;
