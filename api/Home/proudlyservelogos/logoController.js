import Logo from "../../../models/Logo.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Create Multiple Logos
export const createLogos = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one logo."
      });
    }

    const logos = req.files.map((file) => ({
      image: file.path.replace(/\\/g, "/"), // Normalize path to use forward slashes
    }));

    const savedLogos = await Logo.insertMany(logos);

    res.status(201).json({
      success: true,
      message: "Logos uploaded successfully.",
      data: savedLogos,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Logos
export const getAllLogos = async (req, res, next) => {
  try {
    const logos = await Logo.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: logos,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Logo
export const getLogoById = async (req, res, next) => {
  try {
    const logo = await Logo.findById(req.params.id);

    if (!logo) {
      return res.status(404).json({
        success: false,
        message: "Logo not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: logo,
    });
  } catch (error) {
    next(error);
  }
};

// Update Logo
export const updateLogo = async (req, res, next) => {
  try {
    const logo = await Logo.findById(req.params.id);

    if (!logo) {
      return res.status(404).json({
        success: false,
        message: "Logo not found.",
      });
    }

    if (req.file) {
      // Delete the old image file if a new one is uploaded
      if (logo.image) {
        // Construct the absolute path from the project root
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        // Go up three directories to the project root from api/Home/proudlyservelogos
        const oldImagePath = path.resolve(__dirname, "../../../", logo.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Error deleting old logo image:", err);
          }
        });
      }
      logo.image = req.file.path.replace(/\\/g, "/"); // Normalize path
    }

    await logo.save();

    res.status(200).json({
      success: true,
      message: "Logo updated successfully.",
      data: logo,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Logo
export const deleteLogo = async (req, res, next) => {
  try {
    const logo = await Logo.findById(req.params.id);

    if (!logo) {
      return res.status(404).json({ success: false, message: "Logo not found." });
    }

    // Delete the image file from the filesystem
    // Construct the absolute path from the project root
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // Go up three directories to the project root from api/Home/proudlyservelogos
    const imagePath = path.resolve(__dirname, "../../../", logo.image);
    fs.unlink(imagePath, (err) => {
      if (err) {
        // Log the error but don't block the response
        console.error("Error deleting logo image file:", err);
      }
    });

    await Logo.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Logo deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};