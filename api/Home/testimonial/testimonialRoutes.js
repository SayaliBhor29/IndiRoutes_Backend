import express from "express";

import upload from "../../../middleware/upload.js";

import {
  createTestimonial,
  getTestimonials,
  getAllTestimonials,
  getSingleTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "./testimonialController.js";

const router = express.Router();

router.post(
  "/create",
  upload.single("image"),
  createTestimonial
);

router.get("/", getTestimonials);

router.get("/all", getAllTestimonials);

router.get("/:id", getSingleTestimonial);

router.put(
  "/update/:id",
  upload.single("image"),
  updateTestimonial
);

router.delete("/delete/:id", deleteTestimonial);

export default router;