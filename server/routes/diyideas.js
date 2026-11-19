
const express = require("express");
const axios = require("axios");
const router = express.Router();
const db = require("../config/db");

// DIY ideas based on waste type
const diyIdeas = {
    "plastic bottle": [
        {
            title: "Self-Watering Planter",
            description: "Convert an old plastic bottle into a planter.",
            materials: "Plastic bottle, soil, scissors, plant"
        },
        {
            title: "Desk Organizer",
            description: "Make a useful stationery organizer.",
            materials: "Plastic bottle, scissors, paint"
        },
        {
            title: "Bird Feeder",
            description: "Create a simple bird feeder using a bottle.",
            materials: "Plastic bottle, string, wooden spoons"
        }
    ],

    "plastic bag": [
        {
            title: "Reusable Basket",
            description: "Turn clean plastic bags into a small basket.",
            materials: "Plastic bags, scissors"
        },
        {
            title: "Woven Mat",
            description: "Reuse plastic bags to make a decorative mat.",
            materials: "Plastic bags, scissors"
        }
    ],

    "cardboard boxes": [
        {
            title: "Desk Organizer",
            description: "Make stationery compartments from cardboard.",
            materials: "Cardboard, glue, scissors"
        },
        {
            title: "Storage Box",
            description: "Convert cardboard into a storage box.",
            materials: "Cardboard, glue, decorative paper"
        }
    ],

    "paper": [
        {
            title: "Paper Seed Pots",
            description: "Make biodegradable pots for seedlings.",
            materials: "Old paper, water, soil"
        },
        {
            title: "Paper Wall Art",
            description: "Create decorative artwork using waste paper.",
            materials: "Old paper, glue, cardboard"
        }
    ],

    "glass bottles": [
        {
            title: "Decorative Vase",
            description: "Reuse an empty glass bottle as a flower vase.",
            materials: "Glass bottle, paint, decorations"
        },
        {
            title: "Bottle Lamp",
            description: "Create a decorative lamp using a glass bottle.",
            materials: "Glass bottle, battery-powered LED lights"
        }
    ],

    "metal can": [
        {
            title: "Pencil Holder",
            description: "Turn a cleaned metal can into a pencil holder.",
            materials: "Metal can, paint, decorative paper"
        },
        {
            title: "Mini Planter",
            description: "Reuse a metal can as a small planter.",
            materials: "Metal can, soil, plant"
        }
    ],

    "paper cup": [
        {
            title: "Mini Planter",
            description: "Use a clean paper cup to grow seedlings.",
            materials: "Paper cup, soil, seeds"
        },
        {
            title: "Desk Organizer",
            description: "Reuse paper cups to organize stationery.",
            materials: "Paper cups, glue, colours"
        }
    ],

    "food waste": [
        {
            title: "Compost Maker",
            description: "Convert suitable kitchen scraps into compost.",
            materials: "Fruit and vegetable scraps, dry leaves, compost bin"
        },
        {
            title: "Organic Fertilizer",
            description: "Compost organic kitchen waste for plants.",
            materials: "Organic scraps, dry leaves, compost container"
        }
    ]
};

// Get suitable ideas for any waste type
function getIdeas(wasteType) {
    const type = String(wasteType || "").toLowerCase().trim();

    if (diyIdeas[type]) {
        return diyIdeas[type];
    }

    if (type.includes("plastic")) {
        return [
            {
                title: "Plastic Waste Organizer",
                description: "Reuse clean plastic waste to create an organizer.",
                materials: "Clean plastic, scissors, glue"
            },
            {
                title: "Creative Plastic Craft",
                description: "Create a decorative item from reusable plastic.",
                materials: "Clean plastic, paint, glue"
            }
        ];
    }

    if (
        type.includes("paper") ||
        type.includes("carton") ||
        type.includes("cardboard")
    ) {
        return [
            {
                title: "Recycled Paper Craft",
                description: "Reuse paper waste to create useful craft items.",
                materials: "Waste paper, glue, scissors"
            }
        ];
    }

    if (type.includes("glass")) {
        return [
            {
                title: "Glass Decoration",
                description: "Reuse glass items as decorative pieces.",
                materials: "Glass item, paint, decorations"
            }
        ];
    }

    if (type.includes("metal") || type.includes("can")) {
        return [
            {
                title: "Metal Can Organizer",
                description: "Reuse a cleaned metal container as a useful organizer.",
                materials: "Clean metal can, paint, decorative paper"
            }
        ];
    }

    if (type.includes("food")) {
        return [
            {
                title: "Compost Maker",
                description: "Convert suitable kitchen scraps into compost.",
                materials: "Fruit and vegetable scraps, dry leaves, compost bin"
            }
        ];
    }

    return [
        {
            title: "Creative Waste Reuse",
            description: `Explore safe ways to reuse ${wasteType} instead of throwing it away.`,
            materials: "Clean waste material, craft supplies"
        }
    ];
}

// API 1: Fetch user's scans and DIY ideas
router.get("/", (req, res) => {
    const userId = req.query.user_id;

    if (!userId) {
        return res.status(400).json({
            message: "User ID is required"
        });
    }

    const sql = `
        SELECT scan_id, image_path, waste_type, confidence, scanned_at
        FROM waste_scans
        WHERE user_id = ?
        ORDER BY scanned_at DESC
    `;

    db.query(sql, [userId], (err, scans) => {
        if (err) {
            console.error("DIY database error:", err);

            return res.status(500).json({
                message: "Unable to fetch scanned waste"
            });
        }

        const validScans = scans.filter(
            scan =>
                scan.waste_type &&
                scan.waste_type.toLowerCase().trim() !== "unlabeled"
        );

        const uniqueTypes = [
            ...new Set(
                validScans.map(scan => scan.waste_type.trim())
            )
        ];

        const projects = uniqueTypes.map(type => ({
            waste_type: type,
            ideas: getIdeas(type)
        }));

        res.json({
            scans,
            projects
        });
    });
});

// API 2: Fetch YouTube tutorials
router.get("/videos", async (req, res) => {
    const wasteType = req.query.waste_type;

    if (!wasteType) {
        return res.status(400).json({
            message: "Waste type is required"
        });
    }

    if (!process.env.YOUTUBE_API_KEY) {
        return res.status(503).json({
            message: "YouTube API key is not configured"
        });
    }

    try {
        const response = await axios.get(
            "https://www.googleapis.com/youtube/v3/search",
            {
                params: {
                    part: "snippet",
                    q: `DIY reuse ${wasteType} crafts tutorial`,
                    type: "video",
                    videoEmbeddable: "true",
                    maxResults: 6,
                    key: process.env.YOUTUBE_API_KEY
                }
            }
        );

        const videos = response.data.items.map(item => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.medium?.url
        }));

        res.json({ videos });

    } catch (error) {
        console.error(
            "YouTube API error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            message: "Unable to fetch YouTube tutorials"
        });
    }
});

module.exports = router;
