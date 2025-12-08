import mongoose from "mongoose"

// Helper function to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

const mediaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    link: {
      type: String,
      default: null,
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Please add an image"],
    },
    fileName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["landscape", "portrait", "abstract", "nature", "other"],
      default: "other",
    },
    tags: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

mediaSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = generateSlug(this.title)
  }
  next()
})

export const Media = mongoose.models.Media || mongoose.model("Media", mediaSchema)
