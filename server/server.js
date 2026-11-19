
const path = require("path");

// Load environment variables from server/.env
require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const express = require("express");
const cors = require("cors");

const db = require("./config/db");
const authRoutes = require("./routes/auth");
const scanRoutes = require("./routes/scans");
const diyRoutes = require("./routes/diyideas");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route
app.get("/", (req, res) => {
    res.status(200).send("EcoLens AI Backend is running");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/scans", scanRoutes);
app.use("/api/diy", diyRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
