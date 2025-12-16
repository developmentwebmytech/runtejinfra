"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Upload, X, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface Firm {
  _id: string
  name: string
  description: string
  image: string
  slug: string
  createdAt: string
}

interface FirmFormProps {
  firmId?: string
}

export function FirmForm({ firmId }: FirmFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState("")
  const [fileName, setFileName] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  })

  useEffect(() => {
    if (firmId) fetchFirm()
  }, [firmId])

  const fetchFirm = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/our-firms?id=${firmId}`)
      if (!res.ok) throw new Error()
      const data: Firm = await res.json()

      setFormData({
        name: data.name,
        description: data.description || "",
        image: data.image,
      })

      setImagePreview(data.image)
      setFileName(data.image.split("/").pop() || "")
    } catch {
      toast.error("Failed to load firm")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please upload an image")
      return
    }

    try {
      setUploading(true)
      const fd = new FormData()
      fd.append("file", file)

      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: fd,
      })

      if (!res.ok) throw new Error()
      const data = await res.json()

      setFormData({ ...formData, image: data.url })
      setImagePreview(data.url)
      setFileName(data.fileName)
      toast.success("Image uploaded")
    } catch {
      toast.error("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    if (!fileName) return

    await fetch("/api/upload-image", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName }),
    })

    setFormData({ ...formData, image: "" })
    setImagePreview("")
    setFileName("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name  || !formData.image) {
      toast.error("All fields are required")
      return
    }

    try {
      setLoading(true)
      const method = firmId ? "PUT" : "POST"
      const payload = firmId ? { ...formData, id: firmId } : formData

      const res = await fetch("/api/admin/our-firms", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error()
      toast.success(firmId ? "Firm updated" : "Firm created")
      router.push("/dashboard/our-firms")
    } catch {
      toast.error("Save failed")
    } finally {
      setLoading(false)
    }
  }

  if (loading && firmId) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start mb-8">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="mt-1">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-4xl font-bold">
            {firmId ? "Edit Firm" : "Add New Firm"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {firmId ? "Update firm details" : "Create a new firm"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Firm Information</CardTitle>
          <CardDescription>Fill all required fields</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image */}
            <div>
              <Label>Firm Logo</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                {imagePreview ? (
                  <>
                    <div className="relative w-40 h-40 mx-auto">
                      <Image src={imagePreview} alt="Preview" fill className="object-contain" />
                    </div>
                    <div className="flex gap-3 justify-center mt-4">
                      <Label htmlFor="img" className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded">
                        Change Image
                      </Label>
                      <Button type="button" variant="outline" onClick={handleRemoveImage}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <Label htmlFor="img" className="cursor-pointer text-primary">
                    Click to upload image
                  </Label>
                )}
                <input
                  id="img"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <Label>Firm Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Description */}
            <div>
              <Label>Description *</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading || uploading} className="flex-1">
                {loading ? <Spinner className="w-4 h-4" /> : firmId ? "Update Firm" : "Create Firm"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
