"use client"

import Link from "next/link"
import Image from "next/image"
import { Calendar, User } from "lucide-react"
import { useEffect, useState } from "react"
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card"

interface Blog {
  _id: string
  slug: string
  title: string
  author: string
  excerpt: string
  featured_image?: string
  publish_date?: string
  created_at?: string
  tags?: string[] | string
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blogs", { cache: "no-store" }) // ✅ fetch all blogs
        if (!res.ok) throw new Error("Failed to load blogs")
        const data = await res.json()
        setBlogs(data.blogs)
      } catch (error) {
        console.error("Error fetching blogs:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  if (loading) return <p className="text-center py-10">Loading blogs...</p>
  if (blogs.length === 0) return <p className="text-center py-10">No blogs found.</p>

  return (
    <section className="py-16 bg-gray-50">
      {/* Header */}
      <div className="container mx-auto px-4 text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          All Blogs
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Stay updated with e-commerce security, latest trends, and useful tips
          from InoxSecure.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto px-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <Link key={blog._id} href={`/blog/${blog.slug}`}>
            <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300 rounded-2xl">
              {/* Blog Image */}
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={
                    blog.featured_image ||
                    "/placeholder.svg?height=240&width=300&query=blog"
                  }
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-amber-700 line-clamp-2">
                  {blog.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>
                    {new Date(
                      blog.publish_date || blog.created_at || ""
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="mx-2">•</span>
                  <User className="h-3 w-3 mr-1" />
                  <span>{blog.author}</span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-3">
                  {blog.excerpt}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
