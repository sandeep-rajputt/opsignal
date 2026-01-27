import baseApi from "@/Store/api/baseApi";
import type { LoginCredential } from "@/Store/api/loginApi/schemas/loginCredentialSchema";
import { type LoginResponse } from "@/Store/api/loginApi/schemas/loginResponseSchema";
import { authFailed, authPending } from "@/Store/slices/authSlice";
import { toast } from "sonner";
import isApiError from "@/utils/isApiError";

const loginApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredential>({
      query: (data) => {
        return {
          url: "api/user/login",
          method: "POST",
          body: data,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        dispatch(authPending());

        try {
          const { data: res } = await queryFulfilled;
          toast.warning(res.message);
        } catch (error) {
          if (error && typeof error === "object" && "error" in error) {
            const apiError = isApiError(error.error);
            if (apiError) {
              toast.warning(apiError.message);
            } else {
              toast.warning("Something went wrong");
            }
          } else {
            toast.warning("Something went wrong");
          }
          dispatch(authFailed());
        }
      },
    }),
  }),
});

export const { useLoginMutation } = loginApi;
