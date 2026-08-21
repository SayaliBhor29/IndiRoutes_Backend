// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import DownloadResource from "../../../models/DownloadResource.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const deleteFile = (fileUrl) => {
//   if (!fileUrl) return;

//   const relativePath = fileUrl.replace(/^[/\\]+/, "");
//   const filePath = path.resolve(__dirname, "../../../", relativePath);
//   fs.unlink(filePath, (error) => {
//     if (error && error.code !== "ENOENT") console.error("Error deleting resource file:", error);
//   });
// };

// const fileUrl = (file) => `/uploads/${file.filename}`;
// const normalizeResourceType = (type) => type?.trim().toLowerCase();

// export const createDownloadResource = async (req, res, next) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "A resource file is required." });
//     }

//     const resource = await DownloadResource.create({
//       title: req.body.title,
//       description: req.body.description,
//       type: normalizeResourceType(req.body.type),
//       file: fileUrl(req.file),
//       originalName: req.file.originalname,
//     });

//     res.status(201).json({ success: true, message: "Resource uploaded successfully.", data: resource });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getAllDownloadResources = async (req, res, next) => {
//   try {
//     const resources = await DownloadResource.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, data: resources });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getDownloadResourceById = async (req, res, next) => {
//   try {
//     const resource = await DownloadResource.findById(req.params.id);
//     if (!resource) return res.status(404).json({ success: false, message: "Resource not found." });

//     res.status(200).json({ success: true, data: resource });
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateDownloadResource = async (req, res, next) => {
//   try {
//     const resource = await DownloadResource.findById(req.params.id);
//     if (!resource) return res.status(404).json({ success: false, message: "Resource not found." });

//     const previousFile = resource.file;
//     if (req.body.title !== undefined) resource.title = req.body.title;
//     if (req.body.description !== undefined) resource.description = req.body.description;
//     if (req.body.type !== undefined) resource.type = normalizeResourceType(req.body.type);
//     if (req.file) {
//       resource.file = fileUrl(req.file);
//       resource.originalName = req.file.originalname;
//     }

//     await resource.save();
//     if (req.file) deleteFile(previousFile);

//     res.status(200).json({ success: true, message: "Resource updated successfully.", data: resource });
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteDownloadResource = async (req, res, next) => {
//   try {
//     const resource = await DownloadResource.findById(req.params.id);
//     if (!resource) return res.status(404).json({ success: false, message: "Resource not found." });

//     await DownloadResource.findByIdAndDelete(req.params.id);
//     deleteFile(resource.file);

//     res.status(200).json({ success: true, message: "Resource deleted successfully." });
//   } catch (error) {
//     next(error);
//   }
// };


import {
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import DownloadResource from "../../../models/DownloadResource.js";

const s3 = new S3Client({
  region: process.env.AWS_REGION,

  credentials: {
    accessKeyId:
      process.env.AWS_ACCESS_KEY_ID,

    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const normalizeResourceType = (type) =>
  type?.trim().toLowerCase();

const deleteS3File = async (fileUrl) => {
  try {
    if (!fileUrl) return;

    const url = new URL(fileUrl);

    const key = decodeURIComponent(
      url.pathname.substring(1)
    );

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
      })
    );

    console.log(
      "S3 file deleted:",
      key
    );
  } catch (error) {
    console.error(
      "Error deleting S3 resource:",
      error
    );
  }
};

// =====================================================
// CREATE
// =====================================================

export const createDownloadResource = async (
  req,
  res,
  next
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "A resource file is required.",
      });
    }

    const resource =
      await DownloadResource.create({
        title: req.body.title,

        description:
          req.body.description,

        type: normalizeResourceType(
          req.body.type
        ),

        file: req.file.location,

        originalName:
          req.file.originalname,
      });

    res.status(201).json({
      success: true,

      message:
        "Resource uploaded successfully.",

      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET ALL
// =====================================================

export const getAllDownloadResources =
  async (req, res, next) => {
    try {
      const resources =
        await DownloadResource.find()
          .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: resources,
      });
    } catch (error) {
      next(error);
    }
  };

// =====================================================
// GET SINGLE
// =====================================================

export const getDownloadResourceById =
  async (req, res, next) => {
    try {
      const resource =
        await DownloadResource.findById(
          req.params.id
        );

      if (!resource) {
        return res.status(404).json({
          success: false,
          message:
            "Resource not found.",
        });
      }

      res.status(200).json({
        success: true,
        data: resource,
      });
    } catch (error) {
      next(error);
    }
  };

// =====================================================
// UPDATE
// =====================================================

export const updateDownloadResource =
  async (req, res, next) => {
    try {
      const resource =
        await DownloadResource.findById(
          req.params.id
        );

      if (!resource) {
        return res.status(404).json({
          success: false,
          message:
            "Resource not found.",
        });
      }

      const previousFile =
        resource.file;

      if (
        req.body.title !== undefined
      ) {
        resource.title =
          req.body.title;
      }

      if (
        req.body.description !==
        undefined
      ) {
        resource.description =
          req.body.description;
      }

      if (
        req.body.type !== undefined
      ) {
        resource.type =
          normalizeResourceType(
            req.body.type
          );
      }

      if (req.file) {
        resource.file =
          req.file.location;

        resource.originalName =
          req.file.originalname;
      }

      await resource.save();

      if (req.file && previousFile) {
        await deleteS3File(
          previousFile
        );
      }

      res.status(200).json({
        success: true,

        message:
          "Resource updated successfully.",

        data: resource,
      });
    } catch (error) {
      next(error);
    }
  };

// =====================================================
// DELETE
// =====================================================

export const deleteDownloadResource =
  async (req, res, next) => {
    try {
      const resource =
        await DownloadResource.findById(
          req.params.id
        );

      if (!resource) {
        return res.status(404).json({
          success: false,
          message:
            "Resource not found.",
        });
      }

      await DownloadResource.findByIdAndDelete(
        req.params.id
      );

      await deleteS3File(
        resource.file
      );

      res.status(200).json({
        success: true,

        message:
          "Resource deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  };