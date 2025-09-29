// app/api/auth/me/route.js
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function GET(req) {
    try {
        // Get the token from cookies
        const token = req.cookies.get("token")?.value

        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Return user info (excluding sensitive data)
        const user = {
            email: decoded.email,
            id: decoded.id,
            // Add any other non-sensitive user data you want to include
        }

        return NextResponse.json({ user })
    } catch (error) {
        console.error("Auth verification error:", error)

        // If token is invalid or expired, return 401
        return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
}