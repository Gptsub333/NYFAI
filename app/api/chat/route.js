// app/api/chat/route.js
import { NextResponse } from "next/server"
import { OpenAI } from "openai"
import { SITE_PROMPT as DEFAULT_SITE_PROMPT } from "@/app/api/config/sitePrompt"

const MODEL = "gpt-4.1-mini"       // if json_schema isn't supported on your model, switch to "gpt-4o-mini"
const TEMPERATURE = 0.3

const PAGES = {
    community: { label: "Join Community", url: "https://nyfai-i4or71cas-gptaccounts-projects.vercel.app/community" },
    academy: { label: "Explore Academy", url: "https://nyfai-i4or71cas-gptaccounts-projects.vercel.app/upcoming" },
    newsletter: { label: "Subscribe to Newsletter", url: "https://nyfai-i4or71cas-gptaccounts-projects.vercel.app/media" },
    solutions: { label: "View Solutions", url: "https://nyfai-i4or71cas-gptaccounts-projects.vercel.app/solutions" },
    media: { label: "Watch Media", url: "https://nyfai-i4or71cas-gptaccounts-projects.vercel.app/media" },
    contact: { label: "Contact Us", url: "https://nyfai-i4or71cas-gptaccounts-projects.vercel.app/Sponsor" },
    sponsor: { label: "Become a Sponsor", url: "https://nyfai-i4or71cas-gptaccounts-projects.vercel.app/Sponsor" },
    resources: { label: "Read Resources", url: "https://nyfai-i4or71cas-gptaccounts-projects.vercel.app/resources" },
    prompt_library: { label: "Open Prompt Library", url: "https://nyfai-i4or71cas-gptaccounts-projects.vercel.app/resources/prompt-library" },
    ai_reviews: { label: "AI Tool Reviews", url: "https://nyfai-i4or71cas-gptaccounts-projects.vercel.app/resources/aiReviews" },
    media_articles: { label: "Media Articles", url: "https://nyfai-i4or71cas-gptaccounts-projects.vercel.app/media/Article" },
    media_episodes: { label: "Course Episodes", url: "https://nyfai-i4or71cas-gptaccounts-projects.vercel.app/media/Episode" },
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 })
        }

        const { messages = [], sitePrompt, instructions } = await req.json()

        const systemPrompt = [
            sitePrompt || DEFAULT_SITE_PROMPT,
            instructions ? `\nExtra instructions:\n${instructions}` : "",
            `
Return a compact JSON object following this schema.
Pick up to 3 relevant "page_keys" from this set ONLY:
${Object.keys(PAGES).join(", ")}.
If none fits, return an empty array for "page_keys".
Your "answer" must be brief, helpful, and actionable.
`.trim(),
        ].join("\n")

        // JSON Schema used for structured output
        const schema = {
            type: "object",
            additionalProperties: false,
            properties: {
                answer: { type: "string" },
                page_keys: {
                    type: "array",
                    items: { type: "string", enum: Object.keys(PAGES) },
                    maxItems: 3,
                },
            },
            required: ["answer", "page_keys"],
        }

        const resp = await openai.responses.create({
            model: MODEL,
            temperature: TEMPERATURE,
            input: [
                { role: "system", content: systemPrompt },
                ...messages.map(m => ({ role: m.role, content: m.content })),
            ],
            // ⬇️ NEW: Responses API wants text.format (not response_format)
            text: {
                format: {
                    type: "json_schema",
                    name: "SiteAnswer",
                    schema,
                    strict: true,
                },
            },
        })

        // Parse the structured JSON
        let parsed
        try {
            parsed = JSON.parse(resp.output_text)
        } catch {
            parsed = { answer: "I don’t have that detail yet.", page_keys: [] }
        }

        const actions = (parsed.page_keys || [])
            .map(k => PAGES[k])
            .filter(Boolean)
            .map(({ label, url }) => ({ label, url }))

        return NextResponse.json({ answer: parsed.answer, actions }, { status: 200 })
    } catch (err) {
        console.error(err)
        // Helpful fallback if a model rejects json_schema:
        if (String(err?.message || "").includes("json_schema") || String(err?.message || "").includes("text.format")) {
            return NextResponse.json({
                error: "This model may not support structured outputs. Try switching MODEL to 'gpt-4o-mini' or use plain JSON mode (see note in code).",
            }, { status: 500 })
        }
        return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 })
    }
}
