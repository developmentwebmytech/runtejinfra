"use client"

import type React from "react"
import { useState } from "react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"

interface FormData {
  firmName: string
  contactPersonName: string
  mobileNumber: string
  email: string
  registeredOfficeAddress: string
  vendorCategory: string
  materialServiceDescription: string
  yearsOfExperience: string
  gstNumber: string
  panNumber: string
  msmeRegistration: string
  pfEsiApplicable: string
  gstCertificate: File | null
  panCard: File | null
  companyProfile: File | null
  declaration: boolean
}

export default function VendorRegistrationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    firmName: "",
    contactPersonName: "",
    mobileNumber: "",
    email: "",
    registeredOfficeAddress: "",
    vendorCategory: "",
    materialServiceDescription: "",
    yearsOfExperience: "",
    gstNumber: "",
    panNumber: "",
    msmeRegistration: "",
    pfEsiApplicable: "",
    gstCertificate: null,
    panCard: null,
    companyProfile: null,
    declaration: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be smaller than 5MB")
      e.target.value = ""
      return
    }

    const fieldName = e.target.name as keyof Pick<FormData, "gstCertificate" | "panCard" | "companyProfile">
    setFormData((prev) => ({ ...prev, [fieldName]: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.declaration) {
      toast.error("Please accept the declaration")
      return
    }

    if (!formData.gstCertificate || !formData.panCard) {
      toast.error("Please upload GST Certificate and PAN Card")
      return
    }

    setIsSubmitting(true)
    toast.loading("Submitting registration...", { id: "submit" })

    try {
      const payload = new FormData()

      Object.entries(formData).forEach(([key, value]) => {
        if (!["gstCertificate", "panCard", "companyProfile"].includes(key)) {
          payload.append(key, String(value))
        }
      })

      if (formData.gstCertificate) payload.append("gstCertificate", formData.gstCertificate)
      if (formData.panCard) payload.append("panCard", formData.panCard)
      if (formData.companyProfile) payload.append("companyProfile", formData.companyProfile)

      const res = await fetch("/api/admin/vendor-registration", {
        method: "POST",
        body: payload,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Submission failed")
      }

      toast.success("Registration submitted successfully!", { id: "submit" })

      setFormData({
        firmName: "",
        contactPersonName: "",
        mobileNumber: "",
        email: "",
        registeredOfficeAddress: "",
        vendorCategory: "",
        materialServiceDescription: "",
        yearsOfExperience: "",
        gstNumber: "",
        panNumber: "",
        msmeRegistration: "",
        pfEsiApplicable: "",
        gstCertificate: null,
        panCard: null,
        companyProfile: null,
        declaration: false,
      })
    } catch (err: any) {
      toast.error(err.message || "Something went wrong", { id: "submit" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Vendor / Contractor Registration</h1>
          <p className="text-gray-600">
            We invite qualified vendors, suppliers, and contractors to register for potential collaboration on our
            ongoing and upcoming projects.
          </p>
        </div>

        {/* Form Container - Card-based layout */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Firm Details Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">🔹 Firm Details</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                    Firm / Company Name*
                  </label>
                  <input
                    type="text"
                    name="firmName"
                    value={formData.firmName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                    Contact Person Name*
                  </label>
                  <input
                    type="text"
                    name="contactPersonName"
                    value={formData.contactPersonName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Mobile Number*</label>
                  <input
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "")
                      if (value.length <= 10) {
                        setFormData((prev) => ({ ...prev, mobileNumber: value }))
                      }
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Email Address*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                    Registered Office Address*
                  </label>
                  <input
                    type="text"
                    name="registeredOfficeAddress"
                    value={formData.registeredOfficeAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Business Details Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">🔹 Business Details</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Vendor Category*</label>
                <select
                  name="vendorCategory"
                  value={formData.vendorCategory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Vendor Category</option>
                  <option value="Material Supplier">Material Supplier</option>
                  <option value="Labour Contractor">Labour Contractor</option>
                  <option value="Equipment / Machinery Provider">Equipment / Machinery Provider</option>
                  <option value="Transport / Logistics">Transport / Logistics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                  Material / Service Description*
                </label>
                <textarea
                  name="materialServiceDescription"
                  value={formData.materialServiceDescription}
                  onChange={handleInputChange}
                  placeholder="Describe the materials or services you provide"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Statutory & Compliance Details Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">🔹 Statutory & Compliance Details</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                    Years of Experience*
                  </label>
                  <input
                    type="text"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    placeholder="e.g., 5"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">GST Number*</label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., 27AABCT1234H1Z0"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">PAN Number*</label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., AAABR5055K"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">MSME Registration*</label>
                  <select
                    name="msmeRegistration"
                    value={formData.msmeRegistration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">PF / ESI Applicable*</label>
                <select
                  name="pfEsiApplicable"
                  value={formData.pfEsiApplicable}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Upload Mandatory Documents Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">🔹 Upload Mandatory Documents</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">GST Certificate*</label>
                <Input
                  name="gstCertificate"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  required
                  className="cursor-pointer"
                />
                {formData.gstCertificate && (
                  <p className="mt-2 text-xs text-green-600 font-semibold">✓ {formData.gstCertificate.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">PAN Card*</label>
                <Input
                  name="panCard"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  required
                  className="cursor-pointer"
                />
                {formData.panCard && (
                  <p className="mt-2 text-xs text-green-600 font-semibold">✓ {formData.panCard.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                  Company Profile (Optional)
                </label>
                <Input
                  name="companyProfile"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {formData.companyProfile && (
                  <p className="mt-2 text-xs text-green-600 font-semibold">✓ {formData.companyProfile.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 5: Declaration Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">🔹 Declaration (Mandatory)</h2>
            </div>

            <div className="p-6">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="declaration"
                  checked={formData.declaration}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 accent-green-500 cursor-pointer"
                  required
                />
                <span className="text-sm text-gray-700">
                  I understand that registration does not guarantee work allocation and is subject to internal approval
                  and verification.
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 px-12 rounded-lg text-sm uppercase transition-colors shadow-md"
            >
              {isSubmitting ? "Registering..." : "Submit Registration"}
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mt-6">
          <div className="bg-green-50 border-l-4 border-green-500 px-6 py-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase">🔐 Legal Disclaimer</h2>
          </div>

          <div className="p-4">
            <p className="text-base text-gray-900 leading-relaxed">
              Vendor registration is subject to verification, audit requirements, and company procurement policies. The
              company reserves the right to accept or reject any registration without assigning reasons.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
