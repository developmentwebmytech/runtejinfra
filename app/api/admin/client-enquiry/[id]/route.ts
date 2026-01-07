import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import { connectDB } from "@/lib/mongodb"
import ClientEnquiry from "@/lib/models/ClientEnquiry"

const PUBLIC_DIR = path.join(process.cwd(), "public")

// ✅ GET by ID
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    await connectDB()

    const enquiry = await ClientEnquiry.findById(id)

    if (!enquiry) {
      return NextResponse.json({ message: "Not found" }, { status: 404 })
    }

    return NextResponse.json(enquiry)
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

// ✅ DELETE by ID (with file delete)
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    await connectDB()

    const enquiry = await ClientEnquiry.findById(id)

    if (!enquiry) {
      return NextResponse.json({ message: "Not found" }, { status: 404 })
    }

    // delete files
    if (enquiry.attachments?.length) {
      for (const file of enquiry.attachments) {
        const filePath = path.join(PUBLIC_DIR, file)
        try {
          await fs.unlink(filePath)
        } catch {}
      }
    }

    await ClientEnquiry.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    })
  } catch {
    return NextResponse.json({ message: "Delete failed" }, { status: 500 })
  }
}
