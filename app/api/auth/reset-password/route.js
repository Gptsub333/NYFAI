import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Airtable from "airtable";
import bcrypt from "bcryptjs";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

export async function POST(req) {
    const { token, newPassword } = await req.json();

    try {
        const { email } = jwt.verify(token, process.env.JWT_SECRET);
        const records = await base("Admin").select({ filterByFormula: `{mail} = '${email}'` }).firstPage();
        if (!records.length) return NextResponse.json({ error: "Invalid user" }, { status: 400 });

        const hashed = await bcrypt.hash(newPassword, 10);

        await base("Admin").update(records[0].id, { password: hashed });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }
}
