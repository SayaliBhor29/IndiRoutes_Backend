import express from "express";

import {
  getFleetInfrastructure,
  createFleetInfrastructure,
  updateFleetInfrastructure,
  deleteFleetInfrastructure,
} from "./fleetInfrastructureController.js";

const router = express.Router();

router.get("/", getFleetInfrastructure);

router.post("/", createFleetInfrastructure);

router.put("/:id", updateFleetInfrastructure);

router.delete("/:id", deleteFleetInfrastructure);

export default router;