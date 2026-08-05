import express from "express";
import {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} from "./BannerController.js";

const router = express.Router();

router.route("/").get(getBanners).post(createBanner);

router.route("/:id").get(getBannerById).put(updateBanner).delete(deleteBanner);

export default router;