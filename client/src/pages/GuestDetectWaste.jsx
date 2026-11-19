import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGuestScans } from "../utils/guestStorage";
import "../styles/guestScan.css";

const GuestDetectWaste = () => {
    const navigate = useNavigate();
    const [scans, setScans] = useState([]);

    useEffect(() => {
        setScans(getGuestScans());
    }, []);

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
                    <h1>🤖 Detected Waste</h1>
                    <p>All waste items detected during your guest session.</p>
                </header>

                <div className="guest-scan-card">
                    <h2>Total Scans: {scans.length}</h2>

                    {scans.length === 0 ? (
                        <p className="guest-scan-message">
                            No waste items detected yet.
                            Please upload or capture a waste image first!
                        </p>
                    ) : (
                        <div className="guest-guide-grid">
                            {scans.map((scan, index) => (
                                <div className="guest-guide-card" key={scan.id}>
                                    <h3>Scan #{scans.length - index}</h3>

                                    <p>
                                        <strong>Detected Waste:</strong>
                                        {" "}{scan.wasteType}
                                    </p>

                                    <p>
                                        <strong>Category:</strong>
                                        {" "}{scan.category}
                                    </p>

                                    <p>
                                        <strong>AI Confidence:</strong>
                                        {" "}
                                        {scan.confidence !== null
                                            ? `${scan.confidence.toFixed(2)}%`
                                            : "Unavailable"}
                                    </p>

                                    <p>
                                        <strong>Scanned At:</strong>
                                        {" "}{scan.scannedAt}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <p className="guest-scan-message">
                    Your guest scan history is temporary and will be cleared
                    when your browser session ends.
                </p>

            </div>
        </div>
    );
};

export default GuestDetectWaste;