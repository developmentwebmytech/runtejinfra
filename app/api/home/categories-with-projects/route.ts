import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "@/lib/mongodb";
import { Category } from '@/lib/models/Category';
import { Project } from '@/lib/models/PropertyDetail';

// Initialize MongoDB connection

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Fetch all categories where parentCategory is null
    const categories = await Category.find({ parentCategory: null, isActive: true })
      .select('_id name slug icon description')
      .lean();

    // Get project count for each category
    const categoriesWithProjectCount = await Promise.all(
      categories.map(async (category) => {
        const projectCount = await Project.countDocuments({
          category: category._id,
        });

        return {
          _id: category._id.toString(),
          name: category.name,
          slug: category.slug,
          icon: category.icon,
          description: category.description,
          projectCount,
          link: `/category/${category.slug}`,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: categoriesWithProjectCount,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}
