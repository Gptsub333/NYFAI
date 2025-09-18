import base from "@/lib/airtable"; // Import Airtable configuration

const TABLE_EVENTS = "Past events"; // The name of the Airtable table

// GET: Fetch all events
export async function GET() {
    try {
        const records = await base(TABLE_EVENTS).select().all(); // Fetch all events
        const events = records.map((record) => ({
            id: record.id,
            heading: record.fields["Event Heading"], // Update field name
            image: record.fields["Event Image"], // Update field name
            location: record.fields["Location"], // Update field name
            date: record.fields["Date"], // Update field name
            time: record.fields["Time"], // Update field name
            description: record.fields["Description"], // Update field name
            url: record.fields["Event URL"], // Update field name
        }));
        return new Response(JSON.stringify(events), { status: 200 });
    } catch (error) {
        return new Response("Failed to fetch events", { status: 500 });
    }
}

// POST: Add a new event
export async function POST(req) {
    try {
        const { heading, image, location, date, time, description, url } = await req.json();

        // Check for missing required fields
        if (!heading || !image || !location || !date || !time || !description || !url) {
            return new Response("Missing required fields", { status: 400 });
        }

        const newEvent = await base(TABLE_EVENTS).create({
            "Event Heading": heading, // Update field name
            "Event Image": image, // Update field name
            Location: location, // Update field name
            Date: date, // Update field name
            Time: time, // Update field name
            Description: description, // Update field name
            "Event URL": url, // Update field name
        });

        return new Response(
            JSON.stringify({
                id: newEvent.id,
                heading: newEvent.fields["Event Heading"], // Update field name
                image: newEvent.fields["Event Image"], // Update field name
                location: newEvent.fields["Location"], // Update field name
                date: newEvent.fields["Date"], // Update field name
                time: newEvent.fields["Time"], // Update field name
                description: newEvent.fields["Description"], // Update field name
                url: newEvent.fields["Event URL"], // Update field name
            }),
            { status: 201 }
        );
    } catch (error) {
        return new Response("Failed to add event", { status: 500 });
    }
}

// PUT: Update an existing event
export async function PUT(req) {
    try {
        const { id, heading, image, location, date, time, description, url } = await req.json();

        // Check for missing required fields
        if (!id) {
            return new Response("Event ID is required", { status: 400 });
        }

        if (!heading || !image || !location || !date || !time || !description || !url) {
            return new Response("Missing required fields", { status: 400 });
        }

        const updatedEvent = await base(TABLE_EVENTS).update([
            {
                id: id,
                fields: {
                    "Event Heading": heading,
                    "Event Image": image,
                    Location: location,
                    Date: date,
                    Time: time,
                    Description: description,
                    "Event URL": url,
                }
            }
        ]);

        return new Response(
            JSON.stringify({
                id: updatedEvent[0].id,
                heading: updatedEvent[0].fields["Event Heading"],
                image: updatedEvent[0].fields["Event Image"],
                location: updatedEvent[0].fields["Location"],
                date: updatedEvent[0].fields["Date"],
                time: updatedEvent[0].fields["Time"],
                description: updatedEvent[0].fields["Description"],
                url: updatedEvent[0].fields["Event URL"],
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating episode:", error);
        return new Response("Failed to update episode", { status: 500 });
    }
}

// DELETE: Remove an event by ID
export async function DELETE(req) {
    try {
        const { id } = await req.json(); // Get the event ID from the request body

        if (!id) {
            return new Response("Event ID is required", { status: 400 });
        }

        await base(TABLE_EVENTS).destroy([id]); // Delete the event using the Airtable API

        return new Response("Event deleted successfully", { status: 200 });
    } catch (error) {
        return new Response("Failed to delete event", { status: 500 });
    }
}