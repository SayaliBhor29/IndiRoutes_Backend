import express from "express";

import {
  getIndustries,
  getIndustryById,
  createIndustry,
  updateIndustry,
  deleteIndustry,
} from "./industryController.js";

const router = express.Router();

// Public
router.get("/", getIndustries);
router.get("/:id", getIndustryById);

// Admin
router.post("/", createIndustry);
router.put("/:id", updateIndustry);
router.delete("/:id", deleteIndustry);

export default router;