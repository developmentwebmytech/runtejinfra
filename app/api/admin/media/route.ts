import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Media } from "@/lib/models/media"

// GET all media or filtered media
export async function GET(request: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const query: any = {}

    if (category && category !== "all") {
      query.category = category
    }

    if (featured === "true") {
      query.featured = true
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ]
    }

    const media = await Media.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)
    const total = await Media.countDocuments(query)

    return NextResponse.json(
      {
        success: true,
        data: media,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("❌ Error fetching media:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch media" }, { status: 500 })
  }
}

// POST new media
export async function POST(request: Request) {
  try {
    await connectDB()

    const body = await request.json()
    const { title, description, image, fileName, category, tags, featured, link } = body

    if (!title || !image || !fileName) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const media = await Media.create({
      title,
      description,
      image,
      fileName,
      category,
      tags: tags || [],
      featured: featured || false,
      link: link || null,
    })

    return NextResponse.json(
      {
        success: true,
        data: media,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("❌ Error creating media:", error)
    return NextResponse.json({ success: false, error: "Failed to create media" }, { status: 500 })
  }
}
