import { NextResponse } from "next/server";

export function middleware(req) {
    const url = req.nextUrl;
    const pathname = url.pathname;

    const token = req.cookies.get("token")?.value;
    const role = req.cookies.get("role")?.value;

    // Protected routes
    const protectedRoutes = ["/dashboard"];

    const isProtected = protectedRoutes.some((path) =>
        pathname.startsWith(path)
    );

    // If no token → signin
    if (isProtected && !token) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    // Role-based checks:
    if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (pathname.startsWith("/dashboard/artist") && role !== "artist") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (pathname.startsWith("/dashboard/venue") && role !== "venue") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (pathname.startsWith("/dashboard/journalist") && role !== "journalist") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (pathname.startsWith("/dashboard/photographer") && role !== "photographer") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
