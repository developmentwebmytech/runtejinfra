import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Image Skeleton */}
      <Card>
        <div className="p-0">
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </Card>

      {/* Basic Info Skeleton */}
      <Card>
        <div className="p-6 space-y-4">
          <Skeleton className="h-5 w-40" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </Card>

      {/* Details Skeleton */}
      <Card>
        <div className="p-6 space-y-4">
          <Skeleton className="h-5 w-40" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </Card>
    </div>
  )
}
