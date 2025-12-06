import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Project } from "@/lib/models/PropertyDetail"

export async function GET(request: NextRequest) {
  try {
    await connectDB()  

    const AllProjects = await Project.find()    

    return NextResponse.json({
      AllProjects,
     
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
