import baseApi from "../baseApi";
import type { GetMembersResponse } from "./schema/getMembersResponseSchema";

interface GetMembersParams {
  workspaceId: string;
  page?: number;
  limit?: number;
}

const getMembersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMembers: builder.query<GetMembersResponse, GetMembersParams>({
      query: ({ workspaceId, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        return `/api/workspace/${workspaceId}/members-list?${params.toString()}`;
      },
      providesTags: ["Members"],
    }),
  }),
});

export const { useGetMembersQuery } = getMembersApi;
