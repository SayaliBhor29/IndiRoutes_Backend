import express from "express";

import {
  getCarrierOpenings,
  getAllCarrierOpenings,
  createCarrierOpening,
  updateCarrierOpening,
  deleteCarrierOpening,
} from "./carrierOpeningController.js";

const router = express.Router();

router.get("/", getCarrierOpenings);

router.get("/all", getAllCarrierOpenings);

router.post("/", createCarrierOpening);

router.put("/:id", updateCarrierOpening);

router.delete("/:id", deleteCarrierOpening);

export default router;