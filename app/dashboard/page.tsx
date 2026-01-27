"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart,
  Pie,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Building2,
  Users,
  Briefcase,
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  FolderOpen,
  Layers,
  Activity,
  ArrowRight,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Milestone {
  projectsCompleted: number
  buildingsConstructed: number
  workersEmployed: number
  yearsOfExperience: number
}

interface Category {
  _id: string
  name: string
  slug?: string
}

interface RecentProject {
  _id: string
  imageUrl: string
  name: string
  slug: string
  address: string
  description?: string
  yearOfCompletion?: number
  category?: Category
  propertyType?: Category
  createdAt: string
}

interface CategoryStat {
  _id: string
  name: string
  slug: string
  projectCount: number
}

interface ProjectByYear {
  _id: number
  count: number
}

interface DashboardData {
  milestone: Milestone
  recentProjects: RecentProject[]
  categoryStats: CategoryStat[]
  totalProjects: number
  projectsByYear: ProjectByYear[]
}

const COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899"]

export default function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/dashboard-overview", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to fetch data")
        const result = await res.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <p className="text-destructive">{error || "Failed to load data"}</p>
        </Card>
      </div>
    )
  }

  const { milestone, recentProjects, categoryStats, totalProjects, projectsByYear } = data

  const overviewStats = [
    {
      title: "Projects Completed",
      icon: <Briefcase className="w-5 h-5" />,
      value: milestone.projectsCompleted,
      bgColor: "bg-violet-100",
      iconColor: "text-violet-600",
      trend: "+12%",
    },
    {
      title: "Buildings Constructed",
      icon: <Building2 className="w-5 h-5" />,
      value: milestone.buildingsConstructed,
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
      trend: "+8%",
    },
    {
      title: "Workers Employed",
      icon: <Users className="w-5 h-5" />,
      value: milestone.workersEmployed,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
      trend: "+15%",
    },
    {
      title: "Years of Experience",
      icon: <Calendar className="w-5 h-5" />,
      value: milestone.yearsOfExperience,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      trend: "+1",
    },
  ]

  const milestoneChartData = [
    { name: "Projects", value: milestone.projectsCompleted, fill: "#8b5cf6" },
    { name: "Buildings", value: milestone.buildingsConstructed, fill: "#10b981" },
    { name: "Workers", value: milestone.workersEmployed, fill: "#f59e0b" },
    { name: "Years", value: milestone.yearsOfExperience, fill: "#3b82f6" },
  ]

  const categoryChartData = categoryStats.map((cat, index) => ({
    name: cat.name,
    value: cat.projectCount,
    fill: COLORS[index % COLORS.length],
  }))

  const activityChartData = projectsByYear?.map((item) => ({
    year: item._id.toString(),
    projects: item.count,
  }))

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <Card
            key={stat.title}
            className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <span className={stat.iconColor}>{stat.icon}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value.toLocaleString()}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <p className="text-xs text-emerald-600 font-medium">{stat.trend}</p>
                <span className="text-xs text-muted-foreground">vs last year</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Milestone Bar Chart */}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-2">
            <div className="p-2 rounded-lg bg-violet-100">
              <Activity className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <CardTitle>Construction Overview</CardTitle>
              <CardDescription>Milestone statistics breakdown</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={milestoneChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  barSize={50}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {milestoneChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Pie Chart */}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-100">
              <FolderOpen className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <CardTitle>Projects by Category</CardTitle>
              <CardDescription>Distribution across categories</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[220px] sm:h-[280px] md:h-[320px]">

              {categoryChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius="45%"
                      outerRadius="70%"
                      paddingAngle={2}
                      dataKey="value"
                      label={!isMobile ? ({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                        : false}
                      labelLine={false}
                    />


                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />

                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ fontSize: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>

              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No category data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>



      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Projects */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-100">
              <Layers className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Latest 5 uploaded projects</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <div
                    key={project._id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="relative">
                      <Image
                        src={project.imageUrl || "/placeholder.svg"}
                        alt={project.name}
                        width={64}
                        height={64}
                        className="rounded-lg object-cover"
                      />

                      <span className="absolute -top-2 -left-2 w-6 h-6 bg-violet-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {index + 1}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{project.name}</h4>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{project.address}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {project.category && (
                          <Badge variant="secondary" className="text-xs">
                            {project.category.name}
                          </Badge>
                        )}
                        {project.yearOfCompletion && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {project.yearOfCompletion}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <Link
                  href="/dashboard/project-details"
                  className="flex items-center gap-2 text-sm text-violet-600 hover:underline"
                >
                  <span> View all projects</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <FolderOpen className="w-12 h-12 mb-2 opacity-50" />
                <p>No projects uploaded yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Stats */}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-2">
            <div className="p-2 rounded-lg bg-pink-100">
              <FolderOpen className="w-4 h-4 text-pink-600" />
            </div>
            <div>
              <CardTitle>Category Stats</CardTitle>
              <CardDescription>Projects per category</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {categoryStats.length > 0 ? (
              <div className="space-y-3">
                {categoryStats.map((cat, index) => (
                  <div key={cat._id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{cat.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {cat.projectCount} projects
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${totalProjects > 0 ? (cat.projectCount / totalProjects) * 100 : 0}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-3 mt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Total Projects</span>
                    <span className="text-lg font-bold text-violet-600">
                      {totalProjects}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Layers className="w-12 h-12 mb-2 opacity-50" />
                <p>No categories yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
