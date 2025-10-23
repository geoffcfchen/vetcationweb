// src/components/ClinicsMapSection.jsx
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
  OverlayViewF,
} from "@react-google-maps/api";

// Firestore
import { firestore } from "../lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  startAt,
  endAt,
  limit,
} from "firebase/firestore";

// Geohash helpers
import { distanceBetween, geohashQueryBounds } from "geofire-common";

// Reuse your polished clinic panel + map style from InviteSurvey
import { ClinicPanel, defaultCleanStyle } from "../pages/InviteSurvey";

const SECTION_HEIGHT = "100vh";
const MAX_RADIUS_M = 10000; // ~10km

const Section = styled.section`
  position: relative;
  width: 100%;
  height: ${(p) => p.$height || SECTION_HEIGHT};
  overflow: hidden;
`;

const SearchButton = styled.button`
  position: absolute;
  top: 12px;
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
  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const Helper = styled.p`
  position: absolute;
  bottom: 8px;
  width: 100%;
  text-align: center;
  color: #888;
  font-size: 12px;
  pointer-events: none;
`;

const LabelChip = styled.div`
  transform: translate(-50%, -30px);
  background: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 12px;
  line-height: 1;
  color: #1a1a1a;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  white-space: nowrap;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;

  &.current {
    border-color: #c7d2fe;
    background: #eef2ff;
    color: #1e3a8a;
    font-weight: 700;
  }

  /* Selected (active) clinic label: bring forward & highlight */
  &.active {
    border-color: #4d9fec;
    background: #e9f3ff;
    box-shadow: 0 14px 28px rgba(77, 159, 236, 0.25),
      0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translate(-50%, -34px) scale(1.03);
    font-weight: 700;
  }
