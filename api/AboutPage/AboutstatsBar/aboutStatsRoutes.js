import express from "express";

import {
  createAboutStats,
  getAllAboutStats,
  getActiveAboutStats,
  getAboutStatsById,
  updateAboutStats,
  deleteAboutStats,
  toggleAboutStats,
} from "./aboutStatsController.js";

const router = express.Router();

/*
    CREATE
    POST /api/about-stats/create
*/
router.post("/create", createAboutStats);


/*
    GET ALL
    GET /api/about-stats/getAll
*/
router.get("/getAll", getAllAboutStats);


/*
    GET ACTIVE
    GET /api/about-stats/getActive
*/
router.get("/getActive", getActiveAboutStats);


/*
    GET SINGLE
    GET /api/about-stats/get/:id
*/
router.get("/get/:id", getAboutStatsById);


/*
    UPDATE
    PUT /api/about-stats/update/:id
*/
router.put("/update/:id", updateAboutStats);


/*
    DELETE
    DELETE /api/about-stats/delete/:id
*/
router.delete("/delete/:id", deleteAboutStats);


/*
    TOGGLE ACTIVE / INACTIVE
    PATCH /api/about-stats/toggle/:id
*/
router.patch("/toggle/:id", toggleAboutStats);

export default router;