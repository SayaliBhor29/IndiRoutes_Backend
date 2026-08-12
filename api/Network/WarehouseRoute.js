import express from "express";

import {
  getWarehouses,
  getAllWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "./WarehouseController.js";

const router = express.Router();

router.get("/", getWarehouses);

router.get("/all", getAllWarehouses);

router.post("/", createWarehouse);

router.put("/:id", updateWarehouse);

router.delete("/:id", deleteWarehouse);

export default router;