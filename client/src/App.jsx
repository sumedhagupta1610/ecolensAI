
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import GuestDashboard from "./pages/guestDashboard";
import GuestScan from "./pages/GuestScan";
import GuestDetectWaste from "./pages/GuestDetectWaste";
import GuestWasteCategory from "./pages/GuestWasteCategory";

import Dashboard from "./pages/dashboard";
import Recycling from "./pages/recycling";
import DIYIdeas from "./pages/diyideas";
import NearbyCenters from "./pages/nearbycenters";
import ScanHistory from "./pages/scanhistory";
import EcoImpact from "./pages/ecoimpact";
import ScanWaste from "./pages/scanwaste";
import LearningHub from "./pages/learninghub";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Login */}
                <Route path="/" element={<Login />} />

                {/* Guest Routes */}
                <Route path="/guest" element={<GuestDashboard />} />
                <Route path="/guest-scan" element={<GuestScan />} />
                <Route path="/guest-detect" element={<GuestDetectWaste />} />
                <Route path="/guest-category" element={<GuestWasteCategory />} />

                {/* Registered User Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/scan" element={<ScanWaste />} />
                <Route path="/recycling" element={<Recycling />} />
                <Route path="/diy" element={<DIYIdeas />} />
                <Route path="/nearbycenters" element={<NearbyCenters />} />
                <Route path="/scanhistory" element={<ScanHistory />} />
                <Route path="/ecoimpact" element={<EcoImpact />} />
                <Route path="/learninghub" element={<LearningHub />} />

                {/* Unknown URL Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
