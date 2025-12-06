"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Briefcase, Calendar } from "lucide-react"

interface Stats {
  projectsCompleted: number
  buildingsConstructed: number
  workersEmployed: number
  yearsOfExperience: number
}

export function DashboardOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const res = await fetch("/api/milestone", { cache: "no-store" })
      const data = await res.json()
      setStats(data)
      setLoading(false)
    })()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  const chartData = [
    {
      name: "Company Stats",
      Projects: stats.projectsCompleted,
      Buildings: stats.buildingsConstructed,
      Workers: stats.workersEmployed,
      Years: stats.yearsOfExperience,
    },
  ]

  const statCards = [
    {
      title: "Projects Completed",
      value: stats.projectsCompleted,
      description: "Total completed projects",
      icon: Briefcase,
      color: "text-blue-600",
    },
    {
      title: "Buildings Constructed",
      value: stats.buildingsConstructed,
      description: "Buildings delivered",
      icon: Building2,
      color: "text-green-600",
    },
    {
      title: "Workers Employed",
      value: stats.workersEmployed,
      description: "Active workforce",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Years of Experience",
      value: stats.yearsOfExperience,
      description: "Industry experience",
      icon: Calendar,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Company Milestones</CardTitle>
          <CardDescription>Visual representation of key company achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} className="fill-muted-foreground text-sm" />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                className="fill-muted-foreground text-sm"
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{
                  fontSize: "14px",
                  color: "hsl(var(--muted-foreground))",
                  paddingTop: "20px",
                }}
              />
              <Bar dataKey="Projects" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Buildings" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Workers" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Years" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
