import express from "express";
import {
  getLogos,
  createLogos,
  deleteLogo,
} from "./logoController.js";
import createUploadMiddleware from "../../../middleware/upload.js";

// Create a multer instance for the 'logos' sub-directory
const upload = createUploadMiddleware("logos");

const router = express.Router();

// Use upload.array() to handle multiple files under the 'images' field name
router.route("/")
  .get(getLogos)
  .post(upload.array("images", 20), createLogos); // Allow up to 20 images

router.route("/:id").delete(deleteLogo);

export default router;