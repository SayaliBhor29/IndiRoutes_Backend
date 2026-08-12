import express from "express";
import {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "./testimonialController.js";
import upload from "../../../middleware/upload.js";

// Create a multer instance for the 'testimonials' sub-directory
// const upload = createUploadMiddleware("testimonials");

const router = express.Router();

router.route("/").get(getTestimonials);

// @route   POST /api/testimonial/create
// @desc    Create new testimonial
router.route("/create").post(createTestimonial);

router
  .route("/:id")
  .get(getTestimonialById)
  .put(upload.single("image"), updateTestimonial)
  .delete(deleteTestimonial);

export default router;