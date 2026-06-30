import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String },
    linkedIn: { type: String },
    role: { type: String }, // e.g. 'Hiring Manager', 'Recruiter'
    notes: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Contact", contactSchema);
