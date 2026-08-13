import Blog from "../../models/blogs.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Store the uploaded image path in the same format used by the logo module.
const getBlogImagePath = (file) => file.path.replace(/\\/g, "/");

// ==========================================
// GET ALL BLOGS
// ==========================================

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    console.error("Get blogs error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};


// ==========================================
// GET SINGLE BLOG
// ==========================================

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Get blog error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error.message,
    });
  }
};


// ==========================================
// CREATE BLOG
// ==========================================

export const createBlog = async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      category,
      author,
      published,
    } = req.body;

    // Check image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Blog image is required",
      });
    }

    // Required fields
    if (!title || !description || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, description and content are required",
      });
    }

    // Create slug
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    // Check duplicate slug
    const existingBlog = await Blog.findOne({ slug });

    if (existingBlog) {
      return res.status(400).json({
        success: false,
        message: "A blog with this title already exists",
      });
    }

    // Image URL
    const imageUrl = getBlogImagePath(req.file);

    const blog = await Blog.create({
      title,
      description,
      content,
      category: category || "Logistics",
      author: author || "Indiroutes",
      published: published === "true" || published === true,
      slug,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Create blog error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE BLOG
// ==========================================

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const {
      title,
      description,
      content,
      category,
      author,
      published,
    } = req.body;

    const previousTitle = blog.title;

    // Update text fields
    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.content = content || blog.content;
    blog.category = category || blog.category;
    blog.author = author || blog.author;

    if (published !== undefined) {
      blog.published =
        published === "true" || published === true;
    }

    // Update title + slug if title changed
    if (title && title !== previousTitle) {
      blog.slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
    }

    // Update image if new image uploaded
    if (req.file) {
      blog.image = getBlogImagePath(req.file);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Update blog error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update blog",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE BLOG
// ==========================================

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
      error: error.message,
    });
  }
};
