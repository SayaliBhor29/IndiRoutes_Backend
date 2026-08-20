import express from "express";
import upload from "../../../middleware/upload.js";
import {
  createGalleryImages,
  deleteGalleryImage,
  getAllGalleryImages,
  getGalleryImageById,
  updateGalleryImage,
} from "./galleryController.js";

const router = express.Router();

router.post("/create", upload.array("images", 20), createGalleryImages);
router.get("/all", getAllGalleryImages);
router.get("/:id", getGalleryImageById);
router.put("/update/:id", upload.single("image"), updateGalleryImage);
router.delete("/delete/:id", deleteGalleryImage);

export default router;
