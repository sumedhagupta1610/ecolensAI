
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/scanhistory.css";

const ScanHistory = () => {
    const navigate = useNavigate();

    const [scans, setScans] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All Categories");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchScans = async () => {
            try {
                const user = JSON.parse(
                    localStorage.getItem("currentUser") || "null"
                );

                if (!user?.id) {
                    setError("Please log in to view your scan history.");
                    return;
                }

                const response = await fetch(
                    `http://localhost:5000/api/scans?user_id=${user.id}`
                );

                if (!response.ok) {
                    throw new Error("Unable to load scan history.");
                }

                const data = await response.json();
                setScans(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchScans();
    }, []);

    const categories = [
        ...new Set(scans.map(scan => scan.waste_type).filter(Boolean))
    ];

    const filteredScans = scans.filter(scan => {
        const waste = scan.waste_type || "Pending Classification";

        const matchesSearch = waste.toLowerCase().includes(search.toLowerCase());
        const matchesFilter =
            filter === "All Categories" || scan.waste_type === filter;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="history-page">

            {/* Back Button */}
            <button
                className="history-back-button"
                onClick={() => navigate("/dashboard")}
            >
                ← Back
            </button>

            <div className="history-header">
                <h1>Scan History 📜</h1>
                <p>View your previous waste scans and their classifications.</p>
            </div>

            <div className="history-summary">
                <div className="summary-card">
                    <span>Total Scans</span>
                    <strong>{scans.length}</strong>
                </div>

                <div className="summary-card">
                    <span>Classified Scans</span>
                    <strong>{scans.filter(s => s.waste_type).length}</strong>
                </div>

                <div className="summary-card">
                    <span>Categories</span>
                    <strong>{categories.length}</strong>
                </div>
            </div>

            <div className="history-controls">
                <input
                    type="text"
                    placeholder="Search waste type..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                <select
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                >
                    <option>All Categories</option>
                    {categories.map(category => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p>Loading scan history...</p>
            ) : error ? (
                <p>{error}</p>
            ) : filteredScans.length === 0 ? (
                <p>No scans found.</p>
            ) : (
                <div className="history-table">
                    <div className="history-row history-heading">
                        <span>Date</span>
                        <span>Waste</span>
                        <span>Confidence</span>
                        <span>Status</span>
                        <span>Action</span>
                    </div>

                    {filteredScans.map(scan => (
                        <div className="history-row" key={scan.scan_id}>
                            <span>
                                {new Date(scan.scanned_at).toLocaleDateString("en-IN")}
                            </span>

                            <span>
                                {scan.waste_type || "Pending Classification"}
                            </span>

                            <span>
                                {scan.confidence != null
                                    ? `${scan.confidence}%`
                                    : "—"}
                            </span>

                            <span className="status">
                                {scan.waste_type
                                    ? "Classified"
                                    : "Awaiting AI"}
                            </span>

                            <a
                                href={`http://localhost:5000${scan.image_path}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                View
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ScanHistory;
