import mongoose, { Schema, type Document } from "mongoose"

export interface IPartner extends Document {
  name: string
  titleName: string
  image: string
  slug: string
  createdAt: Date
  updatedAt: Date
}

const partnerSchema = new Schema<IPartner>(
  {
    name: {
      type: String,
      trim: true,
    },
    titleName: {
      type: String,
      required: [true, "Title name is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Partner image is required"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

partnerSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  }
  next()
})

export default mongoose.models.Partner || mongoose.model<IPartner>("Partner", partnerSchema)
