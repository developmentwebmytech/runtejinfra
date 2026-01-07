import mongoose, { Document, Schema } from "mongoose"

export interface IClientEnquiry extends Document {
  // Client Information
  clientName: string
  companyName?: string
  mobile: string
  email: string
  location: string

  // Project Details
  projectName: string
  projectLocation: string
  projectType: string
  estimatedBudget?: string
  timelineExpected?: string

  // Nature of Requirement
  requirementDescription: string
  specificRequirements?: string

  // Additional
  sourceOfEnquiry?: string

  // Attachments ✅
  attachments?: string[]

  // Consent
  consent: boolean

  // Metadata
  createdAt: Date
  updatedAt: Date
}

const ClientEnquirySchema = new Schema<IClientEnquiry>(
  {
    // Client Information
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    // Project Details
    projectName: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    projectLocation: {
      type: String,
      required: [true, "Project location is required"],
      trim: true,
    },
    projectType: {
      type: String,
      required: [true, "Project type is required"],
      enum: [
        "Residential Construction",
        "Commercial Construction",
        "Industrial Construction",
        "Infrastructure Development",
        "Renovation/Remodeling",
        "Other",
      ],
    },
    estimatedBudget: {
      type: String,
      trim: true,
    },
    timelineExpected: {
      type: String,
      trim: true,
    },

    // Nature of Requirement
    requirementDescription: {
      type: String,
      required: [true, "Requirement description is required"],
      trim: true,
    },
    specificRequirements: {
      type: String,
      trim: true,
    },

    // Additional
    sourceOfEnquiry: {
      type: String,
      enum: ["Website", "Referral", "Advertisement", "Social Media", "Other"],
    },

    // Attachments ✅
    attachments: {
      type: [String],
      default: [],
    },

    // Consent
    consent: {
      type: Boolean,
      required: [true, "Consent is required"],
      validate: {
        validator: (v: boolean) => v === true,
        message: "You must accept the terms and conditions",
      },
    },
  },
  {
    timestamps: true,
  }
)

// Prevent model overwrite during hot-reload
const ClientEnquiry =
  mongoose.models.ClientEnquiry ||
  mongoose.model<IClientEnquiry>("ClientEnquiry", ClientEnquirySchema)

export default ClientEnquiry
