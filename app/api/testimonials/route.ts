import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Testimonial from "@/lib/models/testimonial";

// GET /api/testimonials
export async function GET() {
  await connectDB();
  const docs = await Testimonial.find().sort({ createdAt: -1 });
  return NextResponse.json(docs);
}

// POST /api/testimonials
export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  if (!body.name || !body.quote )
    return NextResponse.json({ msg: "All fields required" }, { status: 400 });
console.log(body)

  const doc = await Testimonial.create(body);
  return NextResponse.json(doc, { status: 201 });
}
