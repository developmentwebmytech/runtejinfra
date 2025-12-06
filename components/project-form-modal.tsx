"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import Image from "next/image"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

// ==================== INTERFACES ====================
interface Project {
  _id: string
  name: string
  address: string
  mixedUseProjectType: string
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
  description: string
  locationLink: string
  category: {
    _id: string
    name: string
  }
  imageUrl: string
  planImage: PlanImage[] // New field
}

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
  altText?: string
  name?: string // Added the name field here
  position?: number
}

// ==================== IMAGE UPLOAD COMPONENT (for single image) ====================
function ImageUpload({
  value,
  onChange,
  onRemove,
}: {
  value?: string
  onChange: (url: string) => void
  onRemove: () => void
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      const formData = new FormData()
      formData.append("file", file)
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const result = await response.json()
      if (response.ok) {
        onChange(result.imageUrl)
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
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

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  if (value) {
    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium">Project Image</Label>
        <Card className="relative overflow-hidden">
          <CardContent className="p-0">
            <div className="relative group">
              <Image
                src={value || "/placeholder.svg"}
                alt="Project image"
                width={400}
                height={250}
                className="w-full h-64 object-contain"
              />
              <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                  <Button type="button" size="sm" variant="secondary" onClick={openFileDialog} disabled={isUploading}>
                    <Upload className="w-4 h-4 mr-1" />
                    Change
                  </Button>
                  <Button type="button" size="sm" variant="destructive" onClick={onRemove} disabled={isUploading}>
                    <X className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Project Image</Label>
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
            onClick={openFileDialog}
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
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
    </div>
  )
}

// ==================== PLAN IMAGE UPLOAD COMPONENT (for multiple images) ====================
function PlanImageUpload({
  value,
  onChange,
}: {
  value: PlanImage[]
  onChange: (images: PlanImage[]) => void
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      const formData = new FormData()
      formData.append("file", file)
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const result = await response.json()
      if (response.ok) {
        const newImage: PlanImage = { url: result.imageUrl, altText: "", name: "", position: value.length } // Initialize name
        onChange([...value, newImage])
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
      e.target.value = "" // Clear the input so the same file can be selected again
    }
  }

  const handleRemoveImage = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove))
  }

  // Generic handler for updating plan image properties
  const handlePlanImagePropertyChange = (indexToUpdate: number, property: keyof PlanImage, newValue: string) => {
    onChange(value.map((img, index) => (index === indexToUpdate ? { ...img, [property]: newValue } : img)))
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

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Plan Images</Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {value.map((img, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-0">
              <div className="relative group">
                <Image
                  src={img.url || "/placeholder.svg"}
                  alt={img.altText || `Plan image ${index + 1}`}
                  width={200}
                  height={150}
                  className="w-full h-32 object-contain"
                />
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveImage(index)}
                    disabled={isUploading}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
              <div className="p-2 space-y-2">
                {" "}
                {/* Added space-y-2 for spacing between inputs */}
                {/* <Input
                  placeholder="Plan Name"
                  value={img.name || ""}
                  onChange={(e) => handlePlanImagePropertyChange(index, "name", e.target.value)}
                  className="text-xs"
                /> */}
                <Input
                  placeholder="Name"
                  value={img.altText || ""}
                  onChange={(e) => handlePlanImagePropertyChange(index, "altText", e.target.value)}
                  className="text-xs"
                />
              </div>
            </CardContent>
          </Card>
        ))}
        <Card
          className={cn(
            "border-2 border-dashed transition-colors duration-200 flex items-center justify-center",
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
          )}
        >
          <CardContent className="p-0 w-full h-full">
            <div
              className="relative h-full min-h-[150px] flex flex-col items-center justify-center cursor-pointer p-4"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={openFileDialog}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <p className="text-sm text-gray-600">Uploading image...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Add Plan Image</p>
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
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" multiple />
    </div>
  )
}

// ==================== INPUT FIELD COMPONENT ====================
function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  min,
  max,
}: {
  label: string
  name: string
  type?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  placeholder?: string
  min?: string
  max?: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full"
      />
    </div>
  )
}

// ==================== TEXTAREA FIELD COMPONENT ====================
function TextAreaField({
  label,
  name,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-none"
      />
    </div>
  )
}

