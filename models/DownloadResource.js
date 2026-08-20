import mongoose from "mongoose";

const downloadResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    type: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: ["pdf", "ppt", "excel"],
    },
    file: { type: String, required: true },
    originalName: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("DownloadResource", downloadResourceSchema);
