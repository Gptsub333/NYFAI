import Airtable from "airtable"
import { NextResponse } from "next/server"

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID)

const TABLE_ARTICLES = "Articles"

// GET article by ID
export async function GET(req, { params }) {
  const { id } = params

  if (!id) {
    return NextResponse.json({ error: "Article ID is required" }, { status: 400 })
  }

  try {
    const record = await base(TABLE_ARTICLES).find(id)

    const article = {
      id: record.id,
      title: record.fields["Title"],
      date: record.fields["Date"],
      author: record.fields["Author"],
      tags: record.fields["Tags"],
      excerpt: record.fields["Excerpt"],
      image: record.fields["Image url"],
      category: record.fields["Category"],
      content: record.fields["Content"],
      readTime: record.fields["Read time"],
      resourceType: record.fields["Resource Type"],
      industry: record.fields["Industry"],
    }

    return NextResponse.json(article, { status: 200 })
  } catch (error) {
    console.error("Error fetching article by ID:", error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}
