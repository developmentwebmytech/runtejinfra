"use client"

import { useEffect, useState } from "react"
import { MediaCard } from "@/components/media-gallery/media-card"
import { MediaFilter } from "@/components/media-gallery/media-filters"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Media {
  _id: string
  slug: string
  title: string
  description: string
  image: string
  category: string
  viewCount: number
  link?: string
}

interface PaginationData {
  total: number
  page: number
  limit: number
  pages: number
}

export default function MediaGalleryPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState("all")
  const [search, setSearch] = useState("")
  const [featured, setFeatured] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationData | null>(null)

  useEffect(() => {
    setCurrentPage(1)
    setMedia([])
  }, [category, search, featured])

  useEffect(() => {
    fetchMedia()
  }, [category, search, featured, currentPage])

  async function fetchMedia() {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (category !== "all") params.append("category", category)
      if (search) params.append("search", search)
      if (featured) params.append("featured", "true")
      params.append("page", currentPage.toString())
      params.append("limit", "20")

      const response = await fetch(`/api/admin/media?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        if (currentPage === 1) {
          setMedia(data.data)
        } else {
          setMedia((prev) => [...prev, ...data.data])
        }
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Error fetching media:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Media Gallery</h1>
          <p className="text-muted-foreground">Browse our collection of images</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <MediaFilter onCategoryChange={setCategory} onSearchChange={setSearch} onFeaturedChange={setFeatured} />
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="lg:col-span-3">
            {loading && currentPage === 1 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-72" />
                ))}
              </div>
            ) : media.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {media.map((item) => (
                    <MediaCard
                      key={item._id}
                      slug={item.slug}
                      title={item.title}
                      image={item.image}
                      category={item.category}
                      viewCount={item.viewCount}
                      link={item.link}
                    />
                  ))}
                </div>

                {pagination && currentPage < pagination.pages && (
                  <div className="mt-12 flex justify-center">
                    <Button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={loading}
                      variant="outline"
                      size="lg"
                    >
                      {loading ? "Loading..." : `Load More (Page ${currentPage + 1} of ${pagination.pages})`}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No media found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
