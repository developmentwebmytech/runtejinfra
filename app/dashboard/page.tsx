"use client"

import { useEffect, useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import {
  Building2, Users, Briefcase, Calendar,
} from "lucide-react"

interface Stats {
  projectsCompleted: number
  buildingsConstructed: number
  workersEmployed: number
  yearsOfExperience: number
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/milestone", { cache: "no-store" })
      const data = await res.json()
      setStats(data)
      setLoading(false)
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Failed to load stats
      </div>
    )
  }

  const overviewStats = [
    {
      title: "Projects Completed",
      icon: <Briefcase className="text-primary w-6 h-6" />,
      value: stats.projectsCompleted,
    },
    {
      title: "Buildings Constructed",
      icon: <Building2 className="text-primary w-6 h-6" />,
      value: stats.buildingsConstructed,
    },
    {
      title: "Workers Employed",
      icon: <Users className="text-primary w-6 h-6" />,
      value: stats.workersEmployed,
    },
    {
      title: "Years of Experience",
      icon: <Calendar className="text-primary w-6 h-6" />,
      value: stats.yearsOfExperience,
    },
  ]

  const generatedChartData = [
    {
      name: "Stats",
      Projects: stats.projectsCompleted,
      Buildings: stats.buildingsConstructed,
      Workers: stats.workersEmployed,
      Years: stats.yearsOfExperience,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">Compared to last year</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Construction Overview</CardTitle>
          <CardDescription>Monthly progress report</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={generatedChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Projects" fill="#8884d8" />
              <Bar dataKey="Buildings" fill="#10b981" />
              <Bar dataKey="Workers" fill="#8b5cf6" />
              <Bar dataKey="Years" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
