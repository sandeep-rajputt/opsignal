import baseApi from "../baseApi";
import type { ChangeImprovementCategoryResponse } from "./schema/changeImprovementCategoryResponseSchema";
import type { ImprovementCategory } from "@/schemas/common/improvementCategorySchema";

interface ChangeImprovementCategoryParams {
  workspaceId: string;
  improvementId: string;
  data: {
    category: ImprovementCategory;
  };
}

const changeImprovementCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    changeImprovementCategory: builder.mutation<
      ChangeImprovementCategoryResponse,
      ChangeImprovementCategoryParams
    >({
      query: ({ workspaceId, improvementId, data }) => ({
        url: `/api/workspace/${workspaceId}/work/improvement/${improvementId}/category`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const { useChangeImprovementCategoryMutation } =
  changeImprovementCategoryApi;
