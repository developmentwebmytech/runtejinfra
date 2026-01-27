'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function ProjectsByPropertyTypePage() {
  const { slug } = useParams() as { slug: string }

  const [projects, setProjects] = useState<any[]>([])
  const [category, setCategory] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // 1️⃣ get category by slug
        const catRes = await fetch(`/api/categories/${slug}`)
        const catData = await catRes.json()
        setCategory(catData)
        // console.log("Category Data:", catData)
        // 2️⃣ get projects by category ID
        const projRes = await fetch(
          `/api/projectlist?propertyType=${catData._id}`
        )
        const projData = await projRes.json()
        setProjects(projData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchData()
  }, [slug])

  if (loading) return <p className="p-10 text-center">Loading...</p>
  if (!projects.length) return <p className="p-10 text-center">No projects found.</p>

  return (
    <>
      <div className="w-full mt-20 bg-[#bceb9757] py-8 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold">
            Our Services – {category?.name}
          </h2>
          <p className="text-sm text-gray-500 py-2">
            Home / {category?.name}
          </p>
          <p className="text-sm text-gray-600">
            {category?.description}
          </p>
        </div>
      </div>

      <main className="container mx-auto mt-12 px-4 py-10">
        <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <Link
              key={project._id}
              href={`/project/${project.slug}`}
              className="bg-white rounded shadow block"
            >
              <div className="relative h-64">
                <Image
                  src={project.imageUrl}
                  alt={project.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{project.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}
