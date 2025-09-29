// middleware.js
import { NextResponse } from "next/server"
import * as jose from "jose"

export default async function middleware(req) {
    const token = req.cookies.get("token")?.value
    const url = req.nextUrl

    // Public paths (accessible without login)
    const publicPaths = [
        "/auth/login",
        "/auth/signup",
        "/auth/forgot-password",
        "/auth/reset-password",
        "/api/auth",
        "/public",
    ]

    if (publicPaths.some(path => url.pathname.startsWith(path))) {
        return NextResponse.next()
    }

    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    try {
        // Use jose for verification (Edge-safe)
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        await jose.jwtVerify(token, secret)
        return NextResponse.next()
    } catch (err) {
        console.error("Invalid token:", err.message)
        return NextResponse.redirect(new URL("/auth/login", req.url))
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
