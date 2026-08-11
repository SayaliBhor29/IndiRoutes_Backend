import express from "express";
import {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} from "./BannerController.js";
import createUploadMiddleware from "../../../middleware/upload.js";

const upload = createUploadMiddleware("banners");

const router = express.Router();

router
  .route("/")
  .get(getBanners)
  .post(upload.single("image"), createBanner);

router.route("/:id").get(getBannerById).put(upload.single("image"), updateBanner).delete(deleteBanner);

export default router;