`;

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

export default function ClinicsMapSection({
  height = SECTION_HEIGHT,
  initialCenter = { lat: 34.0195, lng: -118.4912 }, // Santa Monica
  initialZoom = 13,
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  const mapRef = useRef(null);
  const [center, setCenter] = useState(initialCenter);
  const [userPos, setUserPos] = useState(null); // for the blue dot
  const [markers, setMarkers] = useState([]);
  const [active, setActive] = useState(null);
  const [showSearchBtn, setShowSearchBtn] = useState(false);
  const [loadingClinics, setLoadingClinics] = useState(false);

  // Ask for geolocation (HTTPS required). If granted, recenter and show blue dot.
  useEffect(() => {
    if (!isLoaded) return;
    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const next = { lat: latitude, lng: longitude };
        setUserPos(next);
        setCenter(next); // this updates the map center and will trigger onIdle
      },
      () => {
        // user denied or unavailable — stay on Santa Monica
      },
      { enableHighAccuracy: true, maximumAge: 60000, timeout: 8000 }
    );
  }, [isLoaded]);

  const handleMapLoad = (map) => {
    mapRef.current = map;
  };
  const handleDragEnd = () => setShowSearchBtn(true);
  const handleZoomChanged = () => setShowSearchBtn(true);

  const fetchClinicsForCurrentBounds = async () => {
    if (!mapRef.current) return;
    const bounds = mapRef.current.getBounds();
    if (!bounds) return;

    const approxRadius = radiusFromBounds(bounds) || MAX_RADIUS_M;
    const radius = Math.min(approxRadius, MAX_RADIUS_M);

    const c = mapRef.current.getCenter();
    const centerLat = c.lat();
    const centerLng = c.lng();

    setLoadingClinics(true);
    try {
      const ranges = geohashQueryBounds([centerLat, centerLng], radius);
      const colRef = collection(firestore, "clinics");
      const perRangeLimit = 100;

      const snaps = await Promise.all(
        ranges.map(([start, end]) =>
          getDocs(
            query(
              colRef,
              orderBy("geohash"),
              startAt(start),
              endAt(end),
              limit(perRangeLimit)
            )
          )
        )
      );

      const dedup = new Map();
      for (const snap of snaps) {
        snap.forEach((docSnap) => {
          if (dedup.has(docSnap.id)) return;
          const x = docSnap.data();
          const loc = x?.location;
          const lat =
            typeof loc?.latitude === "number"
              ? loc.latitude
              : typeof loc?.lat === "number"
              ? loc.lat
              : undefined;
          const lng =
            typeof loc?.longitude === "number"
              ? loc.longitude
              : typeof loc?.lng === "number"
              ? loc.lng
              : undefined;
          if (typeof lat !== "number" || typeof lng !== "number") return;

          const distKm = distanceBetween([centerLat, centerLng], [lat, lng]);
          const distM = distKm * 1000;
          if (distM <= radius) {
            dedup.set(docSnap.id, {
              id: docSnap.id,
              name: x.name || "Clinic",
              position: { lat, lng },
              website: x.website || x.site || undefined,
              email: x.email || undefined,
              phone: x.phone || x.formatted_phone_number || x.tel || undefined,
              address:
                x.address ||
                x.formatted_address ||
                (x.addr &&
                  [x.addr.line1, x.addr.line2, x.addr.city, x.addr.state]
                    .filter(Boolean)
                    .join(", ")) ||
                undefined,
              rating:
                typeof x.rating === "number"
                  ? x.rating
                  : typeof x.avgRating === "number"
                  ? x.avgRating
                  : typeof x?.place?.rating === "number"
                  ? x.place.rating
                  : undefined,
              reviewsCount:
                x.reviewsCount ??
                x.reviewCount ??
                x?.place?.user_ratings_total ??
                undefined,
              _distM: distM,
            });
          }
        });
      }

      const rows = Array.from(dedup.values()).sort(
        (a, b) => a._distM - b._distM
      );
      rows.forEach((r) => delete r._distM);

      setMarkers(rows);
      setShowSearchBtn(false);

      // Open the first clinic, if any
      setActive((prev) => {
        if (prev !== null) return prev;
        const idx = rows.findIndex((r) => r.id);
        return idx !== -1 ? idx : prev;
      });
    } catch (err) {
      console.error("Firestore geohash fetch error:", err);
    } finally {
      setLoadingClinics(false);
    }
  };

  const handleIdle = () => {
    if (markers.length === 0) fetchClinicsForCurrentBounds();
  };

  return (
    <Section $height={height}>
      {isLoaded && (
        <GoogleMap
          onLoad={handleMapLoad}
          onIdle={handleIdle}
          onDragEnd={handleDragEnd}
          onZoomChanged={handleZoomChanged}
          center={center}
          zoom={initialZoom}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            styles: defaultCleanStyle,
            clickableIcons: false,
            disableDefaultUI: true,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
          }}
        >
          {/* Blue-dot user location (shown only if permission granted) */}
          {userPos && (
            <MarkerF
              position={userPos}
              icon={{
                path: window.google?.maps?.SymbolPath?.CIRCLE,
                scale: 8,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              }}
              zIndex={window.google?.maps?.Marker?.MAX_ZINDEX}
            />
          )}

          {showSearchBtn && (
            <SearchButton
              onClick={fetchClinicsForCurrentBounds}
              disabled={loadingClinics}
            >
              {loadingClinics ? "Searching…" : "Search this area"}
            </SearchButton>
          )}

          {markers.map((m, i) => {
            const isActive = active === i;
            const icon = {
              path: window.google?.maps?.SymbolPath?.CIRCLE,
              scale: isActive ? 8 : 6, // subtle bump when active
              fillColor: "#4D9FEC",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            };
            return (
              <React.Fragment key={`${m.id}-${i}`}>
                <MarkerF
                  position={m.position}
                  onClick={() => setActive(i)}
                  icon={icon}
                  // active marker sits on top
                  zIndex={
                    isActive
                      ? window.google?.maps?.Marker?.MAX_ZINDEX
                      : undefined
                  }
                />
                <OverlayViewF
                  position={m.position}
                  // active label goes to highest pane so neighbors can't cover it
                  mapPaneName={isActive ? "floatPane" : "overlayMouseTarget"}
                >
                  <LabelChip
                    className={isActive ? "active" : ""}
                    onClick={() => setActive(i)}
                    title={m.name}
                  >
                    {m.name}
                  </LabelChip>
                </OverlayViewF>
              </React.Fragment>
            );
          })}

          {active !== null && markers[active] && (
            <InfoWindowF
              position={markers[active].position}
              onCloseClick={() => setActive(null)}
              options={{
                pixelOffset: new window.google.maps.Size(0, -14),
                maxWidth: 360,
                disableAutoPan: false,
              }}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <ClinicPanel
                  clinicId={markers[active].id}
                  clinicName={markers[active].name}
                  isPrimary={false} // homepage: no demo vets
                  clinicMeta={markers[active]}
                />
              </div>
            </InfoWindowF>
          )}

          <Helper>Drag or zoom, then tap “Search this area”.</Helper>
        </GoogleMap>
      )}
    </Section>
  );
}
