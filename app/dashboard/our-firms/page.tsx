"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Spinner } from "@/components/ui/spinner"
import { Trash2, Edit2, Plus } from "lucide-react"
import { toast } from "sonner"

interface OurFirm {
  _id: string
  name: string
  description?: string
  image: string
  slug: string
  createdAt: string
}

export default function OurFirmDashboard() {
  const [firms, setFirms] = useState<OurFirm[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchFirms()
  }, [])

  const fetchFirms = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/our-firms")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setFirms(data)
    } catch {
      toast.error("Failed to load firms")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return

    try {
      const res = await fetch("/api/admin/our-firms", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) throw new Error()
      setFirms((prev) => prev.filter((f) => f._id !== id))
      toast.success("Firm deleted")
    } catch {
      toast.error("Delete failed")
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Our Firms</h1>
          <p className="text-muted-foreground">Manage your firms</p>
        </div>

        <Link href="/dashboard/our-firms/form">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Firm
          </Button>
        </Link>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Firm List</CardTitle>
          <CardDescription>{firms.length} total</CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          ) : firms.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">
              No firms found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {firms.map((firm) => (
                  <TableRow key={firm._id}>
                    <TableCell>
                      <div className="relative w-14 h-14">
                        <Image
                          src={firm.image || "/placeholder.svg"}
                          alt={firm.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{firm.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {firm.description || "-"}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{firm.slug}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/dashboard/our-firms/edit/${firm._id}`}>
                        <Button size="sm" variant="outline">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(firm._id, firm.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
