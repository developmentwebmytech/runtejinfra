"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Users, Calendar, ExternalLink, Filter, Eye } from "lucide-react"
import ExcelJS from "exceljs"
import { format } from "date-fns"

export default function VendorAdminDashboard() {
  const router = useRouter()
  const [vendors, setVendors] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      const res = await fetch("/api/admin/vendor-registration")
      const data = await res.json()
      setVendors(data)
    } catch (error) {
      console.log("[v0] Fetch failed", error)
    } finally {
      setLoading(false)
    }
  }

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Vendor Registrations")

    worksheet.columns = [
      { header: "Firm Name", key: "firmName", width: 25 },
      { header: "Contact Person", key: "contactPersonName", width: 20 },
      { header: "Email", key: "email", width: 25 },
      { header: "Mobile", key: "mobileNumber", width: 15 },
      { header: "Category", key: "vendorCategory", width: 20 },
      { header: "Experience (Yrs)", key: "yearsOfExperience", width: 15 },
      { header: "GST Number", key: "gstNumber", width: 20 },
      { header: "MSME Registered", key: "msmeRegistration", width: 15 },
      { header: "Registration Date", key: "createdAt", width: 20 },
    ]

    vendors.forEach((vendor) => {
      worksheet.addRow({
        ...vendor,
        createdAt: format(new Date(vendor.createdAt), "yyyy-MM-dd HH:mm"),
      })
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer])
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `vendor-registrations-${format(new Date(), "yyyy-MM-dd")}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.firmName.toLowerCase().includes(search.toLowerCase()) ||
      vendor.email.toLowerCase().includes(search.toLowerCase()) ||
      vendor.vendorCategory.toLowerCase().includes(search.toLowerCase()),
  )

  const openDetails = (vendorId: string) => {
    router.push(`/dashboard/vendor-registration/${vendorId}`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <div className="container mx-auto px-4 py-10 md:px-8 space-y-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-balance">Vendor Registration</h1>
            <p className="text-muted-foreground text-lg max-w-2xl text-pretty">
              Review and manage incoming vendor registrations for materials, services, and contracting.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={exportToExcel}
              className="border-border hover:bg-muted font-medium transition-all bg-transparent"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Database
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Total Vendors
                </CardTitle>
                <CardDescription>All-time registrations</CardDescription>
              </div>
              <div className="p-2 bg-primary/5 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold tracking-tighter">{vendors.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  New Registrations
                </CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </div>
              <div className="p-2 bg-primary/5 rounded-full">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold tracking-tighter">
                {vendors.filter((v) => new Date(v.createdAt) > new Date(Date.now() - 86400000)).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Vendor Categories
                </CardTitle>
                <CardDescription>Unique categories</CardDescription>
              </div>
              <div className="p-2 bg-primary/5 rounded-full">
                <Filter className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold tracking-tighter">
                {new Set(vendors.map((v) => v.vendorCategory)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Filter by firm, email, or category..."
              className="pl-10 h-11 bg-card border-border focus-visible:ring-1 focus-visible:ring-primary transition-all text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <p className="text-sm text-muted-foreground">
              Showing <span className="text-foreground font-medium">{filteredVendors.length}</span> vendors
            </p>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50 border-b border-border">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-4 font-semibold text-foreground uppercase text-[10px] tracking-[0.1em] px-6">
                    Vendor Profile
                  </TableHead>
                  <TableHead className="py-4 font-semibold text-foreground uppercase text-[10px] tracking-[0.1em]">
                    Category
                  </TableHead>
                  <TableHead className="py-4 font-semibold text-foreground uppercase text-[10px] tracking-[0.1em]">
                    Experience
                  </TableHead>
                  <TableHead className="py-4 font-semibold text-foreground uppercase text-[10px] tracking-[0.1em]">
                    Submission Date
                  </TableHead>
                  <TableHead className="py-4 text-right font-semibold text-foreground uppercase text-[10px] tracking-[0.1em] px-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <p className="text-sm font-medium">Retrieving vendor database...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredVendors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center text-muted-foreground">
                      No matching vendor registrations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVendors.map((vendor) => (
                    <TableRow
                      key={vendor._id}
                      className="group cursor-pointer hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0"
                      onClick={() => openDetails(vendor._id)}
                    >
                      <TableCell className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {vendor.firmName.charAt(0)}
                          </div>
                          <div className="space-y-0.5">
                            <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {vendor.firmName}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">{vendor.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-medium bg-background/50 border-border group-hover:border-primary/50 transition-colors"
                        >
                          {vendor.vendorCategory}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{vendor.yearsOfExperience}</span>
                          <span className="text-xs text-muted-foreground">Yrs</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm font-medium">
                        {format(new Date(vendor.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right py-5 px-6">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted"
                            onClick={() => openDetails(vendor._id)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Button>
                          {vendor.gstCertificateUrl && (
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted"
                            >
                              <a href={vendor.gstCertificateUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">View GST Certificate</span>
                              </a>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
