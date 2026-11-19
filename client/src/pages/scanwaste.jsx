
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/scanwaste.css";

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
            "Desk Organizer - Cut and decorate it for stationery."
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
            "Creative Craft - Use clean plastic for craft projects."
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
            "Plant Pot - Reuse it as a small planter after safely covering sharp edges.",
            "Desk Organizer - Use it to organise supplies."
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
            "Avoid craft projects that require handling sharp shards."
        ],
        disposal: "Wrap or contain broken glass securely, label it clearly and follow local disposal guidelines."
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
            "Reuse the bag if it is still in good condition.",
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
            "Desk Organizer - Create compartments for stationery.",
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
            "Mini Planter - Reuse a clean carton as a seed starter.",
            "Storage Container - Use it for suitable dry items.",
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
            "Mini Organizer - Decorate it for desk storage."
        ],
        disposal: "Dispose of lined or contaminated cups according to local waste collection rules."
    },
    "Jug": {
        recycling: [
            "Empty and rinse the jug.",
            "Identify its material before recycling.",
            "Separate it according to the material and local recycling rules."
        ],
        diy: [
            "Watering Can - Reuse a suitable clean jug.",
            "Planter - Convert it into a plant container.",
            "Storage Container - Reuse it for appropriate household items."
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
            "Mini Craft - Use them for small creative projects."
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

const ScanWaste = () => {
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
            videoRef.current.srcObject = stream;

            await videoRef.current.play();

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

            const capturedFile = new File([blob], "camera-scan.jpg", {
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

            const currentUser = JSON.parse(
                localStorage.getItem("currentUser") || "null"
            );

            if (currentUser?.id) {
                formData.append("user_id", currentUser.id);
            }

            const response = await fetch("http://localhost:5000/api/scans", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Upload failed.");
            }

            if (!data.waste_type) {
                setMessage(data.message || "Could not identify the waste. Please try another image.");
                return;
            }

            setScanResult({
                scanId: data.scan_id,
                wasteType: data.waste_type,
                confidence: data.confidence != null
                    ? Number(data.confidence)
                    : null,
                imagePath: data.image_path
            });

            setFile(null);
            setMessage("Your scan has been saved successfully!");

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

    const confidence = scanResult?.confidence;
    const highConfidence = confidence !== null && confidence >= 80;
    const mediumConfidence = confidence !== null && confidence >= 50 && confidence < 80;
    const lowConfidence = confidence === null || confidence < 50;

    const confidenceClass = highConfidence
        ? "high"
        : mediumConfidence
            ? "medium"
            : "low";

    return (
        <div className="scan-page">

            <button
                className="scan-back-button"
                onClick={() => navigate("/dashboard")}
            >
                ← Back
            </button>

            <h1>📷 Scan Your Waste</h1>

            <p className="scan-description">
                Capture or upload a waste image to get AI-powered recycling and reuse suggestions.
            </p>

            <div className="scan-panel">
                <h3>Capture or Upload Image</h3>

                <div className="scan-action-buttons">
                    <button onClick={startCamera} disabled={streaming || loading} className="scan-button">
                        Start Camera
                    </button>

                    <button onClick={capturePhoto} disabled={!streaming} className="scan-button">
                        Capture Photo
                    </button>

                    <button onClick={stopCamera} disabled={!streaming} className="scan-secondary-button">
                        Stop Camera
                    </button>
                </div>

                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className={`scan-video ${streaming ? "visible" : "hidden"}`}
                />

                <canvas ref={canvasRef} className="scan-hidden-canvas" />

                <div className="scan-file-input">
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={chooseImage}
                    />
                </div>

                {image && (
                    <div className="scan-selected-image">
                        <h3>Selected Image</h3>
                        <img
                            src={image}
                            alt="Selected waste"
                            className="scan-preview-image"
                        />
                    </div>
                )}

                <button
                    onClick={uploadImage}
                    disabled={!file || loading}
                    className="scan-button scan-upload-button"
                >
                    {loading ? "Analysing Image..." : "Upload & Analyse Waste"}
                </button>

                {message && (
                    <p className={`scan-message ${message.includes("successfully") ? "success" : "error"}`}>
                        {message}
                    </p>
                )}
            </div>

            {scanResult && (
                <div className="scan-result">
                    <h2>🌱 Your AI Waste Analysis</h2>

                    <div className="scan-detected-box">
                        <p className="scan-detected-label">Detected Waste</p>

                        <h2 className="scan-detected-name">
                            {scanResult.wasteType}
                        </h2>

                        <p className="scan-id">
                            Scan ID: {scanResult.scanId}
                        </p>
                    </div>

                    <h3>AI Confidence</h3>

                    {confidence !== null ? (
                        <>
                            <h2 className={`scan-confidence-value ${confidenceClass}`}>
                                {confidence.toFixed(2)}%
                            </h2>

                            <progress
                                className={`scan-confidence-progress ${confidenceClass}`}
                                value={Math.min(100, Math.max(0, confidence))}
                                max="100"
                            />
                        </>
                    ) : (
                        <p>Confidence score unavailable.</p>
                    )}

                    {lowConfidence && (
                        <div className="scan-warning">
                            <h3>⚠️ Image isn't clear enough!</h3>
                            <p>
                                Bro, we couldn't confidently identify this waste.
                                Please upload a clearer image with better lighting
                                and the item properly in focus.
                            </p>
                            <button onClick={resetScan} className="scan-button">
                                Upload Another Image
                            </button>
                        </div>
                    )}

                    {mediumConfidence && (
                        <div className="scan-warning">
                            <h3>⚠️ Please verify this result</h3>
                            <p>
                                The AI is not fully certain about this classification.
                                Please check whether the detected waste type is correct
                                before following the recommendations.
                            </p>
                        </div>
                    )}

                    {highConfidence && guide && (
                        <>
                            <div className="scan-guide-card">
                                <h3>♻️ Recycling Guide</h3>
                                <ul className="scan-guide-list">
                                    {guide.recycling.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="scan-guide-card">
                                <h3>💡 DIY & Reuse Ideas</h3>
                                {guide.diy.map((item, index) => (
                                    <div key={index} className="scan-diy-item">
                                        {item}
                                    </div>
                                ))}
                            </div>

                            <div className="scan-guide-card">
                                <h3>🗑️ Disposal Instructions</h3>
                                <p>{guide.disposal}</p>
                            </div>
                        </>
                    )}

                    <div className="scan-result-actions">
                        <button onClick={resetScan} className="scan-button">
                            Scan Another Item
                        </button>

                        <button
                            onClick={() => navigate("/scanhistory")}
                            className="scan-secondary-button"
                        >
                            View Scan History
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScanWaste;
