import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Project } from "@/lib/models/PropertyDetail"
import { unlink } from "fs/promises"
import { join } from "path"

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const { id } = await context.params

    const project = await Project.findById(id).populate("category").populate("propertyType").lean()

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
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const { id } = await context.params
    const body = await request.json()

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        ...body,
        floor: Number(body.floor),
        yearOfCompletion: Number(body.yearOfCompletion),
        updatedAt: new Date(),
        planImage: body.planImage || [],
      },
      { new: true },
    ).populate("category")

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

// ✅ DELETE /api/project/[id] - Delete project with file cleanup
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const { id } = await context.params

    const project = await Project.findById(id)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const filesToDelete: string[] = []

    // Add main image
    if (project.imageUrl) {
      const filename = project.imageUrl.split("/uploads/")[1]
      if (filename) filesToDelete.push(filename)
    }

    // Add plan images
    if (project.planImage && Array.isArray(project.planImage)) {
      project.planImage.forEach((image) => {
        if (image.url) {
          const filename = image.url.split("/uploads/")[1]
          if (filename) filesToDelete.push(filename)
        }
      })
    }

    // Delete files from filesystem
    for (const filename of filesToDelete) {
      try {
        const filePath = join(process.cwd(), "public/uploads", filename)
        await unlink(filePath)
      } catch (err) {
        console.error(`Failed to delete file: ${filename}`, err)
        // Continue with other files even if one fails
      }
    }

    // Delete project from database
    const deletedProject = await Project.findByIdAndDelete(id)

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
