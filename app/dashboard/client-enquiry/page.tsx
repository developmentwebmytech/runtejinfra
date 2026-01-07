"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Download,
  MessageSquare,
  Calendar,
  Eye,
  Building2,
  MapPin,
  TrendingUp,
  Filter,
} from "lucide-react"
import ExcelJS from "exceljs"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"


function ClientEnquiriesDashboard() {
  const router = useRouter()
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const fetchEnquiries = async () => {
    try {
      const res = await fetch("/api/admin/client-enquiry")
      const data = await res.json()
      setEnquiries(Array.isArray(data) ? data : [])
    } catch (error) {
      console.log("Fetch failed", error)
      setEnquiries([
        {
          _id: "1",
          clientName: "John Doe",
          companyName: "JD Constructions",
          mobile: "9876543210",
          email: "john@jd.com",
          location: "New York",
          projectType: "Residential",
          estimatedBudget: "$500,000",
          requirementDescription: "Full construction project",
          createdAt: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const deleteEnquiry = async (id: string) => {
    try {
      await fetch(`/api/admin/client-enquiry/${id}`, {
        method: "DELETE",
      })

      setEnquiries((prev) => prev.filter((e) => e._id !== id))
    } catch (error) {
      console.log("Delete failed", error)
    }
  }


  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Enquiries")

    worksheet.columns = [
      { header: "Client Name", key: "clientName", width: 25 },
      { header: "Company", key: "companyName", width: 25 },
      { header: "Email", key: "email", width: 25 },
      { header: "Project Type", key: "projectType", width: 25 },
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
      item.projectType?.toLowerCase().includes(search.toLowerCase()) ||
      item.companyName?.toLowerCase().includes(search.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredEnquiries.length / pageSize)

  const paginatedEnquiries = filteredEnquiries.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  const openDetails = (enquiryId: string) => {
    router.push(`/dashboard/client-enquiry/enquiry/${enquiryId}`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 md:px-8 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold">Client Enquiries</h1>
            <p className="text-muted-foreground">
              Manage and track client requirements.
            </p>
          </div>
          <Button onClick={exportToExcel} variant="secondary" className="gap-2">
            <Download className="h-4 w-4" />
            Export data
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm uppercase">Total Enquiries</CardTitle>
              <MessageSquare className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{enquiries.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm uppercase">Recent (24h)</CardTitle>
              <Calendar className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {enquiries.filter(
                  (e) => new Date(e.createdAt) > new Date(Date.now() - 86400000)
                ).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm uppercase">Top Project</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">Residential</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
            <Input
              placeholder="Search..."
              className="pl-10"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
          </div>
          <Button variant="ghost" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client / Project</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Project Type</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEnquiries.map((item) => (
                <TableRow
                  key={item._id}
                  className="cursor-pointer"
                  onClick={() => openDetails(item._id)}
                >
                  <TableCell>
                    <div>
                      <div className="font-semibold">{item.clientName}</div>
                      <div className="text-xs flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {item.projectType}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.projectType}</Badge>
                  </TableCell>
                  <TableCell>{item.estimatedBudget || "N/A"}</TableCell>
                  <TableCell>
                    {format(new Date(item.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete enquiry?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-600"
                              onClick={() => deleteEnquiry(item._id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end gap-3 p-4">
            <Button size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
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
