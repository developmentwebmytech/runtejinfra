"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface MediaFilterProps {
  onCategoryChange: (category: string) => void
  onSearchChange: (search: string) => void
  onFeaturedChange: (featured: boolean) => void
}

export function MediaFilter({ onCategoryChange, onSearchChange, onFeaturedChange }: MediaFilterProps) {
  const categories = ["all", "landscape", "portrait", "hotels", "construction", "other"]
  const [activeCategory, setActiveCategory] = useState("all")

  return (
    <div className="space-y-4">
      <div>
        <Input placeholder="Search media..." onChange={(e) => onSearchChange(e.target.value)} className="w-full" />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setActiveCategory(cat)
              onCategoryChange(cat)
            }}
            className="capitalize"
          >
            {cat}
          </Button>
        ))}
      </div>

      <Button variant="outline" size="sm" onClick={() => onFeaturedChange(true)} className="w-full">
        ⭐ Featured Only
      </Button>
    </div>
  )
}
