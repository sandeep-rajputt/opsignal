import baseApi from "../baseApi";
import type { AddTeamMemberResponse } from "./schema/addTeamMemberResponseSchema";
import type { AddTeamMemberData } from "@/schemas/addTeamMemberSchema";

interface AddTeamMemberParams extends AddTeamMemberData {
  workspaceId: string;
}

const addTeamMemberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addTeamMember: builder.mutation<AddTeamMemberResponse, AddTeamMemberParams>(
      {
        query: ({ workspaceId, email, teamId }) => ({
          url: `/api/workspace/${workspaceId}/team/members`,
          method: "POST",
          body: { email, teamId },
        }),
        invalidatesTags: ["Members"],
      },
    ),
  }),
});

export const { useAddTeamMemberMutation } = addTeamMemberApi;
