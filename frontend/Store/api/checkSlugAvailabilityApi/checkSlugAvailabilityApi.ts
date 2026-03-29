import baseApi from "../baseApi";
import type { CheckSlugAvailabilityResponse } from "./schema/checkSlugAvailabilityResponseSchema";

interface CheckSlugAvailabilityParams {
  workspaceId: string;
  slug: string;
}

const checkSlugAvailabilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkSlugAvailability: builder.query<
      CheckSlugAvailabilityResponse,
      CheckSlugAvailabilityParams
    >({
      query: ({ workspaceId, slug }) =>
        `/api/workspace/${workspaceId}/check-slug?slug=${slug}`,
    }),
  }),
});

export const { useLazyCheckSlugAvailabilityQuery } = checkSlugAvailabilityApi;
