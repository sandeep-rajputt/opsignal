import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import env from "@/config/env";

const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    credentials: "include",
    baseUrl:
      env.ENV === "development" ? env.BACKEND_DEVELOPMENT_URL : env.BACKEND_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Workspaces", "Sessions", "User"],
  endpoints: () => ({}),
});

export default baseApi;
