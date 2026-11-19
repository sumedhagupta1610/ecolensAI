
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/diyideas.css";

const API = "http://localhost:5000/api/diy";

// Additional ideas for common waste categories
const diyCatalog = {
    "paper bag": [
        {
            title: "Decorative Gift Bags",
            description: "Turn used paper bags into attractive gift bags.",
            materials: "Paper bags, ribbon, glue, colours",
            steps: [
                "Clean and flatten the paper bag.",
                "Fold the top edges neatly.",
                "Decorate with colours or drawings.",
                "Attach ribbon as handles."
            ]
        },
        {
            title: "Paper Bag Wall Organizer",
            description: "Reuse paper bags to create small storage pockets.",
            materials: "Paper bags, cardboard, glue, scissors",
            steps: [
                "Cut the paper bag into rectangular pieces.",
                "Fold the pieces to make pockets.",
                "Attach them to a cardboard base.",
                "Use them to store stationery."
            ]
        },
        {
            title: "Paper Bag Plant Holder",
            description: "Make an attractive outer cover for small plant pots.",
            materials: "Paper bag, paint, jute rope",
            steps: [
                "Cut the bag to the required height.",
                "Fold the edges neatly.",
                "Decorate with paint or rope.",
                "Place a separate plant pot inside."
            ]
        }
    ],

    "jug": [
        {
            title: "DIY Planter",
            description: "Convert an empty plastic jug into a small garden planter.",
            materials: "Plastic jug, scissors, paint, soil",
            steps: [
                "Wash and dry the jug.",
                "Cut an opening on its side with adult supervision.",
                "Make drainage holes at the bottom.",
                "Decorate and add soil and a plant."
            ]
        },
        {
            title: "Watering Can",
            description: "Reuse a plastic jug for watering plants.",
            materials: "Plastic jug, pin or small drill",
            steps: [
                "Clean the jug properly.",
                "Make small holes in the cap.",
                "Fill the jug with water.",
                "Use it to water plants."
            ]
        },
        {
            title: "Storage Container",
            description: "Turn a clean jug into a useful household organizer.",
            materials: "Plastic jug, scissors, paint",
            steps: [
                "Wash and dry the jug.",
                "Cut the upper portion carefully.",
                "Smooth any sharp edges.",
                "Use it to organize small items."
            ]
        }
    ],

    "plastic bottle": [
        {
            title: "Self-Watering Planter",
            description: "Make a simple planter using an old plastic bottle.",
            materials: "Plastic bottle, cotton string, soil, plant",
            steps: [
                "Cut the bottle into two halves.",
                "Make a hole in the cap.",
                "Pass a cotton string through the cap.",
                "Add water to the lower half and soil to the upper half."
            ]
        },
        {
            title: "Bird Feeder",
            description: "Create a simple bird feeder from a used bottle.",
            materials: "Plastic bottle, wooden spoons, string, bird seed",
            steps: [
                "Clean and dry the bottle.",
                "Make small openings for the spoons.",
                "Insert the spoons carefully.",
                "Fill with bird seed and hang securely."
            ]
        },
        {
            title: "Desk Organizer",
            description: "Make a stationery holder from a plastic bottle.",
            materials: "Plastic bottle, scissors, paint",
            steps: [
                "Cut the bottle to the desired height.",
                "Smooth the edges safely.",
                "Decorate the outside.",
                "Use it to store pens and pencils."
            ]
        }
    ],

    "plastic bag": [
        {
            title: "Reusable Storage Pouch",
            description: "Reuse clean plastic bags to make a simple storage pouch.",
            materials: "Clean plastic bags, scissors, tape",
            steps: [
                "Clean and dry the bags.",
                "Cut them into suitable pieces.",
                "Layer and fold the pieces.",
                "Secure the edges with suitable tape."
            ]
        },
        {
            title: "Plastic Bag Weaving",
            description: "Turn old plastic bags into woven mats.",
            materials: "Clean plastic bags, scissors",
            steps: [
                "Cut bags into long strips.",
                "Join strips together.",
                "Weave the strips over and under.",
                "Secure the ends."
            ]
        }
    ],

    "cardboard boxes": [
        {
            title: "Desk Organizer",
            description: "Convert cardboard boxes into stationery storage.",
            materials: "Cardboard, glue, scissors, decorative paper",
            steps: [
                "Cut cardboard into different-sized sections.",
                "Arrange the sections into compartments.",
                "Glue them onto a cardboard base.",
                "Cover with decorative paper."
            ]
        },
        {
            title: "Mini Storage Box",
            description: "Create a useful storage box from waste cardboard.",
            materials: "Cardboard, glue, ruler, colours",
            steps: [
                "Cut cardboard into equal panels.",
                "Fold and join the panels.",
                "Attach a base and lid.",
                "Decorate the box."
            ]
        }
    ],

    "paper": [
        {
            title: "Paper Flowers",
            description: "Create decorative flowers from used paper.",
            materials: "Waste paper, glue, scissors, colours",
            steps: [
                "Cut paper into petal shapes.",
                "Fold and shape the petals.",
                "Join them using glue.",
                "Add a paper stem."
            ]
        },
        {
            title: "Handmade Paper Notebook",
            description: "Reuse unused paper sheets to make a small notebook.",
            materials: "Used paper, cardboard, thread, hole punch",
            steps: [
                "Collect clean unused paper.",
                "Cut sheets into equal sizes.",
                "Add cardboard covers.",
                "Bind the pages together."
            ]
        }
    ],

    "glass bottles": [
        {
            title: "Decorative Bottle Vase",
            description: "Transform an empty glass bottle into a flower vase.",
            materials: "Glass bottle, paint, decorative thread",
            steps: [
                "Wash and dry the bottle.",
                "Decorate its outside with paint.",
                "Allow it to dry completely.",
                "Use it as a flower vase."
            ]
        },
        {
            title: "Bottle Lamp",
            description: "Reuse a glass bottle as a decorative light holder.",
            materials: "Glass bottle, battery-operated fairy lights",
            steps: [
                "Clean and dry the bottle.",
                "Place battery-operated fairy lights inside.",
                "Arrange the lights neatly.",
                "Use it as a decorative lamp."
            ]
        }
    ],

    "metal can": [
        {
            title: "Pen Stand",
            description: "Turn an empty metal can into a stationery holder.",
            materials: "Metal can, decorative paper, glue",
            steps: [
                "Clean the can thoroughly.",
                "Ensure there are no sharp edges.",
                "Cover the outside with decorative paper.",
                "Use it to store stationery."
            ]
        },
        {
            title: "Small Planter",
            description: "Reuse a metal can as a decorative plant pot.",
            materials: "Metal can, paint, soil, small plant",
            steps: [
                "Clean the can.",
                "Ensure safe drainage holes.",
                "Decorate the outside.",
                "Add soil and a small plant."
            ]
        }
    ],

    "paper cup": [
        {
            title: "Mini Seed Starter",
            description: "Reuse a clean paper cup to start plant seedlings.",
            materials: "Paper cup, soil, seeds, water",
            steps: [
                "Take a clean paper cup.",
                "Make small drainage holes.",
                "Add soil and seeds.",
                "Water lightly and place in sunlight."
            ]
        },
        {
            title: "Desk Decoration",
            description: "Create a small decorative holder from a paper cup.",
            materials: "Paper cup, colours, decorative paper",
            steps: [
                "Clean and dry the cup.",
                "Decorate its outside.",
                "Let it dry.",
                "Use it as a lightweight holder."
            ]
        }
    ],

    "food waste": [
        {
            title: "Home Compost",
            description: "Convert suitable kitchen scraps into useful compost.",
            materials: "Fruit and vegetable scraps, dry leaves, compost container",
            steps: [
                "Collect suitable fruit and vegetable scraps.",
                "Add dry leaves or shredded cardboard.",
                "Mix and maintain proper moisture.",
                "Allow the material to decompose."
            ]
        },
        {
            title: "Kitchen Scrap Fertilizer",
            description: "Use suitable organic kitchen waste for composting.",
            materials: "Vegetable peels, dry leaves, compost bin",
            steps: [
                "Separate suitable organic scraps.",
                "Avoid meat, dairy and oily leftovers.",
                "Layer scraps with dry leaves.",
                "Allow them to decompose properly."
            ]
        }
    ],

    "styrofoam": [
        {
            title: "Protective Packaging",
            description: "Reuse clean Styrofoam pieces for protecting fragile items.",
            materials: "Clean Styrofoam, cardboard box",
            steps: [
                "Collect clean, undamaged pieces.",
                "Break or cut them carefully.",
                "Place around fragile objects.",
                "Reuse them for safe packaging."
            ]
        }
    ],

    "plastic cap": [
        {
            title: "Colourful Wall Art",
            description: "Create decorative patterns using clean plastic caps.",
            materials: "Plastic caps, cardboard, glue",
            steps: [
                "Collect and clean plastic caps.",
                "Arrange them into a pattern.",
                "Glue them onto cardboard.",
                "Display the artwork."
            ]
        }
    ]
};

