"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  FileText,
  Building,
  Download,
} from "lucide-react"

interface EnquiryDetailsModalProps {
  enquiry: any
  isOpen: boolean
  onClose: () => void
}

export function EnquiryDetailsModal({
  enquiry,
  isOpen,
  onClose,
}: EnquiryDetailsModalProps) {
  if (!enquiry) return null

  const DetailRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any
    label: string
    value: string
  }) => (
    <div className="flex items-start gap-3 py-3 border-b last:border-0">
      <div className="p-2 bg-muted rounded-md">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase">{label}</p>
        <p className="text-sm font-medium">{value || "N/A"}</p>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="container mx-auto overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="text-2xl font-bold">
                {enquiry.projectName}
              </DialogTitle>
              <DialogDescription>
                Submitted on{" "}
                {format(new Date(enquiry.createdAt), "dd MMM yyyy, hh:mm a")}
              </DialogDescription>
            </div>

            <Badge variant="outline">{enquiry.projectType}</Badge>
          </div>
        </DialogHeader>

        {/* Client Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <h3 className="font-bold mb-2 flex gap-2">
              <User className="h-4 w-4" /> Client Info
            </h3>
            <DetailRow icon={User} label="Client Name" value={enquiry.clientName} />
            <DetailRow icon={Building} label="Company" value={enquiry.companyName} />
            <DetailRow icon={Mail} label="Email" value={enquiry.email} />
            <DetailRow icon={Phone} label="Mobile" value={enquiry.mobile} />
            <DetailRow icon={MapPin} label="Location" value={enquiry.location} />
          </div>

          {/* Project Info */}
          <div>
            <h3 className="font-bold mb-2 flex gap-2">
              <Briefcase className="h-4 w-4" /> Project Info
            </h3>
            <DetailRow icon={MapPin} label="Project Location" value={enquiry.projectLocation} />
            <DetailRow icon={DollarSign} label="Budget" value={enquiry.estimatedBudget} />
            <DetailRow icon={Clock} label="Timeline" value={enquiry.timelineExpected} />
            <DetailRow icon={FileText} label="Source" value={enquiry.sourceOfEnquiry} />
          </div>
        </div>

        {/* Requirement */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h3 className="font-bold mb-2 flex gap-2">
            <FileText className="h-4 w-4" /> Requirement
          </h3>
          <p className="text-sm whitespace-pre-wrap">
            {enquiry.requirementDescription}
          </p>

          {enquiry.specificRequirements && (
            <p className="mt-3 text-sm italic text-muted-foreground">
              {enquiry.specificRequirements}
            </p>
          )}
        </div>

        {/* Attachments */}
        {enquiry.attachments?.length > 0 && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h3 className="font-bold mb-3 flex gap-2">
              <FileText className="h-4 w-4" /> Attachments
            </h3>

            <ul className="space-y-2">
              {enquiry.attachments.map((file: string, index: number) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="truncate">
                    {file.split("/").pop()}
                  </span>

                  <a
                    href={file}
                    target="_blank"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <Download className="h-4 w-4" />
                    View
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
