import { type NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import Vendor from "@/lib/models/VendorRegistration"
import { connectDB } from "@/lib/mongodb"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/jpg",
]

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const formData = await request.formData()

    // Extract mandatory files
    const gstCertificate = formData.get("gstCertificate") as File | null
    const panCard = formData.get("panCard") as File | null
    const companyProfile = formData.get("companyProfile") as File | null

    // Validate mandatory documents
    if (!gstCertificate || !panCard) {
      return NextResponse.json({ message: "GST Certificate and PAN Card are mandatory" }, { status: 400 })
    }

    // Validate file sizes and types
    const filesToValidate = [
      { file: gstCertificate, name: "GST Certificate" },
      { file: panCard, name: "PAN Card" },
    ]

    if (companyProfile) {
      filesToValidate.push({ file: companyProfile, name: "Company Profile" })
    }

    for (const { file, name } of filesToValidate) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ message: `${name} must be less than 5MB` }, { status: 400 })
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ message: `${name} has invalid file type` }, { status: 400 })
      }
    }

    // Create uploads directory if it doesn't exist
    await fs.mkdir(UPLOAD_DIR, { recursive: true })

    // Helper function to save file
    const saveFile = async (file: File) => {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`
      const filePath = path.join(UPLOAD_DIR, fileName)
      const buffer = Buffer.from(await file.arrayBuffer())
      await fs.writeFile(filePath, buffer)
      return `/uploads/${fileName}`
    }

    // Save files
    const gstCertificateUrl = await saveFile(gstCertificate)
    const panCardUrl = await saveFile(panCard)
    let companyProfileUrl = ""

    if (companyProfile) {
      companyProfileUrl = await saveFile(companyProfile)
    }

    // Extract form fields
    const vendorData = {
      firmName: formData.get("firmName"),
      contactPersonName: formData.get("contactPersonName"),
      mobileNumber: formData.get("mobileNumber"),
      email: formData.get("email"),
      registeredOfficeAddress: formData.get("registeredOfficeAddress"),
      vendorCategory: formData.get("vendorCategory"),
      materialServiceDescription: formData.get("materialServiceDescription"),
      yearsOfExperience: formData.get("yearsOfExperience"),
      gstNumber: formData.get("gstNumber"),
      panNumber: formData.get("panNumber"),
      msmeRegistration: formData.get("msmeRegistration"),
      pfEsiApplicable: formData.get("pfEsiApplicable"),
      gstCertificateUrl,
      panCardUrl,
      companyProfileUrl,
      declaration: formData.get("declaration") === "true",
    }

    // Create and save vendor registration
    const vendor = new Vendor(vendorData)
    await vendor.save()

    return NextResponse.json({ message: "Vendor registration submitted successfully" }, { status: 201 })
  } catch (error) {
    console.error("[v0] Vendor registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectDB()
    const vendors = await Vendor.find().sort({ createdAt: -1 })
    return NextResponse.json(vendors)
  } catch (error) {
    console.error("[v0] Fetch vendors error:", error)
    return NextResponse.json({ message: "Error fetching vendor registrations" }, { status: 500 })
  }
}
