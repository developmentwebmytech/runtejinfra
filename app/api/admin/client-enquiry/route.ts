import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import { connectDB } from "@/lib/mongodb"
import ClientEnquiry from "@/lib/models/ClientEnquiry"

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads")
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
]

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const formData = await request.formData()

    const files = formData.getAll("attachments") as File[]
    const uploadedFiles: string[] = []

    if (files.length > 0) {
      await fs.mkdir(UPLOAD_DIR, { recursive: true })

      for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            { message: "Each file must be under 5MB" },
            { status: 400 }
          )
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
          return NextResponse.json(
            { message: "Only PDF or image files are allowed" },
            { status: 400 }
          )
        }

        const fileName = `${Date.now()}-${file.name}`
        const filePath = path.join(UPLOAD_DIR, fileName)
        const buffer = Buffer.from(await file.arrayBuffer())

        await fs.writeFile(filePath, buffer)
        uploadedFiles.push(`/uploads/${fileName}`)
      }
    }

    const body = Object.fromEntries(formData.entries())
    delete body.attachments

    body.consent = body.consent === "true"

    const enquiry = await ClientEnquiry.create({
      ...body,
      attachments: uploadedFiles,
    })

    return NextResponse.json(
      { success: true, data: enquiry },
      { status: 201 }
    )
  } catch (error: any) {
    console.error(error)
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectDB()
    const enquiries = await ClientEnquiry.find().sort({ createdAt: -1 })
    return NextResponse.json(enquiries)
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch enquiries" },
      { status: 500 }
    )
  }
}
