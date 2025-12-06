"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Layers, LayoutDashboard, Package, Tag , Users ,House ,CalendarArrowDown , BookOpenCheck , BadgeDollarSign , Star,   } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Milestone",
    href: "/dashboard/milestone",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/dashboard/categories",
    icon: Layers,
  },
   {
    title:"Project Details",
    href: "/dashboard/project-details",
    icon: CalendarArrowDown,
  },
  {
    title: "Jobs Applications",
    href: "/dashboard/job-applications",
    icon: Tag,
  },
  {
    title: "Enquiries",
    href: "/dashboard/quotation",
    icon: Users,
  },
  {
    title: "Testimonials",
    href: "/dashboard/testimonials",
    icon: House,
  },
 
  {
    title:"Contact Us",
    href: "/dashboard/getcontact",
    icon: BookOpenCheck,
  },
  {
    title:"Add Contact",
    href: "/dashboard/postcontact",
    icon: BadgeDollarSign,
  },
  {
    title:"Services",
    href: "/dashboard/service-management",
    icon: Star   ,
  }
]

interface DashboardNavProps {
  setOpen?: (open: boolean) => void
}

export function DashboardNav({ setOpen }: DashboardNavProps) {
  const pathname = usePathname()

  return (
    <nav className="h-full py-4 overflow-y-scroll scrollbar-none">
      <div className="px-3 py-2">
        <h2 className="mb-3  text-md font-semibold text-gray-700 tracking-tight">Main Menu</h2>
        <div className="space-y-1 ">
          {items.map((item, index) => (
            <div key={item.href} className="flex flex-col">
              <Link
                href={item.href}
                onClick={() => {
                  if (setOpen) setOpen(false)
                }}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors",
                  pathname === item.href ? "bg-gray-700 text-white " : "transparent",
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>  { item.title}</span>
              </Link>
              {index < items.length - 1 && <Separator className="my-1" />}
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}
