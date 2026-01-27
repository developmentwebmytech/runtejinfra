"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { toast } from "sonner"
import { ArrowLeft, Edit, Trash2, MapPin, Calendar, Layers } from "lucide-react"
import {
  AlertDialog as AlertDialogComponent,
  AlertDialogAction as AlertDialogActionComponent,
  AlertDialogCancel as AlertDialogCancelComponent,
  AlertDialogContent as AlertDialogContentComponent,
  AlertDialogDescription as AlertDialogDescriptionComponent,
  AlertDialogTitle as AlertDialogTitleComponent,
} from "@/components/ui/alert-dialog"

interface PlanImage {
  url: string
  altText?: string
  _id?: string
}

interface Product {
  _id: string
  name: string
  address: string
  description: string
  about: string
  feature: string
  imageUrl: string
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
  locationLink: string
  planImage?: PlanImage[]
}

export default function ProductView() {
  const params = useParams()
  const router = useRouter()
  const productId = params.productId as string
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/projectdetails/${productId}`)
        if (res.ok) {
          const data = await res.json()
          setProduct(data)
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

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/projectdetails/${productId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        toast.success("Product deleted successfully")
        router.push("/dashboard/project-details")
      } else {
        toast.error("Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Failed to delete product")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">Loading product...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">Product not found</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/project-details">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <div className="flex items-center text-gray-600 mt-1">
            <MapPin className="w-4 h-4 mr-2" />
            {product.address}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Link href={`/dashboard/project-details/${product._id}/edit`}>
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </Link>
        <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} disabled={isDeleting}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>

      <AlertDialogComponent open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContentComponent>
          <AlertDialogTitleComponent>Delete Product</AlertDialogTitleComponent>
          <AlertDialogDescriptionComponent>
            Are you sure you want to delete this product? This action cannot be undone. All associated files will be
            deleted.
          </AlertDialogDescriptionComponent>
          <div className="flex gap-3 justify-end pt-4">
            <AlertDialogCancelComponent asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogCancelComponent>
            <AlertDialogActionComponent asChild>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogActionComponent>
          </div>
        </AlertDialogContentComponent>
      </AlertDialogComponent>

      {/* Product Image */}
      {product.imageUrl && (
        <Card>
          <CardContent className="p-0">
            <div className="relative h-96 w-full">
              <Image
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain rounded-lg"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900">Basic Information</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Category</p>
              <p className="font-medium text-gray-900">{product.category?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Property Type</p>
              <p className="font-medium text-gray-900">
                {typeof product.propertyType === "object" ? product.propertyType.name : product.propertyType || "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Details */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900">Project Details</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.floor ? (
              <div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Layers className="w-4 h-4 mr-2" />
                  <p className="text-sm">Floors</p>
                </div>
                <p className="font-medium text-gray-900">{product.floor}</p>
              </div>
            ) : null}
            {product.sampleUnit && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Sample Unit</p>
                <p className="font-medium text-gray-900">{product.sampleUnit}</p>
              </div>
            )}
            {product.basement && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Basement</p>
                <p className="font-medium text-gray-900">{product.basement}</p>
              </div>
            )}
            {product.totalBuiltUpArea && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Built Up Area</p>
                <p className="font-medium text-gray-900">{product.totalBuiltUpArea}</p>
              </div>
            )}
            {product.yearOfCompletion && (
              <div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <p className="text-sm">Year of Completion</p>
                </div>
                <p className="font-medium text-gray-900">{product.yearOfCompletion}</p>
              </div>
            )}
            {product.locationLink && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Location</p>
                <a
                  href={product.locationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:text-blue-800"
                >
                  View on Map
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {product.description && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Description</h3>
          </CardHeader>
          <CardContent className="overflow-auto max-h-96">
            <p className="text-gray-700 whitespace-pre-wrap break-words">{product.description}</p>
          </CardContent>
        </Card>
      )}

      {product.about && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">About</h3>
          </CardHeader>
          <CardContent className="container overflow-x-hidden">
            <div
              className="prose prose-sm max-w-none text-gray-700 break-words"
              dangerouslySetInnerHTML={{ __html: product.about }}
            />

          </CardContent>
        </Card>
      )}

      {product.feature && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Feature</h3>
          </CardHeader>
          <CardContent className="overflow-auto max-h-96">
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: product.feature }}
            />
          </CardContent>
        </Card>
      )}

      {product.planImage && product.planImage.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Plan Images ({product.planImage.length})</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.planImage.map((image) => (
                <div key={image._id} className="space-y-2">
                  <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.altText || "Plan image"}
                      fill
                      className="object-contain"
                    />
                  </div>
                  {image.altText && <p className="text-sm text-gray-700 font-medium">{image.altText}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
