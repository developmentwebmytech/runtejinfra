"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Users, Calendar, ExternalLink, Filter, Eye } from "lucide-react"
import ExcelJS from "exceljs"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

function AdminDashboard() {
  const router = useRouter()
  const [applications, setApplications] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)
  const pageSize = 10


  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/admin/employee-careers")
      const data = await res.json()
      setApplications(data)
    } catch (error) {
      console.log("[v0] Fetch failed", error)
    } finally {
      setLoading(false)
    }
  }



  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Applications")

    worksheet.columns = [
      { header: "Full Name", key: "fullName", width: 25 },
      { header: "Email", key: "email", width: 25 },
      { header: "Mobile", key: "mobileNumber", width: 15 },
      { header: "Position", key: "positionAppliedFor", width: 20 },
      { header: "Experience", key: "totalYearsExperience", width: 15 },
      { header: "Qualification", key: "highestQualification", width: 20 },
      { header: "Organization", key: "currentOrganization", width: 25 },
      { header: "Applied Date", key: "createdAt", width: 20 },
    ]

    applications.forEach((app) => {
      worksheet.addRow({
        ...app,
        createdAt: format(new Date(app.createdAt), "yyyy-MM-dd HH:mm"),
      })
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer])
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `career-applications-${format(new Date(), "yyyy-MM-dd")}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredApps = applications.filter(
    (app) =>
      app.fullName.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase()) ||
      app.positionAppliedFor.toLowerCase().includes(search.toLowerCase()),
  )


  const totalPages = Math.ceil(filteredApps.length / pageSize)

  const paginatedApps = filteredApps.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  const openDetails = (appId: string) => {
    router.push(`/dashboard/employee-careers/applications/${appId}`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <div className="container mx-auto px-4 py-4 md:px-8 space-y-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-balance">Employee Application</h1>
            <p className="text-muted-foreground text-lg max-w-2xl text-pretty">
              Review and manage incoming employee applications for construction and technical roles.
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
                  Total Reach
                </CardTitle>
                <CardDescription>All-time applications</CardDescription>
              </div>
              <div className="p-2 bg-primary/5 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold tracking-tighter">{applications.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Velocity
                </CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </div>
              <div className="p-2 bg-primary/5 rounded-full">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold tracking-tighter">
                {applications.filter((a) => new Date(a.createdAt) > new Date(Date.now() - 86400000)).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Active Roles
                </CardTitle>
                <CardDescription>Unique positions applied</CardDescription>
              </div>
              <div className="p-2 bg-primary/5 rounded-full">
                <Filter className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold tracking-tighter">
                {new Set(applications.map((a) => a.positionAppliedFor)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Filter by name, email, or role..."
              className="pl-10 h-11 bg-card border-border focus-visible:ring-1 focus-visible:ring-primary transition-all text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <p className="text-sm text-muted-foreground">
              Showing <span className="text-foreground font-medium">{filteredApps.length}</span> candidates
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
                    Applicant Profile
                  </TableHead>
                  <TableHead className="py-4 font-semibold text-foreground uppercase text-[10px] tracking-[0.1em]">
                    Target Role
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
                        <p className="text-sm font-medium">Retrieving talent database...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredApps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center text-muted-foreground">
                      No matching applications found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedApps.map((app) => (
                    <TableRow
                      key={app._id}
                      className="group cursor-pointer hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0"
                      onClick={() => openDetails(app._id)}
                    >
                      <TableCell className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {app.fullName.charAt(0)}
                          </div>
                          <div className="space-y-0.5">
                            <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {app.fullName}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">{app.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-medium bg-background/50 border-border group-hover:border-primary/50 transition-colors"
                        >
                          {app.positionAppliedFor}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{app.totalYearsExperience}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm font-medium">
                        {format(new Date(app.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right py-5 px-6">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted"
                            onClick={() => openDetails(app._id)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Button>
                          {app.resumeUrl && (
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted"
                            >
                              <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">View Resume</span>
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

            <div className="flex justify-center items-center gap-4 py-6">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>

              <span className="text-sm">
                Page {page} of {totalPages || 1}
              </span>

              <Button
                variant="outline"
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={null}>
      <AdminDashboard />
    </Suspense>
  )
}
