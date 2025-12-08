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

interface Partner {
  _id: string
  name: string
  titleName: string
  image: string
  slug: string
  createdAt: string
}

interface PartnerFormProps {
  partnerId?: string
}

export function PartnerForm({ partnerId }: PartnerFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    titleName: "",
    image: "",
  })

  useEffect(() => {
    if (partnerId) {
      fetchPartner()
    }
  }, [partnerId])

  const fetchPartner = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/our-work-partner?id=${partnerId}`)
      if (!res.ok) throw new Error("Failed to fetch")
      const data: Partner = await res.json()
      setFormData({
        name: data.name,
        titleName: data.titleName,
        image: data.image,
      })
      setImagePreview(data.image)
      const urlParts = data.image.split("/")
      setFileName(urlParts[urlParts.length - 1])
    } catch (error) {
      console.error("[v0]", error)
      toast.error("Failed to load partner details")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    try {
      setUploading(true)

      const formDataUpload = new FormData()
      formDataUpload.append("file", file)

      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formDataUpload,
      })

      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()

      setFormData({ ...formData, image: data.url })
      setImagePreview(data.url)
      setFileName(data.fileName)
      toast.success("Image uploaded successfully")
    } catch (error) {
      console.error("[v0]", error)
      toast.error("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    if (!fileName) return

    try {
      await fetch("/api/upload-image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName }),
      })

      setFormData({ ...formData, image: "" })
      setImagePreview("")
      setFileName("")
      toast.success("Image removed")
    } catch (error) {
      console.error("[v0]", error)
      toast.error("Failed to remove image")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.titleName || !formData.image) {
      toast.error("All fields are required")
      return
    }

    try {
      setLoading(true)
      const method = partnerId ? "PUT" : "POST"
      const payload = partnerId ? { ...formData, id: partnerId } : formData

      const res = await fetch("/api/admin/our-work-partner", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to save")

      toast.success(partnerId ? "Partner updated successfully" : "Partner created successfully")
      router.push("/dashboard/our-work-partner")
    } catch (error) {
      console.error("[v0]", error)
      toast.error("Failed to save partner")
    } finally {
      setLoading(false)
    }
  }

  if (loading && partnerId) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with back button */}
      <div className="flex items-start  mb-8">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="mt-1 shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight">{partnerId ? "Edit Partner" : "Add New Partner"}</h1>
          <p className="text-muted-foreground text-base mt-2">
            {partnerId ? "Update the partner information below" : "Create a new business partner with all details"}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="border shadow-sm">
        <CardHeader className="border-b pb-6">
          <CardTitle className="text-2xl">Partner Information</CardTitle>
          <CardDescription className="text-base">Fill in all the required fields below</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label className="text-base font-semibold block">Partner Logo</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors bg-muted/30">
                {imagePreview ? (
                  <div className="space-y-4">
                    <div className="relative w-40 h-40 mx-auto">
                      <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
                    </div>
                    <div className="flex gap-3 justify-center">
                      <Label
                        htmlFor="image-input"
                        className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
                      >
                        <Upload className="w-4 h-4" />
                        Change Image
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveImage}
                        disabled={uploading}
                        className="gap-2 bg-transparent"
                      >
                        <X className="w-4 h-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-4">
                    <Upload className="w-16 h-16 mx-auto text-muted-foreground" />
                    <div>
                      <Label
                        htmlFor="image-input"
                        className="cursor-pointer text-primary hover:underline font-semibold text-base"
                      >
                        Click to upload image
                      </Label>
                      <p className="text-sm text-muted-foreground mt-2">or drag and drop your file here</p>
                      <p className="text-xs text-muted-foreground mt-3">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                )}
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </div>
              {uploading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Spinner className="w-4 h-4" />
                  Uploading image...
                </div>
              )}
            </div>

            {/* Partner Name */}
            <div className="space-y-3">
              <Label htmlFor="name" className="font-semibold text-base">
                Partner Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., TechCorp Inc"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 text-base"
              />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <Label htmlFor="titleName" className="font-semibold text-base">
               Description <span className="text-destructive">*</span>
              </Label>
              <Input
                id="titleName"
                placeholder="e.g., Leading Innovators in Tech Solutions"
                value={formData.titleName}
                onChange={(e) => setFormData({ ...formData, titleName: e.target.value })}
                className="h-12 text-base"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-8 border-t">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1 h-11 text-base">
                Cancel
              </Button>
              <Button type="submit" disabled={loading || uploading} className="flex-1 h-11 text-base">
                {loading ? (
                  <>
                    <Spinner className="w-4 h-4 mr-2" />
                    {partnerId ? "Updating..." : "Creating..."}
                  </>
                ) : partnerId ? (
                  "Update Partner"
                ) : (
                  "Create Partner"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
