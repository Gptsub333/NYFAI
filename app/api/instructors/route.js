import { NextResponse } from "next/server";
import Airtable from "airtable";

// Initialize Airtable with API Key and Base ID
const base = new Airtable({
    apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID);

const TABLE_INSTRUCTORS = "Meet Your Instructors";  // The name of the table in Airtable

// GET: Fetch all instructors
export async function GET() {
    try {
        // Fetch records from Airtable with the correct field names
        const records = await base(TABLE_INSTRUCTORS).select({
            fields: [
                "Instructor Name", "Title/Position", "Experience", "Bio", "Profile Image", "Profile Link"
            ]
        }).all();

        // Map the records to the frontend data structure
        const instructors = records.map((record) => ({
            id: record.id,
            name: record.fields["Instructor Name"], // Primary field
            title: record.fields["Title/Position"],
            experience: record.fields.Experience,
            bio: record.fields.Bio,
            avatar: record.fields["Profile Image"],
            profileLink: record.fields["Profile Link"],
        }));

        return NextResponse.json(instructors, { status: 200 });
    } catch (error) {
        console.error("Error fetching instructors from Airtable:", error);
        return NextResponse.json({ error: "Failed to fetch instructors" }, { status: 500 });
    }
}

// POST: Create a new instructor
export async function POST(req) {
    const { name, title, experience, bio, avatar, profileLink } = await req.json();

    if (!name || !bio) {
        return NextResponse.json({ error: "Instructor Name and Bio are required" }, { status: 400 });
    }

    try {
        const createdRecord = await base(TABLE_INSTRUCTORS).create({
            "Instructor Name": name, // Primary field
            "Title/Position": title,
            Experience: experience,
            Bio: bio,
            "Profile Image": avatar,
            "Profile Link": profileLink,
        });

        return NextResponse.json(
            {
                id: createdRecord.id,
                ...createdRecord.fields,
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("Error creating instructor:", err);
        return NextResponse.json({ error: "Failed to create instructor" }, { status: 500 });
    }
}

// PUT: Update an existing instructor
export async function PUT(req) {
    try {
        const {
            id,
            name,
            title,
            experience,
            bio,
            avatar,
            profileLink,
        } = await req.json();

        // Validate required fields
        if (!id) {
            return NextResponse.json({ error: "Instructor ID is required" }, { status: 400 });
        }

        if (!name || !bio) {
            return NextResponse.json({ error: "Instructor Name and Bio are required" }, { status: 400 });
        }

        // Update the instructor in Airtable
        const updatedInstructor = await base(TABLE_INSTRUCTORS).update([
            {
                id: id,
                fields: {
                    "Instructor Name": name,
                    "Title/Position": title,
                    Experience: experience,
                    Bio: bio,
                    "Profile Image": avatar,
                    "Profile Link": profileLink,
                },
            },
        ]);

        const record = updatedInstructor[0];

        return NextResponse.json(
            {
                id: record.id,
                name: record.fields["Instructor Name"],
                title: record.fields["Title/Position"],
                experience: record.fields.Experience,
                bio: record.fields.Bio,
                avatar: record.fields["Profile Image"],
                profileLink: record.fields["Profile Link"],
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating instructor:", error);
        return NextResponse.json({ error: "Failed to update instructor" }, { status: 500 });
    }
}

// DELETE: Delete an instructor by ID
export async function DELETE(req) {
    const { id } = await req.json();
    if (!id) {
        return NextResponse.json({ error: "Instructor ID is required" }, { status: 400 });
    }

    try {
        // Delete the instructor record by ID
        await base(TABLE_INSTRUCTORS).destroy([id]);
        return NextResponse.json({ message: "Instructor deleted successfully" }, { status: 200 });
    } catch (err) {
        console.error("Error deleting instructor:", err);
        return NextResponse.json({ error: "Failed to delete instructor" }, { status: 500 });
    }
}
