// import express from "express";
// import {
//   getServices,
//   getServiceById,
//   createService,
//   updateService,
//   deleteService,
// } from "./ServiceController.js";
// import upload from "../../../middleware/upload.js";

// const router = express.Router();

// // Public routes
// router.get("/", getServices);
// router.get("/:id", getServiceById);

// // Admin routes
// router.post("/", upload.single("image"), createService);
// router.put("/:id", upload.single("image"), updateService);
// router.delete("/:id", deleteService);

// export default router;


import express from "express";

import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "./ServiceController.js";

import upload from "../../../middleware/upload.js";

const router = express.Router();


// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get all active services
router.get("/", getServices);

// Get service by ID
router.get("/:id", getServiceById);


// ==========================================
// ADMIN ROUTES
// ==========================================

// Create service with S3 image upload
router.post(
  "/",
  upload.single("image"),
  createService
);


// Update service with optional S3 image upload
router.put(
  "/:id",
  upload.single("image"),
  updateService
);


// Delete service
router.delete(
  "/:id",
  deleteService
);


export default router;