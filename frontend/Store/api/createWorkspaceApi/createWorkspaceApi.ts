import { OnboardingData } from "@/schemas/onboardingSchema";
import baseApi from "@/Store/api/baseApi";
import { type CreateWorkspaceResponseSchema } from "./schema/createWorkspaceResponseSchema";

const createWorkspaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createWorkspace: builder.mutation<
      CreateWorkspaceResponseSchema,
      OnboardingData
    >({
      query: (data) => ({
        url: `/api/workspace/create-workspace`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Workspaces"],
    }),
  }),
});

export const { useCreateWorkspaceMutation } = createWorkspaceApi;
