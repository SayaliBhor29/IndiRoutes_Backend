// import express from "express";

// import {
//   createCertificate,
//   getAllCertificates,
//   getCertificateById,
//   updateCertificate,
//   deleteCertificate,
// } from "./certificateController.js";
// import upload from "../../../middleware/upload.js";

// const router = express.Router();

// // CREATE
// router.post("/create", upload.single("image"), createCertificate);

// // GET ALL
// router.get(
//   "/getAll",
//   getAllCertificates
// );

// // GET SINGLE
// router.get(
//   "/get/:id",
//   getCertificateById
// );

// // UPDATE
// router.put("/update/:id", upload.single("image"), updateCertificate);

// // DELETE
// router.delete(
//   "/delete/:id",
//   deleteCertificate
// );

// export default router;


import express from "express";

import {
  createCertificate,
  getAllCertificates,
  getCertificateById,
  updateCertificate,
  deleteCertificate,
} from "./certificateController.js";

import s3Upload from "../../../middleware/upload.js";

const router = express.Router();

// CREATE
router.post(
  "/create",
  s3Upload.single("image"),
  createCertificate
);

// GET ALL
router.get(
  "/getAll",
  getAllCertificates
);

// GET SINGLE
router.get(
  "/get/:id",
  getCertificateById
);

// UPDATE
router.put(
  "/update/:id",
  s3Upload.single("image"),
  updateCertificate
);

// DELETE
router.delete(
  "/delete/:id",
  deleteCertificate
);

export default router;