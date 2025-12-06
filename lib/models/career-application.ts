// models/CareerApplication.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICareerApplication extends Document {
  post: string;
  name: string;
  email: string;
  location: string;
  phone: string;
  qualifications: string;
  company: string;
  designation: string;
  tenure: string;
  reason: string;
  // resumeUrl?: string   // add when you store the PDF link
}

const CareerApplicationSchema: Schema = new Schema(
  {
    post: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    qualifications: String,
    company: String,
    designation: String,
    tenure: String,
    reason: String,
    // resumeUrl: String,
  },
  { timestamps: true } // adds createdAt & updatedAt
);

// ✅ Avoid model overwrite in hot‑reload
export default mongoose.models.CareerApplication ||
  mongoose.model<ICareerApplication>("CareerApplication", CareerApplicationSchema);
