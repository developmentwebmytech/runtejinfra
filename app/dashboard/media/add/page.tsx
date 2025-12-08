"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { MediaForm } from "@/components/admin/media/media-form"
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

export default function AddEditMediaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mediaId = searchParams.get("id")

  const [media, setMedia] = useState<Media | null>(null)
  const [loading, setLoading] = useState(!!mediaId)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (mediaId) {
      fetchMedia()
    }
  }, [mediaId])

  async function fetchMedia() {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/media/${mediaId}`)
      const data = await response.json()

      if (data.success) {
        setMedia(data.data)
      } else {
        alert("Failed to load media")
        router.push("/admin/media")
      }
    } catch (error) {
      console.error("Error fetching media:", error)
      alert("Error loading media")
      router.push("/admin/media")
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(formData: any) {
    try {
      setIsSubmitting(true)

      const method = mediaId ? "PUT" : "POST"
      const url = mediaId ? `/api/admin/media/${mediaId}` : "/api/admin/media"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(mediaId ? "Media updated successfully!" : "Media created successfully!")
        router.push("/dashboard/media")
      } else {
        toast.error("Failed to save media")
      }
    } catch (error) {
      console.error("Error saving media:", error)
      toast.error("Error saving media")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <Link href="/dashboard/media" className="inline-block mb-6">
          <Button variant="outline">← Back to Media</Button>
        </Link>

        <div className="max-w-2xl">
          <Card className="p-8">
            <h1 className="text-3xl font-bold mb-2">{mediaId ? "Edit Media" : "Add New Media"}</h1>
            <p className="text-muted-foreground mb-6">
              {mediaId ? "Update the media details below" : "Fill in the details to create a new media item"}
            </p>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading media...</p>
              </div>
            ) : (
              <MediaForm initialData={media} onSubmit={handleSubmit} isLoading={isSubmitting} />
            )}
          </Card>
        </div>
      </div>
    </main>
  )
}
