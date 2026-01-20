import baseApi from "@/Store/api/baseApi";
import type { LoginCredential } from "@/schemas/loginCredentialSchema";
import { type LoginResponse } from "@/schemas/loginResponseSchema";
import { authFailed, authPending } from "@/Store/slices/authSlice";
import { toastQueue } from "@/providers/ToastProvider";

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
          toastQueue.add(
            { message: res.message, variant: "success" },
            { timeout: 5000 },
          );
        } catch {
          dispatch(authFailed());
        }
      },
    }),
  }),
});

export const { useLoginMutation } = loginApi;
