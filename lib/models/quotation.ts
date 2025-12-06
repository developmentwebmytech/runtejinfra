// models/Quotation.ts
import { Schema, model, models } from "mongoose";

const QuotationSchema = new Schema(
  {
    title: { type: String, enum: ["Mr", "Ms"], required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    projectType: { type: String, enum: ["Residential", "Commercial", "Industrial"], required: true },
    pinCode: { type: String, required: true },
    budget: { type: String, required: true },
  },
  { timestamps: true }
);

export const Quotation = models.Quotation || model("Quotation", QuotationSchema);
