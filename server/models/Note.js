import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Note", noteSchema);
