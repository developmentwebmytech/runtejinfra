"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface MediaTableProps {
  media: any[]
  onEdit: (item: any) => void
  onDelete: (id: string) => Promise<void>
  isDeleting?: string
}

export function MediaTable({ media, onEdit, onDelete, isDeleting }: MediaTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b">
            <tr>
              <th className="text-left p-4 font-medium">Image</th>
              <th className="text-left p-4 font-medium">Title</th>
              <th className="text-left p-4 font-medium">Category</th>
              <th className="text-left p-4 font-medium">Views</th>
              <th className="text-left p-4 font-medium">Featured</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {media.map((item) => (
              <tr key={item._id} className="border-b hover:bg-muted/50">
                <td className="p-4">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                  </div>
                </td>
                <td className="p-4 font-medium">{item.title}</td>
                <td className="p-4 capitalize">{item.category}</td>
                <td className="p-4">{item.viewCount}</td>
                <td className="p-4">{item.featured ? "⭐ Yes" : "No"}</td>
                <td className="p-4 text-right space-x-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/dashboard/media/add?id=${item._id}`}>Edit</Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(item._id)}
                    disabled={isDeleting === item._id}
                  >
                    {isDeleting === item._id ? "Deleting..." : "Delete"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
