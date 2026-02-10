import baseApi from "../baseApi";
import { GetSessionsResponse } from "./schema/getSessionsResponseSchema";
import { NullApiResponse } from "@/schemas/common/nullApiResponse";

const getSessionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSessions: builder.query<GetSessionsResponse, null>({
      query: () => `/api/user/sessions`,
      providesTags: ["Sessions"],
    }),
    revokeSession: builder.mutation<NullApiResponse, string>({
      query: (sessionId) => ({
        url: `/api/user/sessions/${sessionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sessions"],
    }),
  }),
});

export const { useGetSessionsQuery, useRevokeSessionMutation } = getSessionsApi;
