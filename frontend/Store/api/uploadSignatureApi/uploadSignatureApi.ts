import baseApi from "../baseApi";
import type { UploadSignatureResponse } from "./schema/uploadSignatureResponseSchema";

const uploadSignatureApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadSignature: builder.mutation<
      UploadSignatureResponse,
      { folder?: string }
    >({
      query: (body) => ({
        url: "/api/user/upload-signature",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useUploadSignatureMutation } = uploadSignatureApi;
