import express from "express";
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "./ServiceController.js";

const router = express.Router();

// Public routes
router.get("/", getServices);
router.get("/:id", getServiceById);

// Admin routes
router.post("/", createService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export default router;