import { cache } from "react";
import { cookies } from "next/headers";
import { User } from "@/schemas/userSchema";
import env from "@/config/env";

interface AuthSuccessResponse {
  isAuthenticated: true;
  user: User;
}

interface AuthFailResponse {
  isAuthenticated: false;
  user: null;
}

type AuthResponse = AuthFailResponse | AuthSuccessResponse;

export const checkServerAuth = cache(async (): Promise<AuthResponse> => {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token");

    if (!refreshToken) {
      return { isAuthenticated: false, user: null };
    }

    const baseUrl =
      env.ENV === "development" ? env.BACKEND_DEVELOPMENT_URL : env.BACKEND_URL;

    const res = await fetch(`${baseUrl}/api/user/me`, {
      method: "GET",
      headers: {
        cookie: cookieStore.toString(),
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      return { isAuthenticated: false, user: null };
    }
    const { data }: { data: User } = JSON.parse(await res.text());

    return { isAuthenticated: true, user: data };
  } catch (error) {
    console.error("Auth validation error:", error);
    return { isAuthenticated: false, user: null };
  }
});
