// app/api/beehiiv-subscribe/route.js



export async function POST(req) {
    const { email } = await req.json();

    if (!email) return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });

    const beehiivApiKey = process.env.BEEHIIV_API_KEY;
    const beehiivPubId = process.env.VITE_BEEHIIV_PUBLICATION_ID;

    if (!beehiivApiKey || !beehiivPubId) {
        return new Response(JSON.stringify({ error: 'Missing Beehiiv API key or publication ID' }), { status: 500 });
    }

    try {
        const response = await fetch(`https://api.beehiiv.com/v2/publications/${beehiivPubId}/subscriptions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${beehiivApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: response.status });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Failed to subscribe to Beehiiv', details: err.message }), { status: 500 });
    }
}
