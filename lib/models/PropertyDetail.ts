// models/project.ts
import mongoose, { Schema, type Document, models } from "mongoose"

export interface IProject extends Document {
  imageUrl: string
  name: string
  slug: string
  address: string
  description?: string
  locationLink?: string
  propertyType: mongoose.Schema.Types.ObjectId
  floor?: number
  sampleUnit?: string
  basement?: string
  totalBuiltUpArea?: string
  yearOfCompletion?: number
  category: mongoose.Schema.Types.ObjectId
  planImage?: {
    url: string
    altText?: string
    position?: number
  }[]
}

const ProjectSchema = new Schema<IProject>(
  {
    imageUrl: { type: String, required: true },

    name: { type: String, required: true },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    address: { type: String, required: true },

    description: { type: String },

    locationLink: { type: String },

    propertyType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    floor: { type: Number },

    sampleUnit: { type: String },

    basement: { type: String },

    totalBuiltUpArea: { type: String },

    yearOfCompletion: { type: Number },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    planImage: [
      {
        url: { type: String, required: true },
        altText: { type: String, default: "" },
        position: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
)

// 🔹 Auto create slug from name
ProjectSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next()

  this.slug = this.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  next()
})

export const Project =
  models.Project || mongoose.model<IProject>("Project", ProjectSchema)
