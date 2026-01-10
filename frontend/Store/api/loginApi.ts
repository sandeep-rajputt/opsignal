import baseApi from "@/Store/api/baseApi";
import type { LoginCredential } from "@/schemas/loginCredentialSchema";
import loginResponseSchema, {
  type LoginResponse,
} from "@/schemas/loginResponseSchema";
import { authFailed, authLogin, authPending } from "@/Store/slices/authSlice";
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

          const parseData = loginResponseSchema.safeParse(res);

          if (parseData.success) {
            dispatch(
              authLogin({
                token: parseData.data.data.token,
              })
            );
            toastQueue.add(
              { message: parseData.data.message, variant: "success" },
              { timeout: 5000 }
            );
          } else {
            dispatch(authFailed());
          }
        } catch {
          dispatch(authFailed());
        }
      },
    }),
  }),
});

export const { useLoginMutation } = loginApi;
