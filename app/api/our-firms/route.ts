import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Ourfirm from "@/lib/models/our-firms"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get("slug")

    // ✅ get single firm by slug
    if (slug) {
      const firm = await Ourfirm.findOne({ slug })

      if (!firm) {
        return NextResponse.json(
          { error: "Firm not found" },
          { status: 404 }
        )
      }

      return NextResponse.json(firm)
    }

    // ✅ get all firms
    const firms = await Ourfirm.find().sort({ createdAt: -1 })
    return NextResponse.json(firms)

  } catch (error) {
    console.error("❌ Fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch firms" },
      { status: 500 }
    )
  }
}
