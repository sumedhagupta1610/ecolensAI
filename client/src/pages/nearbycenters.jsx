
import React, { useState } from "react";
import "../styles/nearbycenters.css";

const NearbyCenters = () => {
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
  const fetchWithTimeout = async (url, options = {}, timeout = 20000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      return await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          ...(options.headers || {}),
        },
      });
    } finally {
      clearTimeout(timer);
    }
  };

  // Find city using Nominatim
  const findCity = async (cityName) => {
    const url = new URL("https://nominatim.openstreetmap.org/search");

    url.search = new URLSearchParams({
      q: `${cityName}, India`,
      format: "jsonv2",
      limit: "1",
      countrycodes: "in",
    }).toString();

    const response = await fetchWithTimeout(url.toString(), {}, 15000);

    if (!response.ok) {
      throw new Error(`City search failed (${response.status}).`);
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

  // Convert Photon results into a common format
  const convertPhotonResults = (features) => {
    return features.map((feature, index) => {
      const properties = feature.properties || {};
      const coordinates = feature.geometry?.coordinates;

      if (!coordinates || coordinates.length < 2) return null;

      const [lon, lat] = coordinates;

      return {
        type: "node",
        id: properties.osm_id || `photon-${index}`,
        lat: Number(lat),
        lon: Number(lon),
        tags: {
          name:
            properties.name ||
            properties.street ||
            "Recycling Collection Point",
          operator: properties.operator || "",
          amenity:
            properties.osm_value === "waste_transfer_station"
              ? "waste_transfer_station"
              : "recycling",
          "addr:city": properties.city || "",
          "addr:street": properties.street || "",
          "addr:postcode": properties.postcode || "",
          description: properties.name || "",
        },
      };
    }).filter(Boolean);
  };

  // Convert Nominatim results into a common format
  const convertNominatimResults = (places) => {
    return places.map((place, index) => ({
      type: "nominatim",
      id: place.place_id || `nominatim-${index}`,
      lat: Number(place.lat),
      lon: Number(place.lon),
      tags: {
        name: place.name || place.display_name?.split(",")[0],
        amenity: place.type === "waste_transfer_station"
          ? "waste_transfer_station"
          : "recycling",
        description: place.display_name || "",
        "addr:city": place.address?.city || place.address?.town || "",
        "addr:street": place.address?.road || "",
      },
    })).filter(
      (item) =>
        Number.isFinite(item.lat) && Number.isFinite(item.lon)
    );
  };

  // Try Photon and Nominatim if Overpass is unavailable
  const fetchFallbackCenters = async (bounds, cityName) => {
    const [south, north, west, east] = bounds.map(Number);

    const centerLat = (south + north) / 2;
    const centerLon = (west + east) / 2;

    const fallbackTasks = [];

    // Photon search
    fallbackTasks.push(
      (async () => {
        const url = new URL("https://photon.komoot.io/api/");

        url.search = new URLSearchParams({
          q: `recycling center ${cityName}`,
          lat: String(centerLat),
          lon: String(centerLon),
          limit: "50",
          lang: "en",
        }).toString();

        const response = await fetchWithTimeout(
          url.toString(),
          {},
          15000
        );

        if (!response.ok) {
          throw new Error(`Photon HTTP ${response.status}`);
        }

        const data = await response.json();

        const features = (data.features || []).filter((feature) => {
          const coordinates = feature.geometry?.coordinates;
          if (!coordinates) return false;

          const [lon, lat] = coordinates;

          return (
            lat >= south &&
            lat <= north &&
            lon >= west &&
            lon <= east
          );
        });

        return convertPhotonResults(features);
      })()
    );

    // Nominatim search
    fallbackTasks.push(
      (async () => {
        const url = new URL("https://nominatim.openstreetmap.org/search");

        url.search = new URLSearchParams({
          q: `recycling centre ${cityName}, India`,
          format: "jsonv2",
          addressdetails: "1",
          limit: "30",
          countrycodes: "in",
        }).toString();

        const response = await fetchWithTimeout(
          url.toString(),
          {},
          15000
        );

        if (!response.ok) {
          throw new Error(`Nominatim HTTP ${response.status}`);
        }

        const data = await response.json();

        const places = (data || []).filter((place) => {
          const lat = Number(place.lat);
          const lon = Number(place.lon);

          return (
            lat >= south &&
            lat <= north &&
            lon >= west &&
            lon <= east
          );
        });

        return convertNominatimResults(places);
      })()
    );

    const responses = await Promise.allSettled(fallbackTasks);

    const results = responses
      .filter((result) => result.status === "fulfilled")
      .flatMap((result) => result.value);

    // Remove duplicate coordinates
    const uniqueResults = [];
    const seen = new Set();

    results.forEach((item) => {
      const key = `${item.lat.toFixed(5)}-${item.lon.toFixed(5)}`;

      if (!seen.has(key)) {
        seen.add(key);
        uniqueResults.push(item);
      }
    });

    console.log("Fallback locations found:", uniqueResults.length);

    if (uniqueResults.length > 0) {
      return uniqueResults;
    }

    throw new Error(
      "No recycling locations were returned by the available map services."
    );
  };

  // Fetch recycling locations from multiple Overpass servers
  const fetchCenters = async (bounds, cityName) => {
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
      "https://overpass.kumi.systems/api/interpreter",
    ];

    console.log("Trying Overpass servers simultaneously...");

    const requests = servers.map(async (server) => {
      const response = await fetchWithTimeout(
        server,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ data: query }).toString(),
        },
        18000
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} from ${server}`);
      }

      const data = await response.json();

      if (!Array.isArray(data.elements) || data.elements.length === 0) {
        throw new Error(`No locations returned by ${server}`);
      }

      console.log(
        `Successfully fetched ${data.elements.length} locations from ${server}`
      );

      return data.elements;
    });

    try {
      // Accept only a successful response containing actual locations
      const elements = await Promise.any(requests);
      return elements;
    } catch (error) {
      console.warn(
        "Overpass servers unavailable. Trying fallback services:",
        error
      );

      return await fetchFallbackCenters(bounds, cityName);
    }
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
            key.replace("recycling:", "").replaceAll("_", " ")
          );

        const accepted =
          acceptedTypes.join(", ") ||
          "Recycling and waste collection";

        const searchableText = [
          accepted,
          tags.name || "",
          tags.operator || "",
          tags.description || "",
          tags.amenity || "",
          tags.recycling_type || "",
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
          tags["addr:city"],
          tags["addr:postcode"],
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
          address: address || tags.description || cityData.display_name,
          accepted_waste_types: accepted,
          category,
          latitude: lat,
          longitude: lon,
          distance,
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
      const cityData = await findCity(search.trim());

      console.log("City found:", cityData.display_name);

      const elements = await fetchCenters(
        cityData.boundingbox,
        search.trim()
      );

      let results = formatCenters(elements, cityData);

      if (userLocation) {
        results.sort((a, b) => {
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        });
      }

      setCenters(results);

      setMessage(
        results.length > 0
          ? `Found ${results.length} mapped locations in ${search.trim()}.`
          : `No mapped recycling centers found in ${search.trim()}.`
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
          longitude: position.coords.longitude,
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
              ),
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
        maximumAge: 60000,
      }
    );
  };

  // Category filtering
  const filteredCenters = centers.filter(
    (center) =>
      filter === "All Centers" || center.category === filter
  );

  return (
    <div className="centers-page">
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

        <button onClick={searchCenters} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>

        <button className="location-btn" onClick={getMyLocation}>
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
          "Composting",
        ].map((item) => (
          <button
            key={item}
            className={filter === item ? "active-filter" : ""}
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
            <div className="center-card" key={center.center_id}>
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
            No centers to display. Search for a city to find mapped
            locations.
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
