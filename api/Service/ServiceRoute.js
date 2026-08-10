import express from "express";

import {
  getServices,
  getMainServices,
  getRegularServices,
  createService,
  updateService,
  deleteService,
} from "./serviceController.js";

const router = express.Router();

router.get("/", getServices);
router.get("/main", getMainServices);
router.get("/regular", getRegularServices);

router.post("/", createService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export default router;