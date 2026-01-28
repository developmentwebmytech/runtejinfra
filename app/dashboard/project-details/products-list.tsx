"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Plus, Edit, Trash2, Search, Filter, Building, Eye, Grid, List, ChevronLeft, ChevronRight } from "lucide-react"
import { Loader2 } from "lucide-react"


interface Product {
  _id: string
  name: string
  address: string
  description: string
  featureSection: string
  imageUrl: string
  category: {
    _id: string
    name: string
  }
  yearOfCompletion: number
}

interface Category {
  _id: string
  name: string
  parentCategory: string | null
}

export function ProductsListContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/projectdetails")
      const data = await res.json()
      setProducts(data)
      setFilteredProducts(data)
    } catch (error) {
      console.error("Failed to fetch products:", error)
      toast.error("Failed to fetch products")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories")
      const data = await res.json()
      const mainCats = data.allcategories
      const filtered = mainCats.filter((cat: Category) => !cat.parentCategory)
      setCategories(filtered)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.address.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category._id === selectedCategory)
    }

    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [products, searchTerm, selectedCategory])

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  // Handle delete
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`/api/admin/projectdetails/${id}`, {
          method: "DELETE",
        })
        if (res.ok) {
          toast.success("Product deleted successfully")
          fetchProducts()
        } else {
          toast.error("Failed to delete product")
        }
      } catch (error) {
        console.error("Failed to delete product:", error)
        toast.error("Failed to delete product")
      }
    }
  }
if (isLoading) {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
    </div>
  )
}

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products </h1>
          <p className="text-gray-600 mt-1">Manage your products and details</p>
        </div>
        <Link href="/dashboard/project-details/create">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search products by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">All Products</h2>
            <div className="text-sm text-gray-500 mt-1">
              {filteredProducts.length} of {products.length} products
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => {
                setViewMode("grid")
                setCurrentPage(1)
              }}
              className="flex items-center gap-2"
            >
              <Grid className="w-4 h-4" />
              Grid
            </Button>
            <Button
              size="sm"
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => {
                setViewMode("list")
                setCurrentPage(1)
              }}
              className="flex items-center gap-2"
            >
              <List className="w-4 h-4" />
              List
            </Button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <Card className="p-12 text-center">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {products.length === 0 ? "No products yet" : "No products match your search"}
            </h3>
            <p className="text-gray-500 mb-4">
              {products.length === 0
                ? "Get started by adding your first product."
                : "Try adjusting your search terms or filters."}
            </p>
            {products.length === 0 && (
              <Link href="/dashboard/project-details/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              </Link>
            )}
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <Card key={product._id} className="group hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="p-0">
                  {product.imageUrl ? (
                    <div className="relative h-48 w-full">
                      <Image
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-contain rounded-t-lg"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
                      <Building className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{product.address}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link href={`/dashboard/project-details/${product._id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full bg-transparent">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/project-details/${product._id}/edit`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full bg-transparent">
                        <Edit className="w-3 h-3 mr-1" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product._id)}
                      className="flex-1"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedProducts.map((product) => (
              <div key={product._id} className="flex items-center gap-4">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    width={64}
                    height={64}
                    className="object-contain rounded-lg"
                  />
                ) : (
                  <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Building className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{product.address}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/project-details/${product._id}`}>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  <Link href={`/dashboard/project-details/${product._id}/edit`}>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(product._id)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        <span className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
