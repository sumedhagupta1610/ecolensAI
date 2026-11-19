import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGuestScans } from "../utils/guestStorage";
import "../styles/guestScan.css";

const GuestWasteCategory = () => {
    const navigate = useNavigate();
    const [scans, setScans] = useState([]);

    useEffect(() => {
        setScans(getGuestScans());
    }, []);

    const categories = [
        {
            name: "Dry Waste",
            icon: "♻️",
            description: "Plastic, paper, cardboard, glass and metal."
        },
        {
            name: "Wet Waste",
            icon: "🍃",
            description: "Food scraps and biodegradable organic waste."
        },
        {
            name: "E-Waste",
            icon: "🔋",
            description: "Electronic items, batteries and circuits."
        }
    ];

    return (
        <div className="guest-scan-page">
            <div className="guest-scan-container">

                <button
                    onClick={() => navigate("/guest")}
                    style={{
                        display: "block",
                        padding: "10px 18px",
                        marginBottom: "20px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#198754",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "14px"
                    }}
                >
                    ← Back
                </button>

                <header className="guest-scan-header">
                    <h1>♻️ Waste Categories</h1>
                    <p>Explore your scanned waste category-wise.</p>
                </header>

                <div className="guest-category-grid">

                    {categories.map(category => {
                        const items = scans.filter(
                            scan => scan.category === category.name
                        );

                        return (
                            <div className="guest-category-card" key={category.name}>

                                <div className="guest-category-icon">
                                    {category.icon}
                                </div>

                                <h2>{category.name}</h2>

                                <p>{category.description}</p>

                                <h3>{items.length} Item(s)</h3>

                                {items.length > 0 ? (
                                    <ul>
                                        {items.map(item => (
                                            <li key={item.id}>
                                                {item.wasteType}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No items scanned in this category.</p>
                                )}

                            </div>
                        );
                    })}

                </div>

                <p className="guest-scan-message">
                    Your guest scan data is temporary for this browser session.
                </p>

            </div>
        </div>
    );
};

export default GuestWasteCategory;