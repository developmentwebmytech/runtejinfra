"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import axios from "axios"

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  icon?: string
  parentCategory: string | null
}

export default function CategoriesPage() {
  const { slug } = useParams() as { slug: string }
  // console.log("Category slug from params:", slug)
  const [categories, setCategories] = useState<Category[]>([])
  const [parentCategory, setParentCategory] = useState<Category | null>(null)
  const [projectCounts, setProjectCounts] = useState<{ [key: string]: number }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // 1️⃣ Get parent category by slug
        const parentRes = await axios.get(`/api/categories/${slug}`)
        const parent = parentRes.data
        // console.log("Parent category data:", parent)
        setParentCategory(parent)

        // 2️⃣ Get sub categories
        const subRes = await axios.get(
          `/api/categories?parentCategory=${parent._id}`
        )
        setCategories(subRes.data.categories || [])
        // console.log("Subcategories data:", subRes.data.categories)

        // 3️⃣ Get project counts
        const counts: { [key: string]: number } = {}

        await Promise.all(
          (subRes.data.categories || []).map(async (cat: Category) => {
            try {
              const res = await fetch(
                `/api/projectlist?propertyType=${cat._id}`
              )

              const data = await res.json()
              counts[cat.slug] = data.length || 0
            } catch {
              counts[cat.slug] = 0
            }
          })
        )

        // console.log("Project counts data:", counts)
        setProjectCounts(counts)
      } catch {
        setError("Failed to load category data")
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchData()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading categories...
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="">
      <div className="bg-green-100">
      {parentCategory && (
        <div className="container mx-auto  py-6  mb-10">
          <h1 className="text-3xl font-semibold mb-2">
            {parentCategory.name}
          </h1>
          <p className="text-sm text-gray-600 mb-2">
            Home / {parentCategory.name}
          </p>
          <p className="text-sm text-gray-800 max-w-4xl">
            {parentCategory.description || "No description available"}
          </p>
        </div>
      )}
      </div>
      <div className="container mx-auto pb-5">
      {categories.length === 0 ? (
        <p className="text-center text-gray-500">No categories found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[300px]">
          {categories.map((category, index) => {
            const colSpan =
              index % 6 === 0 || index % 6 === 5
                ? "md:col-span-2"
                : "md:col-span-1"

            return (
              <Link
                key={category._id}
                href={`/projectslist/${category.slug}`}
                className={`group block ${colSpan}`}
              >
                <div className="relative h-[300px] rounded-md overflow-hidden shadow-md transition-transform group-hover:scale-105">
                  <Image
                    src={
                      category.icon ||
                      `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(
                        category.name
                      )}`
                    }
                    alt={category.name}
                    fill
                    className="object-cover"
                  />

                  <div className="absolute top-2 right-2 bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity shadow p-1">
                    <Image src="/tlogo.png" alt="logo" width={28} height={28} />
                  </div>

                  <div className="absolute inset-0 flex flex-col justify-end p-5 pointer-events-none">
                    <h3 className="bg-black/60 text-white inline-block px-2 py-1 rounded w-fit text-lg font-semibold mb-1">
                      {category.name}
                    </h3>
                    <p className="bg-black/60 text-white inline-block px-2 py-1 rounded w-fit text-xs">
                      {projectCounts[category.slug] ?? 0} Projects
                    </p>
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
