import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Media } from "@/lib/models/media"
import { unlink } from "fs/promises"
import path from "path"

// GET single media
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params

    const media = await Media.findById(id)

    if (!media) {
      return NextResponse.json({ success: false, error: "Media not found" }, { status: 404 })
    }

    // Increment view count
    media.viewCount += 1
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

// UPDATE media
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()

    const media = await Media.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })

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

// DELETE media
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params

    const media = await Media.findByIdAndDelete(id)

    if (!media) {
      return NextResponse.json({ success: false, error: "Media not found" }, { status: 404 })
    }

    // Delete the file from uploads
    try {
      const filePath = path.join(process.cwd(), "public", "uploads", media.fileName)
      await unlink(filePath)
    } catch (fileError) {
      console.warn("⚠️ Could not delete file:", fileError)
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
