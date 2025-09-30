import { NextResponse } from "next/server";
import Airtable from "airtable";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        // Parse request body
        const body = await req.json();
        console.log("Received request:", { email: body.email, hasCurrentPassword: !!body.currentPassword, hasNewPassword: !!body.newPassword });

        const { email, currentPassword, newPassword } = body;

        // Validate input
        if (!email || !currentPassword || !newPassword) {
            console.log("Missing required fields");
            return NextResponse.json(
                { error: "Email, current password, and new password are required" },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            console.log("Password too short");
            return NextResponse.json(
                { error: "New password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Check environment variables
        if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
            console.error("Missing Airtable environment variables");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        // Initialize Airtable
        const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
            process.env.AIRTABLE_BASE_ID
        );

        console.log("Searching for admin with email:", email);

        // Find admin record in Airtable by email
        const records = await base("Admin")
            .select({
                filterByFormula: `{Mail} = '${email}'`,
            })
            .firstPage();

        console.log("Found records:", records.length);

        if (!records.length) {
            return NextResponse.json(
                { error: "Admin user not found" },
                { status: 404 }
            );
        }

        const admin = records[0];
        console.log("Admin found, verifying password");

        // Check if Password field exists
        if (!admin.fields.Password) {
            console.error("Password field is empty in Airtable");
            return NextResponse.json(
                { error: "Password not set for this user" },
                { status: 400 }
            );
        }

        // Verify current password (handle both plain text and hashed)
        let isValidPassword = false;

        // Check if password is hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
        if (admin.fields.Password.startsWith('$2')) {
            // Password is hashed, use bcrypt compare
            isValidPassword = await bcrypt.compare(
                currentPassword,
                admin.fields.Password
            );
        } else {
            // Password is plain text, direct comparison
            isValidPassword = currentPassword === admin.fields.Password;
        }

        console.log("Password valid:", isValidPassword);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: "Current password is incorrect" },
                { status: 400 }
            );
        }

        // Hash new password
        console.log("Hashing new password");
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in Airtable
        console.log("Updating password in Airtable");
        await base("Admin").update(admin.id, {
            Password: hashedPassword,
        });

        console.log("Password updated successfully");

        return NextResponse.json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error("Change password error:", error);
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
        return NextResponse.json(
            { error: "Failed to update password: " + error.message },
            { status: 500 }
        );
    }
}