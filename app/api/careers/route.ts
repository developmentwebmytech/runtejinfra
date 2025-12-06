import { NextRequest, NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import CareerApplication from "@/lib/models/career-application";

// GET ─ list all
export async function GET() {
  await connectDB();
  const docs = await CareerApplication.find().sort({ createdAt: -1 });
  return NextResponse.json(docs);
}

// POST ─ create
export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();

  if (!data.name || !data.email)
    return NextResponse.json({ message: "Name & Email required." }, { status: 400 });

  const doc = await CareerApplication.create(data);
  return NextResponse.json(doc, { status: 201 });
}
