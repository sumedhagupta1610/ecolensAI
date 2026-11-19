import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/guestScan.css";
import { saveGuestScan } from "../utils/guestStorage";

const wasteGuides = {
    "Plastic Bottle": {
        recycling: [
            "Empty and rinse the bottle.",
            "Remove the cap if required by local recycling rules.",
            "Put it in the appropriate plastic recycling bin."
        ],
        diy: [
            "Bottle Planter - Convert it into a small plant pot.",
            "Bird Feeder - Reuse it to make a bird feeder.",
            "Desk Organizer - Use it for stationery."
        ],
        disposal: "Keep the bottle clean and dry before giving it to an authorised plastic waste collector."
    },
    "Plastic bag": {
        recycling: [
            "Keep the plastic bag clean and dry.",
            "Collect reusable plastic bags separately.",
            "Check whether your local recycling centre accepts flexible plastic."
        ],
        diy: [
            "Reusable Storage - Use clean bags to store items.",
            "Plastic Yarn - Convert suitable bags into reusable plastic yarn.",
            "DIY Basket - Weave clean plastic strips into a small basket."
        ],
        disposal: "Do not burn plastic bags or throw them into drains. Give them to an appropriate collection facility."
    },
    "Other Plastic": {
        recycling: [
            "Clean the plastic item.",
            "Check its recycling symbol, if available.",
            "Separate it according to local recycling rules."
        ],
        diy: [
            "Storage Container - Reuse it for small items.",
            "Plant Holder - Convert suitable containers into planters.",
            "Creative Craft - Use clean plastic for crafts."
        ],
        disposal: "Send non-reusable plastic to an authorised waste collection facility."
    },
    "Plastic Cup": {
        recycling: [
            "Empty and clean the cup.",
            "Check whether your local recycler accepts this type of plastic.",
            "Keep it separate from general waste."
        ],
        diy: [
            "Mini Planter - Use it as a small plant pot.",
            "Pen Holder - Decorate it for your desk.",
            "Craft Organizer - Store small stationery items."
        ],
        disposal: "Dispose of it through an appropriate plastic waste collection service."
    },
    "Metal Can": {
        recycling: [
            "Empty and rinse the can.",
            "Allow it to dry.",
            "Place it in the metal recycling collection."
        ],
        diy: [
            "Pencil Holder - Decorate the can for stationery.",
            "Plant Pot - Reuse it after safely covering sharp edges.",
            "Desk Organizer - Organise your supplies."
        ],
        disposal: "Recycle through an authorised metal collection facility. Handle sharp edges carefully."
    },
    "Glass Bottles": {
        recycling: [
            "Empty and rinse the bottle.",
            "Keep glass separate from regular waste.",
            "Send it to a glass recycling collection point."
        ],
        diy: [
            "Flower Vase - Use it as a decorative vase.",
            "Decorative Bottle - Paint and decorate it.",
            "Storage Jar - Reuse it for suitable household storage."
        ],
        disposal: "Handle carefully and never mix broken glass with loose recyclable materials."
    },
    "Glass Shards": {
        recycling: [
            "Do not handle broken glass directly.",
            "Keep the shards in a rigid, puncture-resistant container.",
            "Check with your local glass waste collection facility."
        ],
        diy: [
            "DIY reuse is not recommended for broken glass.",
            "Avoid craft projects involving sharp shards."
        ],
        disposal: "Contain broken glass securely, label it clearly and follow local disposal guidelines."
    },
    "Paper": {
        recycling: [
            "Keep paper clean and dry.",
            "Remove plastic or other non-paper materials.",
            "Send it for paper recycling."
        ],
        diy: [
            "Paper Flowers - Create decorative flowers.",
            "Notebook - Reuse blank paper for rough notes.",
            "Gift Wrap - Use suitable paper for wrapping."
        ],
        disposal: "Put clean, dry paper in the paper recycling collection."
    },
    "Paper Bag": {
        recycling: [
            "Reuse the bag if it is in good condition.",
            "Keep it dry and free from food contamination.",
            "Send it for paper recycling."
        ],
        diy: [
            "Gift Bag - Decorate it for gifting.",
            "Storage Organizer - Reuse it for dry items.",
            "Paper Craft - Use it for creative projects."
        ],
        disposal: "Recycle clean and dry paper bags through paper collection."
    },
    "Cardboard Boxes": {
        recycling: [
            "Remove tape and other non-cardboard materials.",
            "Flatten the cardboard box.",
            "Keep it dry before recycling."
        ],
        diy: [
            "Storage Box - Make a household organiser.",
            "Desk Organizer - Create stationery compartments.",
            "DIY Toy - Build a simple cardboard craft."
        ],
        disposal: "Flatten and send clean cardboard to a paper recycling facility."
    },
    "Paper Carton": {
        recycling: [
            "Empty and rinse the carton.",
            "Check whether your local facility accepts beverage cartons.",
            "Keep it separate for appropriate collection."
        ],
        diy: [
            "Mini Planter - Use it as a seed starter.",
            "Storage Container - Reuse it for suitable dry items.",
            "Craft Project - Make a simple organiser."
        ],
        disposal: "Follow local carton recycling instructions."
    },
    "Paper Cup": {
        recycling: [
            "Check whether the cup has a plastic lining.",
            "Separate it according to local recycling rules.",
            "Do not mix contaminated cups with clean paper."
        ],
        diy: [
            "Seed Starter - Reuse a suitable cup for planting seeds.",
            "Craft Holder - Use it for small craft supplies.",
            "Mini Organizer - Decorate it for your desk."
        ],
        disposal: "Dispose of lined or contaminated cups according to local waste collection rules."
    },
    "Jug": {
        recycling: [
            "Empty and rinse the jug.",
            "Identify its material before recycling.",
            "Separate it according to local recycling rules."
        ],
        diy: [
            "Watering Can - Reuse a suitable clean jug.",
            "Planter - Convert it into a plant container.",
            "Storage Container - Reuse it for suitable household items."
        ],
        disposal: "Send it to an appropriate plastic or material-specific recycling facility."
    },
    "Plastic Cap": {
        recycling: [
            "Collect clean plastic caps separately.",
            "Check whether your recycling centre accepts loose caps.",
            "Follow local plastic recycling instructions."
        ],
        diy: [
            "Decorative Art - Use caps for a mosaic craft.",
            "Counting Game - Make educational counting pieces.",
            "Mini Craft - Use them for creative projects."
        ],
        disposal: "Give clean caps to a collection facility that accepts this type of plastic."
    },
    "Plastic Utensils": {
        recycling: [
            "Clean the utensils.",
            "Check whether local facilities accept disposable plastic utensils.",
            "Keep reusable utensils separate."
        ],
        diy: [
            "Craft Decoration - Reuse clean utensils for suitable art projects.",
            "Garden Labels - Use suitable pieces as plant labels.",
            "Creative Art - Make a decorative craft."
        ],
        disposal: "Dispose of non-recyclable utensils through the appropriate waste collection service."
    },
    "Styrofoam": {
        recycling: [
            "Keep the material clean and dry.",
            "Check whether a specialised facility accepts it.",
            "Do not mix it with regular plastic recycling unless permitted."
        ],
        diy: [
            "Craft Model - Reuse clean pieces for a model.",
            "Packaging Reuse - Save suitable pieces for protective packaging."
        ],
        disposal: "Take it to a facility that specifically accepts expanded polystyrene."
    },
    "food waste": {
        recycling: [
            "Separate food scraps from dry waste.",
            "Use a suitable composting system.",
            "Avoid mixing plastic or other contaminants with organic waste."
        ],
        diy: [
            "Home Compost - Convert suitable food scraps into compost.",
            "Kitchen Compost Bin - Collect biodegradable scraps separately."
        ],
        disposal: "Use a composting or authorised organic waste collection facility."
    }
};

