import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Project } from "@/lib/models/PropertyDetail" // ✅ important fix

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB()

    const { id } = context.params // ✅ fixed here
    console.log("Fetching project with ID:", id)

    const project = await Project.findById(id).populate("category")
    console.log("Fetched Project:", project ? project.name : "Not Found")

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project, { status: 200 })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

// ✅ PUT /api/project/[id] - Update project
export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB();
    const id = context.params.id;
    const body = await request.json();
    const {
      name,
      address,
      propertyType,
      floor,
      sampleUnit,
      basement,
      totalBuiltUpArea,
      yearOfCompletion,
      description,
      locationLink,
      category,
      imageUrl,
      planImage
    } = body;

    // Validation
    if (!name || !address || !category) {
      return NextResponse.json(
        { error: "Name, address, and category are required" },
        { status: 400 }
      );
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        name,
        address,
        propertyType,
        floor: Number(floor),
        sampleUnit,
        basement,
        totalBuiltUpArea,
        yearOfCompletion: Number(yearOfCompletion),
        description,
        locationLink,
        category,
        imageUrl,
        updatedAt: new Date(),
        planImage: planImage || [], // Ensure planImage is an array
      },
      { new: true }
    ).populate("category");

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// ✅ DELETE /api/project/[id] - Delete project
export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB();
    const id = context.params.id;

    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
