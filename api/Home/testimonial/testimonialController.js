// import asyncHandler from "express-async-handler";
// import Testimonial from "../../../models/Testimonial.js";
// import fs from "fs";
// import {
//   getLocalUploadFilePath,
//   getUploadedFilePath,
//   normalizeImageFields,
// } from "../../../utils/uploadPath.js";
// import upload from "../../../middleware/upload.js";

// // @desc    Get all testimonials
// // @route   GET /api/testimonial
// // @access  Public
// export const getTestimonials = asyncHandler(async (req, res) => {
//   const testimonials = await Testimonial.find({ status: true }).sort({ createdAt: -1 });
//   res.status(200).json({
//     success: true,
//     count: testimonials.length,
//     data: normalizeImageFields(testimonials),
//   });
// });

// // @desc    Get single testimonial
// // @route   GET /api/testimonial/:id
// // @access  Public
// export const getTestimonialById = asyncHandler(async (req, res) => {
//   const testimonial = await Testimonial.findById(req.params.id);

//   if (!testimonial) {
//     res.status(404);
//     throw new Error("Testimonial not found");
//   }

//   res.status(200).json({
//     success: true,
//     data: normalizeImageFields(testimonial),
//   });
// });

// // @desc    Create new testimonial
// // @route   POST /api/testimonial
// // @access  Private/Admin
// export const createTestimonial = asyncHandler(async (req, res, next) => {
//   // Use multer as a middleware function
//   upload.single("image")(req, res, async (err) => {
//     if (err) {
//       // A Multer error occurred when uploading.
//       return res.status(400).json({ success: false, message: err.message });
//     }

//     const { ...testimonialData } = req.body;

//     if (req.file) {
//       testimonialData.image = getUploadedFilePath(req.file);
//     }

//     const testimonial = await Testimonial.create(testimonialData);

//     res.status(201).json({
//       success: true,
//       data: normalizeImageFields(testimonial),
//     });
//   });
// });

// // @desc    Update testimonial
// // @route   PUT /api/testimonial/:id
// // @access  Private/Admin
// export const updateTestimonial = asyncHandler(async (req, res) => {
//   let testimonial = await Testimonial.findById(req.params.id);

//   if (!testimonial) {
//     res.status(404);
//     throw new Error("Testimonial not found");
//   }

//   const { ...updateData } = req.body;

//   if (req.file) {
//     // Delete old image if it exists and is not a default placeholder
//     if (testimonial.image) {
//       try {
//         const oldImagePath = getLocalUploadFilePath(testimonial.image);
//         if (oldImagePath && fs.existsSync(oldImagePath)) {
//           fs.unlinkSync(oldImagePath);
//         }
//       } catch (error) {
//         console.error(`Failed to delete old testimonial image: ${error.message}`);
//       }
//     }
//     updateData.image = getUploadedFilePath(req.file);
//   }

//   testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updateData, {
//     new: true,
//     runValidators: true,
//   });

//   res.status(200).json({
//     success: true,
//     data: normalizeImageFields(testimonial),
//   });
// });

// // @desc    Delete testimonial
// // @route   DELETE /api/testimonial/:id
// // @access  Private/Admin
// export const deleteTestimonial = asyncHandler(async (req, res) => {
//   const testimonial = await Testimonial.findById(req.params.id);

//   if (!testimonial) {
//     res.status(404);
//     throw new Error("Testimonial not found");
//   }

//   // Delete image from server if it exists
//   if (testimonial.image) {
//     try {
//       const imagePath = getLocalUploadFilePath(testimonial.image);
//       if (imagePath && fs.existsSync(imagePath)) {
//         fs.unlinkSync(imagePath);
//       }
//     } catch (error) {
//       console.error(`Failed to delete testimonial image: ${error.message}`);
//     }
//   }

//   await testimonial.deleteOne();

//   res.status(200).json({
//     success: true,
//     message: "Testimonial deleted successfully",
//   });
// });


import asyncHandler from "express-async-handler";
import Testimonial from "../../../models/Testimonial.js";
import fs from "fs";

import {
  getLocalUploadFilePath,
  normalizeImageFields,
} from "../../../utils/uploadPath.js";

import upload from "../../../middleware/upload.js";

// =====================================================
// GET ALL TESTIMONIALS
// GET /api/testimonial
// =====================================================

export const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({
    status: true,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: testimonials.length,
    data: normalizeImageFields(testimonials),
  });
});

