"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { ArrowLeft, Upload, Loader2, ImageIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })
import "react-quill-new/dist/quill.snow.css"

interface Category {
  _id: string
  name: string
  parentCategory: string | null
}

interface PropertyType {
  _id: string
  name: string
  category: string
}

interface PlanImage {
  url: string
  altText: string
  _id?: string
  tempId?: string
}

interface Product {
  _id: string
  name: string
  address: string
  category: {
    _id: string
    name: string
  }
  propertyType:
    | {
        _id: string
        name: string
      }
    | string
  floor: number
  sampleUnit: string
  basement: string
  totalBuiltUpArea: string
  yearOfCompletion: number
  imageUrl: string
  description: string
  about: string
  feature: string
  locationLink: string
  planImage?: PlanImage[]
}

export default function EditProduct() {
  const params = useParams()
  const router = useRouter()
  const productId = params.productId as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([])
  const [allPropertyTypes, setAllPropertyTypes] = useState<PropertyType[]>([])

  const [formData, setFormData] = useState<Product | null>(null)
  const [planImages, setPlanImages] = useState<PlanImage[]>([])
  const [originalPlanImages, setOriginalPlanImages] = useState<PlanImage[]>([])

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories")
      const data = await res.json()
      const mainCats = data.categories.filter((cat: Category) => !cat.parentCategory)
      const allSubCats = data.categories.filter((cat: Category) => cat.parentCategory)
      setCategories(mainCats)
      setAllPropertyTypes(
        allSubCats.map((cat: Category) => ({
          _id: cat._id,
          name: cat.name,
          category: typeof cat.parentCategory === "object" ? cat.parentCategory._id : cat.parentCategory,
        })),
      )
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      toast.error("Failed to fetch categories")
    }
  }

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/admin/projectdetails/${productId}`)
      if (res.ok) {
        const data = await res.json()
        setFormData(data)
        setPlanImages(data.planImage || [])
        setOriginalPlanImages(data.planImage || [])
      } else {
        toast.error("Failed to load product")
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      toast.error("Failed to load product")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (productId) {
      fetchCategories()
      fetchProduct()
    }
  }, [productId])

  useEffect(() => {
    if (formData?.category) {
      const categoryId = typeof formData.category === "object" ? formData.category._id : formData.category
      const filtered = allPropertyTypes.filter((type) => type.category === categoryId)
      setPropertyTypes(filtered)
    }
  }, [formData?.category, allPropertyTypes])

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">Loading product...</div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">Product not found</div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      if (!prev) return null
      const updated = { ...prev, [name]: value }
      if (name === "category") {
        updated.propertyType = ""
      }
      return updated
    })
  }

  const handleQuillChange = (name: string, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }
    setIsUploading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("file", file)
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataToSend,
      })
      const result = await response.json()
      if (response.ok) {
        setFormData((prev) => (prev ? { ...prev, imageUrl: result.imageUrl } : null))
        toast.success("Image uploaded successfully")
      } else {
        toast.error(result.error || "Failed to upload image")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handlePlanImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }
    setIsUploading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("file", file)
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataToSend,
      })
      const result = await response.json()
      if (response.ok) {
        const tempId = Date.now().toString()
        setPlanImages((prev) => [...prev, { url: result.imageUrl, altText: file.name, tempId }])
        toast.success("Plan image uploaded successfully")
      } else {
        toast.error(result.error || "Failed to upload plan image")
      }
    } catch (error) {
      console.error("Error uploading plan image:", error)
      toast.error("Failed to upload plan image")
    } finally {
      setIsUploading(false)
    }
  }

  const removePlanImage = (index: number) => {
    setPlanImages((prev) => prev.filter((_, i) => i !== index))
  }

  const updatePlanImageAlt = (index: number, altText: string) => {
    setPlanImages((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], altText }
      return updated
    })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handlePlanImageDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handlePlanImageUpload(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData || !formData.name || !formData.address || !formData.category) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const categoryId = typeof formData.category === "object" ? formData.category._id : formData.category
      const propertyTypeId =
        typeof formData.propertyType === "object" ? formData.propertyType._id : formData.propertyType

      const res = await fetch(`/api/admin/projectdetails/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          category: categoryId,
          propertyType: propertyTypeId,
          floor: Number(formData.floor) || 0,
          yearOfCompletion: Number(formData.yearOfCompletion),
          planImage: planImages.map(({ tempId, ...img }) => img),
        }),
      })

      if (res.ok) {
        toast.success("Product updated successfully")
        router.push(`/dashboard/project-details/${productId}`)
      } else {
        const error = await res.json()
        toast.error(error.error || "Failed to update product")
      }
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Failed to update product")
    } finally {
      setIsSubmitting(false)
    }
  }

  const categoryId = typeof formData.category === "object" ? formData.category._id : formData.category
  const propertyTypeId = typeof formData.propertyType === "object" ? formData.propertyType._id : formData.propertyType

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/project-details/${productId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-1">Update product information</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <Card>
          <CardContent className="p-6">
            {formData.imageUrl ? (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Product Image</Label>
                <div className="relative h-64 w-full">
                  <Image
                    src={formData.imageUrl || "/placeholder.svg"}
                    alt="Product image"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormData((prev) => (prev ? { ...prev, imageUrl: "" } : null))}
                >
                  Remove Image
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Product Image</Label>
                <Card
                  className={cn(
                    "border-2 border-dashed transition-colors duration-200",
                    dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
                  )}
                >
                  <CardContent className="p-0">
                    <div
                      className="relative h-64 flex flex-col items-center justify-center cursor-pointer"
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById("file-input")?.click()}
                    >
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                          <p className="text-sm text-gray-600">Uploading image...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-center px-6">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-2">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                          </div>
                          <Button type="button" variant="outline" size="sm">
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileSelect(file)
                  }}
                  className="hidden"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleInputChange}
                  placeholder="Enter product address"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Selection */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Category & Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Main Category *</Label>
                <Select value={categoryId} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select main category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type</Label>
                <Select
                  value={propertyTypeId || ""}
                  onValueChange={(value) => handleSelectChange("propertyType", value)}
                >
                  <SelectTrigger id="propertyType">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type._id} value={type._id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Project Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="floor">Number of Floors</Label>
                <Input
                  id="floor"
                  name="floor"
                  type="number"
                  value={formData.floor || ""}
                  onChange={handleInputChange}
                  placeholder="Enter number of floors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sampleUnit">Sample Unit</Label>
                <Input
                  id="sampleUnit"
                  name="sampleUnit"
                  value={formData.sampleUnit || ""}
                  onChange={handleInputChange}
                  placeholder="Enter sample unit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="basement">Basement</Label>
                <Input
                  id="basement"
                  name="basement"
                  value={formData.basement || ""}
                  onChange={handleInputChange}
                  placeholder="Enter basement details"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalBuiltUpArea">Total Built Up Area</Label>
                <Input
                  id="totalBuiltUpArea"
                  name="totalBuiltUpArea"
                  value={formData.totalBuiltUpArea || ""}
                  onChange={handleInputChange}
                  placeholder="Enter total built up area"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearOfCompletion">Year of Completion</Label>
                <Input
                  id="yearOfCompletion"
                  name="yearOfCompletion"
                  type="number"
                  value={formData.yearOfCompletion || ""}
                  onChange={handleInputChange}
                  placeholder="Enter year of completion"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationLink">Location Link</Label>
                <Input
                  id="locationLink"
                  name="locationLink"
                  value={formData.locationLink || ""}
                  onChange={handleInputChange}
                  placeholder="Enter location link or map URL"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="font-semibold text-gray-900">Content</h3>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={(e) => setFormData((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                placeholder="Enter product description..."
                className="w-full h-32 px-3 py-2 border border-input rounded-md bg-white text-sm resize-vertical"
              />
            </div>

            {/* About Field */}
            <div className="space-y-2">
              <Label htmlFor="about">About</Label>
              <ReactQuill
                value={formData.about || ""}
                onChange={(value) => handleQuillChange("about", value)}
                placeholder="Enter about information..."
                theme="snow"
                className="bg-white rounded-md border border-input h-[450px]"
              />
            </div>

            {/* Feature Section Field */}
            <div className="space-y-2 pt-12">
              <Label htmlFor="feature">Feature</Label>
              <ReactQuill
                value={formData.feature || ""}
                onChange={(value) => handleQuillChange("feature", value)}
                placeholder="Enter product features..."
                theme="snow"
                className="bg-white rounded-md border border-input h-[450px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Plan Images</h3>
              <span className="text-sm text-gray-500">{planImages.length} uploaded</span>
            </div>

            {/* Plan Image Upload */}
            <Card
              className={cn(
                "border-2 border-dashed transition-colors duration-200",
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
              )}
            >
              <CardContent className="p-0">
                <div
                  className="relative h-48 flex flex-col items-center justify-center cursor-pointer"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handlePlanImageDrop}
                  onClick={() => document.getElementById("plan-image-input")?.click()}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                      <p className="text-sm text-gray-600">Uploading plan image...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-center px-6">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Upload plan images</p>
                        <p className="text-xs text-gray-500 mt-1">Drag and drop or click to upload</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <input
              id="plan-image-input"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handlePlanImageUpload(file)
              }}
              className="hidden"
            />

            {/* Plan Images List */}
            {planImages.length > 0 && (
              <div className="space-y-3 border-t pt-4">
                <Label className="text-sm font-medium">Uploaded Plan Images</Label>
                <div className="grid grid-cols-1 gap-3">
                  {planImages.map((image, index) => (
                    <div key={image._id || image.tempId} className="p-3 border rounded-lg flex items-start gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={image.altText}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2 min-w-0">
                        <Input
                          placeholder="Enter image name/description"
                          value={image.altText}
                          onChange={(e) => updatePlanImageAlt(index, e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePlanImage(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Link href={`/dashboard/project-details/${productId}`}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Product"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
