import baseApi from "@/Store/api/baseApi";
import { toast } from "sonner";
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
              toast.warning("Something went wrong");
              return;
            }
            toast.warning(apiError.message);
          } else {
            toast.warning("Something went wrong");
          }
        }
      },
    }),
  }),
});

export const { useRegisterMutation } = registerApi;
