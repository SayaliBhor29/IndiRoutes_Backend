import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    companyName: {
      type: String,
      trim: true,
      default: "",
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    attachment: {
      type: String,
      default: "",
    },

    privacyAccepted: {
      type: Boolean,
      required: true,
      validate: {
        validator: function (value) {
          return value === true;
        },
        message: "Privacy Policy must be accepted",
      },
    },

    status: {
      type: String,
      enum: ["new", "read", "replied", "closed"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

const Contact =
  mongoose.models.Contact ||
  mongoose.model("Contact", contactSchema);

export default Contact;