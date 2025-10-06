import Airtable from "airtable"
import { NextResponse } from "next/server"

const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID)

const TABLE_SUCCESS = "Success Story" // Airtable table name

// GET all success stories
export async function GET() {
    try {
        const records = await base(TABLE_SUCCESS).select().all()

        const stories = records.map((record) => ({
            id: record.id,
            company: record.fields["Company"],
            result: record.fields["Result"],
            quote: record.fields["Quote"],
            author: record.fields["Author"],
            createdDate: record.fields["Created Date"],
            stars: record.fields["Stars"],
        }))

        return NextResponse.json(stories, { status: 200 })
    } catch (error) {
        console.error("Error fetching success stories:", error)
        return NextResponse.json({ error: "Failed to fetch success stories" }, { status: 500 })
    }
}

// POST a new success story
export async function POST(req) {
    const { company, result, quote, author, stars } = await req.json()

    if (!company || !result || !quote || !author || !stars) {
        return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
    }

    try {
        const newStory = await base(TABLE_SUCCESS).create({
            Company: company,
            Result: result,
            Quote: quote,
            Author: author,
            Stars: Number(stars),

        })

        return NextResponse.json(
            {
                id: newStory.id,
                company: newStory.fields.Company,
                result: newStory.fields.Result,
                quote: newStory.fields.Quote,
                author: newStory.fields.Author,
                createdDate: newStory.fields["Created Date"],
                stars: newStory.fields.Stars,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error creating success story:", error)
        return NextResponse.json({ error: "Failed to create success story" }, { status: 500 })
    }
}

// PUT update existing success story
export async function PUT(req) {
    const { id, company, result, quote, author, stars } = await req.json()

    if (!id) {
        return NextResponse.json({ error: "Success Story ID is required" }, { status: 400 })
    }

    try {
        const updated = await base(TABLE_SUCCESS).update([
            {
                id: id,
                fields: {
                    Company: company,
                    Result: result,
                    Quote: quote,
                    Author: author,
                    Stars: Number(stars),
                    Stars: stars,
                },
            },
        ])

        const updatedRecord = updated[0]
        return NextResponse.json(
            {
                id: updatedRecord.id,
                company: updatedRecord.fields.Company,
                result: updatedRecord.fields.Result,
                quote: updatedRecord.fields.Quote,
                author: updatedRecord.fields.Author,
                createdDate: updatedRecord.fields["Created Date"],
                stars: updatedRecord.fields.Stars,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error updating success story:", error)
        return NextResponse.json({ error: "Failed to update success story" }, { status: 500 })
    }
}

// DELETE a success story
export async function DELETE(req) {
    const { id } = await req.json()

    if (!id) {
        return NextResponse.json({ error: "Success Story ID is required" }, { status: 400 })
    }

    try {
        await base(TABLE_SUCCESS).destroy([id])
        return NextResponse.json({ message: "Success Story deleted successfully" }, { status: 200 })
    } catch (error) {
        console.error("Error deleting success story:", error)
        return NextResponse.json({ error: "Failed to delete success story" }, { status: 500 })
    }
}
