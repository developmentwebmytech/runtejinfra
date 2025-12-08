"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"

interface MediaCardProps {
  slug: string
  title: string
  image: string
  category: string
  viewCount: number
  link?: string
}

export function MediaCard({ slug, title, image, category, viewCount, link }: MediaCardProps) {
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleCardClick = (e: React.MouseEvent) => {
    if (link) {
      e.preventDefault()
      setIsRedirecting(true)
      window.open(link, "_blank", "noopener,noreferrer")
      setIsRedirecting(false)
    }
  }

  if (link) {
    return (
      <Card
        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
        onClick={handleCardClick}
      >
        <div className="relative w-full h-64 bg-muted group">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />

          {/* Hover Logo */}
          <div className="absolute top-2 right-2 bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity shadow">
            <Image src="/tlogo.png" alt="logo" width={30} height={30} />
          </div>

          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Link
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-sm line-clamp-2">{title}</h3>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span className="capitalize">{category}</span>
            <span>👁️ {viewCount}</span>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Link href={`/media/${slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="relative w-full h-64 bg-muted group">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />

          {/* Hover Logo */}
          <div className="absolute top-2 right-2 bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity shadow">
            <Image src="/tlogo.png" alt="logo" width={30} height={30} />
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-sm line-clamp-2">{title}</h3>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span className="capitalize">{category}</span>
            <span>👁️ {viewCount}</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}