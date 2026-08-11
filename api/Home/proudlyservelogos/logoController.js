import asyncHandler from "express-async-handler";
import Logo from "../../../models/Logo.js";
import fs from "fs";
import path from "path";

// @desc    Get all logos
// @route   GET /api/logos
// @access  Public
export const getLogos = asyncHandler(async (req, res) => {
  const logos = await Logo.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: logos.length,
    data: logos,
  });
});

// @desc    Create new logos
// @route   POST /api/logos
// @access  Private/Admin
export const createLogos = asyncHandler(async (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    res.status(400);
    throw new Error("At least one logo image is required");
  }

  const logoData = files.map(file => {
    const imageUrl = `${req.protocol}://${req.get("host")}/${file.path.replace(/\\/g, "/")}`;
    return { image: imageUrl };
  });

  const logos = await Logo.insertMany(logoData);

  res.status(201).json({
    success: true,
    count: logos.length,
    data: logos,
  });
});

// @desc    Delete logo
// @route   DELETE /api/logos/:id
// @access  Private/Admin
export const deleteLogo = asyncHandler(async (req, res) => {
  const logo = await Logo.findById(req.params.id);

  if (!logo) {
    res.status(404);
    throw new Error("Logo not found");
  }

  // Delete image from server
  if (logo.image) {
    try {
      const imagePath = logo.image.split(req.get("host"))[1];
      const fullPath = path.join(path.resolve(), imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (error) {
      console.error(`Failed to delete logo image: ${error.message}`);
      // Decide if you want to proceed or return an error
    }
  }

  await logo.deleteOne();

  res.status(200).json({
    success: true,
    message: "Logo deleted successfully",
  });
});