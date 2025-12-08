"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Spinner } from "@/components/ui/spinner"
import { Trash2, Edit2, Plus } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface Partner {
  _id: string
  name: string
  titleName: string
  image: string
  slug: string
  createdAt: string
}

export default function OurWorkPartnerDashboard() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/our-work-partner")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setPartners(data)
    } catch (error) {
      console.error("[v0]", error)
      toast.error("Failed to load partners")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    try {
      const res = await fetch("/api/admin/our-work-partner", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) throw new Error("Failed to delete")
      setPartners(partners.filter((p) => p._id !== id))
      toast.success("Partner deleted successfully")
    } catch (error) {
      console.error("[v0]", error)
      toast.error("Failed to delete partner")
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Our Work Partners</h1>
          <p className="text-muted-foreground text-base mt-2">Manage and organize your business partners</p>
        </div>

        <Link href="/dashboard/our-work-partner/form">
          <Button size="lg" className="gap-2 w-full md:w-auto">
            <Plus className="w-5 h-5" />
            Add Partner
          </Button>
        </Link>
      </div>

      {/* Partners Table */}
      <Card className="border shadow-sm">
        <CardHeader className="border-b pb-6">
          <CardTitle className="text-2xl">Partners List</CardTitle>
          <CardDescription className="text-base">
            {partners.length} partner{partners.length !== 1 ? "s" : ""} registered
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-base mb-6">No partners added yet</p>
              <Link href="/dashboard/our-work-partner/form">
                <Button variant="outline" size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Add your first partner
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-24">Logo</TableHead>
                    <TableHead className="min-w-32">Name</TableHead>
                    <TableHead className="min-w-40">Title</TableHead>
                    <TableHead className="hidden lg:table-cell min-w-32">Slug</TableHead>
                    <TableHead className="text-right w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.map((partner) => (
                    <TableRow key={partner._id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                          <Image
                            src={partner.image || "/placeholder.svg"}
                            alt={partner.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-base">{partner.name}</TableCell>
                      <TableCell className="text-muted-foreground">{partner.titleName}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground font-mono">
                        {partner.slug}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Link href={`/dashboard/our-work-partner/edit/${partner._id}`}>
                            <Button size="sm" variant="outline" className="gap-1.5 bg-transparent">
                              <Edit2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(partner._id, partner.name)}
                            className="gap-1.5"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
