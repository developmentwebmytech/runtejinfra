// lib/models/contact.ts
import mongoose, { Schema, models } from "mongoose";

const ContactSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    topic: String,
    message: String,
  },
  { timestamps: true }
);

export const Contact =
  models?.Contact || mongoose.model("Contact", ContactSchema);
