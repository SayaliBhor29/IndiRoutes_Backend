import express from "express";
import upload from "../../../middleware/upload.js";

import {
  createLogos,
  getAllLogos,
  getLogoById,
  updateLogo,
  deleteLogo,
} from "./logoController.js";

const router = express.Router();

// Multiple Upload
router.post("/create", upload.array("images", 20), createLogos);

// Get All
router.get("/all", getAllLogos);

// Get Single
router.get("/:id", getLogoById);

// Update Single Logo
router.put("/update/:id", upload.single("image"), updateLogo);

// Delete
router.delete("/delete/:id", deleteLogo);

export default router;