
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const db = require("../config/db");

const router = express.Router();

// Image storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname).toLowerCase();

        cb(null, uniqueName);
    }
});

// Upload configuration
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed."));
        }
    }
});

// 1. Upload image and classify waste using AI
router.post("/", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: "Please upload an image."
        });
    }

    const { user_id } = req.body;
    const imagePath = "/uploads/" + req.file.filename;

    let wasteType = null;
    let confidence = null;
    let aiMessage = "";

    try {
        if (!process.env.ROBOFLOW_API_KEY ||
            !process.env.ROBOFLOW_MODEL_ID) {
            throw new Error("Roboflow configuration is missing.");
        }

        const imageBase64 = fs.readFileSync(req.file.path, {
            encoding: "base64"
        });

        const predictionResponse = await axios.post(
            `https://serverless.roboflow.com/${process.env.ROBOFLOW_MODEL_ID}`,
            imageBase64,
            {
                params: {
                    api_key: process.env.ROBOFLOW_API_KEY
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                timeout: 60000
            }
        );

        const result = predictionResponse.data;

        console.log("ROBOFLOW RESPONSE:", JSON.stringify(result, null, 2));

        let prediction = null;

        if (
            result.predictions &&
            !Array.isArray(result.predictions) &&
            typeof result.predictions === "object"
        ) {
            const entries = Object.entries(result.predictions);

            if (entries.length > 0) {
                const [bestClass, bestResult] = entries.reduce(
                    (best, current) =>
                        current[1].confidence > best[1].confidence
                            ? current
                            : best
                );

                prediction = {
                    class: bestClass,
                    confidence: bestResult.confidence
                };
            }
        } else if (
            Array.isArray(result.predictions) &&
            result.predictions.length > 0
        ) {
            prediction = result.predictions.reduce((best, current) =>
                current.confidence > best.confidence ? current : best
            );
        } else if (
            Array.isArray(result.predicted_classes) &&
            result.predicted_classes.length > 0
        ) {
            prediction = {
                class: result.predicted_classes[0],
                confidence: result.confidence ?? null
            };
        } else if (result.top) {
            prediction = {
                class: result.top,
                confidence: result.confidence
            };
        }

        if (prediction && prediction.class) {
            wasteType = prediction.class;

            confidence = prediction.confidence != null
                ? Number((prediction.confidence * 100).toFixed(2))
                : null;

            aiMessage = "AI classification completed successfully.";

            console.log("Detected Waste:", wasteType);
            console.log("Confidence:", confidence + "%");
        } else {
            aiMessage = "Image uploaded, but AI could not identify the waste.";
        }

    } catch (error) {
        console.error(
            "Roboflow prediction error:",
            error.response?.data || error.message
        );

        aiMessage = "Image saved, but AI prediction failed. Please try again.";
    }

    // Save scan in database
    const query = `
        INSERT INTO waste_scans
        (user_id, image_path, waste_type, confidence)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        query,
        [user_id || null, imagePath, wasteType, confidence],
        (err, result) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Unable to save scan in database."
                });
            }

            res.status(201).json({
                message: aiMessage,
                scan_id: result.insertId,
                image_path: imagePath,
                waste_type: wasteType,
                confidence: confidence
            });
        }
    );
});

// 2. Get scan history
router.get("/", (req, res) => {
    const { user_id } = req.query;

    let query = `
        SELECT scan_id, user_id, image_path, waste_type,
               confidence, scanned_at
        FROM waste_scans
    `;

    const values = [];

    if (user_id) {
        query += " WHERE user_id = ?";
        values.push(user_id);
    }

    query += " ORDER BY scanned_at DESC";

    db.query(query, values, (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Unable to fetch scan history."
            });
        }

        res.json(results);
    });
});

// 3. Get scanned items with recycling information
router.get("/recycling", (req, res) => {
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json({
            message: "User ID is required."
        });
    }

    const query = `
        SELECT
            ws.scan_id,
            ws.image_path,
            ws.waste_type,
            ws.confidence,
            ws.scanned_at,
            rg.recycling_method,
            rg.diy_idea,
            rg.disposal_instructions
        FROM waste_scans ws
        LEFT JOIN recycling_guides rg
        ON LOWER(TRIM(ws.waste_type)) = LOWER(TRIM(rg.waste_type))
        WHERE ws.user_id = ?
        ORDER BY ws.scanned_at DESC
    `;

    db.query(query, [user_id], (err, results) => {
        if (err) {
            console.error("Recycling fetch error:", err);

            return res.status(500).json({
                message: "Unable to fetch recycling information."
            });
        }

        res.json(results);
    });
});

module.exports = router;
