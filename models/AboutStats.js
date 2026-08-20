import mongoose from "mongoose";

const aboutStatsSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: [true, "Value is required"],
      trim: true,
    },

    label: {
      type: String,
      required: [true, "Label is required"],
      enum: [
        "Fleet Size",
        "Cities Served",
        "Pan India Presence",
        "Franchise Partners",
        "Associated Branches",
      ],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const AboutStats = mongoose.model("AboutStats", aboutStatsSchema);

export default AboutStats;