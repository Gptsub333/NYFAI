import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

export async function POST(req) {
    const { email } = await req.json();
    const records = await base("Admin").select({ filterByFormula: `{mail} = '${email}'` }).firstPage();

    if (!records.length) {
        return NextResponse.json({ error: "No such admin" }, { status: 404 });
    }

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

    // send email (use nodemailer or an external service like Resend/SendGrid)
    console.log("Reset link:", resetUrl);

    return NextResponse.json({ success: true });
}
