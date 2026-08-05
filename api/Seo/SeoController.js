import asyncHandler from "express-async-handler";
import Seo from "../../models/Seo.js";

// @desc    Get SEO by page name
// @route   GET /api/seo/:page
// @access  Public
export const getSeoByPage = asyncHandler(async (req, res) => {
  const seo = await Seo.findOne({
    page: req.params.page.toLowerCase(),
    isActive: true,
  });

  if (!seo) {
    res.status(404);
    throw new Error("SEO data not found for this page");
  }

  res.status(200).json({
    success: true,
    data: seo,
  });
});

// @desc    Get all SEO entries
// @route   GET /api/seo
// @access  Public / Admin
export const getAllSeo = asyncHandler(async (req, res) => {
  const seos = await Seo.find({ isActive: true }).sort("page");
  res.status(200).json({
    success: true,
    count: seos.length,
    data: seos,
  });
});

// @desc    Create SEO entry
// @route   POST /api/seo
// @access  Private/Admin
export const createSeo = asyncHandler(async (req, res) => {
  const seo = await Seo.create(req.body);
  res.status(201).json({
    success: true,
    data: seo,
  });
});

// @desc    Update SEO entry
// @route   PUT /api/seo/:page
// @access  Private/Admin
export const updateSeo = asyncHandler(async (req, res) => {
  const seo = await Seo.findOneAndUpdate(
    { page: req.params.page.toLowerCase() },
    req.body,
    {
      returnDocument: "after",
      runValidators: true,
      upsert: true, // create if not exists
    }
  );

  res.status(200).json({
    success: true,
    data: seo,
  });
});

// @desc    Delete SEO entry
// @route   DELETE /api/seo/:page
// @access  Private/Admin
export const deleteSeo = asyncHandler(async (req, res) => {
  const seo = await Seo.findOneAndDelete({
    page: req.params.page.toLowerCase(),
  });

  if (!seo) {
    res.status(404);
    throw new Error("SEO entry not found");
  }

  res.status(200).json({
    success: true,
    message: "SEO entry deleted",
  });
});