import baseApi from "@/Store/api/baseApi";
import { toastQueue } from "@/providers/ToastProvider";
import { type RegisterCredential } from "@/schemas/registerCredentialSchema";
import registerResponseSchema, {
  type RegisterResponse,
} from "@/schemas/registerResponseSchema";
import registerErrorResponseSchema from "@/schemas/registerErrorResponseSchema";

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
          const { data: res } = await queryFulfilled;
          const data = await registerResponseSchema.safeParseAsync(res);
          console.log(data.data);
          if (data.error) {
            console.log(data.error);
            toastQueue.add(
              {
                message: "Something Went wrong",
                variant: "warning",
              },
              { timeout: 5000 }
            );
          }
        } catch (error: unknown) {
          const parsedError = await registerErrorResponseSchema.safeParseAsync(
            (error as { error: unknown })?.error
          );
          if (parsedError.error) {
            toastQueue.add(
              {
                message: "Something Went wrong",
                variant: "error",
              },
              { timeout: 5000 }
            );
            return;
          }
          if (parsedError.data.data.message) {
            toastQueue.add(
              {
                message: parsedError.data.data.message,
                variant: "error",
              },
              { timeout: 5000 }
            );
          }
        }
      },
    }),
  }),
});

export const { useRegisterMutation } = registerApi;
