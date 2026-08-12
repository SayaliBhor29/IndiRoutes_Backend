import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Gallery from "../../../models/Gallery.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteImageFile = (image) => {
  if (!image) return;

  const imagePath = path.resolve(__dirname, "../../../", image);
  fs.unlink(imagePath, (error) => {
    if (error && error.code !== "ENOENT") {
      console.error("Error deleting gallery image:", error);
    }
  });
};

// CREATE MULTIPLE GALLERY IMAGES
export const createGalleryImages = async (req, res, next) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one gallery image.",
      });
    }

    const images = req.files.map((file) => ({
      image: file.path.replace(/\\/g, "/"),
    }));
    const galleryImages = await Gallery.insertMany(images);

    res.status(201).json({
      success: true,
      message: "Gallery images uploaded successfully.",
      data: galleryImages,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL
export const getAllGalleryImages = async (req, res, next) => {
  try {
    const galleryImages = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: galleryImages });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE
export const getGalleryImageById = async (req, res, next) => {
  try {
    const galleryImage = await Gallery.findById(req.params.id);
    if (!galleryImage) {
      return res.status(404).json({ success: false, message: "Gallery image not found." });
    }

    res.status(200).json({ success: true, data: galleryImage });
  } catch (error) {
    next(error);
  }
};

// UPDATE SINGLE
export const updateGalleryImage = async (req, res, next) => {
  try {
    const galleryImage = await Gallery.findById(req.params.id);
    if (!galleryImage) {
      return res.status(404).json({ success: false, message: "Gallery image not found." });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "New gallery image is required." });
    }

    deleteImageFile(galleryImage.image);
    galleryImage.image = req.file.path.replace(/\\/g, "/");
    await galleryImage.save();

    res.status(200).json({
      success: true,
      message: "Gallery image updated successfully.",
      data: galleryImage,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE SINGLE
export const deleteGalleryImage = async (req, res, next) => {
  try {
    const galleryImage = await Gallery.findById(req.params.id);
    if (!galleryImage) {
      return res.status(404).json({ success: false, message: "Gallery image not found." });
    }

    deleteImageFile(galleryImage.image);
    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Gallery image deleted successfully." });
  } catch (error) {
    next(error);
  }
};
