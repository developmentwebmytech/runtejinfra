import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ContactPost } from "@/lib/models/postcontact";

async function getDoc() {
  await connectDB();
  return (await ContactPost.findOne()) || (await ContactPost.create({}));
}

// GET  /api/contact-post
export async function GET() {
  const doc = await getDoc();
  return NextResponse.json(doc, { status: 200 });
}

// PUT  /api/contact-post
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const doc = await ContactPost.findOneAndUpdate({}, body, {
    new: true,
    upsert: true,
  });
  return NextResponse.json(doc, { status: 200 });
}
