import express from "express";
import {
  getSeoByPage,
  getAllSeo,
  createSeo,
  updateSeo,
  deleteSeo,
} from "./SeoController.js";

const router = express.Router();

router.route("/").get(getAllSeo).post(createSeo);
router
  .route("/:page")
  .get(getSeoByPage)
  .put(updateSeo)
  .delete(deleteSeo);

export default router;