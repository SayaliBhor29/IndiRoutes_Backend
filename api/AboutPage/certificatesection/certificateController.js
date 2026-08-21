// import Certificate from "../../../models/Certificate.js";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const deleteImageFile = (image) => {
//   if (!image) return;

//   const imagePath = path.resolve(__dirname, "../../../", image);
//   fs.unlink(imagePath, (error) => {
//     if (error && error.code !== "ENOENT") {
//       console.error("Error deleting certificate image:", error);
//     }
//   });
// };

// // CREATE
// export const createCertificate = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "Certificate image is required",
//       });
//     }

//     const certificate = await Certificate.create({
//       image: req.file.path.replace(/\\/g, "/"),
//     });

//     res.status(201).json({
//       success: true,
//       message: "Certificate uploaded successfully",
//       data: certificate,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to upload certificate",
//       error: error.message,
//     });
//   }
// };

// // GET ALL
// export const getAllCertificates = async (req, res) => {
//   try {
//     const certificates = await Certificate.find()
//       .sort({ createdAt: -1 })
//       .lean();

//     res.status(200).json({
//       success: true,
//       data: certificates,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to get certificates",
//       error: error.message,
//     });
//   }
// };

// // GET SINGLE
// export const getCertificateById = async (req, res) => {
//   try {
//     const certificate = await Certificate.findById(req.params.id);

//     if (!certificate) {
//       return res.status(404).json({
//         success: false,
//         message: "Certificate not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: certificate,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to get certificate",
//       error: error.message,
//     });
//   }
// };

// // UPDATE IMAGE
// export const updateCertificate = async (req, res) => {
//   try {
//     const certificate = await Certificate.findById(req.params.id);

//     if (!certificate) {
//       return res.status(404).json({
//         success: false,
//         message: "Certificate not found",
//       });
//     }

//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "New certificate image is required",
//       });
//     }

//     deleteImageFile(certificate.image);

//     certificate.image = req.file.path.replace(/\\/g, "/");

//     await certificate.save();

//     res.status(200).json({
//       success: true,
//       message: "Certificate updated successfully",
//       data: certificate,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to update certificate",
//       error: error.message,
//     });
//   }
// };

// // DELETE
// export const deleteCertificate = async (req, res) => {
//   try {
//     const certificate = await Certificate.findById(req.params.id);

//     if (!certificate) {
//       return res.status(404).json({
//         success: false,
//         message: "Certificate not found",
//       });
//     }

//     deleteImageFile(certificate.image);

//     await Certificate.findByIdAndDelete(req.params.id);

//     res.status(200).json({
//       success: true,
//       message: "Certificate deleted successfully",
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to delete certificate",
//       error: error.message,
//     });
//   }
// };


import Certificate from "../../../models/Certificate.js";

import {
  S3Client,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Delete image from S3
const deleteS3Image = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    const bucket = process.env.AWS_S3_BUCKET_NAME;

    let key = "";

    // If stored as full S3 URL
    if (imageUrl.includes(".amazonaws.com/")) {
      key = imageUrl.split(".amazonaws.com/")[1];
    }

    // If stored as S3 key
    else {
      key = imageUrl;
    }

    if (!key) return;

    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: decodeURIComponent(key),
      })
    );

    console.log("Certificate deleted from S3:", key);
  } catch (error) {
    console.error(
      "Error deleting certificate image from S3:",
      error
    );
  }
};

// CREATE
export const createCertificate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Certificate image is required",
      });
    }

    const certificate = await Certificate.create({
      image: req.file.location,
      s3Key: req.file.key,
    });

    res.status(201).json({
      success: true,
      message: "Certificate uploaded successfully",
      data: certificate,
    });
  } catch (error) {
    console.error("Create certificate error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload certificate",
      error: error.message,
    });
  }
};

// GET ALL
export const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: certificates,
    });
  } catch (error) {
    console.error("Get certificates error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get certificates",
      error: error.message,
    });
  }
};

// GET SINGLE
export const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(
      req.params.id
    );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    console.error("Get certificate error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get certificate",
      error: error.message,
    });
  }
};

// UPDATE IMAGE
export const updateCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(
      req.params.id
    );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "New certificate image is required",
      });
    }

    // Delete old S3 image
    if (certificate.s3Key) {
      await deleteS3Image(certificate.s3Key);
    } else if (certificate.image) {
      await deleteS3Image(certificate.image);
    }

    // Save new image
    certificate.image = req.file.location;
    certificate.s3Key = req.file.key;

    await certificate.save();

    res.status(200).json({
      success: true,
      message: "Certificate updated successfully",
      data: certificate,
    });
  } catch (error) {
    console.error("Update certificate error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update certificate",
      error: error.message,
    });
  }
};

// DELETE
export const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(
      req.params.id
    );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    // Delete image from S3
    if (certificate.s3Key) {
      await deleteS3Image(certificate.s3Key);
    } else if (certificate.image) {
      await deleteS3Image(certificate.image);
    }

    // Delete MongoDB record
    await Certificate.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Certificate deleted successfully",
    });
  } catch (error) {
    console.error("Delete certificate error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete certificate",
      error: error.message,
    });
  }
};