// ==================== PROJECT FORM MODAL COMPONENT ====================
export function ProjectFormModal({
  isOpen,
  onOpenChange,
  initialData,
  onSubmit,
  onCancel,
  mainCategories,
  allPropertyTypes,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Partial<Project>
  onSubmit: (data: Partial<Project>) => Promise<void>
  onCancel: () => void
  mainCategories: Category[]
  allPropertyTypes: PropertyType[]
}) {
  const [form, setForm] = useState<Partial<Project>>(initialData || {})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([])
  const [loadingPropertyTypes, setLoadingPropertyTypes] = useState(false)

  useEffect(() => {
    setForm(initialData || { planImage: [] }) // Ensure planImage is an array
  }, [initialData])

  // Fetch property types based on selected category
  useEffect(() => {
    const selectedCategory = form.category
      ? typeof form.category === "string"
        ? form.category
        : form.category._id
      : ""

    if (selectedCategory) {
      setLoadingPropertyTypes(true)
      // Filter from allPropertyTypes instead of fetching again
      const subCategories = allPropertyTypes.filter((type) => type.category === selectedCategory)
      setPropertyTypes(subCategories)
      setLoadingPropertyTypes(false)
    } else {
      setPropertyTypes([])
    }
  }, [form.category, allPropertyTypes])

  const handleChange = (name: string, value: string | PlanImage[]) => {
    setForm((prev) => {
      const updated = { ...prev, [name]: value }
      // Reset property type when category changes
      if (name === "category") {
        updated.propertyType = ""
      }
      return updated
    })
  }

  const handleImageChange = (url: string) => {
    setForm((prev) => ({ ...prev, imageUrl: url }))
  }

  const handleImageRemove = () => {
    setForm((prev) => ({ ...prev, imageUrl: "" }))
  }

  const handlePlanImageChange = (images: PlanImage[]) => {
    setForm((prev) => ({ ...prev, planImage: images }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const finalFormData = {
        ...form,
        floor: Number(form.floor) || 0,
        yearOfCompletion: Number(form.yearOfCompletion) || new Date().getFullYear(),
        planImage: form.planImage || [], // Ensure it's an array even if empty
      }
      await onSubmit(finalFormData)
      onOpenChange(false) // Close modal on success
      onCancel() // Reset form in parent
    } catch (error) {
      console.error("Error saving project:", error)
      toast.error("Error saving project")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCategory = form.category
    ? typeof form.category === "string"
      ? form.category
      : form.category._id || ""
    : ""
  const selectedPropertyType = typeof form.propertyType === "object" ? form.propertyType._id : form.propertyType || ""

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>{initialData?._id ? "Edit Project" : "Add New Project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="space-y-6 flex-1 overflow-y-auto p-1">
            {/* Image Upload Section */}
            <ImageUpload value={form.imageUrl} onChange={handleImageChange} onRemove={handleImageRemove} />
            {/* Basic Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Project Name"
                name="name"
                value={form.name || ""}
                onChange={(value) => handleChange("name", value)}
                required
                placeholder="Enter project name"
              />
              <InputField
                label="Address"
                name="address"
                value={form.address || ""}
                onChange={(value) => handleChange("address", value)}
                required
                placeholder="Enter project address"
              />
              {/* Main Category Selection (parentCategory = null) */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Main Category <span className="text-red-500">*</span>
                </Label>
                <Select value={selectedCategory} onValueChange={(value) => handleChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select main category" />
                  </SelectTrigger>
                  <SelectContent>
                    {mainCategories.map((cat) => (
                      <SelectItem key={`main-category-${cat._id}`} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Property Type Selection (subcategories based on selected category) */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Property Type</Label>
                <Select
                  value={selectedPropertyType}
                  onValueChange={(value) => handleChange("propertyType", value)}
                  disabled={!selectedCategory || loadingPropertyTypes}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingPropertyTypes
                          ? "Loading property types..."
                          : selectedCategory
                            ? "Select property type"
                            : "Select main category first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={`property-type-${type._id}`} value={type._id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <InputField
                label="Number of Floors"
                name="floor"
                type="number"
                value={form.floor?.toString() || ""}
                onChange={(value) => handleChange("floor", value)}
                placeholder="Enter number of floors"
              />
              <InputField
                label="Sample Unit"
                name="sampleUnit"
                value={form.sampleUnit || ""}
                onChange={(value) => handleChange("sampleUnit", value)}
                placeholder="e.g., 1BHK, 2BHK, 3BHK"
              />
              <InputField
                label="Basement Details"
                name="basement"
                value={form.basement || ""}
                onChange={(value) => handleChange("basement", value)}
                placeholder="e.g., 2 Level Parking"
              />
              <InputField
                label="Total Built-Up Area"
                name="totalBuiltUpArea"
                value={form.totalBuiltUpArea || ""}
                onChange={(value) => handleChange("totalBuiltUpArea", value)}
                placeholder="e.g., 500,000 sq ft"
              />
              <InputField
                label="Year of Completion"
                name="yearOfCompletion"
                type="number"
                value={form.yearOfCompletion?.toString() || ""}
                onChange={(value) => handleChange("yearOfCompletion", value)}
                min="2000"
                max="2050"
                placeholder="Enter completion year"
              />
            </div>
            {/* Description Fields */}
            <div className="space-y-6">
              <TextAreaField
                label="Description"
                name="description"
                value={form.description || ""}
                onChange={(value) => handleChange("description", value)}
                rows={3}
                placeholder="Brief description of the project..."
              />
              <TextAreaField
                label="Location Link"
                name="locationLink"
                value={form.locationLink || ""}
                onChange={(value) => handleChange("locationLink", value)}
                rows={4}
                placeholder="Detailed locationLink of the project features and amenities..."
              />
            </div>
            {/* Plan Image Upload Section */}
            <PlanImageUpload value={form.planImage || []} onChange={handlePlanImageChange} />
          </div>
          {/* Form Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t mt-auto">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? initialData?._id
                  ? "Updating..."
                  : "Adding..."
                : initialData?._id
                  ? "Update Project"
                  : "Add Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
