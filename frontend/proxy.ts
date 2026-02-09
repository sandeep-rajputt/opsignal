import { NextRequest, NextResponse } from "next/server";

const pathAllowedToAuthUser = ["/dashboard", "/onboarding"];
const pathNotAllowedToAuthUser = ["/login", "/register", "/verify"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);

  const refresh_token = req.cookies.get("refresh_token");

  if (pathAllowedToAuthUser.some((path) => pathname.startsWith(path))) {
    if (!refresh_token?.value) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const match = pathname.match(/\/dashboard\/([^\/]+)/);
    if (match && match[1]) {
      requestHeaders.set("x-dashboard-id", match[1]);
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (pathNotAllowedToAuthUser.includes(pathname)) {
    if (refresh_token?.value) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
