import Industry from "../../../models/Industry.js";

// GET all industries
export const getIndustries = async (req, res) => {
  try {
    const industries = await Industry.find({})
      .sort({ order: 1 })
      .select("name icon order");

    res.status(200).json({
      success: true,
      data: industries,
    });
  } catch (error) {
    console.error("Get industries error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch industries",
      error: error.message,
    });
  }
};

// GET single industry
export const getIndustryById = async (req, res) => {
  try {
    const industry = await Industry.findById(req.params.id);

    if (!industry) {
      return res.status(404).json({
        success: false,
        message: "Industry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: industry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch industry",
      error: error.message,
    });
  }
};

// CREATE industry
export const createIndustry = async (req, res) => {
  try {
    const { name, icon, order } = req.body;

    if (!name || !icon) {
      return res.status(400).json({
        success: false,
        message: "Name and icon are required",
      });
    }

    const existingIndustry = await Industry.findOne({ name });

    if (existingIndustry) {
      return res.status(409).json({
        success: false,
        message: "Industry already exists",
      });
    }

    const industry = await Industry.create({
      name,
      icon,
      order,
    });

    res.status(201).json({
      success: true,
      message: "Industry created successfully",
      data: industry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create industry",
      error: error.message,
    });
  }
};

// UPDATE industry
export const updateIndustry = async (req, res) => {
  try {
    const { name, icon, order } = req.body;

    const industry = await Industry.findByIdAndUpdate(
      req.params.id,
      {
        name,
        icon,
        order,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!industry) {
      return res.status(404).json({
        success: false,
        message: "Industry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Industry updated successfully",
      data: industry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update industry",
      error: error.message,
    });
  }
};

// DELETE industry
export const deleteIndustry = async (req, res) => {
  try {
    const industry = await Industry.findByIdAndDelete(req.params.id);

    if (!industry) {
      return res.status(404).json({
        success: false,
        message: "Industry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Industry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete industry",
      error: error.message,
    });
  }
};
