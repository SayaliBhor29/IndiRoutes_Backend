import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    points: {
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

const Warehouse =
  mongoose.models.Warehouse ||
  mongoose.model("Warehouse", warehouseSchema);

export default Warehouse;