"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Briefcase, FileText, ArrowLeft, Download, Building } from "lucide-react"
import { format } from "date-fns"

interface EnquiryDetailsPageProps {
  params: { id: string }
}

export default function EnquiryDetailsPage({ params }: EnquiryDetailsPageProps) {
  const router = useRouter()
  const [enquiry, setEnquiry] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEnquiry = async () => {
      try {
        const res = await fetch("/api/admin/client-enquiry")
        const data = await res.json()
        const enq = Array.isArray(data)
          ? data.find((item: any) => item._id === params.id)
          : null
        setEnquiry(enq || null)
      } catch (error) {
        console.error("Failed to fetch enquiry:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEnquiry()
  }, [params?.id])

  const DetailSection = ({
    title,
    icon: Icon,
    children,
  }: {
    title: string
    icon: any
    children: React.ReactNode
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-muted-foreground border-b border-border pb-2">
        <Icon className="h-4 w-4" />
        <h3 className="text-sm font-medium uppercase tracking-wider">{title}</h3>
      </div>
      <div className="grid gap-4 py-2">{children}</div>
    </div>
  )

  const DetailItem = ({
    label,
    value,
  }: {
    label: string
    value: string | undefined
  }) => (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="text-sm text-foreground">{value || "Not provided"}</p>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading enquiry...</p>
        </div>
      </div>
    )
  }

  if (!enquiry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg font-medium">Enquiry not found</p>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background border-b">
          <div className="px-6 py-4 flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold px-4 flex-1">
              {enquiry.clientName}
            </h1>
          </div>
        </div>

        <div className="px-6 py-8">
          {/* Badges */}
          <div className="mb-8 flex gap-3">
            <Badge variant="outline">
              {enquiry.projectType}
            </Badge>
            <Badge variant="secondary">
              {format(new Date(enquiry.createdAt), "MMM dd, yyyy")}
            </Badge>
          </div>

          <ScrollArea className="h-[calc(100vh-240px)] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Client Info */}
              <DetailSection title="Client Information" icon={User}>
                <DetailItem label="Client Name" value={enquiry.clientName} />
                <DetailItem label="Company" value={enquiry.companyName} />
                <DetailItem label="Email" value={enquiry.email} />
                <DetailItem label="Mobile" value={enquiry.mobile} />
                <DetailItem label="Location" value={enquiry.location} />
              </DetailSection>

              {/* Project Info */}
              <DetailSection title="Project Information" icon={Briefcase}>
                <DetailItem label="Project Type" value={enquiry.projectType} />
                <DetailItem label="Project Area" value={enquiry.projectArea} />
                <DetailItem label="Estimated Budget" value={enquiry.estimatedBudget} />
                <DetailItem label="Timeline Expected" value={enquiry.timelineExpected} />
              </DetailSection>

              {/* Extra */}
              <DetailSection title="Additional Information" icon={Building}>
                <DetailItem label="Source of Enquiry" value={enquiry.sourceOfEnquiry} />
              </DetailSection>
            </div>

            {/* Requirement */}
            <div className="mt-8 p-6 bg-muted/30 rounded-lg">
              <h3 className="font-bold mb-4 flex gap-2 items-center">
                <FileText className="h-4 w-4" />
                Requirement Description
              </h3>
              <p className="text-sm whitespace-pre-wrap">
                {enquiry.requirementDescription}
              </p>
            </div>

            {/* Attachments */}
            {enquiry.attachments?.length > 0 && (
              <div className="mt-8 p-6 bg-muted/30 rounded-lg">
                <h3 className="font-bold mb-4 flex gap-2 items-center">
                  <FileText className="h-4 w-4" />
                  Attachments
                </h3>

                <ul className="space-y-3">
                  {enquiry.attachments.map((file: string, index: number) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span className="truncate">{file.split("/").pop()}</span>
                      <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
