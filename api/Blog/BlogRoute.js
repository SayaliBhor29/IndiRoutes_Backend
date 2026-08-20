import express from "express";

import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from "./BlogController.js";
import upload from "../../middleware/upload.js";

const router = express.Router();


// ==========================================
// CREATE UPLOAD DIRECTORY
// ==========================================
// const upload = createUploadMiddleware("blogs");


// ==========================================
// ROUTES
// ==========================================

// Get all blogs
router.get("/", getBlogs);

// Get single blog
router.get("/:slug", getBlogBySlug);

// Create blog
router.post(
  "/",
  upload.single("image"),
  createBlog
);

// Update blog
router.put(
  "/:id",
  upload.single("image"),
  updateBlog
);

// Delete blog
router.delete("/:id", deleteBlog);


export default router;