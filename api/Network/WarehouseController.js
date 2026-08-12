import Warehouse from "../../models/Warehouse.js";

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
    const {
      image,
      title,
      points,
      order,
      isActive,
    } = req.body;

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
    const {
      image,
      title,
      points,
      order,
      isActive,
    } = req.body;

    if (points && !Array.isArray(points)) {
      return res.status(400).json({
        success: false,
        message: "Points must be an array",
      });
    }

    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      {
        image,
        title,
        points,
        order,
        isActive,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found",
      });
    }

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