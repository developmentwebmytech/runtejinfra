"use client"

import type React from "react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input" // Updated import path for Input component to match codebase structure

interface FormData {
  fullName: string
  mobileNumber: string
  email: string
  currentLocation: string
  willingsToRelocate: string
  positionAppliedFor: string
  totalYearsExperience: string
  constructionExperienceType: string
  currentOrganization: string
  noticePeriod: string
  highestQualification: string
  keyTechnicalSkills: string
  certifications: string
  resume: File | null
  declaration: boolean
}

export default function EmployeeCareersPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    mobileNumber: "",
    email: "",
    currentLocation: "",
    willingsToRelocate: "",
    positionAppliedFor: "",
    totalYearsExperience: "",
    constructionExperienceType: "",
    currentOrganization: "",
    noticePeriod: "",
    highestQualification: "",
    keyTechnicalSkills: "",
    certifications: "",
    resume: null,
    declaration: false,
  })
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File size exceeded",
          description: "Max size is 5MB. Please choose a smaller file.",
          variant: "destructive",
        })
        e.target.value = "" // clear input
        return
      }
      setFormData((prev) => ({ ...prev, resume: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "resume") {
          formDataToSend.append(key, value as string)
        }
      })

      if (formData.resume) {
        // Validation check before sending
        if (formData.resume.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please upload a file smaller than 5MB",
            variant: "destructive",
          })
          setIsSubmitting(false)
          return
        }
        formDataToSend.append("resume", formData.resume)
      }

      const response = await fetch("/api/admin/employee-careers", {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        toast({ title: "Success", description: "Application submitted successfully!" })
        // Reset form
        setFormData({
          fullName: "",
          mobileNumber: "",
          email: "",
          currentLocation: "",
          willingsToRelocate: "",
          positionAppliedFor: "",
          totalYearsExperience: "",
          constructionExperienceType: "",
          currentOrganization: "",
          noticePeriod: "",
          highestQualification: "",
          keyTechnicalSkills: "",
          certifications: "",
          resume: null,
          declaration: false,
        })
      } else {
        const data = await response.json()
        throw new Error(data.message || "Submission failed")
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Employee Application Form</h1>
          <p className="text-gray-600">Complete all sections to apply for a position</p>
        </div>

        {/* Form Container - Card-based layout */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Personal Details Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">Personal Details</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Full Name*</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Mobile*</label>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Current Location*</label>
                  <input
                    type="text"
                    name="currentLocation"
                    value={formData.currentLocation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                    Willing to Relocate*
                  </label>
                  <select
                    name="willingsToRelocate"
                    value={formData.willingsToRelocate}
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
          </div>

          {/* Section 2: Professional Details Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">Professional Details</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Position Applied*</label>
                  <input
                    type="text"
                    name="positionAppliedFor"
                    value={formData.positionAppliedFor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                    Years of Experience*
                  </label>
                  <input
                    type="text"
                    name="totalYearsExperience"
                    value={formData.totalYearsExperience}
                    onChange={handleInputChange}
                    placeholder="e.g., 5"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Notice Period*</label>
                  <input
                    type="text"
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleInputChange}
                    placeholder="e.g., 30 days"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                    Construction Experience Type
                  </label>
                  <select
                    name="constructionExperienceType"
                    value={formData.constructionExperienceType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select type</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Govt Projects">Govt Projects</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                    Current Organization
                  </label>
                  <input
                    type="text"
                    name="currentOrganization"
                    value={formData.currentOrganization}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Education & Skills Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">Education & Skills</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                  Highest Qualification*
                </label>
                <input
                  type="text"
                  name="highestQualification"
                  value={formData.highestQualification}
                  onChange={handleInputChange}
                  placeholder="e.g., Bachelor in Civil Engineering"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Key Technical Skills</label>
                <textarea
                  name="keyTechnicalSkills"
                  value={formData.keyTechnicalSkills}
                  onChange={handleInputChange}
                  placeholder="e.g., AutoCAD, Site Execution, Billing, Safety"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                  Certifications (if any)
                </label>
                <textarea
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleInputChange}
                  placeholder="List any certifications"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Document Upload Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">Upload Documents</h2>
            </div>

            <div className="p-6">
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                Resume (PDF/DOC, Max 5MB)*
              </label>
              <Input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
                className="cursor-pointer"
              />
              {formData.resume && <p className="mt-2 text-xs text-green-600 font-semibold">✓ {formData.resume.name}</p>}
            </div>
          </div>

          {/* Section 5: Declaration Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">Declaration</h2>
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
                  I declare that the information provided is true and accurate. I understand that submission of this
                  form does not guarantee employment.
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
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>

        {/* Footer Note */}
        {/* Legal Declaration */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mt-6">
          <div className="bg-green-50 border-l-4 border-green-500 px-6 py-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase">Legal Declaration</h2>
          </div>

          <div className="p-4">
            <p className="text-base text-semibold text-black leading-relaxed">
              The company reserves the right to shortlist candidates based on internal evaluation criteria. Any form of
              misrepresentation may lead to disqualification at any stage.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
