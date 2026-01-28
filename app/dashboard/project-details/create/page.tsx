"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  tempId?: string
}

export default function CreateProduct() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([])
  const [allPropertyTypes, setAllPropertyTypes] = useState<PropertyType[]>([])

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    category: "",
    propertyType: "",
    floor: "",
    sampleUnit: "",
    basement: "",
    totalBuiltUpArea: "",
    yearOfCompletion: new Date().getFullYear().toString(),
    imageUrl: "",
    description: "",
    about: "",
    feature: "",
    locationLink: "",
  })

  const [planImages, setPlanImages] = useState<PlanImage[]>([])

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories")
      const data = await res.json()
      const mainCats = data.allcategories.filter((cat: Category) => !cat.parentCategory)
      const allSubCats = data.allcategories.filter((cat: Category) => cat.parentCategory)
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

  React.useEffect(() => {
    fetchCategories()
  }, [])

  React.useEffect(() => {
    if (formData.category) {
      const filtered = allPropertyTypes.filter((type) => type.category === formData.category)
      setPropertyTypes(filtered)
    } else {
      setPropertyTypes([])
    }
  }, [formData.category, allPropertyTypes])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value }
      if (name === "category") {
        updated.propertyType = ""
      }
      return updated
    })
  }

  const handleQuillChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
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
        setFormData((prev) => ({ ...prev, imageUrl: result.imageUrl }))
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

    if (!formData.name || !formData.address || !formData.category) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/projectdetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          floor: Number(formData.floor) || 0,
          yearOfCompletion: Number(formData.yearOfCompletion),
          planImage: planImages.map(({ tempId, ...img }) => img),
        }),
      })

      if (res.ok) {
        toast.success("Product created successfully")
        router.push("/dashboard/project-details")
      } else {
        const error = await res.json()
        toast.error(error.error || "Failed to create product")
      }
    } catch (error) {
      console.error("Error creating product:", error)
      toast.error("Failed to create product")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-2 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/project-details">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Product</h1>
          <p className="text-gray-600 mt-1">Add a new product to your catalog</p>
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
                  onClick={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
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
                  value={formData.name}
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
                  value={formData.address}
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
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
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
                  value={formData.propertyType}
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
                  value={formData.floor}
                  onChange={handleInputChange}
                  placeholder="Enter number of floors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sampleUnit">Sample Unit</Label>
                <Input
                  id="sampleUnit"
                  name="sampleUnit"
                  value={formData.sampleUnit}
                  onChange={handleInputChange}
                  placeholder="Enter sample unit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="basement">Basement</Label>
                <Input
                  id="basement"
                  name="basement"
                  value={formData.basement}
                  onChange={handleInputChange}
                  placeholder="Enter basement details"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalBuiltUpArea">Total Built Up Area</Label>
                <Input
                  id="totalBuiltUpArea"
                  name="totalBuiltUpArea"
                  value={formData.totalBuiltUpArea}
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
                  value={formData.yearOfCompletion}
                  onChange={handleInputChange}
                  placeholder="Enter year of completion"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationLink">Location Link</Label>
                <Input
                  id="locationLink"
                  name="locationLink"
                  value={formData.locationLink}
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
              <ReactQuill
                value={formData.description || ""}
                onChange={(value) => handleQuillChange("description", value)}
                placeholder="Enter product description..."
                theme="snow"
                className="bg-white rounded-md border border-input"
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
                className="bg-white rounded-md border border-input"
              />
            </div>

            {/* Feature Section Field */}
            <div className="space-y-2">
              <Label htmlFor="feature">Feature</Label>
              <ReactQuill
                value={formData.feature || ""}
                onChange={(value) => handleQuillChange("feature", value)}
                placeholder="Enter product features..."
                theme="snow"
                className="bg-white rounded-md border border-input"
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
                    <div key={image.tempId} className="p-3 border rounded-lg flex items-start gap-3">
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
          <Link href="/dashboard/project-details">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
