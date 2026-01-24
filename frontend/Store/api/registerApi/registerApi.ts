import baseApi from "@/Store/api/baseApi";
import { toastQueue } from "@/providers/ToastProvider";
import { type RegisterCredential } from "@/Store/api/registerApi/schemas/registerCredentialSchema";
import { type RegisterResponse } from "@/Store/api/registerApi/schemas/registerResponseSchema";
import isApiError from "@/utils/isApiError";

const registerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterCredential>({
      query: (data) => {
        return {
          url: "/api/user/register",
          method: "POST",
          body: data,
        };
      },
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: unknown) {
          if (error && typeof error === "object" && "error" in error) {
            const apiError = isApiError(error.error);
            if (!apiError) {
              toastQueue.add(
                {
                  message: "Something Went wrong",
                  variant: "error",
                },
                { timeout: 5000 },
              );
              return;
            }
            toastQueue.add(
              {
                message: apiError.message,
                variant: "error",
              },
              { timeout: 5000 },
            );
          } else {
            toastQueue.add(
              {
                message: "Something Went wrong",
                variant: "error",
              },
              { timeout: 5000 },
            );
          }
        }
      },
    }),
  }),
});

export const { useRegisterMutation } = registerApi;
