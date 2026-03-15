import baseApi from "../baseApi";
import type { CreateImprovementResponse } from "./schema/createImprovementResponseSchema";
import type { CreateImprovement } from "@/schemas/createImprovementSchema";

interface CreateImprovementParams {
  workspaceId: string;
  data: CreateImprovement;
}

const createImprovementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createImprovement: builder.mutation<
      CreateImprovementResponse,
      CreateImprovementParams
    >({
      query: ({ workspaceId, data }) => ({
        url: `/api/workspace/${workspaceId}/work/improvement`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateImprovementMutation } = createImprovementApi;
