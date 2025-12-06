// lib/validation/milestoneSchema.ts
import { z } from "zod";

export const milestoneSchema = z.object({
  projectsCompleted: z.string().regex(/^\d+$/, "Must be a number"),
  buildingsConstructed: z.string().regex(/^\d+$/, "Must be a number"),
  workersEmployed: z.string().regex(/^\d+$/, "Must be a number"),
  yearsOfExperience: z.string().regex(/^\d+$/, "Must be a number"),
});
