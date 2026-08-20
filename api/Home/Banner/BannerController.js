// import asyncHandler from "express-async-handler";
// import Banner from "../../../models/BannerModel.js";
// import fs from "fs";
// import {
//   getLocalUploadFilePath,
//   getUploadedFilePath,
//   normalizeImageFields,
// } from "../../../utils/uploadPath.js";

// // @desc    Get all active banners
// // @route   GET /api/home/banner
// // @access  Public
// export const getBanners = asyncHandler(async (req, res) => {
//   const banners = await Banner.find({ isActive: true }).sort("order");
//   res.status(200).json({
//     success: true,
//     count: banners.length,
//     data: normalizeImageFields(banners),
//   });
// });

// // @desc    Get single banner
// // @route   GET /api/home/banner/:id
// // @access  Public
// export const getBannerById = asyncHandler(async (req, res) => {
//   const banner = await Banner.findById(req.params.id);

//   if (!banner) {
//     res.status(404);
//     throw new Error("Banner not found");
//   }

//   res.status(200).json({
//     success: true,
//     data: normalizeImageFields(banner),
//   });
// });

// // @desc    Create new banner
// // @route   POST /api/home/banner
// // @access  Private/Admin
// export const createBanner = asyncHandler(async (req, res) => {
//   const { ...bannerData } = req.body;

//   if (req.file) {
//     bannerData.image = getUploadedFilePath(req.file);
//   } else {
//     res.status(400);
//     throw new Error("Banner image is required");
//   }

//   if (bannerData.isActive !== undefined) {
//     bannerData.isActive = String(bannerData.isActive).trim() === "true";
//   }

//   const banner = await Banner.create({
//     ...bannerData,
//     image: bannerData.image,
//   });

//   res.status(201).json({
//     success: true,
//     data: banner,
//   });
// });

// // @desc    Update banner
// // @route   PUT /api/home/banner/:id
// // @access  Private/Admin
// export const updateBanner = asyncHandler(async (req, res) => {
//   let banner = await Banner.findById(req.params.id);

//   if (!banner) {
//     res.status(404);
//     throw new Error("Banner not found");
//   }

//   const { ...updateData } = req.body;

//   if (updateData.isActive !== undefined) {
//     updateData.isActive = String(updateData.isActive).trim() === "true";
//   }

//   if (req.file) {
//     // Delete old image if it exists
//     const oldImagePath = getLocalUploadFilePath(banner.image);
//     if (oldImagePath && fs.existsSync(oldImagePath)) {
//       fs.unlinkSync(oldImagePath);
//     }
//     updateData.image = getUploadedFilePath(req.file);
//   }

//   banner = await Banner.findByIdAndUpdate(req.params.id, updateData, {
//     new: true,
//     runValidators: true,
//   });

//   res.status(200).json({
//     success: true,
//     data: normalizeImageFields(banner),
//   });
// });

// // @desc    Delete banner
// // @route   DELETE /api/home/banner/:id
// // @access  Private/Admin
// export const deleteBanner = asyncHandler(async (req, res) => {
//   const banner = await Banner.findById(req.params.id);

//   if (!banner) {
//     res.status(404);
//     throw new Error("Banner not found");
//   }

//   // Delete image from server
//   const imagePath = getLocalUploadFilePath(banner.image);
//   if (imagePath && fs.existsSync(imagePath)) {
//     fs.unlinkSync(imagePath);
//   }

//   await banner.deleteOne();

//   res.status(200).json({
//     success: true,
//     message: "Banner deleted successfully",
//   });
// });



import asyncHandler from "express-async-handler";
import Banner from "../../../models/BannerModel.js";
import { deleteFromS3 } from "../../../utils/s3.js";


// @desc    Get all active banners
// @route   GET /api/home/banner
// @access  Public
export const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({
    isActive: true,
  }).sort("order");

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
  const bannerData = {
    ...req.body,
  };

  // S3 image
  if (req.file) {
    bannerData.image = req.file.location;
  } else {
    res.status(400);
    throw new Error("Banner image is required");
  }

  // Convert isActive from FormData string to boolean
  if (bannerData.isActive !== undefined) {
    bannerData.isActive =
      String(bannerData.isActive).trim() === "true";
  }

  const banner = await Banner.create(bannerData);

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

  const updateData = {
    ...req.body,
  };

  // Convert isActive from FormData string to boolean
  if (updateData.isActive !== undefined) {
    updateData.isActive =
      String(updateData.isActive).trim() === "true";
  }

  // If new image uploaded
  if (req.file) {

    // Delete old image from S3
    if (banner.image) {
      await deleteFromS3(banner.image);
    }

    // Save new S3 URL
    updateData.image = req.file.location;
  }

  banner = await Banner.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

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

  // Delete image from S3
  if (banner.image) {
    await deleteFromS3(banner.image);
  }

  // Delete MongoDB document
  await banner.deleteOne();

  res.status(200).json({
    success: true,
    message: "Banner deleted successfully",
  });
});
