
import { useEffect, useState } from "react";
import "../styles/user.css";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api/scans";

const UserDashboard = () => {
    const navigate = useNavigate();

    const [userName, setUserName] = useState("User");
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    const [stats, setStats] = useState({
        totalScans: 0,
        diySaved: 0,
        ecoScore: 0,
        recyclableItems: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const currentUser = JSON.parse(
                    localStorage.getItem("currentUser") || "{}"
                );

                const name =
                    currentUser.full_name ||
                    currentUser.name ||
                    currentUser.username ||
                    "User";

                setUserName(name);

                const userId =
                    currentUser.user_id ||
                    currentUser.id ||
                    currentUser.userId;

                if (!userId) return;

                const response = await fetch(
                    `${API}?user_id=${userId}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch scans");
                }

                const data = await response.json();

                const scans = Array.isArray(data)
                    ? data
                    : data.scans || [];

                const WEIGHT = {
                    plastic: 0.20,
                    wet: 0.25,
                    dry: 0.20,
                    ewaste: 0.50
                };

                const RECOVERY = {
                    plastic: 0.65,
                    wet: 0.90,
                    dry: 0.75,
                    ewaste: 0.80
                };

                const getCategory = (type) => {
                    const value = String(type || "")
                        .toLowerCase()
                        .trim()
                        .replace(/[\s_-]/g, "");

                    if (value.includes("plastic")) return "plastic";

                    if (
                        value.includes("wet") ||
                        value.includes("organic") ||
                        value.includes("food")
                    ) return "wet";

                    if (
                        value.includes("ewaste") ||
                        value.includes("electronic")
                    ) return "ewaste";

                    if (
                        value.includes("dry") ||
                        value.includes("paper") ||
                        value.includes("glass") ||
                        value.includes("metal") ||
                        value.includes("cardboard")
                    ) return "dry";

                    return null;
                };

                let totalWeight = 0;
                let recoveredWeight = 0;
                let recyclableCount = 0;

                scans.forEach((scan) => {
                    const category = getCategory(scan.waste_type);

                    if (!category) return;

                    const weight = WEIGHT[category];

                    totalWeight += weight;
                    recoveredWeight += weight * RECOVERY[category];

                    if (
                        ["plastic", "dry", "ewaste"].includes(category)
                    ) {
                        recyclableCount++;
                    }
                });

                const ecoScore = totalWeight > 0
                    ? Math.round(
                        (recoveredWeight / totalWeight) * 100
                    )
                    : 0;

                let diySaved = 0;

                try {
                    const savedDIY = JSON.parse(
                        localStorage.getItem("savedDIY") || "[]"
                    );

                    diySaved = Array.isArray(savedDIY)
                        ? savedDIY.length
                        : 0;
                } catch {
                    diySaved = 0;
                }

                setStats({
                    totalScans: scans.length,
                    diySaved,
                    ecoScore,
                    recyclableItems: recyclableCount
                });

            } catch (error) {
                console.error("Dashboard Error:", error);
            }
        };

        fetchDashboardData();
    }, []);

    // Logout confirmation
    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
        sessionStorage.clear();

        setShowLogoutPopup(false);
        navigate("/", { replace: true });
    };

    return (
        <div className="dashboard">
            <div className="sidebar">
                <h2>EcoLens AI</h2>

                <ul>
                    <li onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
                        🏠 Dashboard
                    </li>

                    <li onClick={() => navigate("/scan")} style={{ cursor: "pointer" }}>
                        📷 Scan Waste
                    </li>

                    <li onClick={() => navigate("/recycling")} style={{ cursor: "pointer" }}>
                        ♻ Recycling
                    </li>

                    <li onClick={() => navigate("/diy")} style={{ cursor: "pointer" }}>
                        💡 DIY Ideas
                    </li>

                    <li onClick={() => navigate("/learninghub")} style={{ cursor: "pointer" }}>
                        🎥 Learning Hub
                    </li>

                    <li onClick={() => navigate("/nearbycenters")} style={{ cursor: "pointer" }}>
                        📍 Nearby Centers
                    </li>

                    <li onClick={() => navigate("/scanhistory")} style={{ cursor: "pointer" }}>
                        📜 Scan History
                    </li>

                    <li onClick={() => navigate("/ecoimpact")} style={{ cursor: "pointer" }}>
                        🌍 Eco Impact
                    </li>

                    <li
                        onClick={() => setShowLogoutPopup(true)}
                        style={{ cursor: "pointer", color: "#ff6b6b" }}
                    >
                        🚪 Logout
                    </li>
                </ul>
            </div>

            <div className="content">
                <h1>Welcome, {userName} 👋</h1>

                <div className="grid">
                    <div className="box">
                        Total Scans<br />
                        <b>{stats.totalScans}</b>
                    </div>

                    <div className="box">
                        DIY Saved<br />
                        <b>{stats.diySaved}</b>
                    </div>

                    <div className="box">
                        Eco Score<br />
                        <b>{stats.ecoScore}/100</b>
                    </div>

                    <div className="box">
                        Recyclable Items<br />
                        <b>{stats.recyclableItems}</b>
                    </div>
                </div>
            </div>

            {/* Logout Confirmation Popup */}
            {showLogoutPopup && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0, 0, 0, 0.6)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999
                    }}
                    onClick={() => setShowLogoutPopup(false)}
                >
                    <div
                        style={{
                            background: "#fff",
                            padding: "30px",
                            borderRadius: "12px",
                            width: "90%",
                            maxWidth: "380px",
                            textAlign: "center",
                            boxShadow: "0 5px 25px rgba(0,0,0,0.2)"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{ marginBottom: "15px", color: "#222" }}>
                            Confirm Logout
                        </h2>

                        <p style={{ marginBottom: "25px", color: "#555" }}>
                            Do you really want to logout?
                        </p>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "15px"
                            }}
                        >
                            <button
                                onClick={() => setShowLogoutPopup(false)}
                                style={{
                                    padding: "10px 25px",
                                    border: "none",
                                    borderRadius: "6px",
                                    background: "#ddd",
                                    color: "#333",
                                    cursor: "pointer",
                                    fontWeight: "bold"
                                }}
                            >
                                No
                            </button>

                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: "10px 25px",
                                    border: "none",
                                    borderRadius: "6px",
                                    background: "#e74c3c",
                                    color: "#fff",
                                    cursor: "pointer",
                                    fontWeight: "bold"
                                }}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
