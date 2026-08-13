import express from "express";

import {
  createFleetStat,
  getFleetStats,
  getAllFleetStats,
  getFleetStatById,
  updateFleetStat,
  deleteFleetStat,
} from "./FleetStatController.js";

const router = express.Router();

// Public
router.get("/", getFleetStats);

// Admin
router.get("/all", getAllFleetStats);
router.get("/:id", getFleetStatById);
router.post("/", createFleetStat);
router.put("/:id", updateFleetStat);
router.delete("/:id", deleteFleetStat);

export default router;