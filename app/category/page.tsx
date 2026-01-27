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
  slug: string
  parentCategory: string | null
  createdAt: string
  updatedAt: string
}

interface ApiResponse {
  categories: Category[]
  allcategories: Category[]
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const res = await axios.get<ApiResponse>("/api/categories")

        const topLevelCategories = res.data.allcategories.filter(
          (category) => category.parentCategory === null
        )
        // console.log("all categories:", res.data.allcategories)
        // console.log("Top-level categories:", topLevelCategories)
        setCategories(topLevelCategories)
      } catch (err) {
        setError("Failed to load categories")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

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
    <div>
      {/* Header */}
      <div className="container mx-auto mt-5 bg-[#bceb9757] px-4 py-8 ">
        <div className="">
          <h2 className="text-3xl font-semibold">Property Categories</h2>
          <p className="text-sm text-gray-500 mt-1">Home / Categories</p>
          <p className="text-sm text-gray-600 mt-2 max-w-3xl">
            Explore our main property categories to find what you are looking for.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 py-10">
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
                  href={`/category/${category.slug}`}
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

                    {/* Text overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-5 pointer-events-none">
                      <h3 className="bg-black/60 text-white inline-block px-2 py-1 rounded w-fit text-lg font-semibold">
                        {category.name}
                      </h3>
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
