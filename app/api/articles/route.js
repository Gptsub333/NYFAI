import Airtable from "airtable"
import { NextResponse } from "next/server"

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID)

const TABLE_ARTICLES = "Articles"

// GET all articles
export async function GET() {
  try {
    const records = await base(TABLE_ARTICLES).select().all()

    const articles = records.map((record) => ({
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
      type: record.fields["Resource Type"],
      industry: record.fields["Industry"],
    }))

    return NextResponse.json(articles, { status: 200 })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}

// POST create article
export async function POST(req) {
  const { title, date, author, tags, excerpt, image, category, content, readTime, type, industry } = await req.json()

  if (!title || !date || !author || !excerpt || !category || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    const newArticle = await base(TABLE_ARTICLES).create({
      Title: title,
      Date: date,
      Author: author,
      Tags: tags,
      Excerpt: excerpt,
      "Image url": image,
      Category: category,
      Content: content,
      "Read time": readTime,
      "Resource Type": type,
      Industry: industry,
    })

    return NextResponse.json(
      {
        id: newArticle.id,
        ...newArticle.fields,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
  }
}

// PUT update article
export async function PUT(req) {
  const { id, title, date, author, tags, excerpt, image, category, content, readTime, type, industry } =
    await req.json()

  if (!id) {
    return NextResponse.json({ error: "Article ID is required" }, { status: 400 })
  }

  try {
    const updatedArticle = await base(TABLE_ARTICLES).update([
      {
        id,
        fields: {
          Title: title,
          Date: date,
          Author: author,
          Tags: tags,
          Excerpt: excerpt,
          "Image url": image,
          Category: category,
          Content: content,
          "Read time": readTime,
          "Resource Type": type,
          Industry: industry,
        },
      },
    ])

    const record = updatedArticle[0]
    return NextResponse.json(
      {
        id: record.id,
        ...record.fields,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 })
  }
}

// DELETE article
export async function DELETE(req) {
  const { id } = await req.json()

  if (!id) {
    return NextResponse.json({ error: "Article ID is required" }, { status: 400 })
  }

  try {
    await base(TABLE_ARTICLES).destroy([id])
    return NextResponse.json({ message: "Article deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
}
