import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Warehouse from "../../models/Warehouse.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteImageFile = (image) => {
  if (!image) return;

  const imagePath = path.resolve(__dirname, "../../", image);
  fs.unlink(imagePath, (error) => {
    if (error && error.code !== "ENOENT") {
      console.error("Error deleting warehouse image:", error);
    }
  });
};

const parsePoints = (points) => {
  if (Array.isArray(points) || points === undefined) return points;

  if (typeof points === "string") {
    return JSON.parse(points);
  }

  return points;
};

const parseBoolean = (value) => {
  if (typeof value !== "string") return value;

  const normalized = value.trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;

  return value;
};

// GET all active warehouses
export const getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find({
      isActive: true,
    })
      .sort({ order: 1 })
      .select("image title points order isActive");

    res.status(200).json({
      success: true,
      data: warehouses,
    });
  } catch (error) {
    console.error("Get Warehouses Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch warehouses",
      error: error.message,
    });
  }
};


// GET all warehouses including inactive
export const getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find()
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: warehouses,
    });
  } catch (error) {
    console.error("Get All Warehouses Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch warehouses",
      error: error.message,
    });
  }
};


// CREATE warehouse
export const createWarehouse = async (req, res) => {
  try {
    const { title, order } = req.body;
    const image = req.file?.path.replace(/\\/g, "/");
    const points = parsePoints(req.body.points);
    const isActive = parseBoolean(req.body.isActive);

    if (!image || !title || !points) {
      return res.status(400).json({
        success: false,
        message: "Image, title and points are required",
      });
    }

    if (!Array.isArray(points)) {
      return res.status(400).json({
        success: false,
        message: "Points must be an array",
      });
    }

    const warehouse = await Warehouse.create({
      image,
      title,
      points,
      order,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Warehouse created successfully",
      data: warehouse,
    });
  } catch (error) {
    console.error("Create Warehouse Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create warehouse",
      error: error.message,
    });
  }
};


// UPDATE warehouse
export const updateWarehouse = async (req, res) => {
  try {
    const { title, order } = req.body;
    const points = parsePoints(req.body.points);
    const isActive = parseBoolean(req.body.isActive);

    if (points && !Array.isArray(points)) {
      return res.status(400).json({
        success: false,
        message: "Points must be an array",
      });
    }

    const warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found",
      });
    }

    if (req.file) {
      deleteImageFile(warehouse.image);
      warehouse.image = req.file.path.replace(/\\/g, "/");
    }

    if (title !== undefined) warehouse.title = title;
    if (points !== undefined) warehouse.points = points;
    if (order !== undefined) warehouse.order = order;
    if (isActive !== undefined) warehouse.isActive = isActive;

    await warehouse.save();

    res.status(200).json({
      success: true,
      message: "Warehouse updated successfully",
      data: warehouse,
    });
  } catch (error) {
    console.error("Update Warehouse Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update warehouse",
      error: error.message,
    });
  }
};


// DELETE warehouse
export const deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(
      req.params.id
    );

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found",
      });
    }

    deleteImageFile(warehouse.image);

    res.status(200).json({
      success: true,
      message: "Warehouse deleted successfully",
    });
  } catch (error) {
    console.error("Delete Warehouse Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete warehouse",
      error: error.message,
    });
  }
};
