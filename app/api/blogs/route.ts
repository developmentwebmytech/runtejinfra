import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Blog } from "@/lib/models/Blog"

export async function GET(request: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const category = searchParams.get("category")
    const tag = searchParams.get("tag")

    const skip = (page - 1) * limit
    const query: any = {}

    if (category) query.categories = { $in: [category] }
    if (tag) query.tags = { $in: [tag] }

    const total = await Blog.countDocuments(query)

    const blogs = await Blog.find(query)
      .sort({ publish_date: -1, created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return NextResponse.json({
      blogs: blogs.map((blog: any) => ({
        ...blog,
        _id: blog._id.toString(),
        publish_date: blog.publish_date || blog.created_at,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch blogs",
        details: (error as Error).message,
        blogs: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      },
      { status: 500 }
    )
  }
}
