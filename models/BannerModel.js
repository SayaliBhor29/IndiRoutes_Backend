import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    tagline: {
      type: String,
      required: true,
    },
    titlePrimary: {
      type: String,
      required: true,
    },
    titleHighlight: {
      type: String,
      required: true,
    },
    titleSecondary: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String, // will store image path / URL
      required: true,
    },
    primaryBtnLink: {
      type: String,
      default: "/contact",
    },
    primaryBtnText: {
      type: String,
      required: true,
    },
    secondaryBtnText: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      required: true,
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
  { timestamps: true }
);

export default mongoose.model("Banner", bannerSchema);