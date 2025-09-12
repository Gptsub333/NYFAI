// app/api/airtable-subscribe/route.js

export async function POST(req) {
    const { name, email } = await req.json();

    if (!name || !email) return new Response(JSON.stringify({ error: 'Name and Email required' }), { status: 400 });

    const airtableApiKey = process.env.VITE_AIRTABLE_API_KEY;
    const baseId = process.env.VITE_AIRTABLE_BASE_ID;
    const tableName = process.env.VITE_AIRTABLE_TABLE_NAME;

    if (!airtableApiKey || !baseId || !tableName) {
        return new Response(JSON.stringify({ error: 'Missing Airtable environment variables' }), { status: 500 });
    }

    try {
        const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${airtableApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fields: { Name: name, Email: email },
            }),
        });

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: response.status });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Failed to subscribe to Airtable', details: err.message }), { status: 500 });
    }
}
