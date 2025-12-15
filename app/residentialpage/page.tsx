"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import axios from "axios"

interface Property {
  _id: string
  name: string
  image: string
  projectCount: number
  slug: string
}

export default function CategoryPage() {
  const { slug } = useParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return

    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/categories/${slug}`)
        setProperties(res.data.children || [])
      } catch (err) {
        console.error("Fetch failed", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  return (
    <div>
      {/* Header */}
      <div className="w-full mt-20 bg-[#bceb9757] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold capitalize">{slug}</h2>
          <p className="text-sm text-gray-500">Home / {slug}</p>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 py-10">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {properties.map((item, index) => {
              const colSpan =
                index % 6 === 0 || index % 6 === 5
                  ? "md:col-span-2"
                  : "md:col-span-1"

              return (
                <Link
                  key={item._id}
                  href={`/projects/${item.slug}`}
                  className={`block w-full ${colSpan}`}
                >
                  <div className="relative h-[300px] overflow-hidden rounded-md">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 text-white">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-sm">{item.projectCount} Projects</p>
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
