import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import Airtable from "airtable"

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
)

export async function POST(req) {
    try {
        const { email, password } = await req.json()

        // Input validation
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            )
        }

        // Rate limiting could be added here

        // Safer query - escape the email properly
        const records = await base("Admin")
            .select({
                filterByFormula: `{Mail} = "${email.replace(/"/g, '""')}"`,
                maxRecords: 1
            })
            .firstPage()

        if (!records.length) {
            // Don't reveal if email exists or not
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            )
        }

        const admin = records[0].fields

        // For security, passwords should be hashed
        // If using plain text (not recommended), at least use timing-safe comparison
        const isValid = password === admin.Password

        // Better approach would be:
        // const isValid = await bcrypt.compare(password, admin.Password)

        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            )
        }

        // Create JWT with more secure payload
        const token = jwt.sign(
            {
                email: admin.Mail,
                id: records[0].id,
                // Don't include sensitive data in JWT
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
                issuer: "your-app-name",
                audience: "your-app-users"
            }
        )

        const response = NextResponse.json({
            success: true,
            user: {
                email: admin.Mail,
                // Include any non-sensitive user data needed by frontend
            }
        })

        // Set secure cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 86400, // 24 hours in seconds
            path: "/"
        })

        return response

    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}