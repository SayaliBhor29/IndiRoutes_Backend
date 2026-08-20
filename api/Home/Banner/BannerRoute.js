// import express from "express";
// import {
//   getBanners,
//   getBannerById,
//   createBanner,
//   updateBanner,
//   deleteBanner,
// } from "./BannerController.js";
// import upload from "../../../middleware/upload.js";

// // const upload = createUploadMiddleware("banners");

// const router = express.Router();

// router
//   .route("/")
//   .get(getBanners)
//   .post(upload.single("image"), createBanner);

// router.route("/:id").get(getBannerById).put(upload.single("image"), updateBanner).delete(deleteBanner);

// export default router;

import express from "express";
import upload from "../../../middleware/upload.js";

import {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} from "./BannerController.js";

const router = express.Router();

router.get("/", getBanners);

router.get("/:id", getBannerById);

router.post(
  "/",
  upload.single("image"),
  createBanner
);

router.put(
  "/:id",
  upload.single("image"),
  updateBanner
);

router.delete(
  "/:id",
  deleteBanner
);

export default router;