import mongoose, { Schema, Document } from "mongoose";

/* ────────── TypeScript shape ────────── */
export interface ITestimonial extends Document {
  name: string;         // e.g., "Deepak Singh"
  quote: string;        // the testimonial text
  imageUrl: string;     // full URL for the avatar / photo
}

/* ────────── Mongoose schema ────────── */
const TestimonialSchema: Schema = new Schema(
  {
    name:      { type: String, required: true, trim: true },
    quote:     { type: String, required: true, trim: true },
    imageUrl:  { type: String,  },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

/* ───── Avoid model re‑compile in Next.js hot‑reload ───── */
export default mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
