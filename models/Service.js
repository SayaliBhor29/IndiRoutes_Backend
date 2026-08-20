import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["main", "service"],
      required: true,
      lowercase: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      required: true,
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
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

const Service =
  mongoose.models.OurServices ||
  mongoose.model("OurServices", serviceSchema);
export default Service;