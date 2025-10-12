// ./components/InteractiveMapBlock.jsx
import React from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import styled from "styled-components";
import { darkMapStyle } from "../data/darkMapStyle";
// import { firestore } from "../firebase";
import { firestore } from "../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
  position: "relative",
};

const MapWrapper = styled.div`
  position: relative;

  .clinic-label {
    font-weight: 500;
    font-size: 12px;
    color: #fff;
    transform: translateY(-28px);
  }

  .search-area-btn {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 5;
    background: #4d9fec;
    color: white;
    border: 0;
    border-radius: 999px;
    padding: 8px 14px;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
    white-space: nowrap;
  }
  .search-area-btn:disabled {
    opacity: 0.6;
    cursor: default;
  }

  p.helper {
    color: #aaa;
    font-size: 12px;
    text-align: center;
    margin-top: 8px;
  }
`;

const IWContent = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  strong {
    font-size: 14px;
    color: #111;
  }
  small {
    font-size: 12px;
    color: #666;
  }
  &:hover {
    background: #f9f9f9;
    border-radius: 4px;
  }
`;

// Haversine-ish radius from bounds half-diagonal (meters)
function radiusFromBounds(bounds) {
  if (!bounds) return null;
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(ne.lat() - sw.lat());
  const dLng = toRad(ne.lng() - sw.lng());
  const lat1 = toRad(sw.lat());
  const lat2 = toRad(ne.lat());
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const diagonal = R * c;
  return diagonal / 2;
}

// Hard cap on search radius
const MAX_RADIUS_M = 5000;

export default React.memo(function InteractiveMapBlock({ block }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  const mapRef = React.useRef(null);
  const initialCenter = block.center ?? { lat: 34.0195, lng: -118.4912 }; // Santa Monica
  const initialZoom = block.zoom ?? 10;

  const [markers, setMarkers] = React.useState([]);
  const [active, setActive] = React.useState(null);
  const [showSearchBtn, setShowSearchBtn] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [center, setCenter] = React.useState(initialCenter);
  const [zoom] = React.useState(initialZoom); // keep constant to avoid controlled-loop

  // Geolocate user; pan imperatively to avoid center/zoom feedback loops
  React.useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (mapRef.current) {
          mapRef.current.panTo(coords);
          mapRef.current.setZoom(12);
        } else {
          // if map not loaded yet, use as initial center
          setCenter(coords);
        }
      },
      () => {
        // ignore; fallback stays Santa Monica
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  const handleMapLoad = (map) => {
    mapRef.current = map;
  };

  const handleDragEnd = () => setShowSearchBtn(true);
  const handleZoomChanged = () => setShowSearchBtn(true);

  const fetchClinicsForCurrentBounds = React.useCallback(async () => {
    if (!mapRef.current) return;

    const bounds = mapRef.current.getBounds();
    if (!bounds) return;

    // compute radius and clamp
    const approxRadius = radiusFromBounds(bounds) || MAX_RADIUS_M;
    const radius = Math.min(approxRadius, MAX_RADIUS_M);

    // derive a bounding box from current bounds
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    let minLat = Math.min(sw.lat(), ne.lat());
    let maxLat = Math.max(sw.lat(), ne.lat());
    let minLng = Math.min(sw.lng(), ne.lng());
    let maxLng = Math.max(sw.lng(), ne.lng());

    // shrink to max-radius box around map center if zoomed too far out
    const c = mapRef.current.getCenter();
    const centerLat = c.lat();
    const centerLng = c.lng();

    const degPerMeterLat = 1 / 111320;
    const latPad = MAX_RADIUS_M * degPerMeterLat;
    const degPerMeterLng = 1 / (111320 * Math.cos((centerLat * Math.PI) / 180));
    const lngPad = MAX_RADIUS_M * degPerMeterLng;

    minLat = Math.max(minLat, centerLat - latPad);
    maxLat = Math.min(maxLat, centerLat + latPad);
    minLng = Math.max(minLng, centerLng - lngPad);
    maxLng = Math.min(maxLng, centerLng + lngPad);

    setLoading(true);

    try {
      // Firestore can range on one field; use location.lat then filter lng client-side
      const qRef = query(
        collection(firestore, block.collectionName || "clinics"),
        where("location.lat", ">=", minLat),
        where("location.lat", "<=", maxLat),
        orderBy("location.lat", "asc"),
        limit(400)
      );

      const snap = await getDocs(qRef);
      const rows = [];
      snap.forEach((d) => {
        const x = d.data();
        const loc = x?.location || {};
        if (
          typeof loc.lat === "number" &&
          typeof loc.lng === "number" &&
          x?.name &&
          loc.lng >= minLng &&
          loc.lng <= maxLng
        ) {
          rows.push({
            name: x.name,
            position: { lat: loc.lat, lng: loc.lng },
            website: x.website || x.site || undefined,
            email: x.email || undefined,
          });
        }
      });

      setMarkers(rows);
      setShowSearchBtn(false);
    } catch (err) {
      console.error("Firestore bounds fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [block.collectionName]);

  // Initial fetch once map is idle the first time
  const handleIdle = React.useCallback(() => {
    if (markers.length === 0) fetchClinicsForCurrentBounds();
  }, [markers.length, fetchClinicsForCurrentBounds]);

  if (!isLoaded) return <p style={{ color: "#ccc" }}>Loading map…</p>;

  return (
    <MapWrapper>
      {showSearchBtn && (
        <button
          className="search-area-btn"
          onClick={fetchClinicsForCurrentBounds}
          disabled={loading}
          aria-label="Search this area"
          title="Search this area"
        >
          {loading ? "Searching…" : "Search this area"}
        </button>
      )}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={handleMapLoad}
        onDragEnd={handleDragEnd}
        onZoomChanged={handleZoomChanged}
        onIdle={handleIdle}
        options={{
          styles: darkMapStyle,
          fullscreenControl: false,
          mapTypeControl: false,
          clickableIcons: false,
          streetViewControl: false,
        }}
      >
        {markers.map((m, i) => (
          <MarkerF
            key={`${m.name}-${i}`}
            position={m.position}
            onMouseOver={() => setActive(i)}
            onClick={() => m.website && window.open(m.website, "_blank")}
            label={{ text: m.name, className: "clinic-label", color: "#fff" }}
          />
        ))}

        {active !== null && markers[active] && (
          <InfoWindowF
            position={markers[active].position}
            onCloseClick={() => setActive(null)}
            options={{
              pixelOffset: new window.google.maps.Size(0, -10),
              maxWidth: 200,
            }}
          >
            <IWContent
              onClick={() =>
                markers[active].website &&
                window.open(markers[active].website, "_blank")
              }
            >
              <strong>{markers[active].name}</strong>
              <small>
                {markers[active].website
                  ? "Visit site ↗"
                  : markers[active].email || "No link"}
              </small>
            </IWContent>
          </InfoWindowF>
        )}
      </GoogleMap>

      <p className="helper">
        Showing clinics near the visible area (max ~5 km radius).
      </p>
    </MapWrapper>
  );
});