// =====================================================
// GET SINGLE TESTIMONIAL
// GET /api/testimonial/:id
// =====================================================

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

// =====================================================
// CREATE TESTIMONIAL
// POST /api/testimonial/create
// =====================================================

export const createTestimonial = asyncHandler(async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.error("Multer/S3 Upload Error:", err);

      return res.status(400).json({
        success: false,
        message: err.message || "Image upload failed",
      });
    }

    try {
      const {
        name,
        role,
        company,
        review,
        rating,
        status,
      } = req.body;

      // ===============================================
      // VALIDATION
      // ===============================================

      if (!name?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name is required",
        });
      }

      if (!role?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Role is required",
        });
      }

      if (!company?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Company is required",
        });
      }

      if (!review?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Review is required",
        });
      }

      // ===============================================
      // TESTIMONIAL DATA
      // ===============================================

      const testimonialData = {
        name: name.trim(),
        role: role.trim(),
        company: company.trim(),
        review: review.trim(),
        rating: Number(rating) || 5,
        status:
          status === undefined
            ? true
            : status === "true" || status === true,
      };

      // ===============================================
      // S3 IMAGE URL
      // ===============================================

      if (req.file) {
        // multer-s3 provides the S3 URL here
        testimonialData.image =
          req.file.location ||
          req.file.key ||
          "";
      }

      // ===============================================
      // CREATE
      // ===============================================

      const testimonial = await Testimonial.create(testimonialData);

      res.status(201).json({
        success: true,
        message: "Testimonial created successfully",
        data: normalizeImageFields(testimonial),
      });
    } catch (error) {
      console.error("Create Testimonial Error:", error);

      return res.status(500).json({
        success: false,
        message: error.message || "Failed to create testimonial",
      });
    }
  });
});

// =====================================================
// UPDATE TESTIMONIAL
// PUT /api/testimonial/:id
// =====================================================

export const updateTestimonial = asyncHandler(async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.error("Multer/S3 Upload Error:", err);

      return res.status(400).json({
        success: false,
        message: err.message || "Image upload failed",
      });
    }

    try {
      let testimonial = await Testimonial.findById(req.params.id);

      if (!testimonial) {
        return res.status(404).json({
          success: false,
          message: "Testimonial not found",
        });
      }

      const {
        name,
        role,
        company,
        review,
        rating,
        status,
      } = req.body;

      // ===============================================
      // UPDATE DATA
      // ===============================================

      const updateData = {};

      if (name !== undefined) {
        updateData.name = name.trim();
      }

      if (role !== undefined) {
        updateData.role = role.trim();
      }

      if (company !== undefined) {
        updateData.company = company.trim();
      }

      if (review !== undefined) {
        updateData.review = review.trim();
      }

      if (rating !== undefined) {
        updateData.rating = Number(rating);
      }

      if (status !== undefined) {
        updateData.status =
          status === "true" || status === true;
      }

      // ===============================================
      // NEW S3 IMAGE
      // ===============================================

      if (req.file) {
        /*
         * IMPORTANT:
         *
         * If your S3 bucket has lifecycle/versioning,
         * the old image can remain in S3.
         *
         * For now we simply replace the stored URL.
         */

        updateData.image =
          req.file.location ||
          req.file.key ||
          "";
      }

      // ===============================================
      // UPDATE DATABASE
      // ===============================================

      testimonial = await Testimonial.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({
        success: true,
        message: "Testimonial updated successfully",
        data: normalizeImageFields(testimonial),
      });
    } catch (error) {
      console.error("Update Testimonial Error:", error);

      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update testimonial",
      });
    }
  });
});

// =====================================================
// DELETE TESTIMONIAL
// DELETE /api/testimonial/:id
// =====================================================

export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    res.status(404);
    throw new Error("Testimonial not found");
  }

  /*
   * If image is an old local upload,
   * delete it from local storage.
   *
   * S3 images are NOT deleted here.
   * If you want S3 deletion also, your S3 middleware
   * needs DeleteObject functionality.
   */

  if (
    testimonial.image &&
    !testimonial.image.startsWith("http://") &&
    !testimonial.image.startsWith("https://")
  ) {
    try {
      const imagePath = getLocalUploadFilePath(
        testimonial.image
      );

      if (imagePath && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    } catch (error) {
      console.error(
        `Failed to delete old image: ${error.message}`
      );
    }
  }

  await testimonial.deleteOne();

  res.status(200).json({
    success: true,
    message: "Testimonial deleted successfully",
  });
});
