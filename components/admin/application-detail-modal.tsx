"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Briefcase, GraduationCap, FileText, Award } from "lucide-react"
import { format } from "date-fns"

interface ApplicationDetailsModalProps {
  application: any | null
  isOpen: boolean
  onClose: () => void
}

export function ApplicationDetailsModal({ application, isOpen, onClose }: ApplicationDetailsModalProps) {
  if (!application) return null

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden bg-card border-border">
        <DialogHeader className="p-6 border-b border-border bg-muted/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold tracking-tight">{application.fullName}</DialogTitle>
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {application.positionAppliedFor}
                </Badge>
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                  {application.totalYearsExperience} Years Exp.
                </Badge>
              </div>
            </div>
            {application.resumeUrl && (
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-4 w-4" />
                  View Full Resume
                </a>
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="h-full max-h-[calc(90vh-130px)] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DetailSection title="Contact Information" icon={User}>
              <DetailItem label="Email Address" value={application.email} />
              <DetailItem label="Mobile Number" value={application.mobileNumber} />
              <DetailItem label="Current Location" value={application.currentLocation} />
              <DetailItem label="Willing to Relocate" value={application.willingsToRelocate} />
            </DetailSection>

            <DetailSection title="Professional Background" icon={Briefcase}>
              <DetailItem label="Current Organization" value={application.currentOrganization} />
              <DetailItem label="Construction Experience" value={application.constructionExperienceType} />
              <DetailItem label="Notice Period" value={application.noticePeriod} />
              <DetailItem label="Applied On" value={format(new Date(application.createdAt), "MMMM dd, yyyy")} />
            </DetailSection>

            <DetailSection title="Education & Skills" icon={GraduationCap}>
              <DetailItem label="Highest Qualification" value={application.highestQualification} />
              <DetailItem label="Technical Skills" value={application.keyTechnicalSkills} />
              <DetailItem label="Certifications" value={application.certifications} />
            </DetailSection>

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
      </DialogContent>
    </Dialog>
  )
}
