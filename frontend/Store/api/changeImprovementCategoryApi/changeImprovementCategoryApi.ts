import baseApi from "../baseApi";
import type { ChangeImprovementCategoryResponse } from "./schema/changeImprovementCategoryResponseSchema";
import type { ImprovementCategory } from "@/schemas/common/improvementCategorySchema";
import type { GetImprovementLogsResponse } from "../getImprovementLogsApi/schema/getImprovementLogsResponseSchema";
import type { WorkLog } from "@/schemas/workLogsSchema";
import getImprovementLogsApi from "../getImprovementLogsApi/getImprovementLogsApi";

interface ChangeImprovementCategoryParams {
  workspaceId: string;
  improvementId: string;
  data: {
    category: ImprovementCategory;
  };
  currentCategory: ImprovementCategory;
  userName: string;
  userId: string;
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
      async onQueryStarted(
        { workspaceId, improvementId, data, currentCategory, userName, userId },
        { dispatch, queryFulfilled },
      ) {
        const optimisticLog: WorkLog = {
          name: "category_change",
          data: {
            from: currentCategory,
            to: data.category,
            by: {
              id: userId,
              name: userName,
            },
            at: new Date().toISOString(),
          },
        };

        const patchResult = dispatch(
          getImprovementLogsApi.util.updateQueryData(
            "getImprovementLogs",
            { workspaceId, improvementId },
            (draft: GetImprovementLogsResponse) => {
              draft.data.unshift(optimisticLog);
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useChangeImprovementCategoryMutation } =
  changeImprovementCategoryApi;
