// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import Gallery from "../../../models/Gallery.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const deleteImageFile = (image) => {
//   if (!image) return;

//   const imagePath = path.resolve(__dirname, "../../../", image);
//   fs.unlink(imagePath, (error) => {
//     if (error && error.code !== "ENOENT") {
//       console.error("Error deleting gallery image:", error);
//     }
//   });
// };

// // CREATE MULTIPLE GALLERY IMAGES
// export const createGalleryImages = async (req, res, next) => {
//   try {
//     if (!req.files?.length) {
//       return res.status(400).json({
//         success: false,
//         message: "Please upload at least one gallery image.",
//       });
//     }

//     const images = req.files.map((file) => ({
//       image: file.path.replace(/\\/g, "/"),
//     }));
//     const galleryImages = await Gallery.insertMany(images);

//     res.status(201).json({
//       success: true,
//       message: "Gallery images uploaded successfully.",
//       data: galleryImages,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // GET ALL
// export const getAllGalleryImages = async (req, res, next) => {
//   try {
//     const galleryImages = await Gallery.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, data: galleryImages });
//   } catch (error) {
//     next(error);
//   }
// };

// // GET SINGLE
// export const getGalleryImageById = async (req, res, next) => {
//   try {
//     const galleryImage = await Gallery.findById(req.params.id);
//     if (!galleryImage) {
//       return res.status(404).json({ success: false, message: "Gallery image not found." });
//     }

//     res.status(200).json({ success: true, data: galleryImage });
//   } catch (error) {
//     next(error);
//   }
// };

// // UPDATE SINGLE
// export const updateGalleryImage = async (req, res, next) => {
//   try {
//     const galleryImage = await Gallery.findById(req.params.id);
//     if (!galleryImage) {
//       return res.status(404).json({ success: false, message: "Gallery image not found." });
//     }

//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "New gallery image is required." });
//     }

//     deleteImageFile(galleryImage.image);
//     galleryImage.image = req.file.path.replace(/\\/g, "/");
//     await galleryImage.save();

//     res.status(200).json({
//       success: true,
//       message: "Gallery image updated successfully.",
//       data: galleryImage,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // DELETE SINGLE
// export const deleteGalleryImage = async (req, res, next) => {
//   try {
//     const galleryImage = await Gallery.findById(req.params.id);
//     if (!galleryImage) {
//       return res.status(404).json({ success: false, message: "Gallery image not found." });
//     }

//     deleteImageFile(galleryImage.image);
//     await Gallery.findByIdAndDelete(req.params.id);

//     res.status(200).json({ success: true, message: "Gallery image deleted successfully." });
//   } catch (error) {
//     next(error);
//   }
// };


import Gallery from "../../../models/Gallery.js";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

// =====================================================
// AWS S3 CLIENT
// =====================================================

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// =====================================================
// DELETE S3 IMAGE
// =====================================================

const deleteS3Image = async (key) => {
  if (!key) return;

  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
      })
    );

    console.log("Deleted S3 gallery image:", key);
  } catch (error) {
    console.error(
      "Error deleting gallery image from S3:",
      error
    );
  }
};

// =====================================================
// CREATE MULTIPLE GALLERY IMAGES
// =====================================================

export const createGalleryImages = async (req, res, next) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one gallery image.",
      });
    }

    const images = req.files.map((file) => ({
      image: file.location,
      s3Key: file.key,
    }));

    const galleryImages = await Gallery.insertMany(images);

    res.status(201).json({
      success: true,
      message: "Gallery images uploaded successfully.",
      data: galleryImages,
    });
  } catch (error) {
    console.error("Create Gallery Error:", error);
    next(error);
  }
};

// =====================================================
// GET ALL
// =====================================================

export const getAllGalleryImages = async (req, res, next) => {
  try {
    const galleryImages = await Gallery.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: galleryImages,
    });
  } catch (error) {
    console.error("Get Gallery Error:", error);
    next(error);
  }
};

// =====================================================
// GET SINGLE
// =====================================================

export const getGalleryImageById = async (req, res, next) => {
  try {
    const galleryImage = await Gallery.findById(
      req.params.id
    );

    if (!galleryImage) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: galleryImage,
    });
  } catch (error) {
    console.error("Get Gallery By ID Error:", error);
    next(error);
  }
};

// =====================================================
// UPDATE SINGLE
// =====================================================

export const updateGalleryImage = async (req, res, next) => {
  try {
    const galleryImage = await Gallery.findById(
      req.params.id
    );

    if (!galleryImage) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "New gallery image is required.",
      });
    }

    // Delete old S3 image
    if (galleryImage.s3Key) {
      await deleteS3Image(galleryImage.s3Key);
    }

    // Save new S3 image
    galleryImage.image = req.file.location;
    galleryImage.s3Key = req.file.key;

    await galleryImage.save();

    res.status(200).json({
      success: true,
      message: "Gallery image updated successfully.",
      data: galleryImage,
    });
  } catch (error) {
    console.error("Update Gallery Error:", error);
    next(error);
  }
};

// =====================================================
// DELETE SINGLE
// =====================================================

export const deleteGalleryImage = async (req, res, next) => {
  try {
    const galleryImage = await Gallery.findById(
      req.params.id
    );

    if (!galleryImage) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found.",
      });
    }

    // Delete from S3
    if (galleryImage.s3Key) {
      await deleteS3Image(galleryImage.s3Key);
    }

    // Delete MongoDB document
    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Gallery image deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Gallery Error:", error);
    next(error);
  }
};