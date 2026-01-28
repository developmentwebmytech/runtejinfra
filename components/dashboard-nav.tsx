"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import {
  Layers,
  LayoutDashboard,
  Package,
  Tag,
  Users,
  House,
  CalendarArrowDown,
  BookOpenCheck,
  BadgeDollarSign,
  Star,
  ChevronDown,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface DashboardNavProps {
  setOpen?: (open: boolean) => void
}

export function DashboardNav({ setOpen }: DashboardNavProps) {
  const pathname = usePathname()
  const [openApplications, setOpenApplications] = useState(false)

  // Auto-open Applications if a child route is active
  useEffect(() => {
    if (
      pathname === "/dashboard/employee-careers" ||
      pathname === "/dashboard/client-enquiry" ||
      pathname === "/dashboard/vendor-registration"
    ) {
      setOpenApplications(true)
    }
  }, [pathname])

  return (
    <nav className="h-full py-4 overflow-y-scroll scrollbar-none">
      <div className="px-3 py-2">
        <h2 className="mb-3 text-md font-semibold text-gray-700 tracking-tight">
          Main Menu
        </h2>

        <div className="space-y-1">
          {/* Dashboard */}
          <NavLink
            href="/dashboard"
            title="Dashboard"
            icon={LayoutDashboard}
            pathname={pathname}
            setOpen={setOpen}
          />

          <Separator />

          <NavLink
            href="/dashboard/milestone"
            title="Milestone"
            icon={Package}
            pathname={pathname}
            setOpen={setOpen}
          />

          <Separator />

          <NavLink
            href="/dashboard/categories"
            title="Categories"
            icon={Layers}
            pathname={pathname}
            setOpen={setOpen}
          />

          <Separator />

          <NavLink
            href="/dashboard/project-details"
            title="Project Details"
            icon={CalendarArrowDown}
            pathname={pathname}
            setOpen={setOpen}
          />

          <Separator />

          {/* <NavLink
            href="/dashboard/job-applications"
            title="Jobs Applications"
            icon={Tag}
            pathname={pathname}
            setOpen={setOpen}
          /> */}

          {/* <Separator /> */}

          <NavLink
            href="/dashboard/quotation"
            title="Enquiries"
            icon={Users}
            pathname={pathname}
            setOpen={setOpen}
          />

          <Separator />

          <NavLink
            href="/dashboard/testimonials"
            title="Testimonials"
            icon={House}
            pathname={pathname}
            setOpen={setOpen}
          />

          <Separator />

        
          {/* Applications Dropdown */}
          <div className="flex flex-col">
            <button
              onClick={() => setOpenApplications(!openApplications)}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-3 text-sm font-medium w-full",
                "hover:bg-gray-700 hover:text-white  text-gray-700 not-[]:transition-colors"
              )}
            >
              <div className="flex items-center ">
                <Package className="mr-2 h-4 w-4" />
                Applications
              </div>

              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  openApplications && "rotate-180"
                )}
              />
            </button>

            {openApplications && (
              <div className="ml-6 mt-1 space-y-1">
                <ChildLink
                  href="/dashboard/employee-careers"
                  title="Employees"
                  icon={House}
                  pathname={pathname}
                  setOpen={setOpen}
                />

                <ChildLink
                  href="/dashboard/client-enquiry"
                  title="Client Enquiries"
                  icon={Package}
                  pathname={pathname}
                  setOpen={setOpen}
                />

                <ChildLink
                  href="/dashboard/vendor-registration"
                  title="Vendor Registration"
                  icon={Package}
                  pathname={pathname}
                  setOpen={setOpen}
                />
              </div>
            )}
          </div>


          <Separator />

          <NavLink
            href="/dashboard/getcontact"
            title="Contact Us"
            icon={BookOpenCheck}
            pathname={pathname}
            setOpen={setOpen}
          />

          <Separator />

          <NavLink
            href="/dashboard/postcontact"
            title="Add Contact"
            icon={BadgeDollarSign}
            pathname={pathname}
            setOpen={setOpen}
          />

          <Separator />

          <NavLink
            href="/dashboard/blogs"
            title="Blogs"
            icon={Star}
            pathname={pathname}
            setOpen={setOpen}
          />

          <Separator />

          <NavLink
            href="/dashboard/media"
            title="Media"
            icon={Users}
            pathname={pathname}
            setOpen={setOpen}
          />

          <Separator />

          <NavLink
            href="/dashboard/our-work-partner"
            title="Work Partner"
            icon={BookOpenCheck}
            pathname={pathname}
            setOpen={setOpen}
          />

          <Separator />

          <NavLink
            href="/dashboard/our-firms"
            title="Our Firms"
            icon={Package}
            pathname={pathname}
            setOpen={setOpen}
          />
        </div>
      </div>
    </nav>
  )
}

/* ---------- Reusable Components ---------- */

function NavLink({
  href,
  title,
  icon: Icon,
  pathname,
  setOpen,
}: any) {
  return (
    <Link
      href={href}
      onClick={() => setOpen?.(false)}
      className={cn(
        "group flex items-center rounded-md px-3 py-3 text-sm font-medium",
        "hover:bg-gray-700 hover:text-white transition-colors",
        pathname === href ? "bg-gray-700 text-white" : "text-gray-600"
      )}

    >
      <Icon className="mr-2 h-4 w-4" />
      {title}
    </Link>
  )
}

function ChildLink({
  href,
  title,
  icon: Icon,
  pathname,
  setOpen,
}: any) {
  return (
    <Link
      href={href}
      onClick={() => setOpen?.(false)}
      className={cn(
        "flex items-center rounded-md px-3 py-3 text-sm hover:bg-gray-600 hover:text-white",
        pathname === href ? "bg-gray-700 text-white" : "text-gray-600"

      )}
    >
      <Icon className="mr-2 h-3 w-3" />
      {title}
    </Link>
  )
}
