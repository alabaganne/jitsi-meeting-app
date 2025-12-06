require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { json } = require("body-parser");

const authRoutes = require("./routes/auth");
const meetingRoutes = require("./routes/meetings");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(json());

// Health check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Jitsi Meet API Server",
        version: "1.0.0",
    });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});
