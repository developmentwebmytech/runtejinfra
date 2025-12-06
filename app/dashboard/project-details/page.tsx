"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Plus, Building, Filter, Search } from "lucide-react"
import { ProjectFormModal } from "@/components/project-form-modal" // Import the new modal component
import { ProjectCard } from "@/components/project-card" // Import the ProjectCard component

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
  position?: number
}

// ==================== MAIN COMPONENT ====================
export default function ProjectManagement() {
  // ==================== STATE MANAGEMENT ====================
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [mainCategories, setMainCategories] = useState<Category[]>([]) // Only parentCategory = null
  const [allPropertyTypes, setAllPropertyTypes] = useState<PropertyType[]>([]) // Store all property types for lookup
  const [editingProject, setEditingProject] = useState<Partial<Project> | undefined>(undefined)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // ==================== API FUNCTIONS ====================
  // Fetch main categories (parentCategory = null)
  const fetchMainCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories")
      const data = await res.json()
      // Filter categories where parentCategory is null
      const mainCats = data.categories.filter((cat: Category) => cat.parentCategory === null)
      setMainCategories(mainCats)
      // Also store all subcategories for property type lookup
      const allSubCategories = data.categories.filter((cat: Category) => cat.parentCategory !== null)
      setAllPropertyTypes(
        allSubCategories.map((cat: Category) => ({
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

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projectdetails")
      const data = await res.json()
      setProjects(data)
      setFilteredProjects(data)
    } catch (error) {
      console.error("Failed to fetch projects:", error)
      toast.error("Failed to fetch projects")
    }
  }

  // ==================== EFFECTS ====================
  // Initial data fetch
  useEffect(() => {
    fetchProjects()
    fetchMainCategories()
  }, [])

  // Filter projects based on search and category
  useEffect(() => {
    let filtered = projects
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (typeof project.propertyType === "object"
            ? project.propertyType.name.toLowerCase().includes(searchTerm.toLowerCase())
            : project.propertyType?.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }
    // Apply category filter
    if (selectedCategoryFilter && selectedCategoryFilter !== "all") {
      filtered = filtered.filter((project) => project.category._id === selectedCategoryFilter)
    }
    setFilteredProjects(filtered)
  }, [projects, searchTerm, selectedCategoryFilter])

  // ==================== ACTION HANDLERS ====================
  // Handle form submission from modal
  const handleFormSubmit = async (formData: Partial<Project>) => {
    const url = formData._id ? `/api/admin/projectdetails/${formData._id}` : "/api/admin/projectdetails"
    const method = formData._id ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      toast.success(`Project ${formData._id ? "updated" : "added"} successfully`)
      fetchProjects()
    } else {
      const error = await res.json()
      throw new Error(error.error || "Error saving project")
    }
  }

  // Handle edit project
  const handleEdit = (project: Project) => {
    const formData = {
      ...project,
      propertyType: typeof project.propertyType === "object" ? project.propertyType._id : project.propertyType,
    }
    setEditingProject(formData)
    setIsModalOpen(true)
  }

  // Handle delete project
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        const res = await fetch(`/api/admin/projectdetails/${id}`, {
          method: "DELETE",
        })
        if (res.ok) {
          toast.success("Project deleted successfully")
          fetchProjects()
        } else {
          toast.error("Failed to delete project")
        }
      } catch (error) {
        console.error("Failed to delete project:", error)
        toast.error("Failed to delete project")
      }
    }
  }

  // Reset form and close modal
  const resetFormAndCloseModal = () => {
    setEditingProject(undefined)
    setIsModalOpen(false)
  }

  // Open add modal
  const openAddModal = () => {
    setEditingProject(undefined) // Clear any previous editing data
    setIsModalOpen(true)
  }

  // ==================== RENDER ====================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* ==================== HEADER ==================== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600 mt-1">Manage your property projects and details</p>
        </div>
        {/* Add Project Button */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddModal} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Project
            </Button>
          </DialogTrigger>
          {/* ==================== PROJECT FORM MODAL ==================== */}
          <ProjectFormModal
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
            initialData={editingProject}
            onSubmit={handleFormSubmit}
            onCancel={resetFormAndCloseModal}
            mainCategories={mainCategories}
            allPropertyTypes={allPropertyTypes}
          />
        </Dialog>
      </div>
      {/* ==================== FILTERS AND SEARCH ==================== */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search projects by name, address, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {mainCategories.map((cat) => (
                <SelectItem key={`filter-${cat._id}`} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* ==================== PROJECTS SECTION ==================== */}
      <div className="space-y-6">
        {/* Projects Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">All Projects</h2>
          <div className="text-sm text-gray-500">
            {filteredProjects.length} of {projects.length} {projects.length === 1 ? "project" : "projects"}
          </div>
        </div>
        {/* Projects Grid or Empty State */}
        {filteredProjects.length === 0 ? (
          <Card className="p-12 text-center">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {projects.length === 0 ? "No projects yet" : "No projects match your search"}
            </h3>
            <p className="text-gray-500 mb-4">
              {projects.length === 0
                ? "Get started by adding your first property project."
                : "Try adjusting your search terms or filters."}
            </p>
            {projects.length === 0 && (
              <Button onClick={openAddModal}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Project
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={`project-${project._id}`}
                project={project}
                onEdit={handleEdit}
                onDelete={handleDelete}
                allPropertyTypes={allPropertyTypes}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
