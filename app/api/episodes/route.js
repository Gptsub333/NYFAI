import { NextResponse } from 'next/server';
import Airtable from 'airtable';

const base = new Airtable({
    apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID);

const TABLE_EPISODES = process.env.NEXT_PUBLIC_AIRTABLE_EPISODES_TABLE;

export async function GET() {
    try {
        // Fetch all episodes from Airtable
        const records = await base(TABLE_EPISODES).select().all();

        // Map the records into the format you want to return
        const episodes = records.map((record) => ({
            id: record.id,
            title: record.fields["Episode Title"],
            episode: record.fields["Episode Number"],
            description: record.fields.Description,
            link: record.fields["Episode URL"] || "",
        }));

        return NextResponse.json(episodes, { status: 200 });
    } catch (error) {
        console.error("Error fetching episodes from Airtable:", error);
        return NextResponse.json({ error: "Failed to fetch episodes" }, { status: 500 });
    }
}

export async function POST(req) {
    const { title, episode, link, description } = await req.json();

    // Ensure all required fields are present
    if (!title || !episode || !description) {
        return NextResponse.json({ error: "Title, Episode, and Description are required" }, { status: 400 });
    }

    // Ensure episode is a valid number
    const episodeNumber = Number(episode); // Convert the episode to a number

    if (isNaN(episodeNumber)) {
        return NextResponse.json({ error: "Episode number must be a valid number" }, { status: 400 });
    }

    try {
        // Make sure to pass the correct field names and values as strings if needed
        const newEpisode = await base(TABLE_EPISODES).create({
            "Episode Title": title,             // Ensure this is passed as a string
            "Episode Number": episodeNumber,    // Pass the episode as a number
            Description: description,           // Ensure this is the correct field name
            "Episode URL": link || "",          // Ensure this is passed if available
        });

        // Return the newly created episode
        return NextResponse.json(
            {
                id: newEpisode.id,
                title: newEpisode.fields["Episode Title"],
                episode: newEpisode.fields["Episode Number"],
                description: newEpisode.fields.Description,
                link: newEpisode.fields["Episode URL"] || "",  // Handle empty link
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating episode:", error);
        return NextResponse.json({ error: "Failed to create episode" }, { status: 500 });
    }
}



export async function DELETE(req) {
    const { id } = await req.json();

    if (!id) {
        return NextResponse.json({ error: "Episode ID is required" }, { status: 400 });
    }

    try {
        // Delete the episode from Airtable
        await base(TABLE_EPISODES).destroy([id]);

        return NextResponse.json({ message: "Episode deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting episode:", error);
        return NextResponse.json({ error: "Failed to delete episode" }, { status: 500 });
    }
}
