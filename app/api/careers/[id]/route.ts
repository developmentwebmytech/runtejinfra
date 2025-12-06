// app/api/careers/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CareerApplication from "@/lib/models/career-application";

interface Params { params: { id: string }; }

// GET /api/careers/:id     → read one
export async function GET(_: NextRequest, { params }: Params) {
  await connectDB();
  const doc = await CareerApplication.findById(params.id);
  if (!doc) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

// PATCH /api/careers/:id   → update
export async function PATCH(req: NextRequest, { params }: Params) {
  await connectDB();
  const updates = await req.json();
  const doc = await CareerApplication.findByIdAndUpdate(params.id, updates, { new: true });
  if (!doc) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

// DELETE /api/careers/:id  → delete
export async function DELETE(_: NextRequest, { params }: Params) {
  await connectDB();
  const doc = await CareerApplication.findByIdAndDelete(params.id);
  if (!doc) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ message: "Deleted" });
}
