"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface MediaDetail {
  _id: string
  slug: string
  title: string
  description: string
  image: string
  category: string
  tags: string[]
  featured: boolean
  viewCount: number
  link?: string
  createdAt: string
}

export default function MediaDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [media, setMedia] = useState<MediaDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMedia() {
      try {
        setLoading(true)
        const response = await fetch(`/api/media/${slug}`)
        const data = await response.json()

        if (data.success) {
          setMedia(data.data)
        } else {
          setError(data.error || "Failed to fetch media")
        }
      } catch (err) {
        console.error("Error fetching media:", err)
        setError("Error loading media")
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchMedia()
    }
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-muted-foreground">Loading media...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !media) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-destructive mb-4">{error || "Media not found"}</p>
            <Link href="/media">
              <Button>Back to Gallery</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <Link href="/media" className="inline-block mb-6">
          <Button variant="outline">← Back to Gallery</Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Section */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative w-full aspect-square bg-muted">
                <Image
                  src={media.image || "/placeholder.svg"}
                  alt={media.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Card>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{media.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="capitalize bg-secondary px-3 py-1 rounded">{media.category}</span>
                <span>👁️ {media.viewCount} views</span>
              </div>
            </div>

            {media.description && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{media.description}</p>
              </div>
            )}

            {media.tags && media.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {media.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {media.featured && (
              <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded p-3">
                <p className="text-sm text-amber-900 dark:text-amber-100">⭐ Featured Media</p>
              </div>
            )}

            {media.link && (
              <Link href={media.link} target="_blank" rel="noopener noreferrer">
                <Button className="w-full">Visit Link</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
