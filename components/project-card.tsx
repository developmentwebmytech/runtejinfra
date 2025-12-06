"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, MapPin, Calendar, Layers, Edit, Trash2 } from "lucide-react"

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
  planImage: PlanImage[]
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

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  allPropertyTypes,
}: {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (id: string) => void
  allPropertyTypes: PropertyType[]
}) {
  // Helper function to get property type name
  const getPropertyTypeName = () => {
    if (typeof project.propertyType === "object" && project.propertyType?.name) {
      return project.propertyType.name
    }
    if (typeof project.propertyType === "string") {
      const foundType = allPropertyTypes.find((type) => type._id === project.propertyType)
      return foundType?.name || project.propertyType
    }
    return "Unknown Type"
  }
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="p-0">
        {project.imageUrl ? (
          <div className="relative h-48 w-full">
            <Image
              src={project.imageUrl || "/placeholder.svg"}
              alt={project.name}
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
        {/* Project Title and Address */}
        <div>
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{project.name}</h3>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="line-clamp-1">{project.address}</span>
          </div>
        </div>
        {/* Project Details */}
        <div className="space-y-2 text-sm">
          {project.propertyType && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Type:</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{getPropertyTypeName()}</span>
            </div>
          )}
          {project.category && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Category:</span>
              <span className="text-gray-600">{project.category.name}</span>
            </div>
          )}
          {project.floor && (
            <div className="flex items-center gap-2">
              <Layers className="w-3 h-3" />
              <span>{project.floor} floors</span>
            </div>
          )}
          {project.yearOfCompletion && (
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span>{project.yearOfCompletion}</span>
            </div>
          )}
        </div>
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(project)} className="flex-1">
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(project._id)} className="flex-1">
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
