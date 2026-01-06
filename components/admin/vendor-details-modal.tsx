"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Copy, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"

interface VendorDetailsModalProps {
  vendor: any | null
  isOpen: boolean
  onClose: () => void
}

export function VendorDetailsModal({ vendor, isOpen, onClose }: VendorDetailsModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!vendor) return null

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{vendor.firmName}</DialogTitle>
          <DialogDescription>Complete vendor registration details</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Firm Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground uppercase text-xs tracking-widest">Firm Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Contact Person</p>
                <p className="font-medium text-sm">{vendor.contactPersonName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Mobile Number</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{vendor.mobileNumber}</p>
                  <button
                    onClick={() => copyToClipboard(vendor.mobileNumber, "mobile")}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    {copiedField === "mobile" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-1 col-span-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Email Address</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm break-all">{vendor.email}</p>
                  <button
                    onClick={() => copyToClipboard(vendor.email, "email")}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    {copiedField === "email" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-1 col-span-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Registered Office Address</p>
                <p className="font-medium text-sm">{vendor.registeredOfficeAddress}</p>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground uppercase text-xs tracking-widest">Business Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Vendor Category</p>
                <Badge variant="outline" className="w-fit">
                  {vendor.vendorCategory}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Years of Experience</p>
                <p className="font-medium text-sm">{vendor.yearsOfExperience} years</p>
              </div>
              <div className="space-y-1 col-span-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Material / Service Description</p>
                <p className="font-medium text-sm">{vendor.materialServiceDescription}</p>
              </div>
            </div>
          </div>

          {/* Statutory & Compliance */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground uppercase text-xs tracking-widest">Statutory & Compliance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">GST Number</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono font-medium text-sm">{vendor.gstNumber}</p>
                  <button
                    onClick={() => copyToClipboard(vendor.gstNumber, "gst")}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    {copiedField === "gst" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">PAN Number</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono font-medium text-sm">{vendor.panNumber}</p>
                  <button
                    onClick={() => copyToClipboard(vendor.panNumber, "pan")}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    {copiedField === "pan" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">MSME Registration</p>
                <Badge variant={vendor.msmeRegistration === "Yes" ? "default" : "outline"}>
                  {vendor.msmeRegistration}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">PF / ESI Applicable</p>
                <Badge variant={vendor.pfEsiApplicable === "Yes" ? "default" : "outline"}>
                  {vendor.pfEsiApplicable}
                </Badge>
              </div>
            </div>
          </div>

          {/* Document Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground uppercase text-xs tracking-widest">Uploaded Documents</h3>
            <div className="space-y-2">
              {vendor.gstCertificateUrl && (
                <a href={vendor.gstCertificateUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full justify-between bg-transparent" asChild>
                    <span>
                      GST Certificate <ExternalLink className="h-4 w-4" />
                    </span>
                  </Button>
                </a>
              )}
              {vendor.panCardUrl && (
                <a href={vendor.panCardUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full justify-between bg-transparent" asChild>
                    <span>
                      PAN Card <ExternalLink className="h-4 w-4" />
                    </span>
                  </Button>
                </a>
              )}
              {vendor.companyProfileUrl && (
                <a href={vendor.companyProfileUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full justify-between bg-transparent" asChild>
                    <span>
                      Company Profile <ExternalLink className="h-4 w-4" />
                    </span>
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Registration Date */}
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Registration Date</p>
            <p className="font-medium text-sm">{format(new Date(vendor.createdAt), "MMMM d, yyyy 'at' h:mm a")}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
