"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Building, Copy, CheckCircle2, ArrowLeft, ExternalLink } from "lucide-react"
import { format } from "date-fns"

interface VendorDetailsPageProps {
  params: { id: string }
}

export default function VendorDetailsPage({ params }: VendorDetailsPageProps) {
  const router = useRouter()
  const [vendor, setVendor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await fetch("/api/admin/vendor-registration")
        const data = await res.json()
        const vnd = Array.isArray(data) ? data.find((item: any) => item._id === params.id) : null
        setVendor(vnd || null)
      } catch (error) {
        console.error("[v0] Failed to fetch vendor:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVendor()
  }, [params?.id])

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const DetailSection = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-muted-foreground border-b border-border pb-2">
        <Icon className="h-4 w-4" />
        <h3 className="text-sm font-medium uppercase tracking-wider">{title}</h3>
      </div>
      <div className="grid gap-4 py-2">{children}</div>
    </div>
  )

  const DetailItem = ({ label, value }: { label: string; value: string | undefined }) => (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="text-sm text-foreground leading-relaxed">{value || "Not provided"}</p>
    </div>
  )

  const CopyableItem = ({ label, value, fieldName }: { label: string; value: string; fieldName: string }) => (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <div className="flex items-center gap-2">
        <p className="text-sm text-foreground font-mono">{value}</p>
        <button
          onClick={() => copyToClipboard(value, fieldName)}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          {copiedField === fieldName ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Loading vendor details...</p>
        </div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg font-medium">Vendor not found</p>
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
            <h1 className="text-2xl font-bold tracking-tight text-balance flex-1 px-4">{vendor.firmName}</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8">
          {/* Badges Section */}
          <div className="mb-8 flex flex-wrap gap-3">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-base py-2 px-4">
              {vendor.vendorCategory}
            </Badge>
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-base py-2 px-4">
              {format(new Date(vendor.createdAt), "MMM dd, yyyy")}
            </Badge>
          </div>

          {/* Scrollable Details Grid */}
          <ScrollArea className="h-[calc(100vh-240px)] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8">
              {/* Firm Details */}
              <DetailSection title="Firm Details" icon={Building}>
                <DetailItem label="Contact Person" value={vendor.contactPersonName} />
                <CopyableItem label="Mobile Number" value={vendor.mobileNumber} fieldName="mobile" />
                <CopyableItem label="Email Address" value={vendor.email} fieldName="email" />
                <DetailItem label="Registered Office Address" value={vendor.registeredOfficeAddress} />
              </DetailSection>

              {/* Business Details */}
              <DetailSection title="Business Details" icon={Building}>
                <DetailItem label="Vendor Category" value={vendor.vendorCategory} />
                <DetailItem label="Years of Experience" value={`${vendor.yearsOfExperience} years`} />
                <DetailItem label="Material / Service Description" value={vendor.materialServiceDescription} />
              </DetailSection>

              {/* Statutory & Compliance */}
              <div className="md:col-span-2">
                <DetailSection title="Statutory & Compliance" icon={Building}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CopyableItem label="GST Number" value={vendor.gstNumber} fieldName="gst" />
                    <CopyableItem label="PAN Number" value={vendor.panNumber} fieldName="pan" />
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium">MSME Registration</p>
                      <Badge variant={vendor.msmeRegistration === "Yes" ? "default" : "outline"}>
                        {vendor.msmeRegistration}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium">PF / ESI Applicable</p>
                      <Badge variant={vendor.pfEsiApplicable === "Yes" ? "default" : "outline"}>
                        {vendor.pfEsiApplicable}
                      </Badge>
                    </div>
                  </div>
                </DetailSection>
              </div>
            </div>

            {/* Document Links */}
            {(vendor.gstCertificateUrl || vendor.panCardUrl || vendor.companyProfileUrl) && (
              <div className="mt-8 p-6 bg-muted/30 rounded-lg">
                <h3 className="font-bold mb-4 flex gap-2 items-center">
                  <Building className="h-4 w-4" /> Uploaded Documents
                </h3>

                <div className="space-y-2">
                  {vendor.gstCertificateUrl && (
                    <a href={vendor.gstCertificateUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full justify-between bg-transparent">
                        <span>GST Certificate</span>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  {vendor.panCardUrl && (
                    <a href={vendor.panCardUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full justify-between bg-transparent">
                        <span>PAN Card</span>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  {vendor.companyProfileUrl && (
                    <a href={vendor.companyProfileUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full justify-between bg-transparent">
                        <span>Company Profile</span>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Registration Date */}
            <div className="mt-8 p-6 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground font-medium mb-2">Registration Date</p>
              <p className="font-medium text-sm">{format(new Date(vendor.createdAt), "MMMM d, yyyy 'at' h:mm a")}</p>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
