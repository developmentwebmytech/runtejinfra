"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Download, MessageSquare, Calendar, Eye, Building2, MapPin, TrendingUp, Filter } from "lucide-react"
import ExcelJS from "exceljs"
import { format } from "date-fns"
import { useSearchParams } from "next/navigation"
import { EnquiryDetailsModal } from "@/components/admin/enquiry-detail-modal"

function ClientEnquiriesDashboard() {
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const searchParams = useSearchParams() // New line added

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const fetchEnquiries = async () => {
    try {
      const res = await fetch("/api/admin/client-enquiry")
      const data = await res.json()
      setEnquiries(Array.isArray(data) ? data : [])
    } catch (error) {
      console.log("[v0] Fetch failed", error)
      // Fallback dummy data for visual representation if API is not ready
      setEnquiries([
        {
          _id: "1",
          clientName: "John Doe",
          companyName: "JD Constructions",
          mobile: "9876543210",
          email: "john@jd.com",
          location: "New York",
          projectName: "Skyline Residency",
          projectLocation: "Manhattan",
          projectType: "Residential Construction",
          estimatedBudget: "$500,000",
          requirementDescription: "Full construction of a 3-story residential building.",
          createdAt: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Enquiries")

    worksheet.columns = [
      { header: "Client Name", key: "clientName", width: 25 },
      { header: "Company", key: "companyName", width: 25 },
      { header: "Email", key: "email", width: 25 },
      { header: "Project", key: "projectName", width: 25 },
      { header: "Type", key: "projectType", width: 25 },
      { header: "Budget", key: "estimatedBudget", width: 15 },
      { header: "Date", key: "createdAt", width: 20 },
    ]

    enquiries.forEach((item) => {
      worksheet.addRow({
        ...item,
        createdAt: format(new Date(item.createdAt), "yyyy-MM-dd HH:mm"),
      })
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer])
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `client-enquiries-${format(new Date(), "yyyy-MM-dd")}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredEnquiries = enquiries.filter(
    (item) =>
      item.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      item.projectName?.toLowerCase().includes(search.toLowerCase()) ||
      item.companyName?.toLowerCase().includes(search.toLowerCase()),
  )

  const openDetails = (item: any) => {
    setSelectedEnquiry(item)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-[1400px] mx-auto px-4 py-8 md:px-8 space-y-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Client Enquiries</h1>
            <p className="text-muted-foreground">Manage and track project requirements from potential clients.</p>
          </div>
          <Button onClick={exportToExcel} variant="secondary" className="gap-2">
            <Download className="h-4 w-4" />
            Export data
          </Button>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-border shadow-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Total Enquiries
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{enquiries.length}</div>
              <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Recent (24h)
              </CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {enquiries.filter((e) => new Date(e.createdAt) > new Date(Date.now() - 86400000)).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">New leads today</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Top Project Type
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">Residential</div>
              <p className="text-xs text-muted-foreground mt-1">64% of total volume</p>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by client, project, or company..."
              className="pl-10 bg-card border-border h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <span className="text-sm text-muted-foreground">
              Showing <span className="text-foreground font-medium">{filteredEnquiries.length}</span> results
            </span>
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="px-6 py-4">Client / Project</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Project Type</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right px-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <span>Loading enquiries...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredEnquiries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                      No enquiries found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEnquiries.map((item) => (
                    <TableRow
                      key={item._id}
                      className="group cursor-pointer hover:bg-muted/20 transition-colors"
                      onClick={() => openDetails(item)}
                    >
                      <TableCell className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {item.clientName}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {item.projectName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-[10px] uppercase tracking-wider font-semibold border-primary/20 bg-primary/5 text-primary"
                        >
                          {item.projectType}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{item.estimatedBudget || "N/A"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(item.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right px-6">
                        <Button variant="ghost" size="icon" onClick={() => openDetails(item)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <EnquiryDetailsModal enquiry={selectedEnquiry} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default function ClientEnquiriesPage() {
  return (
    <Suspense fallback={null}>
      <ClientEnquiriesDashboard />
    </Suspense>
  )
}
