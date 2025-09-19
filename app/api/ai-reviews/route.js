import { NextResponse } from "next/server";
import Airtable from "airtable";

// Initialize Airtable with API Key and Base ID
const base = new Airtable({
    apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID);

const TABLE_AI_REVIEW = "AI Tool Review";  // The name of the table in Airtable

// GET: Fetch all AI Tool Reviews
export async function GET() {
    try {
        // Fetch records from Airtable with the correct field names
        const records = await base(TABLE_AI_REVIEW).select({
            fields: [
                "Tool Name", "Description", "Tool Image", "Rating (1-5 stars)", "Pros", "Cons", "Best Use Case"
            ]
        }).all();

        // Map the records to the frontend data structure
        const reviews = records.map((record) => ({
            id: record.id,
            name: record.fields["Tool Name"],  // Primary field
            description: record.fields.Description,
            image: record.fields["Tool Image"],
            rating: record.fields["Rating (1-5 stars)"],
            pros: record.fields.Pros,
            cons: record.fields.Cons,
            bestUseCase: record.fields["Best Use Case"],
        }));

        return NextResponse.json(reviews, { status: 200 });
    } catch (error) {
        console.error("Error fetching AI tool reviews from Airtable:", error);
        return NextResponse.json({ error: "Failed to fetch AI tool reviews" }, { status: 500 });
    }
}

// POST: Create a new AI Tool Review
export async function POST(req) {
    const { name, description, image, rating, pros, cons, bestUseCase } = await req.json();

    if (!name || !description) {
        return NextResponse.json({ error: "Tool Name and Description are required" }, { status: 400 });
    }

    try {
        const createdRecord = await base(TABLE_AI_REVIEW).create({
            "Tool Name": name,  // Primary field
            Description: description,
            "Tool Image": image,
            "Rating (1-5 stars)": rating,
            Pros: pros,
            Cons: cons,
            "Best Use Case": bestUseCase,
        });

        return NextResponse.json(
            {
                id: createdRecord.id,
                ...createdRecord.fields,
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("Error creating AI tool review:", err);
        return NextResponse.json({ error: "Failed to create AI tool review" }, { status: 500 });
    }
}

// PUT: Update an existing AI Tool Review
export async function PUT(req) {
    try {
        const {
            id,
            name,
            description,
            image,
            rating,
            pros,
            cons,
            bestUseCase,
        } = await req.json();

        // Validate required fields
        if (!id) {
            return NextResponse.json({ error: "AI Tool Review ID is required" }, { status: 400 });
        }

        if (!name || !description) {
            return NextResponse.json({ error: "Tool Name and Description are required" }, { status: 400 });
        }

        // Update the AI tool review in Airtable
        const updatedReview = await base(TABLE_AI_REVIEW).update([
            {
                id: id,
                fields: {
                    "Tool Name": name,
                    Description: description,
                    "Tool Image": image,
                    "Rating (1-5 stars)": rating,
                    Pros: pros,
                    Cons: cons,
                    "Best Use Case": bestUseCase,
                },
            },
        ]);

        const record = updatedReview[0];

        return NextResponse.json(
            {
                id: record.id,
                name: record.fields["Tool Name"],
                description: record.fields.Description,
                image: record.fields["Tool Image"],
                rating: record.fields["Rating (1-5 stars)"],
                pros: record.fields.Pros,
                cons: record.fields.Cons,
                bestUseCase: record.fields["Best Use Case"],
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating AI tool review:", error);
        return NextResponse.json({ error: "Failed to update AI tool review" }, { status: 500 });
    }
}

// DELETE: Delete an AI Tool Review by ID
export async function DELETE(req) {
    const { id } = await req.json();
    if (!id) {
        return NextResponse.json({ error: "AI Tool Review ID is required" }, { status: 400 });
    }

    try {
        // Delete the AI tool review record by ID
        await base(TABLE_AI_REVIEW).destroy([id]);
        return NextResponse.json({ message: "AI Tool Review deleted successfully" }, { status: 200 });
    } catch (err) {
        console.error("Error deleting AI tool review:", err);
        return NextResponse.json({ error: "Failed to delete AI tool review" }, { status: 500 });
    }
}
