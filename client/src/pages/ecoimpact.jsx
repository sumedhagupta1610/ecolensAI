
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ecoimpact.css";

const API = "http://localhost:5000/api/scans";

// Estimated average weight per scanned item (kg).
// These are assumptions, not actual measured weights.
const WEIGHT = {
    plastic: 0.20,
    wet: 0.25,
    dry: 0.20,
    ewaste: 0.50
};

// Estimated recovery / composting potential.
const RECOVERY = {
    plastic: 0.65,
    wet: 0.90,
    dry: 0.75,
    ewaste: 0.80
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

function getCategory(wasteType) {
    // Handle null, undefined, and empty waste types safely.
    const type = String(wasteType ?? "").trim().toLowerCase();

    if (
        type.includes("food") ||
        type.includes("wet") ||
        type.includes("organic")
    ) return "wet";

    if (
        type.includes("electronic") ||
        type.includes("battery") ||
        type.includes("e-waste") ||
        type.includes("ewaste")
    ) return "ewaste";

    if (
        type.includes("plastic") ||
        type.includes("jug")
    ) return "plastic";

    return "dry";
}

function localDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getCurrentWeek(date) {
    const d = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    ));

    const day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - day);

    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const week = Math.ceil(
        (((d - yearStart) / 86400000) + 1) / 7
    );

    return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function getDefaultDate(period) {
    const now = new Date();

    if (period === "Weekly") return getCurrentWeek(now);

    if (period === "Monthly") {
        return `${now.getFullYear()}-${String(
            now.getMonth() + 1
        ).padStart(2, "0")}`;
    }

    return String(now.getFullYear());
}

function getPeriodBounds(period, value) {
    if (period === "Monthly") {
        const [year, month] = (value || getDefaultDate(period))
            .split("-").map(Number);

        if (!year || !month || month < 1 || month > 12) {
            return getPeriodBounds(period, getDefaultDate(period));
        }

        return {
            start: new Date(year, month - 1, 1),
            end: new Date(year, month, 1)
        };
    }

    if (period === "Yearly") {
        const year = Number(value);

        if (!year || year < 2000 || year > 2100) {
            return getPeriodBounds(period, getDefaultDate(period));
        }

        return {
            start: new Date(year, 0, 1),
            end: new Date(year + 1, 0, 1)
        };
    }

    const match = (value || "").match(/^(\d{4})-W(\d{2})$/);

    if (!match) {
        const now = new Date();
        return {
            start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6),
            end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
        };
    }

    const year = Number(match[1]);
    const week = Number(match[2]);

    const jan4 = new Date(year, 0, 4);
    const monday = new Date(year, 0, 4);
    const day = jan4.getDay() || 7;

    monday.setDate(jan4.getDate() - day + 1 + (week - 1) * 7);

    const end = new Date(monday);
    end.setDate(end.getDate() + 7);

    return { start: monday, end };
}

function getPreviousBounds(period, bounds) {
    const start = new Date(bounds.start);
    const end = new Date(bounds.start);

    if (period === "Weekly") {
        start.setDate(start.getDate() - 7);
    } else if (period === "Monthly") {
        start.setMonth(start.getMonth() - 1);
    } else {
        start.setFullYear(start.getFullYear() - 1);
    }

    return { start, end };
}

function calculateImpact(scans) {
    const breakdown = {
        plastic: 0,
        wet: 0,
        dry: 0,
        ewaste: 0
    };

    scans.forEach(scan => {
        const category = getCategory(scan?.waste_type);
        breakdown[category] += WEIGHT[category];
    });

    const total = Object.values(breakdown).reduce(
        (sum, weight) => sum + weight,
        0
    );

    const recoverable =
        breakdown.plastic * RECOVERY.plastic +
        breakdown.wet * RECOVERY.wet +
        breakdown.dry * RECOVERY.dry +
        breakdown.ewaste * RECOVERY.ewaste;

    const rate = total > 0
        ? Math.round((recoverable / total) * 100)
        : 0;

    return {
        breakdown,
        total,
        recoverable,
        rate,
        score: rate
    };
}

function filterScans(scans, bounds) {
    return scans.filter(scan => {
        const date = new Date(scan?.scanned_at);

        return (
            !Number.isNaN(date.getTime()) &&
            date >= bounds.start &&
            date < bounds.end
        );
    });
}

function formatKg(value) {
    return `${Number(value || 0).toFixed(2)} kg`;
}

