import baseApi from "../baseApi";
import type { UpdateProfileResponse } from "./schema/updateProfileResponseSchema";
import type { UpdateProfileRequest } from "./schema/updateProfileRequestSchema";

const updateProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation<
      UpdateProfileResponse,
      UpdateProfileRequest
    >({
      query: (body) => ({
        url: "/api/user/update-profile",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useUpdateProfileMutation } = updateProfileApi;
