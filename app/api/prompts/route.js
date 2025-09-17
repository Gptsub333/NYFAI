import { NextResponse } from "next/server";
import Airtable from "airtable";

// Initialize Airtable with API key and Base ID
const base = new Airtable({
    apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID);

// Airtable table name for prompts
const TABLE_PROMPTS = process.env.NEXT_PUBLIC_AIRTABLE_PROMPTS_TABLE;

export async function GET() {
    try {
        // Fetch all records from Airtable
        const records = await base(TABLE_PROMPTS).select().all();

        // Map the records to your frontend data structure
        const prompts = records.map((record) => ({
            id: record.id,
            title: record.fields["Title"],  // Assuming 'Title' is the primary field
            description: record.fields.Description,
            content: record.fields["Prompt Content"],
            category: record.fields.Category,
            difficulty: record.fields["Difficulty Level"],
        }));

        return NextResponse.json(prompts, { status: 200 });
    } catch (error) {
        console.error("Error fetching prompts from Airtable:", error);
        return NextResponse.json({ error: "Failed to fetch prompts from Airtable" }, { status: 500 });
    }
}
export async function POST(req) {
    const { title, description, content, category, difficulty } = await req.json();

    // Ensure all required fields are provided
    if (!title || !description || !content || !category || !difficulty) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    try {
        // Create a new prompt in Airtable
        const newPrompt = await base(TABLE_PROMPTS).create({
            Title: title,
            Description: description,
            "Prompt Content": content,
            Category: category,
            "Difficulty Level": difficulty,
        });

        // Return the newly created prompt
        return NextResponse.json(
            {
                id: newPrompt.id,
                title: newPrompt.fields.Title,
                description: newPrompt.fields.Description,
                content: newPrompt.fields["Prompt Content"],
                category: newPrompt.fields.Category,
                difficulty: newPrompt.fields["Difficulty Level"],
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating prompt:", error);
        return NextResponse.json({ error: "Failed to create prompt" }, { status: 500 });
    }
}

export async function DELETE(req) {
    const { id } = await req.json();

    // Ensure the ID is provided
    if (!id) {
        return NextResponse.json({ error: "Prompt ID is required" }, { status: 400 });
    }

    try {
        // Delete the prompt from Airtable
        await base(TABLE_PROMPTS).destroy([id]);

        // Return a success message
        return NextResponse.json({ message: "Prompt deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting prompt:", error);
        return NextResponse.json({ error: "Failed to delete prompt" }, { status: 500 });
    }
}
