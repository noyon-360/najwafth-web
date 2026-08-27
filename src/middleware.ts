import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const authRoutes = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
];

// Browsing the website is public. Only pages that need a user's account data
// should require an authenticated session.
const protectedRoutes = ["/account", "/cart", "/checkout", "/order", "/success"];

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: "next-auth.session-token-website",
  });

  const { pathname } = request.nextUrl;
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!token && isProtectedRoute) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("callbackUrl", request.nextUrl.href);
    return NextResponse.redirect(signinUrl);
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|images).*)"],
};
