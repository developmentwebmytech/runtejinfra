import mongoose, { Schema, type Document } from "mongoose"

export interface IVendor extends Document {
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
  gstCertificateUrl: string
  panCardUrl: string
  companyProfileUrl?: string
  declaration: boolean
  createdAt: Date
  updatedAt: Date
}

const VendorSchema: Schema = new Schema(
  {
    firmName: { type: String, required: true },
    contactPersonName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true },
    registeredOfficeAddress: { type: String, required: true },
    vendorCategory: { type: String, required: true },
    materialServiceDescription: { type: String, required: true },
    yearsOfExperience: { type: String, required: true },
    gstNumber: { type: String, required: true },
    panNumber: { type: String, required: true },
    msmeRegistration: { type: String, required: true },
    pfEsiApplicable: { type: String, required: true },
    gstCertificateUrl: { type: String, required: true },
    panCardUrl: { type: String, required: true },
    companyProfileUrl: String,
    declaration: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
)

export default mongoose.models.Vendor || mongoose.model<IVendor>("Vendor", VendorSchema)
