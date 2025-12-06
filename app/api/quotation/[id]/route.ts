import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Quotation } from "@/lib/models/quotation";

// GET  /api/quotation/:id  → return one record
export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    await connectDB();
    const item = await Quotation.findById(params.id);
    if (!item) return NextResponse.json({ msg: "Not found" }, { status: 404 });
    return NextResponse.json(item);
}

// DELETE  /api/quotation/:id  → delete
export async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    await connectDB();
    await Quotation.findByIdAndDelete(params.id);
    return NextResponse.json({ msg: "deleted" });
}
