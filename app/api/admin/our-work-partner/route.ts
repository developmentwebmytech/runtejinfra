import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Partner from "@/lib/models/partner"

// =========================
// GET
// =========================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    await connectDB()

    if (!id) {
      const partners = await Partner.find().sort({ createdAt: -1 })
      return NextResponse.json(partners)
    }

    const partner = await Partner.findById(id)

    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }

    return NextResponse.json(partner)
  } catch (error) {
    console.error("❌ Fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 })
  }
}

// =========================
// POST
// =========================
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const data = await request.json()

    // ---- auto slug fix ----
    if (!data.slug && data.name) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
    }

    const partner = new Partner(data)
    await partner.save()

    return NextResponse.json(partner, { status: 201 })
  } catch (error: any) {
    console.error("❌ Create error:", error)
    return NextResponse.json({ error: error.message || "Failed to create partner" }, { status: 400 })
  }
}

// =========================
// PUT
// =========================
export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    const data = await request.json()
    const { id } = data

    if (!id) {
      return NextResponse.json({ error: "Partner ID is required" }, { status: 400 })
    }

    // auto slug if name changed
    if (!data.slug && data.name) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
    }

    const partner = await Partner.findByIdAndUpdate(id, data, { new: true })

    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }

    return NextResponse.json(partner)
  } catch (error: any) {
    console.error("❌ Update error:", error)
    return NextResponse.json({ error: error.message || "Failed to update partner" }, { status: 400 })
  }
}

// =========================
// DELETE
// =========================
export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    const data = await request.json()
    const { id } = data

    if (!id) {
      return NextResponse.json({ error: "Partner ID is required" }, { status: 400 })
    }

    const partner = await Partner.findByIdAndDelete(id)

    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Partner deleted successfully" })
  } catch (error) {
    console.error("❌ Delete error:", error)
    return NextResponse.json({ error: "Failed to delete partner" }, { status: 500 })
  }
}
