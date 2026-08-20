// import Logo from "../../../models/Logo.js";
// import fs from "fs";

// // import {
// //   getUploadedFilePath,
// //   normalizeImageFields,
// //   getLocalUploadFilePath,
// // } from "../../../utils/uploadpath.js";


// // =====================================================
// // CREATE MULTIPLE LOGOS
// // =====================================================

// export const createLogos = async (req, res, next) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Please upload at least one logo.",
//       });
//     }

//     const logos = req.files.map((file) => ({
//       image: getUploadedFilePath(file),
//     }));

//     const savedLogos = await Logo.insertMany(logos);

//     const normalizedLogos = normalizeImageFields(savedLogos);

//     return res.status(201).json({
//       success: true,
//       message: "Logos uploaded successfully.",
//       data: normalizedLogos,
//     });

//   } catch (error) {
//     next(error);
//   }
// };


// // =====================================================
// // GET ALL LOGOS
// // =====================================================

// export const getAllLogos = async (req, res, next) => {
//   try {
//     const logos = await Logo
//       .find()
//       .sort({ createdAt: -1 });

//     const normalizedLogos = normalizeImageFields(logos);

//     return res.status(200).json({
//       success: true,
//       data: normalizedLogos,
//     });

//   } catch (error) {
//     next(error);
//   }
// };


// // =====================================================
// // GET SINGLE LOGO
// // =====================================================

// export const getLogoById = async (req, res, next) => {
//   try {
//     const logo = await Logo.findById(req.params.id);

//     if (!logo) {
//       return res.status(404).json({
//         success: false,
//         message: "Logo not found.",
//       });
//     }

//     const normalizedLogo = normalizeImageFields(logo);

//     return res.status(200).json({
//       success: true,
//       data: normalizedLogo,
//     });

//   } catch (error) {
//     next(error);
//   }
// };


// // =====================================================
// // UPDATE LOGO
// // =====================================================

// export const updateLogo = async (req, res, next) => {
//   try {
//     const logo = await Logo.findById(req.params.id);

//     if (!logo) {
//       return res.status(404).json({
//         success: false,
//         message: "Logo not found.",
//       });
//     }


//     // ---------------------------------------------
//     // If new image uploaded
//     // ---------------------------------------------

//     if (req.file) {

//       // Delete old image
//       if (logo.image) {

//         const oldImagePath = getLocalUploadFilePath(
//           logo.image
//         );

//         if (oldImagePath) {

//           fs.unlink(oldImagePath, (err) => {

//             if (err && err.code !== "ENOENT") {
//               console.error(
//                 "Error deleting old logo image:",
//                 err
//               );
//             }

//           });

//         }
//       }


//       // Save new image path
//       logo.image = getUploadedFilePath(req.file);
//     }


//     await logo.save();

//     const normalizedLogo = normalizeImageFields(logo);

//     return res.status(200).json({
//       success: true,
//       message: "Logo updated successfully.",
//       data: normalizedLogo,
//     });

//   } catch (error) {
//     next(error);
//   }
// };


// // =====================================================
// // DELETE LOGO
// // =====================================================

// export const deleteLogo = async (req, res, next) => {
//   try {

//     const logo = await Logo.findById(req.params.id);

//     if (!logo) {
//       return res.status(404).json({
//         success: false,
//         message: "Logo not found.",
//       });
//     }


//     // ---------------------------------------------
//     // Delete image from uploads folder
//     // ---------------------------------------------

//     if (logo.image) {

//       const imagePath = getLocalUploadFilePath(
//         logo.image
//       );

//       if (imagePath) {

//         fs.unlink(imagePath, (err) => {

//           if (err && err.code !== "ENOENT") {
//             console.error(
//               "Error deleting logo image file:",
//               err
//             );
//           }

//         });

//       }
//     }


//     // ---------------------------------------------
//     // Delete database record
//     // ---------------------------------------------

//     await Logo.findByIdAndDelete(req.params.id);


//     return res.status(200).json({
//       success: true,
//       message: "Logo deleted successfully.",
//     });

//   } catch (error) {
//     next(error);
//   }
// };


import Logo from "../../../models/Logo.js";


// =====================================================
// CREATE MULTIPLE LOGOS
// =====================================================

export const createLogos = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one logo.",
      });
    }

    const logos = req.files.map((file) => ({
      image: file.location,
    }));

    const savedLogos = await Logo.insertMany(logos);

    return res.status(201).json({
      success: true,
      message: "Logos uploaded successfully.",
      data: savedLogos,
    });

  } catch (error) {
    next(error);
  }
};


// =====================================================
// GET ALL LOGOS
// =====================================================

export const getAllLogos = async (req, res, next) => {
  try {
    const logos = await Logo
      .find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: logos,
    });

  } catch (error) {
    next(error);
  }
};


// =====================================================
// GET SINGLE LOGO
// =====================================================

export const getLogoById = async (req, res, next) => {
  try {
    const logo = await Logo.findById(req.params.id);

    if (!logo) {
      return res.status(404).json({
        success: false,
        message: "Logo not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: logo,
    });

  } catch (error) {
    next(error);
  }
};


// =====================================================
// UPDATE LOGO
// =====================================================

export const updateLogo = async (req, res, next) => {
  try {
    const logo = await Logo.findById(req.params.id);

    if (!logo) {
      return res.status(404).json({
        success: false,
        message: "Logo not found.",
      });
    }


    // ---------------------------------------------
    // If new image uploaded to S3
    // ---------------------------------------------

    if (req.file) {
      logo.image = req.file.location;
    }


    await logo.save();

    return res.status(200).json({
      success: true,
      message: "Logo updated successfully.",
      data: logo,
    });

  } catch (error) {
    next(error);
  }
};


// =====================================================
// DELETE LOGO
// =====================================================

export const deleteLogo = async (req, res, next) => {
  try {
    const logo = await Logo.findById(req.params.id);

    if (!logo) {
      return res.status(404).json({
        success: false,
        message: "Logo not found.",
      });
    }


    // ---------------------------------------------
    // Delete database record
    // ---------------------------------------------

    await Logo.findByIdAndDelete(req.params.id);


    return res.status(200).json({
      success: true,
      message: "Logo deleted successfully.",
    });

  } catch (error) {
    next(error);
  }
};