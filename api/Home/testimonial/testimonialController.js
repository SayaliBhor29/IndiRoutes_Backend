import asyncHandler from "express-async-handler";
import Testimonial from "../../../models/Testimonial.js";
import fs from "fs";
import {
  getLocalUploadFilePath,
  getUploadedFilePath,
  normalizeImageFields,
} from "../../../utils/uploadPath.js";
import upload from "../../../middleware/upload.js";

// @desc    Get all testimonials
// @route   GET /api/testimonial
// @access  Public
export const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ status: true }).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: testimonials.length,
    data: normalizeImageFields(testimonials),
  });
});

// @desc    Get single testimonial
// @route   GET /api/testimonial/:id
// @access  Public
export const getTestimonialById = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    res.status(404);
    throw new Error("Testimonial not found");
  }

  res.status(200).json({
    success: true,
    data: normalizeImageFields(testimonial),
  });
});

// @desc    Create new testimonial
// @route   POST /api/testimonial
// @access  Private/Admin
export const createTestimonial = asyncHandler(async (req, res, next) => {
  // Use multer as a middleware function
  upload.single("image")(req, res, async (err) => {
    if (err) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ success: false, message: err.message });
    }

    const { ...testimonialData } = req.body;

    if (req.file) {
      testimonialData.image = getUploadedFilePath(req.file);
    }

    const testimonial = await Testimonial.create(testimonialData);

    res.status(201).json({
      success: true,
      data: normalizeImageFields(testimonial),
    });
  });
});

// @desc    Update testimonial
// @route   PUT /api/testimonial/:id
// @access  Private/Admin
export const updateTestimonial = asyncHandler(async (req, res) => {
  let testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    res.status(404);
    throw new Error("Testimonial not found");
  }

  const { ...updateData } = req.body;

  if (req.file) {
    // Delete old image if it exists and is not a default placeholder
    if (testimonial.image) {
      try {
        const oldImagePath = getLocalUploadFilePath(testimonial.image);
        if (oldImagePath && fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      } catch (error) {
        console.error(`Failed to delete old testimonial image: ${error.message}`);
      }
    }
    updateData.image = getUploadedFilePath(req.file);
  }

  testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: normalizeImageFields(testimonial),
  });
});

// @desc    Delete testimonial
// @route   DELETE /api/testimonial/:id
// @access  Private/Admin
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    res.status(404);
    throw new Error("Testimonial not found");
  }

  // Delete image from server if it exists
  if (testimonial.image) {
    try {
      const imagePath = getLocalUploadFilePath(testimonial.image);
      if (imagePath && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    } catch (error) {
      console.error(`Failed to delete testimonial image: ${error.message}`);
    }
  }

  await testimonial.deleteOne();

  res.status(200).json({
    success: true,
    message: "Testimonial deleted successfully",
  });
});
