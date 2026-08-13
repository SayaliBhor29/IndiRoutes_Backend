import FleetStat from "../../models/FleetStat.js";

// CREATE
export const createFleetStat = async (req, res) => {
  try {
    const { icon, number, title, desc, order, isActive } = req.body;

    const fleetStat = await FleetStat.create({
      icon,
      number,
      title,
      desc,
      order,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Fleet stat created successfully",
      data: fleetStat,
    });
  } catch (error) {
    console.error("Create Fleet Stat Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create fleet stat",
      error: error.message,
    });
  }
};


// GET ALL ACTIVE
export const getFleetStats = async (req, res) => {
  try {
    const fleetStats = await FleetStat.find({
      isActive: true,
    }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: fleetStats,
    });
  } catch (error) {
    console.error("Get Fleet Stats Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch fleet stats",
      error: error.message,
    });
  }
};


// GET ALL - ADMIN
export const getAllFleetStats = async (req, res) => {
  try {
    const fleetStats = await FleetStat.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: fleetStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch fleet stats",
      error: error.message,
    });
  }
};


// GET SINGLE
export const getFleetStatById = async (req, res) => {
  try {
    const fleetStat = await FleetStat.findById(req.params.id);

    if (!fleetStat) {
      return res.status(404).json({
        success: false,
        message: "Fleet stat not found",
      });
    }

    res.status(200).json({
      success: true,
      data: fleetStat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch fleet stat",
      error: error.message,
    });
  }
};


// UPDATE
export const updateFleetStat = async (req, res) => {
  try {
    const fleetStat = await FleetStat.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!fleetStat) {
      return res.status(404).json({
        success: false,
        message: "Fleet stat not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fleet stat updated successfully",
      data: fleetStat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update fleet stat",
      error: error.message,
    });
  }
};


// DELETE
export const deleteFleetStat = async (req, res) => {
  try {
    const fleetStat = await FleetStat.findByIdAndDelete(req.params.id);

    if (!fleetStat) {
      return res.status(404).json({
        success: false,
        message: "Fleet stat not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fleet stat deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete fleet stat",
      error: error.message,
    });
  }
};