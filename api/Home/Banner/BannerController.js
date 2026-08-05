import asyncHandler from "express-async-handler";
import Banner from "../../../models/BannerModel.js";

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
  const banner = await Banner.create(req.body);

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

  banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
  returnDocument: "after",
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

  await banner.deleteOne();

  res.status(200).json({
    success: true,
    message: "Banner deleted successfully",
  });
});