const EcoImpact = () => {
    const navigate = useNavigate();

    const [period, setPeriod] = useState("Monthly");
    const [selectedDate, setSelectedDate] = useState(
        getDefaultDate("Monthly")
    );
    const [scans, setScans] = useState([]);
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
                    throw new Error("Unable to load your scan records.");
                }

                const data = await response.json();

                const records = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.scans)
                        ? data.scans
                        : [];

                setScans(records);
            } catch (err) {
                console.error("Eco Impact loading error:", err);
                setError(err.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchScans();
    }, []);

    const bounds = useMemo(
        () => getPeriodBounds(period, selectedDate),
        [period, selectedDate]
    );

    const currentScans = useMemo(
        () => filterScans(scans, bounds),
        [scans, bounds]
    );

    const previousBounds = useMemo(
        () => getPreviousBounds(period, bounds),
        [period, bounds]
    );

    const previousScans = useMemo(
        () => filterScans(scans, previousBounds),
        [scans, previousBounds]
    );

    const current = useMemo(
        () => calculateImpact(currentScans),
        [currentScans]
    );

    const previous = useMemo(
        () => calculateImpact(previousScans),
        [previousScans]
    );

    const progress = previous.recoverable > 0
        ? Math.round(
            ((current.recoverable - previous.recoverable) /
                previous.recoverable) * 100
        )
        : null;

    const breakdownItems = [
        { key: "plastic", label: "Plastic Waste", icon: "♻️" },
        { key: "wet", label: "Wet Waste", icon: "🍂" },
        { key: "dry", label: "Dry Waste", icon: "📄" },
        { key: "ewaste", label: "E-Waste", icon: "🔋" }
    ];

    const changePeriod = newPeriod => {
        setPeriod(newPeriod);
        setSelectedDate(getDefaultDate(newPeriod));
    };

    if (loading) {
        return (
            <div className="eco-page">
                <button
                    className="eco-back-button"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Back
                </button>

                <h2>Loading your Eco Impact...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="eco-page">
                <button
                    className="eco-back-button"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Back
                </button>

                <h1>Eco Impact 🌍</h1>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="eco-page">

            <button
                className="eco-back-button"
                onClick={() => navigate("/dashboard")}
            >
                ← Back
            </button>

            <div className="eco-header">
                <div>
                    <h1>Eco Impact 🌍</h1>
                    <p>
                        Track your scanned waste and its estimated
                        environmental impact.
                    </p>
                </div>
            </div>

            <div className="period-section">
                <div className="period-buttons">
                    {["Weekly", "Monthly", "Yearly"].map(item => (
                        <button
                            key={item}
                            className={period === item ? "active" : ""}
                            onClick={() => changePeriod(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                <div className="date-selector">
                    <label>
                        Select {period === "Weekly"
                            ? "Week"
                            : period === "Yearly" ? "Year" : "Month"}
                    </label>

                    <input
                        type={
                            period === "Yearly"
                                ? "number"
                                : period === "Monthly"
                                    ? "month"
                                    : "week"
                        }
                        min={period === "Yearly" ? "2000" : undefined}
                        max={period === "Yearly" ? "2100" : undefined}
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                    />
                </div>
            </div>

            <p className="section-description">
                Based on {currentScans.length} waste scan(s) in the selected period.
                Weight and recovery values are estimates, not actual measurements.
            </p>

            <div className="impact-grid">
                <div className="impact-card">
                    <span className="card-icon">🗑️</span>
                    <div>
                        <p>Total Waste Generated</p>
                        <h2>{formatKg(current.total)}</h2>
                    </div>
                </div>

                <div className="impact-card">
                    <span className="card-icon">♻️</span>
                    <div>
                        <p>Waste Recycled*</p>
                        <h2>{formatKg(current.recoverable)}</h2>
                    </div>
                </div>

                <div className="impact-card">
                    <span className="card-icon">📊</span>
                    <div>
                        <p>Recycling Rate*</p>
                        <h2>{current.rate}%</h2>
                    </div>
                </div>

                <div className="impact-card">
                    <span className="card-icon">🌱</span>
                    <div>
                        <p>Eco Score</p>
                        <h2>{current.score}/100</h2>
                    </div>
                </div>
            </div>

            <div className="eco-section">
                <h2>Waste Breakdown</h2>

                <p className="section-description">
                    Estimated waste generated during the selected period.
                </p>

                <div className="waste-breakdown">
                    {breakdownItems.map(item => {
                        const weight = current.breakdown[item.key];
                        const percentage = current.total > 0
                            ? (weight / current.total) * 100
                            : 0;

                        return (
                            <div className="waste-item" key={item.key}>
                                <div className="waste-item-top">
                                    <span>
                                        {item.icon} {item.label}
                                    </span>
                                    <strong>{formatKg(weight)}</strong>
                                </div>

                                <div className="progress">
                                    <div
                                        className={`progress-fill ${item.key}`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="environment-section">
                <h2>Environmental Impact 🌱</h2>

                <p className="section-description">
                    Estimated potential to divert scanned waste from
                    general disposal through recycling and composting.
                </p>

                <div className="environment-grid">
                    <div className="environment-card">
                        <span>♻️</span>
                        <h3>{formatKg(current.recoverable)}</h3>
                        <p>Potentially recoverable waste</p>
                    </div>

                    <div className="environment-card">
                        <span>🌳</span>
                        <h3>
                            {current.total === 0
                                ? "No Scan Data"
                                : current.rate >= 70
                                    ? "Positive Impact"
                                    : "Improvement Possible"}
                        </h3>
                        <p>
                            {current.total === 0
                                ? "Scan waste to view your impact."
                                : "Better segregation can improve waste recovery."}
                        </p>
                    </div>

                    <div className="environment-card">
                        <span>🌍</span>
                        <h3>
                            {current.rate >= 70
                                ? "Eco Friendly"
                                : current.total === 0
                                    ? "Get Started"
                                    : "Keep Improving"}
                        </h3>
                        <p>
                            Your scanning activity helps track
                            waste and recycling potential.
                        </p>
                    </div>
                </div>
            </div>

            <div className="progress-section">
                <div>
                    <h2>Your Recycling Progress</h2>

                    <p>
                        {progress === null
                            ? "Not enough previous-period scan data for comparison."
                            : `Estimated recovery potential compared with the previous ${period.toLowerCase()} period.`}
                    </p>
                </div>

                <div className="progress-percent">
                    {progress === null
                        ? "—"
                        : `${progress > 0 ? "+" : ""}${progress}%`}
                </div>
            </div>

            <p className="section-description">
                *Eco Impact uses estimated average weights per scan and
                estimated recovery rates. Actual waste weight and confirmed
                recycling activity are not recorded in the database.
            </p>

        </div>
    );
};

export default EcoImpact;
