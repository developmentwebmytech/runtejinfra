"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { User, Mail, Phone, MapPin, Briefcase, Clock, DollarSign, FileText, Building } from "lucide-react"

interface EnquiryDetailsModalProps {
  enquiry: any
  isOpen: boolean
  onClose: () => void
}

export function EnquiryDetailsModal({ enquiry, isOpen, onClose }: EnquiryDetailsModalProps) {
  if (!enquiry) return null

  const DetailRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
      <div className="p-2 bg-muted rounded-md shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium">{value || "N/A"}</p>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border overflow-y-auto max-h-[90vh]">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold">{enquiry.projectName}</DialogTitle>
              <DialogDescription>
                Submitted on {format(new Date(enquiry.createdAt), "MMMM d, yyyy 'at' h:mm a")}
              </DialogDescription>
            </div>
            <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary uppercase">
              {enquiry.projectType}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 py-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <User className="h-4 w-4" /> Client Information
            </h3>
            <DetailRow icon={User} label="Client Name" value={enquiry.clientName} />
            <DetailRow icon={Building} label="Company Name" value={enquiry.companyName} />
            <DetailRow icon={Mail} label="Email Address" value={enquiry.email} />
            <DetailRow icon={Phone} label="Contact Number" value={enquiry.mobile} />
            <DetailRow icon={MapPin} label="Client Location" value={enquiry.location} />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Project Details
            </h3>
            <DetailRow icon={MapPin} label="Project Location" value={enquiry.projectLocation} />
            <DetailRow icon={DollarSign} label="Estimated Budget" value={enquiry.estimatedBudget} />
            <DetailRow icon={Clock} label="Expected Timeline" value={enquiry.timelineExpected} />
            <DetailRow icon={FileText} label="Source" value={enquiry.sourceOfEnquiry} />
          </div>
        </div>

        <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border">
          <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" /> Requirement Description
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {enquiry.requirementDescription}
          </p>
          {enquiry.specificRequirements && (
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-2">
                Specific Requirements
              </h4>
              <p className="text-sm text-muted-foreground italic">"{enquiry.specificRequirements}"</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
