import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith("/sign-in") || req.nextUrl.pathname.startsWith("/sign-up");
  const isAppPage = req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/generate") ||
    req.nextUrl.pathname.startsWith("/posts") ||
    req.nextUrl.pathname.startsWith("/settings");

  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isAppPage && !isAuth) {
    let callbackUrl = req.nextUrl.pathname;
    if (req.nextUrl.search) callbackUrl += req.nextUrl.search;
    return NextResponse.redirect(new URL(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/generate/:path*", "/posts/:path*", "/settings/:path*", "/sign-in", "/sign-up"],
};
