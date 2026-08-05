import mongoose from "mongoose";

const seoSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true, // e.g. "home", "about", "services", "contact"
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 70,
    },
    description: {
      type: String,
      required: true,
      maxlength: 160,
    },
    keywords: {
      type: [String],
      default: [],
    },
    canonicalUrl: {
      type: String,
    },
    ogTitle: String,
    ogDescription: String,
    ogImage: String, // full URL preferred
    ogType: {
      type: String,
      default: "website",
    },
    twitterCard: {
      type: String,
      default: "summary_large_image",
    },
    robots: {
      type: String,
      default: "index, follow",
    },
    structuredData: {
      type: mongoose.Schema.Types.Mixed, // JSON-LD object
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Seo", seoSchema);