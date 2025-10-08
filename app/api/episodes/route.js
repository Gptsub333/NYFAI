import { NextResponse } from "next/server"
import Airtable from "airtable"

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID)

const TABLE_EPISODES = process.env.AIRTABLE_EPISODES_TABLE

export async function GET() {
  try {
    // Fetch all episodes from Airtable in ascending order by Episode Number
    const records = await base(TABLE_EPISODES)
      .select({
        sort: [{ field: "Episode Number", direction: "asc" }],
      })
      .all()

    // Map the records into the format you want to return
    const episodes = records.map((record) => ({
      id: record.id,
      title: record.fields["Episode Title"],
      episode: record.fields["Episode Number"],
      description: record.fields.Description,
      link: record.fields["Episode URL"] || "",
      image: record.fields.Image, // Assuming 'Image' is an attachment field
    }))

    return NextResponse.json(episodes, { status: 200 })
  } catch (error) {
    console.error("Error fetching episodes from Airtable:", error)
    return NextResponse.json({ error: "Failed to fetch episodes" }, { status: 500 })
  }
}

export async function POST(req) {
  const { title, episode, link, description, image } = await req.json()

  // Ensure all required fields are present
  if (!title || !episode || !description || !image) {
    return NextResponse.json({ error: "Title, Episode, and Description are required" }, { status: 400 })
  }

  // Ensure episode is a valid number
  const episodeNumber = Number(episode) // Convert the episode to a number

  if (isNaN(episodeNumber)) {
    return NextResponse.json({ error: "Episode number must be a valid number" }, { status: 400 })
  }

  try {
    // Make sure to pass the correct field names and values as strings if needed
    const newEpisode = await base(TABLE_EPISODES).create({
      "Episode Title": title, // Ensure this is passed as a string
      "Episode Number": episodeNumber, // Pass the episode as a number
      Description: description, // Ensure this is the correct field name
      "Episode URL": link || "", // Ensure this is passed if available
      Image: image, // image should be S3 URL
    })

    // Return the newly created episode
    return NextResponse.json(
      {
        id: newEpisode.id,
        title: newEpisode.fields["Episode Title"],
        episode: newEpisode.fields["Episode Number"],
        description: newEpisode.fields.Description,
        link: newEpisode.fields["Episode URL"] || "", // Handle empty link
        image: newEpisode.fields.Image || "", // Handle empty image
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating episode:", error)
    return NextResponse.json({ error: "Failed to create episode" }, { status: 500 })
  }
}

// PUT: Update an existing episode
export async function PUT(req) {
  try {
    const { id, title, episode, link, description, image } = await req.json()

    // Validate required fields
    if (!id) {
      return new Response("Episode ID is required", { status: 400 })
    }

    if (!title || !episode || !description || !image) {
      return new Response("Missing required fields", { status: 400 })
    }

    // Update the episode in Airtable
    const updatedEpisode = await base(TABLE_EPISODES).update([
      {
        id: id,
        fields: {
          "Episode Title": title,
          "Episode Number": episode,
          "Episode URL": link || "",
          Description: description,
          Image: image, // image should be S3 URL
        },
      },
    ])

    const record = updatedEpisode[0]

    return new Response(
      JSON.stringify({
        id: record.id,
        title: record.fields["Episode Title"],
        episode: record.fields["Episode Number"],
        link: record.fields["Episode URL"],
        description: record.fields.Description,
        image: record.fields.Image,
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating episode:", error)
    return new Response("Failed to update episode", { status: 500 })
  }
}

export async function DELETE(req) {
  const { id } = await req.json()

  if (!id) {
    return NextResponse.json({ error: "Episode ID is required" }, { status: 400 })
  }

  try {
    // Delete the episode from Airtable
    await base(TABLE_EPISODES).destroy([id])

    return NextResponse.json({ message: "Episode deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting episode:", error)
    return NextResponse.json({ error: "Failed to delete episode" }, { status: 500 })
  }
}
