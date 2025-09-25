import { NextResponse } from "next/server"
import Airtable from "airtable"

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID)

const TABLE_COURSES = process.env.AIRTABLE_COURSES_TABLE

export async function GET() {
  try {
    // Fetch records from Airtable with the correct field names
    const records = await base(TABLE_COURSES)
      .select({
        fields: [
          "Course Title",
          "Description",
          "Level",
          "Duration",
          "Number of Students",
          "Rating (1-5)",
          "Course Image",
          "External Link",
        ],
      })
      .all()

    // Map the records to your frontend data structure
    const courses = records.map((record) => ({
      id: record.id,
      title: record.fields["Course Title"],
      description: record.fields.Description,
      level: record.fields.Level,
      duration: record.fields.Duration,
      students: record.fields["Number of Students"],
      rating: record.fields["Rating (1-5)"],
      image: record.fields["Course Image"],
      externalLink: record.fields["External Link"],
    }))

    return NextResponse.json(courses, { status: 200 })
  } catch (error) {
    console.error("Error fetching courses from Airtable:", error)
    return NextResponse.json({ error: "Failed to fetch courses from Airtable" }, { status: 500 })
  }
}

export async function POST(req) {
  const { title, description, level, duration, students, rating, image, externalLink } = await req.json()

  // Use the correct field names here:
  if (!title || !description) {
    return NextResponse.json({ error: "Course Title and Description are required" }, { status: 400 })
  }

  try {
    const createdRecord = await base(TABLE_COURSES).create({
      "Course Title": title, // Correct field name
      Description: description,
      Level: level,
      Duration: duration,
      "Number of Students": students,
      "Rating (1-5)": rating,
      "Course Image": image,
      "External Link": externalLink,
    })

    return NextResponse.json(
      {
        id: createdRecord.id,
        ...createdRecord.fields,
      },
      { status: 201 },
    )
  } catch (err) {
    console.error("Error creating course:", err)
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const { id, title, description, level, duration, students, rating, image, externalLink } = await req.json()

    // Validate required fields
    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    if (!title || !description) {
      return NextResponse.json({ error: "Course Title and Description are required" }, { status: 400 })
    }

    // Update the course in Airtable
    const updatedCourse = await base(TABLE_COURSES).update([
      {
        id: id,
        fields: {
          "Course Title": title,
          Description: description,
          Level: level,
          Duration: duration,
          "Number of Students": students,
          "Rating (1-5)": rating,
          "Course Image": image,
          "External Link": externalLink,
        },
      },
    ])

    const record = updatedCourse[0]

    return NextResponse.json(
      {
        id: record.id,
        title: record.fields["Course Title"],
        description: record.fields.Description,
        level: record.fields.Level,
        duration: record.fields.Duration,
        students: record.fields["Number of Students"],
        rating: record.fields["Rating (1-5)"],
        image: record.fields["Course Image"],
        externalLink: record.fields["External Link"],
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating course:", error)
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
  }
}

export async function DELETE(req) {
  const { id } = await req.json()
  if (!id) {
    return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
  }

  try {
    // Delete the course record by ID
    await base(TABLE_COURSES).destroy([id])
    return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 })
  } catch (err) {
    console.error("Error deleting course:", err)
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 })
  }
}
