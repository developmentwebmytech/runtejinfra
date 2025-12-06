import Image from "next/image"
import Link from "next/link"

interface Category {
  _id: string
  name: string
  description?: string
  image?: string
  parentCategory: string | null
}

interface CategoryCardProps {
  category: Category
  index: number
  showCount?: boolean
  propertyCount?: number
}

export function CategoryCard({ category, index, showCount = false, propertyCount = 0 }: CategoryCardProps) {
  const positionInBlock = index % 6
  const colSpan = positionInBlock === 0 || positionInBlock === 5 ? "md:col-span-2" : "md:col-span-1"

  const linkHref = `/categories/${category._id}`

  return (
    <Link href={linkHref} className={`block w-full ${colSpan} group`}>
      <div className="relative h-[300px] rounded-md overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105">
        <Image
          src={category.image || `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(category.name)}`}
          alt={category.name}
          fill
          className="object-cover rounded-md"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-5 text-white">
          <h3 className="text-lg sm:text-xl font-semibold mb-1">{category.name}</h3>
          {category.description && (
            <p className="text-xs sm:text-sm opacity-90 mb-2 line-clamp-2">{category.description}</p>
          )}
          {showCount && <p className="text-xs sm:text-sm">{propertyCount} Properties</p>}
          {!showCount && <p className="text-xs sm:text-sm">View Details →</p>}
        </div>
      </div>
    </Link>
  )
}
