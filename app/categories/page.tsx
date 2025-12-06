"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import axios from "axios"

interface Category {
  _id: string
  name: string
  description?: string
  icon?: string
  parentCategory: string | null
  createdAt: string
  updatedAt: string
}

interface ApiResponse {
  categories: Category[]
  total: number
  totalPages: number
  page: number
  limit: number
}

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)

        const res = await axios.get<ApiResponse>("/api/admin/categories/")
        // console.log("All Categories:", res.data)

        // Filter top-level categories
        const topLevelCategories = res.data.categories.filter(
          (category) => category.parentCategory === null
        )
        // console.log("Top Level Categories:", topLevelCategories)

        setCategories(topLevelCategories)
      } catch (error) {
        console.error("Failed to fetch categories", error)
        setError("Failed to load categories")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading categories...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header Section */}
      <div className="w-full mt-20 bg-[#bceb9757] py-8 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold">Property Categories</h2>
          <p className="text-sm text-gray-500 py-2">Home / Categories</p>
          <p className="text-sm text-gray-600 mt-1">
            Explore our main property categories. Each category contains various subcategories and properties to help
            you find exactly what looking for.
          </p>
        </div>
      </div>

      {/* Grid Section */}
      <div className="container mx-auto px-4 py-10">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No categories found</p>
            <p className="text-gray-400 text-sm mt-2">Categories will appear here once they are added to the system.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[300px] justify-items-center">
            {categories.map((category, index) => {
              const positionInBlock = index % 6
              const colSpan = positionInBlock === 0 || positionInBlock === 5 ? "md:col-span-2" : "md:col-span-1"

              // Create URL-friendly slug from category name
              // const categorySlug = category.name.toLowerCase().replace(/\s+/g, "-")
              const linkHref = `/categories/${category._id}`

              return (
                <Link key={category._id} href={linkHref} className={`block w-full ${colSpan} group`}>
                  <div className="relative h-[300px] rounded-md overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={
                        category.icon ||
                        `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(category.name)}`
                      }
                      alt={category.name}
                      fill
                      className="object-cover rounded-md"
                    />

                    <div className="absolute inset-0 bg-opacity-40 flex flex-col justify-end p-5 text-white">
                      <h3 className="text-lg sm:text-xl font-semibold mb-1">{category.name}</h3>
                     
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoriesPage
