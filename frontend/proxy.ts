import { NextRequest, NextResponse } from "next/server";

const pathAllowedToAuthUser = ["/dashboard", "/onboarding"];
const pathNotAllowedToAuthUser = ["/login", "/register", "/verify"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathAllowedToAuthUser.includes(pathname)) {
    const refresh_token = req.cookies.get("refresh_token");
    if (!refresh_token?.value) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  if (pathNotAllowedToAuthUser.includes(pathname)) {
    const refresh_token = req.cookies.get("refresh_token");
    if (refresh_token?.value) {
      console.log("redirect");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, and .png files
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
  ],
};
