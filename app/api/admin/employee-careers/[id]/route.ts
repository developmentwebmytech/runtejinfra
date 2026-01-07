import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import { connectDB } from "@/lib/mongodb"
import EmployeeApplication from "@/lib/models/EmployeeApplication"

const PUBLIC_DIR = path.join(process.cwd(), "public")

type Context = {
  params: Promise<{ id: string }>
}

// ✅ GET by ID
export async function GET(req: NextRequest, context: Context) {
  const { id } = await context.params

  try {
    await connectDB()

    const application = await EmployeeApplication.findById(id)

    if (!application) {
      return NextResponse.json({ message: "Not found" }, { status: 404 })
    }

    return NextResponse.json(application)
  } catch {
    return NextResponse.json({ message: "Error" }, { status: 500 })
  }
}

// ✅ DELETE by ID
export async function DELETE(req: NextRequest, context: Context) {
  const { id } = await context.params

  try {
    await connectDB()

    const application = await EmployeeApplication.findById(id)

    if (!application) {
      return NextResponse.json({ message: "Not found" }, { status: 404 })
    }

    // delete resume file
    if (application.resumeUrl) {
      try {
        const filePath = path.join(PUBLIC_DIR, application.resumeUrl)
        await fs.unlink(filePath)
      } catch {}
    }

    await EmployeeApplication.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    })
  } catch {
    return NextResponse.json({ message: "Delete failed" }, { status: 500 })
  }
}
