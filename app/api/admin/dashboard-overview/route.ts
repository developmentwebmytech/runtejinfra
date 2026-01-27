import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Milestone from "@/lib/models/milestone"
import { Project } from "@/lib/models/PropertyDetail"
import { Category } from "@/lib/models/Category"

export async function GET() {
  try {
    await connectDB()

    // Fetch milestone data
    const milestone = await Milestone.findOne().sort({ _id: -1 })

    // Fetch recent 5 projects with category populated
    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("category", "name slug")
      .populate("propertyType", "name slug")
      .lean()

    // Fetch category-wise project counts
    const categories = await Category.find({parentCategory: null}).lean()
    const categoryStats = await Promise.all(
      categories.map(async (cat) => {
        const count = await Project.countDocuments({ category: cat._id })
        return {
          _id: cat._id,
          name: cat.name,
          slug: cat.slug,
          projectCount: count,
        }
      })
    )

    // Get total projects count
    const totalProjects = await Project.countDocuments()

    // Get projects by year (for activity chart)
    const projectsByYear = await Project.aggregate([
      {
        $group: {
          _id: { $year: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 5 },
    ])

    return NextResponse.json(
      {
        milestone: milestone || {
          projectsCompleted: 0,
          buildingsConstructed: 0,
          workersEmployed: 0,
          yearsOfExperience: 0,
        },
        recentProjects: recentProjects || [],
        categoryStats: categoryStats || [],
        totalProjects,
        projectsByYear: projectsByYear || [],
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("GET dashboard error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
