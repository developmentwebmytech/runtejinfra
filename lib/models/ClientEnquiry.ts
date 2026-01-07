import mongoose, { Document, Schema } from "mongoose"

export interface IClientEnquiry extends Document {
  clientName: string
  companyName?: string
  mobile: string
  email: string
  location: string

  projectType: string
  projectArea?: string
  estimatedBudget?: string
  timelineExpected?: string

  requirementDescription: string
  sourceOfEnquiry?: string

  attachments?: string[]
  consent: boolean

  createdAt: Date
  updatedAt: Date
}

const ClientEnquirySchema = new Schema<IClientEnquiry>(
  {
    // Client Info
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },

    // Project Details
    projectType: {
      type: String,
      required: true,
      enum: [
        "Residential",
        "Commercial",
        "Industrial",
        "Road / Infrastructure",
        "Renovation",
        "Govt / Tender Project",
      ],
    },
    projectArea: {
      type: String,
      trim: true,
    },
    estimatedBudget: {
      type: String,
      trim: true,
    },
    timelineExpected: {
      type: String,
      trim: true,
    },

    // Requirement
    requirementDescription: {
      type: String,
      required: true,
      trim: true,
    },

    // Extra
    sourceOfEnquiry: {
      type: String,
      trim: true,
    },

    // Files
    attachments: {
      type: [String],
      default: [],
    },

    // Consent
    consent: {
      type: Boolean,
      required: true,
      validate: {
        validator: (v: boolean) => v === true,
        message: "Consent is required",
      },
    },
  },
  { timestamps: true }
)

const ClientEnquiry =
  mongoose.models.ClientEnquiry ||
  mongoose.model<IClientEnquiry>("ClientEnquiry", ClientEnquirySchema)

export default ClientEnquiry
