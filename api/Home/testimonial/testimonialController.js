import Testimonial from "../../../models/Testimonial.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const createTestimonial = async (req, res, next) => {
  try {
    const { name, role, company, review, rating } = req.body;

    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!role) missingFields.push("role");
    if (!company) missingFields.push("company");
    if (!review) missingFields.push("review");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required testimonial fields.",
        missingFields,
        receivedBody: req.body,
      });
    }

    const testimonial = await Testimonial.create({
      name: name.trim(),
      role: role.trim(),
      company: company.trim(),
      review: review.trim(),
      rating: rating ? Number(rating) : undefined,
      image: req.file ? req.file.path.replace(/\\/g, "/") : "",
    });

    res.status(201).json({
      success: true,
      message: "Testimonial Added",
      data: testimonial,
    });
  } catch (err) {
    next(err);
  }
};

export const getTestimonials = async (req, res, next) => {
  try {
    const data = await Testimonial.find({ status: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllTestimonials = async (req, res, next) => {
  try {
    const data = await Testimonial.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getSingleTestimonial = async (req, res, next) => {
  try {
    const data = await Testimonial.findById(req.params.id);
    if (!data) {
      res.status(404);
      throw new Error("Testimonial not found");
    }
    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      res.status(404);
      throw new Error("Testimonial not found");
    }

    if (req.file) {
      if (testimonial.image) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const oldImagePath = path.resolve(__dirname, "../../..", testimonial.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Error deleting old testimonial image:", err);
        });
      }
      testimonial.image = req.file.path.replace(/\\/g, "/");
    }

    testimonial.name = req.body.name || testimonial.name;
    testimonial.role = req.body.role || testimonial.role;
    testimonial.company = req.body.company || testimonial.company;
    testimonial.review = req.body.review || testimonial.review;
    testimonial.rating = req.body.rating || testimonial.rating;
    testimonial.status = req.body.status === undefined ? testimonial.status : req.body.status;

    const updatedTestimonial = await testimonial.save();

    res.status(200).json({
      success: true,
      message: "Updated Successfully",
      data: updatedTestimonial,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      res.status(404);
      throw new Error("Testimonial not found");
    }

    if (testimonial.image) {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const imagePath = path.resolve(__dirname, "../../..", testimonial.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting testimonial image file:", err);
      });
    }

    await testimonial.deleteOne();

    res.status(200).json({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (err) {
    next(err);
  }
};