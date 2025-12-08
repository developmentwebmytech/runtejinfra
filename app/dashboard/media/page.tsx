"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MediaTable } from "@/components/admin/media/media-table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"

interface Media {
  _id: string
  title: string
  description: string
  image: string
  fileName: string
  category: string
  tags: string[]
  featured: boolean
  viewCount: number
  link?: string
  slug: string
}

interface PaginationData {
  total: number
  page: number
  limit: number
  pages: number
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationData | null>(null)

  useEffect(() => {
    fetchMedia()
  }, [currentPage])

  async function fetchMedia() {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append("page", currentPage.toString())
      params.append("limit", "10")

      const response = await fetch(`/api/admin/media?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setMedia(data.data)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Error fetching media:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this media?")) return

    try {
      setIsDeletingId(id)
      const response = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        await fetchMedia()
        toast.success("Media deleted successfully!")
      } else {
        toast.error("Failed to delete media")
      }
    } catch (error) {
      console.error("Error deleting media:", error)
      alert("Error deleting media")
    } finally {
      setIsDeletingId(null)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Media Management</h1>
            <p className="text-muted-foreground">Manage your media gallery</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/dashboard/media/add">+ Add Media</Link>
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Media List</h2>

          {loading ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Loading media...</p>
            </Card>
          ) : media.length > 0 ? (
            <>
              <MediaTable
                media={media}
                onEdit={(item) => {
                  // Link will be handled in the table
                }}
                onDelete={handleDelete}
                isDeleting={isDeletingId || undefined}
              />

              {pagination && (
                <div className="mt-8 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: pagination.pages }).map((_, i) => (
                        <Button
                          key={i + 1}
                          variant={currentPage === i + 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      disabled={currentPage === pagination.pages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No media items yet. Create one to get started!</p>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
