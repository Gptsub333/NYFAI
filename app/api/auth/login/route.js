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

        console.log("Login attempt for:", email)

        // Safer query - escape the email properly
        const records = await base("Admin")
            .select({
                filterByFormula: `{Mail} = "${email.replace(/"/g, '""')}"`,
                maxRecords: 1
            })
            .firstPage()

        if (!records.length) {
            console.log("User not found")
            // Don't reveal if email exists or not
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            )
        }

        const admin = records[0].fields
        console.log("User found, validating password")

        // Handle both hashed and plain text passwords
        let isValid = false

        if (admin.Password.startsWith('$2')) {
            // Password is hashed with bcrypt
            console.log("Comparing hashed password")
            isValid = await bcrypt.compare(password, admin.Password)
        } else {
            // Password is plain text (legacy support)
            console.log("Comparing plain text password")
            isValid = password === admin.Password

            // Optional: Auto-upgrade to hashed password on successful login
            if (isValid) {
                console.log("Upgrading plain text password to hashed")
                const hashedPassword = await bcrypt.hash(password, 10)
                await base("Admin").update(records[0].id, {
                    Password: hashedPassword
                })
                console.log("Password upgraded successfully")
            }
        }

        console.log("Password validation result:", isValid)

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
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
                issuer: "bobcat-academy",
                audience: "bobcat-users"
            }
        )

        const response = NextResponse.json({
            success: true,
            user: {
                email: admin.Mail,
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

        console.log("Login successful for:", email)
        return response

    } catch (error) {
        console.error("Login error:", error)
        console.error("Error details:", error.message)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}