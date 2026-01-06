import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import ClientEnquiry from "@/lib/models/ClientEnquiry"

export async function POST(req: Request) {
  try {
    await connectDB()

    const formData = await req.formData()
    const body = Object.fromEntries(formData.entries())

    // consent ko boolean banao
    body.consent = body.consent === "true"

    const newEnquiry = await ClientEnquiry.create(body)

    return NextResponse.json({
      success: true,
      message: "Enquiry received and saved successfully",
      data: newEnquiry,
    })
  } catch (error: any) {
    console.error("[v0] API Error:", error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal Server Error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    await connectDB()
    const applications = await ClientEnquiry.find().sort({ createdAt: -1 })
    return NextResponse.json(applications)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching applications" }, { status: 500 })
  }
}
