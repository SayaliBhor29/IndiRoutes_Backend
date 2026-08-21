// import express from "express";
// import upload from "../../../middleware/upload.js";
// import {
//   createDownloadResource,
//   deleteDownloadResource,
//   getAllDownloadResources,
//   getDownloadResourceById,
//   updateDownloadResource,
// } from "./downloadController.js";

// const router = express.Router();

// router.post("/create", upload.single("file"), createDownloadResource);
// router.get("/all", getAllDownloadResources);
// router.get("/:id", getDownloadResourceById);
// router.put("/update/:id", upload.single("file"), updateDownloadResource);
// router.delete("/delete/:id", deleteDownloadResource);

// export default router;


import express from "express";

import upload from "../../../middleware/upload.js";

import {
  createDownloadResource,
  deleteDownloadResource,
  getAllDownloadResources,
  getDownloadResourceById,
  updateDownloadResource,
} from "./downloadController.js";

const router = express.Router();

router.post(
  "/create",
  upload.single("file"),
  createDownloadResource
);

router.get(
  "/all",
  getAllDownloadResources
);

router.get(
  "/:id",
  getDownloadResourceById
);

router.put(
  "/update/:id",
  upload.single("file"),
  updateDownloadResource
);

router.delete(
  "/delete/:id",
  deleteDownloadResource
);

export default router;