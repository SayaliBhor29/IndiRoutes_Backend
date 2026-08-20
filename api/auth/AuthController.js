import crypto from "crypto";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Admin from "../../models/Admin.js";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  return process.env.JWT_SECRET;
};

const createToken = (admin) =>
  jwt.sign(
    { id: admin._id.toString(), tokenVersion: admin.tokenVersion },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

const publicAdmin = (admin) => ({
  id: admin._id,
  name: admin.name,
  email: admin.email,
});

const getBearerToken = (req) => {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  return scheme === "Bearer" && token ? token : null;
};

const sendResetEmail = async (email, resetUrl) => {
  if (!process.env.SMTP_HOST) return false;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
      : undefined,
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Reset your IndiRoutes admin password",
    text: `Use this link to reset your password: ${resetUrl}`,
  });
  return true;
};

// POST /api/auth/register
// Only available until the first admin account is created.
export const register = asyncHandler(async (req, res) => {
  // Validate server configuration before creating an admin record.
  getJwtSecret();

  const { name, email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }
  if (password.length < 8) {
    res.status(400);
    throw new Error("Password must be at least 8 characters long");
  }

  const adminExists = await Admin.exists({});
  if (adminExists) {
    res.status(403);
    throw new Error("Admin registration is disabled after the first admin is created");
  }

  const admin = await Admin.create({ name, email, password });
  const adminWithTokenVersion = await Admin.findById(admin._id).select("+tokenVersion");
  res.status(201).json({
    success: true,
    message: "Admin registered successfully",
    token: createToken(adminWithTokenVersion),
    admin: publicAdmin(admin),
  });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select(
    "+password +tokenVersion"
  );
  if (!admin || !(await admin.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.status(200).json({ success: true, token: createToken(admin), admin: publicAdmin(admin) });
});

// POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    res.status(401);
    throw new Error("Bearer token is required");
  }

  let payload;
  try {
    payload = jwt.verify(token, getJwtSecret());
  } catch {
    res.status(401);
    throw new Error("Invalid or expired token");
  }

  const admin = await Admin.findById(payload.id).select("+tokenVersion");
  if (!admin || admin.tokenVersion !== payload.tokenVersion) {
    res.status(401);
    throw new Error("Token is no longer valid");
  }

  admin.tokenVersion += 1;
  await admin.save();
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select(
    "+resetPasswordToken +resetPasswordExpires"
  );
  const message = "If an account exists, password reset instructions have been sent.";
  if (!admin) return res.status(200).json({ success: true, message });

  const resetToken = crypto.randomBytes(32).toString("hex");
  admin.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  admin.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
  await admin.save();

  const resetBaseUrl = process.env.RESET_PASSWORD_URL;
  if (process.env.SMTP_HOST && resetBaseUrl) {
    const resetUrl = `${resetBaseUrl.replace(/\/$/, "")}/${resetToken}`;
    try {
      await sendResetEmail(admin.email, resetUrl);
    } catch (error) {
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpires = undefined;
      await admin.save();
      throw new Error("Unable to send password reset email");
    }
  }

  const response = { success: true, message };
  if (process.env.NODE_ENV !== "production" && (!process.env.SMTP_HOST || !resetBaseUrl)) {
    response.resetToken = resetToken;
    response.message = "Reset token returned because email is not configured.";
  } else if (!process.env.SMTP_HOST || !resetBaseUrl) {
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();
    throw new Error("Password reset email is not configured");
  }
  res.status(200).json(response);
});

// POST /api/auth/reset-password/:token
export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 8) {
    res.status(400);
    throw new Error("Password must be at least 8 characters long");
  }

  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const admin = await Admin.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  }).select("+password +tokenVersion +resetPasswordToken +resetPasswordExpires");

  if (!admin) {
    res.status(400);
    throw new Error("Password reset token is invalid or has expired");
  }

  admin.password = password;
  admin.resetPasswordToken = undefined;
  admin.resetPasswordExpires = undefined;
  admin.tokenVersion += 1;
  await admin.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
    token: createToken(admin),
    admin: publicAdmin(admin),
  });
});
