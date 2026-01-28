"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DeleteAlertDialog } from "@/components/delete-alert-dialog"
import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"
import { Loader2 } from "lucide-react"



interface Category {
  _id: string
  name: string
  description: string
  icon: string
  parentCategory?: {
    _id: string
    name: string
  }
  isActive: boolean
  createdAt: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [parentOptions, setParentOptions] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [parentFilter, setParentFilter] = useState("")

  const [debouncedSearch, setDebouncedSearch] = useState("")


  const limit = 10
  const { toast } = useToast()

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    category: Category | null
  }>({ open: false, category: null })

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      if (parentFilter) queryParams.append("parentCategory", parentFilter)
      if (debouncedSearch) queryParams.append("search", debouncedSearch)

      const response = await fetch(`/api/admin/categories?${queryParams.toString()}`)

      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
        setTotalPages(data.totalPages)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchParentCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories?page=1&limit=100")
      if (response.ok) {
        const data = await response.json()
        setParentOptions(data.categories)
      }
    } catch (error) {
      console.error("Failed to fetch parent categories", error)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.category) return

    try {
      const response = await fetch(`/api/admin/categories/${deleteDialog.category._id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Category deleted successfully",
        })
        fetchCategories()
      } else {
        throw new Error("Failed to delete category")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    } finally {
      setDeleteDialog({ open: false, category: null })
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500) // wait 500ms after typing stops

    return () => clearTimeout(timer)

  }, [searchQuery])

  useEffect(() => {
    fetchCategories()
  }, [page, parentFilter, debouncedSearch])

  useEffect(() => {
    fetchParentCategories()
  }, [])



if (loading)
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  )


  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold leading-12">Categories</h1>
          <p className="text-muted-foreground">Manage your product categories</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/categories/new">
            <Plus className="h-4 w-4 mr-2 " />
            Add Category
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>A list of all categories in your store</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-4 items-start md:items-center">
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm"
              />

              <button
                onClick={() => setDebouncedSearch(searchQuery)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>


            <select
              value={parentFilter}
              onChange={(e) => {
                setPage(1)
                setParentFilter(e.target.value)
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All Parent Categories</option>
              {parentOptions
                .filter((cat) => cat.parentCategory === null)
                .map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}

            </select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Parent Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>
                    {category.icon ? (
                      <Image
                        src={category.icon || "/placeholder.svg"}
                        alt={category.name}
                        width={32}
                        height={32}
                        className="rounded-md"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description.length > 90 ? category.description.slice(0, 90) + "..." : category.description}</TableCell>
                  <TableCell>
                    {category.parentCategory ? (
                      <Badge variant="outline">{category.parentCategory.name}</Badge>
                    ) : (
                      <span className="text-muted-foreground">Root</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.isActive ? "default" : "secondary"}>
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/categories/${category._id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteDialog({ open: true, category })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground mt-3">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <DeleteAlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, category: null })}
        onConfirm={handleDelete}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteDialog.category?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}