const GuestScan = () => {
    const navigate = useNavigate();

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const fileRef = useRef(null);

    const [streaming, setStreaming] = useState(false);
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [scanResult, setScanResult] = useState(null);

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
                audio: false
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }

            setStreaming(true);
            setMessage("");
        } catch (error) {
            setMessage("Camera access failed. Please allow camera permission or use gallery upload.");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        setStreaming(false);
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !video.videoWidth) {
            setMessage("Camera is not ready yet.");
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        canvas.getContext("2d").drawImage(video, 0, 0);

        canvas.toBlob(blob => {
            if (!blob) {
                setMessage("Could not capture image.");
                return;
            }

            const capturedFile = new File([blob], "guest-scan.jpg", {
                type: "image/jpeg"
            });

            setFile(capturedFile);
            setImage(URL.createObjectURL(capturedFile));
            setScanResult(null);
            setMessage("Photo captured successfully.");

            stopCamera();
        }, "image/jpeg");
    };

    const chooseImage = (event) => {
        const selectedFile = event.target.files[0];

        if (!selectedFile) return;

        if (!selectedFile.type.startsWith("image/")) {
            setMessage("Please select an image file.");
            return;
        }

        setFile(selectedFile);
        setImage(URL.createObjectURL(selectedFile));
        setScanResult(null);
        setMessage("Image selected successfully.");
    };

    const uploadImage = async () => {
        if (!file) {
            setMessage("Please capture or select an image first.");
            return;
        }

        setLoading(true);
        setMessage("");
        setScanResult(null);

        try {
            const formData = new FormData();
            formData.append("image", file);

            // Guest scan: no user_id is sent.
            const response = await fetch("http://localhost:5000/api/scans", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Upload failed.");
            }

            if (!data.waste_type) {
                setMessage(
                    data.message ||
                    "Could not identify the waste. Please try another image."
                );
                return;
            }

            const detectedType = data.waste_type;
            const detectedConfidence = data.confidence != null
                ? Number(data.confidence)
                : null;

            // Save successful guest scan in temporary session storage.
            saveGuestScan(detectedType, detectedConfidence);

            setScanResult({
                wasteType: detectedType,
                confidence: detectedConfidence
            });

            setMessage("Waste detected successfully!");

        } catch (error) {
            setMessage(error.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const resetScan = () => {
        setFile(null);
        setImage(null);
        setScanResult(null);
        setMessage("");

        if (fileRef.current) {
            fileRef.current.value = "";
        }
    };

    const guide = scanResult
        ? wasteGuides[scanResult.wasteType] || {
            recycling: [
                "Identify the material before recycling.",
                "Keep the item clean and separate.",
                "Follow local recycling collection rules."
            ],
            diy: [
                "Look for safe reuse opportunities.",
                "Reuse suitable clean materials for household crafts."
            ],
            disposal: "Follow your local waste collection and disposal guidelines."
        }
        : null;

    const confidence = scanResult?.confidence ?? null;
    const highConfidence = confidence !== null && confidence >= 80;
    const mediumConfidence = confidence !== null && confidence >= 50 && confidence < 80;
    const lowConfidence = confidence === null || confidence < 50;

    return (
        <div className="guest-scan-page">
            <div className="guest-scan-container">

                {/* Back to Guest Dashboard */}
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
                    <h1>📷 Guest Waste Scanner</h1>
                    <p>Upload or capture a waste image to identify its category using AI.</p>
                </header>

                <div className="guest-scan-card">
                    <h2>Upload Waste Image</h2>

                    <div className="guest-scan-actions">
                        <button onClick={startCamera} disabled={streaming || loading}>
                            Start Camera
                        </button>

                        <button onClick={capturePhoto} disabled={!streaming}>
                            Capture Photo
                        </button>

                        <button onClick={stopCamera} disabled={!streaming}>
                            Stop Camera
                        </button>
                    </div>

                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="guest-scan-preview"
                        style={{
                            display: streaming ? "block" : "none",
                            background: "#222"
                        }}
                    />

                    <canvas ref={canvasRef} style={{ display: "none" }} />

                    <div className="guest-upload-area">
                        <div className="upload-icon">📁</div>
                        <p>Select a waste image from your device</p>

                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            onChange={chooseImage}
                        />
                    </div>

                    {image && (
                        <div className="guest-selected-image">
                            <h3>Selected Image</h3>
                            <img
                                src={image}
                                alt="Selected waste"
                                className="guest-scan-preview"
                            />
                        </div>
                    )}

                    <div className="guest-scan-actions">
                        <button
                            onClick={uploadImage}
                            disabled={!file || loading}
                        >
                            {loading ? "Detecting Waste..." : "Upload & Detect Waste"}
                        </button>
                    </div>

                    {message && (
                        <p className={
                            message.includes("successfully")
                                ? "guest-scan-message"
                                : "guest-scan-error"
                        }>
                            {message}
                        </p>
                    )}
                </div>

                {scanResult && (
                    <div className="guest-scan-card">

                        <div className="guest-scan-result">
                            <h2>🌱 Waste Detection Result</h2>

                            <p>Detected Waste Category</p>
                            <h2>{scanResult.wasteType}</h2>

                            <h3>AI Confidence</h3>

                            {confidence !== null ? (
                                <>
                                    <h2 className={
                                        highConfidence
                                            ? "confidence-high"
                                            : mediumConfidence
                                                ? "confidence-medium"
                                                : "confidence-low"
                                    }>
                                        {confidence.toFixed(2)}%
                                    </h2>

                                    <div className="confidence-track">
                                        <div
                                            className={`confidence-fill ${
                                                highConfidence
                                                    ? "high"
                                                    : mediumConfidence
                                                        ? "medium"
                                                        : "low"
                                            }`}
                                            style={{
                                                width: `${Math.min(100, Math.max(0, confidence))}%`
                                            }}
                                        />
                                    </div>
                                </>
                            ) : (
                                <p>Confidence score unavailable.</p>
                            )}
                        </div>

                        {lowConfidence && (
                            <div className="guest-scan-error">
                                <h3>⚠️ Image isn't clear enough!</h3>
                                <p>
                                    AI could not confidently identify this waste.
                                    Please upload a clearer image with better lighting.
                                </p>
                            </div>
                        )}

                        {mediumConfidence && (
                            <div className="guest-warning">
                                <h3>⚠️ Please verify this result</h3>
                                <p>
                                    AI is not fully certain about this classification.
                                    Please check the detected category.
                                </p>
                            </div>
                        )}

                        {highConfidence && guide && (
                            <div className="guest-guide-grid">

                                <div className="guest-guide-card">
                                    <h3>♻️ Recycling Guide</h3>
                                    <ul>
                                        {guide.recycling.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="guest-guide-card">
                                    <h3>💡 DIY & Reuse Ideas</h3>
                                    {guide.diy.map((item, index) => (
                                        <p key={index}>{item}</p>
                                    ))}
                                </div>

                                <div className="guest-guide-card">
                                    <h3>🗑️ Disposal Instructions</h3>
                                    <p>{guide.disposal}</p>
                                </div>

                            </div>
                        )}

                        <div className="guest-scan-actions">
                            <button onClick={resetScan}>
                                Scan Another Item
                            </button>
                        </div>
                    </div>
                )}

                <p className="guest-scan-message">
                    Guest scans are temporary for this browser session.
                    <br />
                    Login to access your saved activity and Eco Impact.
                </p>

            </div>
        </div>
    );
};

export default GuestScan;