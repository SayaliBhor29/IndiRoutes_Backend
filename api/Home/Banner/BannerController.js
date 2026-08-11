import asyncHandler from "express-async-handler";
import Banner from "../../../models/BannerModel.js";
import fs from "fs";

// @desc    Get all active banners
// @route   GET /api/home/banner
// @access  Public
export const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({ isActive: true }).sort("order");
  res.status(200).json({
    success: true,
    count: banners.length,
    data: banners,
  });
});

// @desc    Get single banner
// @route   GET /api/home/banner/:id
// @access  Public
export const getBannerById = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }

  res.status(200).json({
    success: true,
    data: banner,
  });
});

// @desc    Create new banner
// @route   POST /api/home/banner
// @access  Private/Admin
export const createBanner = asyncHandler(async (req, res) => {
  const { ...bannerData } = req.body;

  if (req.file) {
    const imageUrl = `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`;
    bannerData.image = imageUrl;
  } else {
    res.status(400);
    throw new Error("Banner image is required");
  }

  const banner = await Banner.create({
    ...bannerData,
    image: bannerData.image,
  });

  res.status(201).json({
    success: true,
    data: banner,
  });
});

// @desc    Update banner
// @route   PUT /api/home/banner/:id
// @access  Private/Admin
export const updateBanner = asyncHandler(async (req, res) => {
  let banner = await Banner.findById(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }

  const { ...updateData } = req.body;

  if (req.file) {
    // Delete old image if it exists
    if (banner.image) {
      const oldImagePath = banner.image.split(req.get("host"))[1];
      if (fs.existsSync(`.${oldImagePath}`)) {
        fs.unlinkSync(`.${oldImagePath}`);
      }
    }
    const newImageUrl = `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`;
    updateData.image = newImageUrl;
  }

  banner = await Banner.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: banner,
  });
});

// @desc    Delete banner
// @route   DELETE /api/home/banner/:id
// @access  Private/Admin
export const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }

  // Delete image from server
  if (banner.image) {
    const imagePath = banner.image.split(req.get("host"))[1];
    if (fs.existsSync(`.${imagePath}`)) {
      fs.unlinkSync(`.${imagePath}`);
    }
  }

  await banner.deleteOne();

  res.status(200).json({
    success: true,
    message: "Banner deleted successfully",
  });
});