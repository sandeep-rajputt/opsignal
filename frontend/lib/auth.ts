import { cookies } from "next/headers";
import env from "@/config/env";

export async function checkUser() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token");

  if (!refreshToken) {
    return false;
  }

  const res = await fetch(
    env.ENV === "production"
      ? `${env.BACKEND_URL}/api/user/me`
      : `${env.BACKEND_DEVELOPMENT_URL}/api/user/me`,
    {
      headers: {
        cookie: cookieStore.toString(),
      },
      cache: "no-store",
    },
  );
  return res.ok;
}
