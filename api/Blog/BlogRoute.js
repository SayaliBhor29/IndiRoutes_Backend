import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from "./BlogController.js";

const router = express.Router();


// ==========================================
// CREATE UPLOAD DIRECTORY
// ==========================================

const uploadDirectory = "uploads/blogs";

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}


// ==========================================
// MULTER STORAGE
// ==========================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});


// ==========================================
// FILE FILTER
// ==========================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      ),
      false
    );
  }
};


// ==========================================
// MULTER CONFIG
// ==========================================

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});


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