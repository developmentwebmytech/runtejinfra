import mongoose, { Schema, type Document } from "mongoose"

export interface IEmployeeApplication extends Document {
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
  resumeUrl: string
  declaration: boolean
  createdAt: Date
  updatedAt: Date
}

const EmployeeApplicationSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true },
    currentLocation: { type: String, required: true },
    willingsToRelocate: { type: String, required: true },
    positionAppliedFor: { type: String, required: true },
    totalYearsExperience: { type: String, required: true },
    constructionExperienceType: String,
    currentOrganization: String,
    noticePeriod: { type: String, required: true },
    highestQualification: { type: String, required: true },
    keyTechnicalSkills: String,
    certifications: String,
    resumeUrl: String,
    declaration: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
)

export default mongoose.models.EmployeeApplication ||
  mongoose.model<IEmployeeApplication>("EmployeeApplication", EmployeeApplicationSchema)
