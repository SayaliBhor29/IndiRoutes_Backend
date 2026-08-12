import CarrierOpening from "../../models/CarrierOpening.js";

// GET ACTIVE OPENINGS
export const getCarrierOpenings = async (req, res) => {
  try {
    const openings = await CarrierOpening.find({
      isActive: true,
    })
      .sort({ order: 1 })
      .select(
        "title description details order isActive"
      );

    res.status(200).json({
      success: true,
      data: openings,
    });
  } catch (error) {
    console.error(
      "Get Carrier Openings Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch carrier openings",
      error: error.message,
    });
  }
};


// GET ALL OPENINGS
export const getAllCarrierOpenings = async (
  req,
  res
) => {
  try {
    const openings = await CarrierOpening.find()
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: openings,
    });
  } catch (error) {
    console.error(
      "Get All Carrier Openings Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch carrier openings",
      error: error.message,
    });
  }
};


// CREATE OPENING
export const createCarrierOpening = async (
  req,
  res
) => {
  try {
    const {
      title,
      description,
      details,
      order,
      isActive,
    } = req.body;

    if (!title || !description || !details) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description and details are required",
      });
    }

    if (!Array.isArray(details)) {
      return res.status(400).json({
        success: false,
        message: "Details must be an array",
      });
    }

    const opening = await CarrierOpening.create({
      title,
      description,
      details,
      order,
      isActive,
    });

    res.status(201).json({
      success: true,
      message:
        "Carrier opening created successfully",
      data: opening,
    });
  } catch (error) {
    console.error(
      "Create Carrier Opening Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create carrier opening",
      error: error.message,
    });
  }
};


// UPDATE OPENING
export const updateCarrierOpening = async (
  req,
  res
) => {
  try {
    const {
      title,
      description,
      details,
      order,
      isActive,
    } = req.body;

    if (details && !Array.isArray(details)) {
      return res.status(400).json({
        success: false,
        message: "Details must be an array",
      });
    }

    const opening =
      await CarrierOpening.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          details,
          order,
          isActive,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!opening) {
      return res.status(404).json({
        success: false,
        message: "Carrier opening not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Carrier opening updated successfully",
      data: opening,
    });
  } catch (error) {
    console.error(
      "Update Carrier Opening Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update carrier opening",
      error: error.message,
    });
  }
};


// DELETE OPENING
export const deleteCarrierOpening = async (
  req,
  res
) => {
  try {
    const opening =
      await CarrierOpening.findByIdAndDelete(
        req.params.id
      );

    if (!opening) {
      return res.status(404).json({
        success: false,
        message: "Carrier opening not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Carrier opening deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Carrier Opening Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete carrier opening",
      error: error.message,
    });
  }
};