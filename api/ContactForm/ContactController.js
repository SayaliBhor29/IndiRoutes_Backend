import Contact from "../../models/Contact.js";


// CREATE CONTACT
export const createContact = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      companyName,
      subject,
      message,
      privacyAccepted,
    } = req.body;

    // Required fields
    if (
      !fullName ||
      !email ||
      !phone ||
      !subject ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Full name, email, phone, subject and message are required",
      });
    }

    // Privacy validation
    const accepted =
      privacyAccepted === true ||
      privacyAccepted === "true";

    if (!accepted) {
      return res.status(400).json({
        success: false,
        message:
          "Please accept Privacy Policy and Terms of Use",
      });
    }

    // Attachment
    let attachment = "";

    if (req.file) {
      attachment = `/uploads/contact/${req.file.filename}`;
    }

    const contact = await Contact.create({
      fullName,
      email,
      phone,
      companyName,
      subject,
      message,
      attachment,
      privacyAccepted: true,
    });

    res.status(201).json({
      success: true,
      message:
        "Your message has been submitted successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Create Contact Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit contact form",
      error: error.message,
    });
  }
};


// GET ALL CONTACTS
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error("Get Contacts Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
      error: error.message,
    });
  }
};


// GET SINGLE CONTACT
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(
      req.params.id
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Get Contact Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch contact",
      error: error.message,
    });
  }
};


// UPDATE STATUS
export const updateContactStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "new",
      "read",
      "replied",
      "closed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const contact =
      await Contact.findByIdAndUpdate(
        req.params.id,
        { status },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact status updated",
      data: contact,
    });
  } catch (error) {
    console.error(
      "Update Contact Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update contact status",
      error: error.message,
    });
  }
};


// DELETE CONTACT
export const deleteContact = async (req, res) => {
  try {
    const contact =
      await Contact.findByIdAndDelete(
        req.params.id
      );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Delete Contact Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete contact",
      error: error.message,
    });
  }
};