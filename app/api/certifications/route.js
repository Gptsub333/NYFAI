import { NextResponse } from "next/server"
import Airtable from "airtable"

// Initialize Airtable with API Key and Base ID
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID)

const TABLE_CERTIFICATIONS = "Certification" // The name of the table in Airtable

// GET: Fetch all certifications
export async function GET() {
  try {
    // Fetch records from Airtable with the correct field names
    const records = await base(TABLE_CERTIFICATIONS)
      .select({
        fields: [
          "Certification Title",
          "Description",
          "Certification Level",
          "Program Duration",
          "Number of Projects",
          "Learn More URL",
        ],
      })
      .all()

    // Map the records to the frontend data structure
    const certifications = records.map((record) => ({
      id: record.id,
      title: record.fields["Certification Title"], // Primary field
      description: record.fields.Description,
      level: record.fields["Certification Level"],
      duration: record.fields["Program Duration"],
      projects: record.fields["Number of Projects"],
      learnMoreUrl: record.fields["Learn More URL"],
    }))

    return NextResponse.json(certifications, { status: 200 })
  } catch (error) {
    console.error("Error fetching certifications from Airtable:", error)
    return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 })
  }
}

// POST: Create a new certification
export async function POST(req) {
  const { title, description, level, duration, projects, learnMoreUrl } = await req.json()

  if (!title || !description) {
    return NextResponse.json({ error: "Certification Title and Description are required" }, { status: 400 })
  }

  try {
    const createdRecord = await base(TABLE_CERTIFICATIONS).create({
      "Certification Title": title, // Primary field
      Description: description,
      "Certification Level": level,
      "Program Duration": duration,
      "Number of Projects": projects,
      "Learn More URL": learnMoreUrl,
    })

    return NextResponse.json(
      {
        id: createdRecord.id,
        ...createdRecord.fields,
      },
      { status: 201 },
    )
  } catch (err) {
    console.error("Error creating certification:", err)
    return NextResponse.json({ error: "Failed to create certification" }, { status: 500 })
  }
}

// PUT: Update an existing certification
export async function PUT(req) {
  try {
    const { id, title, description, level, duration, projects, learnMoreUrl } = await req.json()

    // Validate required fields
    if (!id) {
      return NextResponse.json({ error: "Certification ID is required" }, { status: 400 })
    }

    if (!title || !description) {
      return NextResponse.json({ error: "Certification Title and Description are required" }, { status: 400 })
    }

    // Update the certification in Airtable
    const updatedCertification = await base(TABLE_CERTIFICATIONS).update([
      {
        id: id,
        fields: {
          "Certification Title": title,
          Description: description,
          "Certification Level": level,
          "Program Duration": duration,
          "Number of Projects": projects,
          "Learn More URL": learnMoreUrl,
        },
      },
    ])

    const record = updatedCertification[0]

    return NextResponse.json(
      {
        id: record.id,
        title: record.fields["Certification Title"],
        description: record.fields.Description,
        level: record.fields["Certification Level"],
        duration: record.fields["Program Duration"],
        projects: record.fields["Number of Projects"],
        learnMoreUrl: record.fields["Learn More URL"],
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating certification:", error)
    return NextResponse.json({ error: "Failed to update certification" }, { status: 500 })
  }
}

// DELETE: Delete a certification by ID
export async function DELETE(req) {
  const { id } = await req.json()
  if (!id) {
    return NextResponse.json({ error: "Certification ID is required" }, { status: 400 })
  }

  try {
    // Delete the certification record by ID
    await base(TABLE_CERTIFICATIONS).destroy([id])
    return NextResponse.json({ message: "Certification deleted successfully" }, { status: 200 })
  } catch (err) {
    console.error("Error deleting certification:", err)
    return NextResponse.json({ error: "Failed to delete certification" }, { status: 500 })
  }
}
