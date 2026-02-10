import baseApi from "../baseApi";
import { GetUserApiResponse } from "./schemas/getUserApiResponse";

const getUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<GetUserApiResponse, null>({
      query: () => `/api/user/me`,
      providesTags: ["User"],
    }),
  }),
});

export const { useGetUserQuery } = getUserApi;
