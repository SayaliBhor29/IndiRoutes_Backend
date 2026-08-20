import mongoose from "mongoose";

const fleetCardSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
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

const FleetInfrastructure = mongoose.model(
  "FleetInfrastructure",
  fleetCardSchema
);

export default FleetInfrastructure;