import asyncHandler from "express-async-handler";
import Testimonial from "../../../models/Testimonial.js";
import fs from "fs";
import path from "path";

// @desc    Get all testimonials
// @route   GET /api/testimonial
// @access  Public
export const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ status: true }).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: testimonials.length,
    data: testimonials,
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
    data: testimonial,
  });
});

// @desc    Create new testimonial
// @route   POST /api/testimonial
// @access  Private/Admin
export const createTestimonial = asyncHandler(async (req, res) => {
  const { ...testimonialData } = req.body;

  if (req.file) {
    const imageUrl = `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`;
    testimonialData.image = imageUrl;
  }

  const testimonial = await Testimonial.create(testimonialData);

  res.status(201).json({
    success: true,
    data: testimonial,
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
        const oldImagePath = testimonial.image.split(req.get("host"))[1];
        const fullPath = path.join(path.resolve(), oldImagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch (error) {
        console.error(`Failed to delete old testimonial image: ${error.message}`);
      }
    }
    const newImageUrl = `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`;
    updateData.image = newImageUrl;
  }

  testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: testimonial,
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
      const imagePath = testimonial.image.split(req.get("host"))[1];
      const fullPath = path.join(path.resolve(), imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
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