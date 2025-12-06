import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Project } from "@/lib/models/PropertyDetail"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB()  

     const productId = params.slug

   
    const Projects = await Project.findById({id: productId})

    return NextResponse.json({
      Projects,
     
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
