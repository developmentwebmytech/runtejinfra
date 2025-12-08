import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Media } from "@/lib/models/media"

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB()
    const { slug } = await params

    const media = await Media.findOne({ slug })

    if (!media) {
      return NextResponse.json({ success: false, error: "Media not found" }, { status: 404 })
    }

    // Increment view count
    media.viewCount = (media.viewCount || 0) + 1
    await media.save()

    return NextResponse.json(
      {
        success: true,
        data: media,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("❌ Error fetching media:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch media" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB()
    const { slug } = await params
    const body = await request.json()

    const media = await Media.findOneAndUpdate({ slug }, body, { new: true, runValidators: true })

    if (!media) {
      return NextResponse.json({ success: false, error: "Media not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        success: true,
        data: media,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("❌ Error updating media:", error)
    return NextResponse.json({ success: false, error: "Failed to update media" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB()
    const { slug } = await params

    const media = await Media.findOneAndDelete({ slug })

    if (!media) {
      return NextResponse.json({ success: false, error: "Media not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Media deleted successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("❌ Error deleting media:", error)
    return NextResponse.json({ success: false, error: "Failed to delete media" }, { status: 500 })
  }
}
