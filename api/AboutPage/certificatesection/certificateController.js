import Certificate from "../../../models/Certificate.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteImageFile = (image) => {
  if (!image) return;

  const imagePath = path.resolve(__dirname, "../../../", image);
  fs.unlink(imagePath, (error) => {
    if (error && error.code !== "ENOENT") {
      console.error("Error deleting certificate image:", error);
    }
  });
};

// CREATE
export const createCertificate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Certificate image is required",
      });
    }

    const certificate = await Certificate.create({
      image: req.file.path.replace(/\\/g, "/"),
    });

    res.status(201).json({
      success: true,
      message: "Certificate uploaded successfully",
      data: certificate,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to upload certificate",
      error: error.message,
    });
  }
};

// GET ALL
export const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: certificates,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get certificates",
      error: error.message,
    });
  }
};

// GET SINGLE
export const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get certificate",
      error: error.message,
    });
  }
};

// UPDATE IMAGE
export const updateCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "New certificate image is required",
      });
    }

    deleteImageFile(certificate.image);

    certificate.image = req.file.path.replace(/\\/g, "/");

    await certificate.save();

    res.status(200).json({
      success: true,
      message: "Certificate updated successfully",
      data: certificate,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update certificate",
      error: error.message,
    });
  }
};

// DELETE
export const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    deleteImageFile(certificate.image);

    await Certificate.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Certificate deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete certificate",
      error: error.message,
    });
  }
};
