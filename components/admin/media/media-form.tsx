"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface MediaFormProps {
  initialData?: any
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export function MediaForm({ initialData, onSubmit, isLoading = false }: MediaFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [image, setImage] = useState(initialData?.image || "")
  const [fileName, setFileName] = useState(initialData?.fileName || "")
  const [category, setCategory] = useState(initialData?.category || "other")
  const [tags, setTags] = useState(initialData?.tags?.join(",") || "")
  const [featured, setFeatured] = useState(initialData?.featured || false)
  const [link, setLink] = useState(initialData?.link || "")
  const [uploading, setUploading] = useState(false)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setImage(data.url)
        setFileName(data.fileName)
      }
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title || !image || !fileName) {
      alert("Please fill in all required fields")
      return
    }

    await onSubmit({
      title,
      description,
      image,
      fileName,
      category,
      tags: tags.split(",").filter((t) => t.trim()),
      featured,
      link: link || null,
    })
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter media title" required />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter media description"
            className="w-full p-2 border rounded-md bg-background text-foreground"
            rows={4}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Image *</label>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="flex-1"
              />
              {uploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
            </div>

            {image && (
              <div className="relative w-full h-48 bg-muted rounded-md overflow-hidden">
                <Image src={image || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded-md bg-background text-foreground"
          >
            <option value="landscape">Landscape</option>
            <option value="portrait">Portrait</option>
            <option value="abstract">Abstract</option>
            <option value="nature">Nature</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
          <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., sunset, beach, landscape" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Link (Optional)</label>
          <Input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="e.g., https://example.com"
            type="url"
          />
        </div>

        {/* Featured */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium">Featured</span>
          </label>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading || uploading} className="w-full">
          {isLoading ? "Saving..." : initialData ? "Update Media" : "Create Media"}
        </Button>
      </form>
    </Card>
  )
}
