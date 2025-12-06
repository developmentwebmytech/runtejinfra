import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Contact } from "@/lib/models/contact";

// DELETE /api/contact/:id
export async function DELETE(
  _req: NextRequest,
  ctx: { params: { id: string } }
) {
  // ⬇️ In Next 15, ctx.params is a promise – we must await it once.
  const { id } = await ctx.params;

  try {
    await connectDB();

    const removed = await Contact.findByIdAndDelete(id);

    if (!removed) {
      return NextResponse.json(
        { message: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Contact deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
