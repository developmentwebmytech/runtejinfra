
import { type NextRequest, NextResponse } from "next/server"
import EmployeeApplication from "@/lib/models/EmployeeApplication"
import { connectDB } from "@/lib/mongodb"



// GET: all OR by id
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    // GET by id
    if (id) {
      const application = await EmployeeApplication.findById(id)

      if (!application) {
        return NextResponse.json(
          { message: "Application not found" },
          { status: 404 }
        )
      }

      return NextResponse.json(application)
    }

    // GET all
    const applications = await EmployeeApplication.find().sort({
      createdAt: -1,
    })

    return NextResponse.json(applications)
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching applications" },
      { status: 500 }
    )
  }
}
