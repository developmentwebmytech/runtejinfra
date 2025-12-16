import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Ourfirm from "@/lib/models/our-firms"

// =========================
// GET
// =========================
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      const ourfirms = await Ourfirm.find().sort({ createdAt: -1 })
      return NextResponse.json(ourfirms)
    }

    const ourfirm = await Ourfirm.findById(id)

    if (!ourfirm) {
      return NextResponse.json({ error: "Ourfirm not found" }, { status: 404 })
    }

    return NextResponse.json(ourfirm)
  } catch (error) {
    console.error("❌ Fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch ourfirms" }, { status: 500 })
  }
}

// =========================
// POST
// =========================
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const data = await request.json()

    if (!data.slug && data.name) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
    }

    const ourfirm = await Ourfirm.create(data)

    return NextResponse.json(ourfirm, { status: 201 })
  } catch (error: any) {
    console.error("❌ Create error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create ourfirm" },
      { status: 400 }
    )
  }
}

// =========================
// PUT
// =========================
export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: "Ourfirm ID is required" }, { status: 400 })
    }

    if (!data.slug && data.name) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
    }

    const ourfirm = await Ourfirm.findByIdAndUpdate(
      data.id,
      data,
      { new: true }
    )

    if (!ourfirm) {
      return NextResponse.json({ error: "Ourfirm not found" }, { status: 404 })
    }

    return NextResponse.json(ourfirm)
  } catch (error: any) {
    console.error("❌ Update error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update ourfirm" },
      { status: 400 }
    )
  }
}

// =========================
// DELETE
// =========================
export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Ourfirm ID is required" }, { status: 400 })
    }

    const ourfirm = await Ourfirm.findByIdAndDelete(id)

    if (!ourfirm) {
      return NextResponse.json({ error: "Ourfirm not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Ourfirm deleted successfully" })
  } catch (error) {
    console.error("❌ Delete error:", error)
    return NextResponse.json({ error: "Failed to delete ourfirm" }, { status: 500 })
  }
}
