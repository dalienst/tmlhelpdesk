import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { canOpenPortal, dashboardPath, type RoleFlags } from "@/lib/roles";

// Server-side gate for portal pages: signed-in users only, and each role
// portal (/admin, /gm, ...) only for users who hold that role.
// The API still enforces permissions on every request; this keeps people
// from landing on pages they cannot use.
export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname, search } = request.nextUrl;

  const expired =
    !!token &&
    (token.error === "SessionExpired" ||
      (typeof token.expiresAt === "number" && Date.now() >= token.expiresAt));

  if (!token || expired) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    if (expired) loginUrl.searchParams.set("expired", "1");
    return NextResponse.redirect(loginUrl);
  }

  const prefix = pathname.split("/")[1];
  if (!canOpenPortal(token as RoleFlags, prefix)) {
    return NextResponse.redirect(new URL(dashboardPath(token as RoleFlags), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/director/:path*",
    "/gm/:path*",
    "/group-manager/:path*",
    "/technician/:path*",
    "/manager/:path*",
    "/employee/:path*",
    "/tickets/:path*",
    "/reports/:path*",
    "/guides/:path*",
  ],
};
