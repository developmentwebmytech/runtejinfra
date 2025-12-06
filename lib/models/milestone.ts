import mongoose from "mongoose";

const MilestoneSchema = new mongoose.Schema({
  projectsCompleted: { type: Number, required: true },
  buildingsConstructed: { type: Number, required: true },
  workersEmployed: { type: Number, required: true },
  yearsOfExperience: { type: Number, required: true },
});

export default mongoose.models.Milestone ||
  mongoose.model("Milestone", MilestoneSchema);
