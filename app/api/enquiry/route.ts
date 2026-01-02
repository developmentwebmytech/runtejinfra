import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb";
import ClientEnquiry from "@/lib/models/ClientEnquiry";

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()

    const newEnquiry = await ClientEnquiry.create(body)

    console.log("[v0] New Client Enquiry Saved:", {
      id: newEnquiry._id,
      client: newEnquiry.fullName,
      type: newEnquiry.requirementType,
      timestamp: new Date().toISOString(),
    })

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
