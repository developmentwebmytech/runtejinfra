// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Contact } from "@/lib/models/contact";

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const saved = await Contact.create(body);
  return NextResponse.json(saved, { status: 201 });
}

export async function GET() {
  await connectDB();
  const list = await Contact.find().sort({ createdAt: -1 });
  return NextResponse.json(list);
}
