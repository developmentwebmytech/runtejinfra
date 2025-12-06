import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Testimonial from "@/lib/models/testimonial";

interface Params { params: { id: string } }

export async function GET(_: NextRequest, { params }: Params) {
  await connectDB();
  const doc = await Testimonial.findById(params.id);
  if (!doc) return NextResponse.json({ msg: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  await connectDB();
  const updates = await req.json();
  const doc = await Testimonial.findByIdAndUpdate(params.id, updates, { new: true });
  if (!doc) return NextResponse.json({ msg: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  await connectDB();
  const doc = await Testimonial.findByIdAndDelete(params.id);
  if (!doc) return NextResponse.json({ msg: "Not found" }, { status: 404 });
  return NextResponse.json({ msg: "Deleted" });
}
