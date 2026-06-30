import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // from Clerk
    company: { type: String, required: true },
    role: { type: String, required: true },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },
    jobUrl: { type: String },
    salary: { type: String },
    location: { type: String },
    isRemote: { type: Boolean, default: false },
    dateApplied: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.model("Application", applicationSchema);
