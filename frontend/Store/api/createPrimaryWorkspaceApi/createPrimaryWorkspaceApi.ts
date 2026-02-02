import { OnboardingData } from "@/schemas/onboardingSchema";
import baseApi from "@/Store/api/baseApi";
import { type CreatePrimaryWorkspaceResponseSchema } from "./schema/createPrimaryWorkspaceResponseSchema";

const createPrimaryWorkspaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPrimaryWorkspace: builder.mutation<
      CreatePrimaryWorkspaceResponseSchema,
      OnboardingData
    >({
      query: (data) => ({
        url: `/api/workspace/create-primary-workspace`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreatePrimaryWorkspaceMutation } = createPrimaryWorkspaceApi;
