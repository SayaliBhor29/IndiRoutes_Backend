import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
// Routes
import bannerRoutes from "./api/Home/Banner/BannerRoute.js";
import seoRoutes from "./api/Seo/SeoRoute.js";
import logoRoutes from "./api/Home/proudlyservelogos/logoRoutes.js";
import authRoutes from "./api/auth/AuthRoute.js";
import ServiceRoutes from "./api/Home/Services_Section/ServiceRoute.js";
// import aboutRoutes from "./api/About/AboutRoute.js"; // add later
import testimonialRoutes from "./api/Home/testimonial/testimonialRoutes.js";
import industryRoutes from "./api/Home/Industry/IndustryRoute.js";
import fleetInfrastructureRoutes from "./api/Home/FleetInfrastructure/fleetInfrastructureRoute.js";
import warehouseRoutes from "./api/Network/WarehouseRoute.js";
import ContactRoutes from "./api/ContactForm/ContactRoute.js";
import CarrierOpening from "./api/contact/carrierOpeningRoutes.js";
import Service from "./api/Service/ServiceRoute.js";
import Blog from "./api/Blog/BlogRoute.js";

// Error middleware (create if you don't have it)
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in .env before starting the server");
}
connectDB();

const app = express();

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // change port if needed
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Static folder for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// API Routes
app.use("/api/seo", seoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/home/banner", bannerRoutes);
app.use("/api/services", ServiceRoutes);
app.use("/api/industries", industryRoutes);
app.use("/api/fleet-infrastructure", fleetInfrastructureRoutes);
app.use("/api/service", Service);
app.use("/api/warehouses",warehouseRoutes);
app.use("/api/contacts",ContactRoutes);
app.use("/api/carrier-openings",CarrierOpening);
app.use("/api/blog", Blog);
// app.use("/api/about", aboutRoutes);
app.use("/api/logos", logoRoutes);
app.use(
  "/api/testimonial",
  testimonialRoutes
);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "IndiRoutes Backend API is running..." });
});

// Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *
Allow: /
Sitemap:https://main.d2s904457hjke6.amplifyapp.com/sitemap.xml`);
});

app.get("/sitemap.xml", async (req, res) => {
  try {
    const pages = [
      { url: "https://main.d2s904457hjke6.amplifyapp.com/", priority: "1.0", changefreq: "daily" },
      { url: "https://main.d2s904457hjke6.amplifyapp.com/about", priority: "0.8", changefreq: "monthly" },
      { url: "https://main.d2s904457hjke6.amplifyapp.com/services", priority: "0.9", changefreq: "weekly" },
      { url: "https://main.d2s904457hjke6.amplifyapp.com/contact", priority: "0.7", changefreq: "monthly" },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    pages.forEach((page) => {
      xml += `
  <url>
    <loc>${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    res.status(500).send("Error generating sitemap");
  }
});
