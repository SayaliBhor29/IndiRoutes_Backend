import FleetInfrastructure from "../../../models/FleetInfrastructure.js";

// GET all fleet cards
export const getFleetInfrastructure = async (req, res) => {
  try {
    const cards = await FleetInfrastructure.find({
      isActive: true,
    })
      .sort({ order: 1 })
      .select("value title description order isActive");

    res.status(200).json({
      success: true,
      data: cards,
    });
  } catch (error) {
    console.error("Get Fleet Infrastructure Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch fleet infrastructure cards",
      error: error.message,
    });
  }
};


// CREATE card
export const createFleetInfrastructure = async (req, res) => {
  try {
    const {
      icon,
      value,
      title,
      description,
      order,
      isActive,
    } = req.body;

    if (!icon || !value || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "Value, title and description are required",
      });
    }

    const card = await FleetInfrastructure.create({
      icon,
      value,
      title,
      description,
      order,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Fleet card created successfully",
      data: card,
    });
  } catch (error) {
    console.error("Create Fleet Infrastructure Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create fleet card",
      error: error.message,
    });
  }
};


// UPDATE card
export const updateFleetInfrastructure = async (req, res) => {
  try {
    const {
      icon,
      value,
      title,
      description,
      order,
      isActive,
    } = req.body;

    const card = await FleetInfrastructure.findByIdAndUpdate(
      req.params.id,
      {
        icon,
        value,
        title,
        description,
        order,
        isActive,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Fleet card not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fleet card updated successfully",
      data: card,
    });
  } catch (error) {
    console.error("Update Fleet Infrastructure Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update fleet card",
      error: error.message,
    });
  }
};


// DELETE card
export const deleteFleetInfrastructure = async (req, res) => {
  try {
    const card = await FleetInfrastructure.findByIdAndDelete(
      req.params.id
    );

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Fleet card not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fleet card deleted successfully",
    });
  } catch (error) {
    console.error("Delete Fleet Infrastructure Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete fleet card",
      error: error.message,
    });
  }
};