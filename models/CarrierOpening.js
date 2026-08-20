import mongoose from "mongoose";

const carrierOpeningSchema = new mongoose.Schema(
  {
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

    details: {
      type: [String],
      required: true,
      default: [],
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

const CarrierOpening =
  mongoose.models.CarrierOpening ||
  mongoose.model(
    "CarrierOpening",
    carrierOpeningSchema
  );

export default CarrierOpening;