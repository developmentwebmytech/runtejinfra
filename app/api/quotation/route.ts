// app/api/quotation/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Quotation } from "@/lib/models/quotation";

/* ---------- GET  /api/quotation  ---------- */
export async function GET() {
  try {
    await connectDB();
    const all = await Quotation.find().sort({ createdAt: -1 }); // newest first
    return NextResponse.json(all);              // 200 OK
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/* ---------- POST  /api/quotation  ---------- */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, firstName, lastName, email, phone, projectType, pinCode, budget } = body;

    // light check
    if (!title || !firstName || !lastName || !email || !phone || !projectType || !pinCode || !budget) {
      return NextResponse.json({ message: "Missing data" }, { status: 400 });
    }

    await connectDB();
    const saved = await Quotation.create(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
