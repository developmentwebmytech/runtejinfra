import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Partner from "@/lib/models/partner"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get("slug")

    if (slug) {
      const partner = await Partner.findOne({ slug })
      if (!partner) {
        return NextResponse.json({ error: "Partner not found" }, { status: 404 })
      }
      return NextResponse.json(partner)
    }

    const partners = await Partner.find().sort({ createdAt: -1 })
    return NextResponse.json(partners)
  } catch (error) {
    console.error("❌ Fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 })
  }
}
