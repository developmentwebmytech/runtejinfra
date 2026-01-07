import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Vendor from "@/lib/models/VendorRegistration"
import fs from "fs/promises"
import path from "path"

const UPLOAD_DIR = path.join(process.cwd(), "public")

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    // ✅ fix for Next.js params error
    const { id } = await params

    const vendor = await Vendor.findById(id)

    if (!vendor) {
      return NextResponse.json(
        { message: "Vendor not found" },
        { status: 404 }
      )
    }

    // 🗑 delete uploaded files
    const files = [
      vendor.gstCertificateUrl,
      vendor.panCardUrl,
      vendor.companyProfileUrl,
    ]

    for (const filePath of files) {
      if (filePath) {
        const fullPath = path.join(UPLOAD_DIR, filePath)
        try {
          await fs.unlink(fullPath)
        } catch {
          // ignore file not found
        }
      }
    }

    await Vendor.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: "Vendor deleted successfully",
    })
  } catch (error) {
    console.error("Delete vendor error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
