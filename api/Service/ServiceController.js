import Service from "../../models/Service.js";

// GET all services
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({
      isActive: true,
    })
      .sort({ category: 1, order: 1 })
      .select("category title description icon order isActive");

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("Get Services Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error: error.message,
    });
  }
};


// GET main services
export const getMainServices = async (req, res) => {
  try {
    const services = await Service.find({
      category: "main",
      isActive: true,
    })
      .sort({ order: 1 })
      .select("title description icon order");

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("Get Main Services Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch main services",
      error: error.message,
    });
  }
};


// GET regular services
export const getRegularServices = async (req, res) => {
  try {
    const services = await Service.find({
      category: "service",
      isActive: true,
    })
      .sort({ order: 1 })
      .select("title description icon order");

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("Get Regular Services Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch regular services",
      error: error.message,
    });
  }
};


// CREATE service
export const createService = async (req, res) => {
  try {
    const {
      category,
      title,
      description,
      icon,
      order,
      isActive,
    } = req.body;

    if (!category || !title || !description || !icon) {
      return res.status(400).json({
        success: false,
        message: "Category, title, description and icon are required",
      });
    }

    if (!["main", "service"].includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Category must be either main or service",
      });
    }

    const service = await Service.create({
      category,
      title,
      description,
      icon,
      order,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    console.error("Create Service Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create service",
      error: error.message,
    });
  }
};


// UPDATE service
export const updateService = async (req, res) => {
  try {
    const {
      category,
      title,
      description,
      icon,
      order,
      isActive,
    } = req.body;

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        category,
        title,
        description,
        icon,
        order,
        isActive,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    console.error("Update Service Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update service",
      error: error.message,
    });
  }
};


// DELETE service
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(
      req.params.id
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Delete Service Error:", error);

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  }
};