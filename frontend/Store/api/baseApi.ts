import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import env from "@/config/env";
import { RootState } from "@/Store/store";

const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    credentials: "include",
    baseUrl:
      env.ENV === "development" ? env.BACKEND_DEVELOPMENT_URL : env.BACKEND_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");

      return headers;
    },
  }),

  endpoints: () => ({}),
});

export default baseApi;
