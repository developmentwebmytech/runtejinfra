'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface Project {
  _id: string
  name: string
  address: string
  imageUrl: string
  yearOfCompletion: number
  totalBuiltUpArea: string
  propertyType: string
}

interface Category {
  _id: string
  name: string
  description: string
}

export default function ProjectsByPropertyTypePage() {
  const { id } = useParams() // this is propertyType id
  const [projects, setProjects] = useState<Project[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`/api/admin/projectdetails?propertyType=${id}`)
        const data = await res.json()

        const filtered = data.filter((p: any) => p.propertyType?.toString() === id)
        setProjects(filtered)
        console.log("✅ Filtered projects:", filtered)
      } catch (err) {
        console.error("❌ Error fetching projects:", err)
        setError("Something went wrong while fetching projects.")
      } finally {
        setLoading(false)
      }
    }

    const fetchCategoryDetails = async () => {
      try {
        const res = await fetch(`/api/admin/categories/${id}`)
        const catData = await res.json()
        setCategory(catData)
        console.log("✅ Category:", catData)
      } catch (err) {
        console.error("❌ Error fetching category:", err)
      }
    }

    if (id) {
      fetchProjects()
      fetchCategoryDetails()
    }
  }, [id])

  if (loading) return <p className="p-10 text-center">Loading...</p>
  if (!projects.length) return <p className="p-10 text-center">No projects found.</p>

  return (
    <>
      {/* 🔥 Dynamic Header */}
      <div className="w-full mt-20 bg-[#bceb9757] py-8 px-4 sm:px-6 md:px-10">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold">
            Our Services – {category?.name || 'Category'}
          </h2>
          <p className="text-sm text-gray-500 mb-1 py-2">
            Home / {category?.name || 'Loading...'}
          </p>
          <p className="text-sm text-gray-600 mt-1 mb-2">
            {category?.description ||
              'Explore various construction and development projects.'}
          </p>
        </div>
      </div>

      {/* 🔥 Projects Grid */}
      <main className="container mx-auto mt-12 min-h-screen px-4 sm:px-6 lg:px-8 py-10">
        {error ? (
          <p>{error}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => (
              <Link
                key={project._id}
                href={`/projectdetail/${project._id}`}
                className="bg-white rounded shadow overflow-hidden block"
              >
                <div className="relative w-full h-64 sm:h-56">
                  {project?.imageUrl && (
                    <Image
                      src={project.imageUrl}
                      alt={project.name || 'Project image'}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                  <span className="absolute top-2 right-2 text-white text-xs px-2 py-1 rounded bg-green-600">
                    FOR SALE
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
