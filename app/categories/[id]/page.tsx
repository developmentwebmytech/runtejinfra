"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
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

function CategoriesPage() {
  const { id } = useParams() as { id: string }
  const [categories, setCategories] = useState<Category[]>([])
  const [parentCategory, setParentCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [projectCounts, setProjectCounts] = useState<{ [key: string]: number }>({})


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // ✅ Fetch parent category (fix here)
        const parentRes = await axios.get(`/api/admin/categories/${id}`)
        setParentCategory(parentRes.data) // ✅ FIXED
        console.log("Parent Category:", parentRes.data)

        // ✅ Fetch subcategories
        const subRes = await axios.get(`/api/admin/categories?parentCategory=${id}`)

        setCategories(subRes.data.categories || [])

        // 🔄 Fetch project count for each subcategory
        const counts: { [key: string]: number } = {}

        await Promise.all(
          subRes.data.categories.map(async (category: Category) => {
            try {
              const res = await fetch(`/api/admin/projectdetails?propertyType=${category._id}`)
              const data = await res.json()

              const filtered = data.filter((p: any) => p.propertyType?.toString() === category._id)
              counts[category._id] = filtered.length
            } catch (err) {
              console.error(`Error fetching projects for category ${category._id}`, err)
              counts[category._id] = 0
            }
          })
        )

        setProjectCounts(counts)

      } catch (error) {
        console.error("Failed to fetch data", error)
        setError("Failed to load category data")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading categories...</p>
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
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* ✅ Parent Header Section */}
      {parentCategory && (
        <div className="bg-green-100 px-6 py-6  rounded-md mb-10">
          <h1 className="text-3xl font-semibold mb-2">{parentCategory.name}</h1>
          <p className="text-sm text-gray-600 mb-2">Home / {parentCategory.name}</p>
          <p className="text-sm text-gray-800 max-w-4xl mb-4">
            {parentCategory.description || "No description available"}
          </p>


        </div>
      )}

      {/* ✅ Subcategories Grid */}
      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No categories found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[300px] justify-items-center">
          {categories.map((category, index) => {
            const colSpan =
              index % 6 === 0 || index % 6 === 5 ? "md:col-span-2" : "md:col-span-1"
            const linkHref = `/projectlist/${category._id}`

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
                  <div className="absolute inset-0 bg-opacity-40 flex flex-col justify-end p-5 text-black">
                    <h3 className="text-lg sm:text-xl font-semibold mb-1">{category.name}</h3>

                    <p className="text-xs sm:text-sm">
                      {projectCounts[category._id] ?? "Loading..."} Projects
                    </p>


                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CategoriesPage
