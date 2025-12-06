import { NextRequest, NextResponse } from "next/server";
import { milestoneSchema } from "@/lib/validation/milestoneSchema";
import { connectDB } from "@/lib/mongodb";
import Milestone from "@/lib/models/milestone";

// GET: fetch milestone
export async function GET() {
  try {
    await connectDB();
    const latest = await Milestone.findOne().sort({ _id: -1 });
    if (!latest) {
      return NextResponse.json({}, { status: 200 });
    }
    return NextResponse.json(latest, { status: 200 });
  } catch (error) {
    console.error("GET milestone error:", error); // ✅ error is used
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT: update milestone
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = milestoneSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    await connectDB();
    const updated = await Milestone.findOneAndUpdate({}, parsed.data, {
      new: true,
      upsert: true,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT milestone error:", error); // ✅ error is used
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
