// models/service.model.ts
import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  category: String,
  imageUrl: String,
});

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);
