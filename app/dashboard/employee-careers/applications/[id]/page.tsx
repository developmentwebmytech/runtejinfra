"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Briefcase, GraduationCap, FileText, Award, ArrowLeft } from "lucide-react"
import { format } from "date-fns"

interface ApplicationDetailsPageProps {
  params: { id: string }
}

export default function ApplicationDetailsPage({ params }: ApplicationDetailsPageProps) {
  const router = useRouter()
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await fetch("/api/admin/employee-careers")
        const data = await res.json()
        const app = data.find((item: any) => item._id === params.id)
        setApplication(app || null)
      } catch (error) {
        console.error("[v0] Failed to fetch application:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplication()
  }, [params?.id])

  const DetailSection = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-muted-foreground border-b border-border pb-2">
        <Icon className="h-4 w-4" />
        <h3 className="text-sm font-medium uppercase tracking-wider">{title}</h3>
      </div>
      <div className="grid gap-4 py-2">{children}</div>
    </div>
  )

  const DetailItem = ({ label, value }: { label: string; value: string | boolean | undefined }) => (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="text-sm text-foreground leading-relaxed">{value || "Not provided"}</p>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Loading application details...</p>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg font-medium">Application not found</p>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <div className="container mx-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="px-6 py-4 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Go back</span>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight text-balance flex-1 px-4">{application.fullName}</h1>
            {application.resumeUrl && (
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-4 w-4" />
                  Resume
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8">
          {/* Badges Section */}
          <div className="mb-8 flex flex-wrap gap-3">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-base py-2 px-4">
              {application.positionAppliedFor}
            </Badge>
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-base py-2 px-4">
              {application.totalYearsExperience} Years Experience
            </Badge>
          </div>

          {/* Scrollable Details Grid */}
          <ScrollArea className="h-[calc(100vh-240px)] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8">
              {/* Contact Information */}
              <DetailSection title="Contact Information" icon={User}>
                <DetailItem label="Email Address" value={application.email} />
                <DetailItem label="Mobile Number" value={application.mobileNumber} />
                <DetailItem label="Current Location" value={application.currentLocation} />
                <DetailItem label="Willing to Relocate" value={application.willingsToRelocate} />
              </DetailSection>

              {/* Professional Background */}
              <DetailSection title="Professional Background" icon={Briefcase}>
                <DetailItem label="Current Organization" value={application.currentOrganization} />
                <DetailItem label="Construction Experience" value={application.constructionExperienceType} />
                <DetailItem label="Notice Period" value={application.noticePeriod} />
                <DetailItem label="Applied On" value={format(new Date(application.createdAt), "MMMM dd, yyyy")} />
              </DetailSection>

              {/* Education & Skills */}
              <DetailSection title="Education & Skills" icon={GraduationCap}>
                <DetailItem label="Highest Qualification" value={application.highestQualification} />
                <DetailItem label="Technical Skills" value={application.keyTechnicalSkills} />
                <DetailItem label="Certifications" value={application.certifications} />
              </DetailSection>

              {/* Additional Info */}
              <DetailSection title="Additional Info" icon={Award}>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Declaration Signed</p>
                  <Badge variant={application.declaration ? "default" : "destructive"} className="mt-1">
                    {application.declaration ? "Yes" : "No"}
                  </Badge>
                </div>
              </DetailSection>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
