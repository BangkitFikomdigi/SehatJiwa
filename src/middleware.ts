import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Bypass auth untuk development lokal (teman testing tanpa auth)
const SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";

// Cek cepat via cookie (tanpa hit DB) untuk redirect dasar. Validasi penuh
// session tetap dilakukan di server component/API route lewat auth.api.getSession().
export function middleware(request: NextRequest) {
  // Skip semua middleware auth jika NEXT_PUBLIC_SKIP_AUTH = true
  if (SKIP_AUTH) {
    return NextResponse.next();
  }

  // Block akses ke /login dan /register kalau auth diaktifkan
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  if (isAuthPage && !SKIP_AUTH) {
    // Redirect ke dashboard atau home
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  const sessionCookie = getSessionCookie(request);
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  if (!sessionCookie && isDashboard) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
