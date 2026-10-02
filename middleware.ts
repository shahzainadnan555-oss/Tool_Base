import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Admin UI is a frontend foundation only.
 * Keep it available in development, and require ADMIN_UI_ENABLED=true in production.
 * This is not authentication — real admin APIs must use server-side auth later.
 */
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!path.startsWith("/admin")) {
    return NextResponse.next();
  }

  const enabled =
    process.env.ADMIN_UI_ENABLED === "true" ||
    process.env.NODE_ENV === "development";

  if (!enabled) {
    return NextResponse.rewrite(new URL("/not-found-admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