function getUserId() {
    const keys = ["currentUser", "user", "userInfo"];

    for (const key of keys) {
        try {
            const data = JSON.parse(localStorage.getItem(key));
            const id = data?.user_id || data?.id || data?.userId;
            if (id) return id;
        } catch (error) {
            // Ignore invalid localStorage values
        }
    }

    return null;
}

function getTutorialLinks(wasteType) {
    const name = wasteType || "waste materials";

    return [
        {
            title: `DIY Reuse Ideas for ${name}`,
            description: "Creative reuse projects and simple crafts",
            query: `DIY reuse ideas using ${name}`
        },
        {
            title: `${name} Upcycling Projects`,
            description: "Step-by-step upcycling tutorials",
            query: `how to upcycle ${name} step by step`
        },
        {
            title: `Best Crafts from ${name}`,
            description: "Easy recycling and craft inspiration",
            query: `creative crafts from ${name}`
        }
    ];
}

function DIYIdeas() {
    const navigate = useNavigate();

    const [scans, setScans] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchScans = async () => {
            const userId = getUserId();

            if (!userId) {
                setError("User information not found. Please login again.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `${API}?user_id=${encodeURIComponent(userId)}`
                );

                if (!response.ok) {
                    throw new Error("Unable to load your scanned waste.");
                }

                const data = await response.json();

                const userScans = data.scans || [];
                const userProjects = data.projects || [];

                setScans(userScans);
                setProjects(userProjects);

                const firstType =
                    userProjects[0]?.waste_type ||
                    userScans[0]?.waste_type ||
                    "";

                setSelectedType(firstType);
            } catch (err) {
                console.error("DIY loading error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchScans();
    }, []);

    const displayProjects = projects.length
        ? projects
        : [...new Set(scans.map(scan => scan.waste_type).filter(Boolean))]
            .map(type => ({ waste_type: type, ideas: [] }));

    const selectedProject = displayProjects.find(
        project => project.waste_type === selectedType
    );

    const selectedScan = scans.find(
        scan => scan.waste_type === selectedType
    );

    const catalogKey = selectedType.toLowerCase().trim();

    const ideas =
        diyCatalog[catalogKey] ||
        selectedProject?.ideas ||
        [];

    const tutorials = getTutorialLinks(selectedType);

    if (loading) {
        return (
            <div className="diy-page">
                <button
                    className="diy-back-button"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Back
                </button>
                <h2>Loading your DIY ideas...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="diy-page">
                <button
                    className="diy-back-button"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Back
                </button>

                <h2>DIY Reuse Ideas 💡</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="diy-page">
            <button
                className="diy-back-button"
                onClick={() => navigate("/dashboard")}
            >
                ← Back
            </button>

            <div className="diy-header">
                <h1>DIY Reuse Ideas 💡</h1>
                <p>
                    Discover creative ways to reuse your scanned waste
                    instead of throwing it away.
                </p>
            </div>

            {scans.length === 0 ? (
                <div className="latest-scan">
                    <h2>No scans available yet!</h2>
                    <p>
                        Scan some waste first to discover personalised
                        recycling and DIY ideas.
                    </p>
                    <button onClick={() => window.location.href = "/scan"}>
                        Scan Waste
                    </button>
                </div>
            ) : (
                <>
                    <div className="latest-scan">
                        <div>
                            <span className="scan-label">
                                Your previously scanned waste
                            </span>

                            <h2>{selectedType || "Select a waste item"}</h2>

                            <p>
                                Select one of your scanned waste items
                                to explore creative reuse ideas.
                            </p>
                        </div>

                        {selectedScan && (
                            <span className="waste-type">
                                {selectedScan.confidence != null
                                    ? `${selectedScan.confidence}% confidence`
                                    : "Scanned item"}
                            </span>
                        )}
                    </div>

                    <h2 className="section-title">
                        Your Scanned Items
                    </h2>

                    <div className="ideas-grid">
                        {displayProjects.map(project => {
                            const count = scans.filter(
                                scan => scan.waste_type === project.waste_type
                            ).length;

                            return (
                                <button
                                    key={project.waste_type}
                                    className="idea-card"
                                    onClick={() => setSelectedType(project.waste_type)}
                                    style={{
                                        cursor: "pointer",
                                        textAlign: "left",
                                        border: selectedType === project.waste_type
                                            ? "2px solid #269b68"
                                            : undefined
                                    }}
                                >
                                    <h3>{project.waste_type}</h3>
                                    <p>{count} scan(s)</p>
                                    <span>Explore Ideas →</span>
                                </button>
                            );
                        })}
                    </div>

                    {selectedType && (
                        <>
                            <h2 className="section-title">
                                Creative Reuse Ideas for {selectedType}
                            </h2>

                            <div className="ideas-grid">
                                {ideas.length > 0 ? (
                                    ideas.map((idea, index) => (
                                        <div className="idea-card" key={index}>
                                            <h3>{idea.title}</h3>
                                            <p>{idea.description}</p>

                                            <p>
                                                <strong>Materials:</strong>{" "}
                                                {idea.materials}
                                            </p>

                                            {idea.steps?.length > 0 && (
                                                <details>
                                                    <summary>View Steps</summary>
                                                    <ol>
                                                        {idea.steps.map((step, i) => (
                                                            <li key={i}>{step}</li>
                                                        ))}
                                                    </ol>
                                                </details>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="idea-card">
                                        <h3>Creative Reuse</h3>
                                        <p>
                                            Explore safe ways to reuse or recycle
                                            {` ${selectedType}`} instead of throwing it away.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="youtube-section">
                                <h2 className="section-title">
                                    YouTube DIY Tutorials 🎥
                                </h2>

                                <p>
                                    Explore video tutorials for reusing {selectedType}.
                                </p>

                                <div className="ideas-grid">
                                    {tutorials.map((tutorial, index) => (
                                        <a
                                            className="idea-card"
                                            key={index}
                                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(tutorial.query)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: "block",
                                                color: "inherit",
                                                textDecoration: "none"
                                            }}
                                        >
                                            <h3>🎬 {tutorial.title}</h3>
                                            <p>{tutorial.description}</p>
                                            <span>
                                                Watch Tutorials on YouTube →
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default DIYIdeas;
