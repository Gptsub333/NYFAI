import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Airtable from "airtable";
import bcrypt from "bcryptjs";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

export async function POST(req) {
  try {
    const { currentPassword, newPassword } = await req.json();

    // Read token from cookie
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Fetch admin record
    const records = await base("Admin")
      .select({ filterByFormula: `{mail} = '${email}'` })
      .firstPage();

    if (!records.length) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const admin = records[0];
    const isValid = await bcrypt.compare(currentPassword, admin.fields.password);

    if (!isValid) {
      return NextResponse.json({ error: "Current password is wrong" }, { status: 400 });
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // Update Airtable
    await base("Admin").update(admin.id, { password: hashed });

    return NextResponse.json({ success: true, message: "Password updated" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
