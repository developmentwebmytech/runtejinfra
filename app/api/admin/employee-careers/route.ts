import { type NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import EmployeeApplication from "@/lib/models/EmployeeApplication"
import { connectDB } from "@/lib/mongodb"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const formData = await request.formData()

    // Extract fields
    const fullName = formData.get("fullName")
    const email = formData.get("email")
    const resume = formData.get("resume") as File | null

    if (resume) {
      if (resume.size > MAX_FILE_SIZE) {
        return NextResponse.json({ message: "File size must be less than 5MB" }, { status: 400 })
      }
      if (!ALLOWED_TYPES.includes(resume.type)) {
        return NextResponse.json({ message: "Only PDF and DOC/DOCX files are allowed" }, { status: 400 })
      }
    }

    let resumeUrl = ""
    if (resume) {
      await fs.mkdir(UPLOAD_DIR, { recursive: true })
      const fileName = `${Date.now()}-${resume.name}`
      const filePath = path.join(UPLOAD_DIR, fileName)
      const buffer = Buffer.from(await resume.arrayBuffer())
      await fs.writeFile(filePath, buffer)
      resumeUrl = `/uploads/${fileName}`
    }

    const applicationData = Object.fromEntries(formData.entries())
    delete applicationData.resume

    const application = new EmployeeApplication({
      ...applicationData,
      resumeUrl,
      declaration: formData.get("declaration") === "true",
    })

    await application.save()

    return NextResponse.json({ message: "Application submitted successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectDB()
    const applications = await EmployeeApplication.find().sort({ createdAt: -1 })
    return NextResponse.json(applications)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching applications" }, { status: 500 })
  }
}
