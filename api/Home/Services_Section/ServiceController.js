// import Service from "../../../models/ServiceModel.js";
// import { getUploadedFilePath, normalizeImageFields } from "../../../utils/uploadPath.js";

// export const getServices = async (req, res) => {
//   try {
//     const services = await Service.find({ isActive: true })
//       .sort({ order: 1 })
//       .select("-__v");

//     res.status(200).json({
//       success: true,
//       data: normalizeImageFields(services),
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch services",
//       error: error.message,
//     });
//   }
// };

// export const getServiceById = async (req, res) => {
//   try {
//     const service = await Service.findById(req.params.id);

//     if (!service) {
//       return res.status(404).json({
//         success: false,
//         message: "Service not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: normalizeImageFields(service),
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch service",
//       error: error.message,
//     });
//   }
// };

// export const createService = async (req, res) => {
//   try {
//     // Support both single object and array
//     const data = Array.isArray(req.body) ? req.body : [req.body];
//     const image = getUploadedFilePath(req.file);
//     const servicesToCreate = data.map((service) => ({
//       ...service,
//       ...(image ? { image } : {}),
//     }));

//     const services = await Service.insertMany(servicesToCreate);

//     res.status(201).json({
//       success: true,
//       message: `${services.length} service(s) created successfully`,
//       data: normalizeImageFields(services),
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to create service",
//       error: error.message,
//     });
//   }
// };

// export const updateService = async (req, res) => {
//   try {
//     const updateData = { ...req.body };
//     const image = getUploadedFilePath(req.file);
//     if (image) {
//       updateData.image = image;
//     }

//     const service = await Service.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!service) {
//       return res.status(404).json({
//         success: false,
//         message: "Service not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Service updated successfully",
//       data: normalizeImageFields(service),
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to update service",
//       error: error.message,
//     });
//   }
// };

// export const deleteService = async (req, res) => {
//   try {
//     const service = await Service.findByIdAndDelete(req.params.id);

//     if (!service) {
//       return res.status(404).json({
//         success: false,
//         message: "Service not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Service deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to delete service",
//       error: error.message,
//     });
//   }
// };


import Service from "../../../models/ServiceModel.js";

export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .sort({ order: 1 })
      .select("-__v");

    res.status(200).json({
      success: true,
<<<<<<< HEAD
      data: normalizeImageFields(services),
=======
      data: services,
>>>>>>> 3fd17596fbc856103d26f00f07556d27f530d665
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error: error.message,
    });
  }
};

<<<<<<< HEAD
=======

>>>>>>> 3fd17596fbc856103d26f00f07556d27f530d665
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
<<<<<<< HEAD
      data: normalizeImageFields(service),
=======
      data: service,
>>>>>>> 3fd17596fbc856103d26f00f07556d27f530d665
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch service",
      error: error.message,
    });
  }
};

<<<<<<< HEAD
export const createService = async (req, res) => {
  try {
    // Support both single object and array
    const data = Array.isArray(req.body) ? req.body : [req.body];
    const image = getUploadedFilePath(req.file);
    const servicesToCreate = data.map((service) => ({
      ...service,
      ...(image ? { image } : {}),
    }));

    const services = await Service.insertMany(servicesToCreate);

    res.status(201).json({
      success: true,
      message: `${services.length} service(s) created successfully`,
      data: normalizeImageFields(services),
=======

export const createService = async (req, res) => {
  try {
    const serviceData = {
      ...req.body,
    };

    // S3 uploaded image
    if (req.file) {
      serviceData.image = req.file.location;
    }

    const service = await Service.create(serviceData);

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
>>>>>>> 3fd17596fbc856103d26f00f07556d27f530d665
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create service",
      error: error.message,
    });
  }
};

<<<<<<< HEAD
export const updateService = async (req, res) => {
  try {
    const updateData = { ...req.body };
    const image = getUploadedFilePath(req.file);
    if (image) {
      updateData.image = image;
=======

export const updateService = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    // Replace image only if new image uploaded
    if (req.file) {
      updateData.image = req.file.location;
>>>>>>> 3fd17596fbc856103d26f00f07556d27f530d665
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
<<<<<<< HEAD
      { new: true, runValidators: true }
=======
      {
        new: true,
        runValidators: true,
      }
>>>>>>> 3fd17596fbc856103d26f00f07556d27f530d665
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
<<<<<<< HEAD
      data: normalizeImageFields(service),
=======
      data: service,
>>>>>>> 3fd17596fbc856103d26f00f07556d27f530d665
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update service",
      error: error.message,
    });
  }
};

<<<<<<< HEAD
=======

>>>>>>> 3fd17596fbc856103d26f00f07556d27f530d665
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

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
    res.status(500).json({
      success: false,
      message: "Failed to delete service",
      error: error.message,
    });
  }
<<<<<<< HEAD
};
=======
};
>>>>>>> 3fd17596fbc856103d26f00f07556d27f530d665
