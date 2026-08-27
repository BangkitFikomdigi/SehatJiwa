import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Cek cepat via cookie (tanpa hit DB) untuk redirect dasar. Validasi penuh
// session tetap dilakukan di server component/API route lewat auth.api.getSession().
export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  if (!sessionCookie && isDashboard) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (sessionCookie && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
