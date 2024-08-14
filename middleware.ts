import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "util/config";

export default async function protectPagesMiddleware(
  req: NextRequest,
  res: NextResponse
) {
  const cookieValue = req.cookies.get(COOKIE_NAME);

  if (!cookieValue?.value) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*", // Match all routes starting with /dashboard
};
