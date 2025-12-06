// lib/models/postcontact.ts
import mongoose from "mongoose";

const schema = new mongoose.Schema({
  instagram: String,
  twitter:   String,
  whatsapp:  String,
  facebook:  String,
  linkedin:  String,
  mapUrl:    String,
  phone:     String,
});

export const ContactPost =
  mongoose.models.ContactPost ||
  mongoose.model("ContactPost", schema);
