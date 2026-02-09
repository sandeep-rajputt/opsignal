import baseApi from "../baseApi";
import type { GetWorkspaceBasicInfoResponse } from "./schema/getWorkspaceBasicInfoResponseSchema";

const getWorkspaceBasicInfoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkspaceBasicInfo: builder.query<GetWorkspaceBasicInfoResponse, string>(
      {
        query: (workspaceId) => `/api/workspace/${workspaceId}/basic-info`,
      },
    ),
  }),
});

export const { useGetWorkspaceBasicInfoQuery } = getWorkspaceBasicInfoApi;
