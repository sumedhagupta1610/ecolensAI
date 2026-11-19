
const STORAGE_KEY = "ecolens_guest_scans";

export const getGuestScans = () => {
    try {
        return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
};

export const saveGuestScan = (wasteType, confidence) => {
    const scans = getGuestScans();

    const scan = {
        id: Date.now(),
        wasteType,
        confidence: confidence != null ? Number(confidence) : null,
        category: getWasteCategory(wasteType),
        scannedAt: new Date().toLocaleString()
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([scan, ...scans]));
};

export const getWasteCategory = (wasteType = "") => {
    const type = wasteType.toLowerCase();

    if (
        type.includes("food") ||
        type.includes("organic") ||
        type.includes("vegetable") ||
        type.includes("fruit")
    ) {
        return "Wet Waste";
    }

    if (
        type.includes("e-waste") ||
        type.includes("electronic") ||
        type.includes("battery") ||
        type.includes("circuit")
    ) {
        return "E-Waste";
    }

    if (
        type.includes("plastic") ||
        type.includes("paper") ||
        type.includes("cardboard") ||
        type.includes("glass") ||
        type.includes("metal") ||
        type.includes("can") ||
        type.includes("styrofoam")
    ) {
        return "Dry Waste";
    }

    return "Dry Waste";
};
