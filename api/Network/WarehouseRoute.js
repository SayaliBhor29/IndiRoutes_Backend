import express from "express";
import upload from "../../middleware/upload.js";

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

router.post("/", upload.single("image"), createWarehouse);

router.put("/:id", upload.single("image"), updateWarehouse);

router.delete("/:id", deleteWarehouse);

export default router;
