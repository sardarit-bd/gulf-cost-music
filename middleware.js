import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  const token = req.cookies.get("token")?.value || null;
  const role = req.cookies.get("role")?.value || null;
  const user = req.cookies.get("user")?.value || null;

  if (pathname.startsWith("/dashboard") && (!token || !user)) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // Role-based access
  const rolePaths = {
    admin: "/dashboard/admin",
    artist: "/dashboard/artist",
    venue: "/dashboard/venue",
    journalist: "/dashboard/journalist",
    photographer: "/dashboard/photographer",
  };

  for (const [key, route] of Object.entries(rolePaths)) {
    if (pathname.startsWith(route) && role !== key) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
