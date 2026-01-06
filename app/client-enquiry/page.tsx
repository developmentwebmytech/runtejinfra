"use client"

import type React from "react"
import { useState } from "react"
import { Upload, X } from "lucide-react"

interface FormData {
  clientName: string
  companyName: string
  mobile: string
  email: string
  location: string
  projectName: string
  projectLocation: string
  projectType: string
  estimatedBudget: string
  timelineExpected: string
  requirementDescription: string
  specificRequirements: string
  sourceOfEnquiry: string
  consent: boolean
}

export default function ClientEnquiryPage() {
  const [formData, setFormData] = useState<FormData>({
    clientName: "",
    companyName: "",
    mobile: "",
    email: "",
    location: "",
    projectName: "",
    projectLocation: "",
    projectType: "",
    estimatedBudget: "",
    timelineExpected: "",
    requirementDescription: "",
    specificRequirements: "",
    sourceOfEnquiry: "",
    consent: false,
  })

  const [attachments, setAttachments] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      if (name === "mobile") {
        const digitsOnly = value.replace(/\D/g, "")
        setFormData((prev) => ({
          ...prev,
          [name]: digitsOnly,
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }))
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAttachments((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.clientName || !formData.email || !formData.mobile || !formData.location) {
      setError("Please fill in all required fields")
      return
    }

    if (formData.mobile && !/^[0-9]{10,15}$/.test(formData.mobile)) {
      setError("Mobile number must contain 10-15 digits only")
      return
    }

    if (!formData.consent) {
      setError("You must accept the declaration to proceed")
      return
    }

    setLoading(true)

    try {
      const submitData = new FormData()

      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, String(value))
      })

      attachments.forEach((file) => {
        submitData.append("attachments", file)
      })

      const response = await fetch("/api/admin/client-enquiry", {
        method: "POST",
        body: submitData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Failed to submit enquiry")
        return
      }

      setSubmitted(true)
      setFormData({
        clientName: "",
        companyName: "",
        mobile: "",
        email: "",
        location: "",
        projectName: "",
        projectLocation: "",
        projectType: "",
        estimatedBudget: "",
        timelineExpected: "",
        requirementDescription: "",
        specificRequirements: "",
        sourceOfEnquiry: "",
        consent: false,
      })
      setAttachments([])

      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white border-2 border-green-500 rounded-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Enquiry Submitted Successfully!</h2>
          <p className="text-gray-600">
            Thank you for your interest. Our team will review your enquiry and get back to you within 24-48 hours.
          </p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Client Enquiry Form</h1>
          <p className="text-gray-600">Complete all sections to submit your project enquiry to Runtej Infra</p>
        </div>

        {/* Form Container - Card-based layout */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Section 1: Client Information Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-green-500 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">Client Information</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Client Name*</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Mobile*</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="0-9 digits only"
                    maxLength={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Email*</label>
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
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Location*</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Project Details Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-green-500 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">Project Details</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Project Name*</label>
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Project Location*</label>
                  <input
                    type="text"
                    name="projectLocation"
                    value={formData.projectLocation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Project Type*</label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Residential Construction">Residential Construction</option>
                    <option value="Commercial Construction">Commercial Construction</option>
                    <option value="Industrial Construction">Industrial Construction</option>
                    <option value="Infrastructure Development">Infrastructure Development</option>
                    <option value="Renovation/Remodeling">Renovation/Remodeling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Estimated Budget</label>
                  <input
                    type="text"
                    name="estimatedBudget"
                    value={formData.estimatedBudget}
                    onChange={handleInputChange}
                    placeholder="e.g., 50 Lakhs"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Timeline Expected</label>
                  <input
                    type="text"
                    name="timelineExpected"
                    value={formData.timelineExpected}
                    onChange={handleInputChange}
                    placeholder="e.g., 6 months"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Nature of Requirement Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-green-500 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">Nature of Requirement</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                  Requirement Description*
                </label>
                <textarea
                  name="requirementDescription"
                  value={formData.requirementDescription}
                  onChange={handleInputChange}
                  placeholder="Describe your project requirements in detail"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                  Specific Requirements
                </label>
                <textarea
                  name="specificRequirements"
                  value={formData.specificRequirements}
                  onChange={handleInputChange}
                  placeholder="Any specific technical or design requirements"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                  Upload Drawings / BOQ / Scope (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition-colors">
                  <input
                    type="file"
                    id="attachments"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="attachments" className="flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                    <span className="text-xs text-gray-500 mt-1">PDF, DOCX (Max 5MB each)</span>
                  </label>
                </div>

                {attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border border-gray-200"
                      >
                        <span className="text-sm text-gray-700 truncate flex-1">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Additional Information Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-green-500 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">Additional Information</h2>
            </div>

            <div className="p-6">
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                How did you hear about us?
              </label>
              <select
                name="sourceOfEnquiry"
                value={formData.sourceOfEnquiry}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select source</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Advertisement">Advertisement</option>
                <option value="Social Media">Social Media</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Section 5: Declaration Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-green-500 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">Declaration</h2>
            </div>

            <div className="p-6">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 accent-green-500 cursor-pointer"
                  required
                />
                <span className="text-sm text-gray-700">
                  I authorize Runtej Infra to contact me for further discussion regarding this enquiry.
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 px-12 rounded-lg text-sm uppercase transition-colors shadow-md"
            >
              {loading ? "Submitting..." : "Submit Enquiry"}
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mt-6">
          <div className="bg-green-50 border-l-4 border-green-500 px-6 py-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase">Legal Declaration</h2>
          </div>

          <div className="p-4">
            <p className="text-base text-semibold text-black leading-relaxed">
              This enquiry is for information purposes only and does not constitute a binding offer, quotation, or contract.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
