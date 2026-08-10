import express from "express";

import {
  createContact,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} from "./ContactController.js";

import uploadContact from "../../middleware/uploadContact.js";

const router = express.Router();


// Submit contact form
router.post(
  "/",
  uploadContact.single("attachment"),
  createContact
);


// Get all enquiries
router.get("/", getContacts);


// Get single enquiry
router.get("/:id", getContactById);


// Update enquiry status
router.patch(
  "/:id/status",
  updateContactStatus
);


// Delete enquiry
router.delete(
  "/:id",
  deleteContact
);

export default router;