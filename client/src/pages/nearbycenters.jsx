
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/nearbycenters.css";

const NearbyCenters = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Centers");
  const [centers, setCenters] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Calculate distance between two coordinates
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Fetch with timeout
  const fetchWithTimeout = async (url, timeout = 25000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      return await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: "application/json"
        }
      });
    } finally {
      clearTimeout(timer);
    }
  };

  // Find city using OpenStreetMap Nominatim
  const findCity = async (cityName) => {
    const geoUrl = new URL(
      "https://nominatim.openstreetmap.org/search"
    );

    geoUrl.search = new URLSearchParams({
      q: `${cityName}, India`,
      format: "jsonv2",
      limit: "1",
      countrycodes: "in"
    }).toString();

    const response = await fetchWithTimeout(geoUrl.toString(), 15000);

    if (!response.ok) {
      throw new Error(`City search failed (${response.status})`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("City not found. Please check the spelling.");
    }

    if (!data[0].boundingbox) {
      throw new Error("City boundaries are not available.");
    }

    return data[0];
  };

  // Fetch recycling locations from Overpass
  const fetchCenters = async (bounds) => {
    const [south, north, west, east] = bounds.map(Number);

    const query = `
      [out:json][timeout:25];
      (
        nwr["amenity"="recycling"](${south},${west},${north},${east});
        nwr["amenity"="waste_transfer_station"](${south},${west},${north},${east});
        nwr["recycling_type"="centre"](${south},${west},${north},${east});
      );
      out center tags;
    `;

    const servers = [
      "https://overpass-api.de/api/interpreter",
      "https://overpass.private.coffee/api/interpreter",
      "https://overpass.kumi.systems/api/interpreter"
    ];

    let lastError = null;

    for (const server of servers) {
      try {
        console.log("Trying map server:", server);

        const url = `${server}?data=${encodeURIComponent(query)}`;

        const response = await fetchWithTimeout(url, 35000);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!data || !Array.isArray(data.elements)) {
          throw new Error("Invalid response from map server.");
        }

        console.log(
          `Successfully fetched ${data.elements.length} locations`
        );

        return data.elements;
      } catch (error) {
        console.error(`Map server failed (${server}):`, error);
        lastError = error;
      }
    }

    throw new Error(
      lastError?.name === "AbortError"
        ? "Map server request timed out. Please try again."
        : `All map servers failed. ${lastError?.message || ""}`
    );
  };

  // Format locations
  const formatCenters = (elements, cityData) => {
    return elements
      .map((item) => {
        const tags = item.tags || {};

        const lat = Number(item.lat ?? item.center?.lat);
        const lon = Number(item.lon ?? item.center?.lon);

        if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
          return null;
        }

        const acceptedTypes = Object.keys(tags)
          .filter(
            (key) =>
              key.startsWith("recycling:") &&
              tags[key] === "yes"
          )
          .map((key) =>
            key
              .replace("recycling:", "")
              .replaceAll("_", " ")
          );

        const accepted =
          acceptedTypes.join(", ") ||
          "Recycling and waste collection";

        const searchableText = [
          accepted,
          tags.name || "",
          tags.operator || "",
          tags.description || ""
        ].join(" ");

        const category =
          /battery|electronic|e-waste|electrical/i.test(searchableText)
            ? "E-Waste"
            : /organic|green waste|compost/i.test(searchableText)
            ? "Composting"
            : "Recycling";

        const address = [
          tags["addr:housenumber"],
          tags["addr:street"],
          tags["addr:suburb"],
          tags["addr:city"]
        ]
          .filter(Boolean)
          .join(", ");

        const distance =
          userLocation !== null
            ? getDistance(
                userLocation.latitude,
                userLocation.longitude,
                lat,
                lon
              )
            : null;

        return {
          center_id: `${item.type}-${item.id}`,
          center_name:
            tags.name ||
            tags.operator ||
            "Recycling Collection Point",
          address: address || cityData.display_name,
          accepted_waste_types: accepted,
          category,
          latitude: lat,
          longitude: lon,
          distance
        };
      })
      .filter(Boolean);
  };

  // Search recycling centers by city
  const searchCenters = async () => {
    if (loading) return;

    if (!search.trim()) {
      setMessage("Please enter a city name.");
      return;
    }

    setLoading(true);
    setMessage("Searching recycling centers...");
    setCenters([]);

    try {
      // Step 1: Find city
      const cityData = await findCity(search.trim());

      console.log("City found:", cityData.display_name);

      // Step 2: Fetch locations
      const elements = await fetchCenters(cityData.boundingbox);

      // Step 3: Format results
      let results = formatCenters(elements, cityData);

      // Sort by distance when user location is available
      if (userLocation) {
        results.sort((a, b) => a.distance - b.distance);
      }

      setCenters(results);

      setMessage(
        results.length > 0
          ? `Found ${results.length} mapped locations in ${search.trim()}.`
          : `No mapped recycling centers found in ${search.trim()}. Try another city.`
      );
    } catch (error) {
      console.error("Nearby Centers Error:", error);

      setMessage(
        error.message ||
        "Unable to fetch locations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Detect user's location
  const getMyLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Location is not supported by this browser.");
      return;
    }

    setMessage("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

        setUserLocation(location);

        setCenters((previous) =>
          [...previous]
            .map((center) => ({
              ...center,
              distance: getDistance(
                location.latitude,
                location.longitude,
                center.latitude,
                center.longitude
              )
            }))
            .sort((a, b) => a.distance - b.distance)
        );

        setMessage("Your location detected successfully!");
      },
      (error) => {
        console.error("Geolocation error:", error);

        if (error.code === 1) {
          setMessage(
            "Location permission denied. Please allow location access."
          );
        } else if (error.code === 2) {
          setMessage("Your current location is unavailable.");
        } else {
          setMessage("Location request timed out. Please try again.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );
  };

  // Category filtering
  const filteredCenters = centers.filter(
    (center) =>
      filter === "All Centers" ||
      center.category === filter
  );

  return (
    <div className="centers-page">

      {/* Back Button */}
      <button
        className="centers-back-button"
        onClick={() => navigate("/dashboard")}
      >
        ← Back
      </button>

      <div className="centers-header">
        <h1>Nearby Recycling Centers 📍</h1>
        <p>
          Find recycling and waste collection centers near you.
        </p>
      </div>

      {/* Search */}
      <div className="center-search">

        <input
          type="text"
          placeholder="Search by city name (e.g. Jaipur, Delhi)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") searchCenters();
          }}
        />

        <button
          onClick={searchCenters}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>

        <button
          className="location-btn"
          onClick={getMyLocation}
        >
          📍 Use My Location
        </button>

      </div>

      {message && (
        <p className="center-message">{message}</p>
      )}

      {/* Filters */}
      <div className="center-filters">
        {[
          "All Centers",
          "Recycling",
          "E-Waste",
          "Composting"
        ].map((item) => (
          <button
            key={item}
            className={
              filter === item ? "active-filter" : ""
            }
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Results */}
      <p className="section-title">
        Available Centers ({filteredCenters.length})
      </p>

      <div className="centers-list">

        {filteredCenters.length > 0 ? (
          filteredCenters.map((center) => (
            <div
              className="center-card"
              key={center.center_id}
            >

              <div className="center-icon">
                {center.category === "E-Waste"
                  ? "🔋"
                  : center.category === "Composting"
                  ? "🍂"
                  : "♻️"}
              </div>

              <div className="center-info">

                <h2>{center.center_name}</h2>

                <p className="center-type">
                  {center.accepted_waste_types}
                </p>

                <p>📍 {center.address}</p>

                <p>
                  📏{" "}
                  {center.distance !== null
                    ? `${center.distance.toFixed(2)} km away`
                    : "Distance unavailable"}
                </p>

              </div>

              <button
                className="details-btn"
                onClick={() => setSelectedCenter(center)}
              >
                View Details
              </button>

            </div>
          ))
        ) : (
          <p>
            No centers to display. Search for a city to find
            mapped locations.
          </p>
        )}

      </div>

      <p className="osm-credit">
        Location data © OpenStreetMap contributors
      </p>

      {/* Details Modal */}
      {selectedCenter && (
        <div
          className="center-modal"
          onClick={() => setSelectedCenter(null)}
        >

          <div
            className="center-modal-content"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() => setSelectedCenter(null)}
            >
              ✕
            </button>

            <h2>{selectedCenter.center_name}</h2>

            <p>
              <b>Category:</b> {selectedCenter.category}
            </p>

            <p>
              <b>Address:</b> {selectedCenter.address}
            </p>

            <p>
              <b>Accepted Waste:</b>{" "}
              {selectedCenter.accepted_waste_types}
            </p>

            <p>
              <b>Distance:</b>{" "}
              {selectedCenter.distance !== null
                ? `${selectedCenter.distance.toFixed(2)} km`
                : "Unavailable"}
            </p>

            <a
              href={`https://www.openstreetmap.org/?mlat=${selectedCenter.latitude}&mlon=${selectedCenter.longitude}#map=17/${selectedCenter.latitude}/${selectedCenter.longitude}`}
              target="_blank"
              rel="noreferrer"
            >
              View on Map ↗
            </a>

          </div>

        </div>
      )}

    </div>
  );
};

export default NearbyCenters;
