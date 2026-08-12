import AboutStats from "../../../models/AboutStats.js";

/* =====================================================
   CREATE ABOUT STATS
===================================================== */

export const createAboutStats = async (req, res) => {
  try {
    const { value, label, isActive } = req.body;

    if (!value || !label) {
      return res.status(400).json({
        success: false,
        message: "Value and label are required",
      });
    }

    const aboutStats = await AboutStats.create({
      value: value.trim(),
      label: label.trim(),
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: "About stats created successfully",
      data: aboutStats,
    });
  } catch (error) {
    console.error("CREATE ABOUT STATS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create about stats",
      error: error.message,
    });
  }
};


/* =====================================================
   GET ALL ABOUT STATS
===================================================== */

export const getAllAboutStats = async (req, res) => {
  try {
    const aboutStats = await AboutStats.find().sort({
      createdAt: 1,
    });

    return res.status(200).json({
      success: true,
      count: aboutStats.length,
      data: aboutStats,
    });
  } catch (error) {
    console.error("GET ALL ABOUT STATS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch about stats",
      error: error.message,
    });
  }
};


/* =====================================================
   GET ACTIVE ABOUT STATS
===================================================== */

export const getActiveAboutStats = async (req, res) => {
  try {
    const aboutStats = await AboutStats.find({
      isActive: true,
    }).sort({
      createdAt: 1,
    });

    return res.status(200).json({
      success: true,
      count: aboutStats.length,
      data: aboutStats,
    });
  } catch (error) {
    console.error("GET ACTIVE ABOUT STATS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch active about stats",
      error: error.message,
    });
  }
};


/* =====================================================
   GET SINGLE ABOUT STATS
===================================================== */

export const getAboutStatsById = async (req, res) => {
  try {
    const { id } = req.params;

    const aboutStats = await AboutStats.findById(id);

    if (!aboutStats) {
      return res.status(404).json({
        success: false,
        message: "About stats not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: aboutStats,
    });
  } catch (error) {
    console.error("GET ABOUT STATS BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch about stats",
      error: error.message,
    });
  }
};


/* =====================================================
   UPDATE ABOUT STATS
===================================================== */

export const updateAboutStats = async (req, res) => {
  try {
    const { value, label, isActive } = req.body;

    // Build the update object conditionally
    const updateData = {};
    if (value !== undefined) updateData.value = value;
    if (label !== undefined) updateData.label = label;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedAboutStats = await AboutStats.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true } // Return the updated doc and run schema validators
    );

    if (!updatedAboutStats) {
      return res.status(404).json({
        success: false,
        message: "About stats not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "About stats updated successfully",
      data: updatedAboutStats,
    });
  } catch (error) {
    console.error("UPDATE ABOUT STATS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update about stats",
      error: error.message,
    });
  }
};


/* =====================================================
   DELETE ABOUT STATS
===================================================== */

export const deleteAboutStats = async (req, res) => {
  try {
    const aboutStats = await AboutStats.findByIdAndDelete(req.params.id);

    if (!aboutStats) {
      return res.status(404).json({
        success: false,
        message: "About stats not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "About stats deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ABOUT STATS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete about stats",
      error: error.message,
    });
  }
};


/* =====================================================
   TOGGLE ACTIVE / INACTIVE
===================================================== */

export const toggleAboutStats = async (req, res) => {
  try {
    const { id } = req.params;

    const aboutStats = await AboutStats.findById(id);

    if (!aboutStats) {
      return res.status(404).json({
        success: false,
        message: "About stats not found",
      });
    }

    aboutStats.isActive = !aboutStats.isActive;

    await aboutStats.save();

    return res.status(200).json({
      success: true,
      message: `About stats ${
        aboutStats.isActive
          ? "activated"
          : "deactivated"
      } successfully`,
      data: aboutStats,
    });
  } catch (error) {
    console.error("TOGGLE ABOUT STATS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to change about stats status",
      error: error.message,
    });
  }
};