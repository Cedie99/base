import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAuthPage =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register");
  const isDashboard = nextUrl.pathname.startsWith("/dashboard");

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Role-based route protection
  if (isDashboard && isLoggedIn) {
    const role = req.auth?.user?.role ?? "user";

    if (nextUrl.pathname.startsWith("/dashboard/users") && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    if (
      (nextUrl.pathname.startsWith("/dashboard/listings") ||
        nextUrl.pathname.startsWith("/dashboard/moderation")) &&
      role !== "admin" &&
      role !== "moderator"
    ) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
