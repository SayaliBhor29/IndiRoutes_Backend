// import express from "express";
// import upload from "../../../middleware/upload.js";

// import {
//   createLogos,
//   getAllLogos,
//   getLogoById,
//   updateLogo,
//   deleteLogo,
// } from "./logoController.js";

// const router = express.Router();

// // Multiple Upload
// router.post("/create", upload.array("images", 20), createLogos);

// // Get All
// router.get("/all", getAllLogos);

// // Get Single
// router.get("/:id", getLogoById);

// // Update Single Logo
// router.put("/update/:id", upload.single("image"), updateLogo);

// // Delete
// router.delete("/delete/:id", deleteLogo);

// export default router;

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


// =====================================================
// CREATE MULTIPLE LOGOS
// =====================================================

router.post(
  "/create",
  upload.array("images", 20),
  createLogos
);


// =====================================================
// GET ALL LOGOS
// =====================================================

router.get(
  "/all",
  getAllLogos
);


// =====================================================
// GET SINGLE LOGO
// =====================================================

router.get(
  "/:id",
  getLogoById
);


// =====================================================
// UPDATE SINGLE LOGO
// =====================================================

router.put(
  "/update/:id",
  upload.single("image"),
  updateLogo
);


// =====================================================
// DELETE LOGO
// =====================================================

router.delete(
  "/delete/:id",
  deleteLogo
);


export default router;