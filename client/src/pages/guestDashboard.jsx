
import "../styles/guest.css";
import { useNavigate } from "react-router-dom";

const GuestDashboard = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: "📷",
            title: "Upload Waste Image",
            description: "Upload an image or capture a photo to scan your waste.",
            button: "Start Scanning",
            path: "/guest-scan",
            color: "green"
        },
        {
            icon: "🤖",
            title: "Detect Waste",
            description: "View all waste items detected during your guest session.",
            button: "View Detections",
            path: "/guest-detect",
            color: "blue"
        },
        {
            icon: "♻️",
            title: "Waste Category",
            description: "Explore your scanned waste items by their categories.",
            button: "Explore Categories",
            path: "/guest-category",
            color: "orange"
        }
    ];

    return (
        <div className="guest">

            {/* Navbar */}
            <nav className="guest-navbar">
                <div className="guest-logo">
                    🌿 <span>EcoLens AI</span>
                </div>

                <button
                    className="guest-login-btn"
                    onClick={() => navigate("/")}
                >
                    Login / Sign Up
                </button>
            </nav>

            {/* Hero Section */}
            <section className="guest-hero">
                <div className="hero-tag">
                    🌍 Smart Waste Management
                </div>

                <h1>
                    Make Your Waste
                    <span> Count for a Better Future.</span>
                </h1>

                <p>
                    Welcome to EcoLens AI! Use artificial intelligence
                    to identify waste, understand its category and
                    take a step towards a cleaner environment.
                </p>

                <button
                    className="hero-btn"
                    onClick={() => navigate("/guest-scan")}
                >
                    Start Exploring <span>→</span>
                </button>

                <div className="hero-decoration">
                    ♻️
                </div>
            </section>

            {/* Features Section */}
            <section className="guest-features">

                <div className="section-heading">
                    <span>EXPLORE ECOLENS</span>
                    <h2>What would you like to do?</h2>
                    <p>Choose a feature to get started with your waste management journey.</p>
                </div>

                <div className="cards">
                    {features.map((feature, index) => (
                        <div
                            className={`card ${feature.color}`}
                            key={index}
                            onClick={() => navigate(feature.path)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    navigate(feature.path);
                                }
                            }}
                        >
                            <div className="feature-icon">
                                {feature.icon}
                            </div>

                            <h3>{feature.title}</h3>

                            <p>{feature.description}</p>

                            <button
                                className="feature-btn"
                                onClick={() => navigate(feature.path)}
                            >
                                {feature.button} →
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Guest Notice */}
            <section className="guest-notice">
                <div className="notice-icon">🔐</div>

                <div>
                    <h3>Enjoying EcoLens AI?</h3>
                    <p>
                        Login to unlock Recycling Tips, DIY Ideas,
                        Scan History and your Eco Impact Score.
                        Your guest scan data is temporary.
                    </p>
                </div>

                <button onClick={() => navigate("/")}>
                    Login Now →
                </button>
            </section>

            {/* Footer */}
            <footer className="guest-footer">
                <p>🌿 EcoLens AI — Small Steps, Greener Tomorrow.</p>
            </footer>

        </div>
    );
};

export default GuestDashboard;
