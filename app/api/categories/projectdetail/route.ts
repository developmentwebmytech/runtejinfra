import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Project } from "@/lib/models/PropertyDetail"

export async function GET(req: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const propertyType = searchParams.get("propertyType")
    // console.log("propertyType:", propertyType)

    const filter: any = {}
    if (propertyType) {
      filter.propertyType = propertyType   // ✅ FIX HERE
    }

    const projects = await Project.find(filter)
      .populate("propertyType")
      .sort({ createdAt: -1 })

    // console.log("Fetched projects:", projects)

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    )
  }
}
