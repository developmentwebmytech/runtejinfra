import mongoose, { Schema, type Document } from "mongoose"

export interface IOurfirm extends Document {
  name: string
  image: string
  slug: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const OurfirmSchema = new Schema<IOurfirm>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Partner image is required"],
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

OurfirmSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  }
  next()
})

export default mongoose.models.Ourfirm ||
  mongoose.model<IOurfirm>("Ourfirm", OurfirmSchema)
