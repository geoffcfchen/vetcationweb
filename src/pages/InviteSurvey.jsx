// src/pages/InviteSurvey.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import { useParams } from "react-router-dom";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";

// Firestore (modular SDK)
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

const BREAKPOINT = 768; // <768 = mobile sheet, >=768 = left card
const MAX_RADIUS_M = 5000;

const Page = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
`;

const BgMapWrap = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: auto;
`;

const DesktopCard = styled.div`
  position: fixed;
  top: 24px;
  left: 24px;
  max-width: 520px;
  width: calc(min(92vw, 520px));
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
`;

const MobileSheet = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${(p) => p.$height}px;
  background: #fff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -12px 28px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  touch-action: none;
`;

const Grabber = styled.div`
  padding: 10px 0 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
  user-select: none;
  &::before {
    content: "";
    width: 44px;
    height: 5px;
    border-radius: 999px;
    background: #d6d6d6;
    display: block;
  }
`;

const SheetBody = styled.div`
  padding: 16px;
  overflow: auto;
`;

const H1 = styled.h1`
  font-size: 20px;
  margin: 0 0 12px;
`;

const P = styled.p`
  color: #555;
  margin: 0 0 16px;
`;

const Choice = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  text-align: left;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #e6e6e6;
  background: ${(p) => (p.$active ? "#e9f3ff" : "white")};
  cursor: pointer;
`;

const Submit = styled.button`
  margin-top: 16px;
  background: #4d9fec;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
`;

const Muted = styled.p`
  color: #888;
  font-size: 14px;
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

// Default look, just hide store/POI promos and transit
export const defaultCleanStyle = [
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },
  {
    featureType: "poi.business",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  //remove parks
  {
    featureType: "poi.park",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  //remove East Los Angeles Hobart, El Sereno, and Montecito Heights labels this kind of labels
  {
    featureType: "administrative.neighborhood",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

const FN_VERIFY =
  import.meta.env.VITE_FN_VERIFY ||
  "https://us-central1-vetcationapp.cloudfunctions.net/verifyClinicInvite";
const FN_SUBMIT =
  import.meta.env.VITE_FN_SUBMIT ||
  "https://us-central1-vetcationapp.cloudfunctions.net/submitClinicInterest"; // <- default

// Approximate radius from current map bounds half-diagonal (meters)
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

export default function InviteSurvey() {
  const { clinicId, token } = useParams();

  // responsive mode
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < BREAKPOINT : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // verify state
  const [verifying, setVerifying] = useState(true);
  const [valid, setValid] = useState(false);
  const [invalidReason, setInvalidReason] = useState("");

  // page state
  const [clinicName, setClinicName] = useState("Your clinic");
  const [center, setCenter] = useState({ lat: 34.0195, lng: -118.4912 });
  const [nonce, setNonce] = useState("");

  // form state
  const [selected, setSelected] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // map + clinics state
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]); // nearby clinics
  const [active, setActive] = useState(null);
  const [showSearchBtn, setShowSearchBtn] = useState(false);
  const [loadingClinics, setLoadingClinics] = useState(false);

  // bottom sheet drag state
  const minSheet = 200;
  const maxSheet = Math.floor(
    typeof window !== "undefined" ? window.innerHeight * 0.85 : 640
  );
  const [sheetH, setSheetH] = useState(Math.min(280, maxSheet));
  const dragRef = useRef({ startY: 0, startH: sheetH, dragging: false });

  const startDrag = (e) => {
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragRef.current = { startY: clientY, startH: sheetH, dragging: true };
  };
  const onDrag = (e) => {
    if (!dragRef.current.dragging) return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dy = dragRef.current.startY - clientY;
    const next = Math.max(
      minSheet,
      Math.min(maxSheet, dragRef.current.startH + dy)
    );
    setSheetH(next);
  };
  const endDrag = () => {
    dragRef.current.dragging = false;
    const mid = (minSheet + maxSheet) / 2;
    setSheetH((h) => (h < mid ? minSheet : maxSheet));
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  // Verify token first. If invalid, do not show the survey.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setVerifying(true);
        const resp = await fetch(FN_VERIFY, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clinicId, token }),
        });
        if (!resp.ok) {
          const text = await resp.text().catch(() => "");
          throw new Error(`HTTP ${resp.status} ${text}`.trim());
        }
        const json = await resp.json();
        if (!alive) return;

        if (!json.ok) {
          setValid(false);
          setInvalidReason(json.error || "invalid link");
        } else {
          setValid(true);
          setClinicName(json.clinicName || "Your clinic");
          if (
            json.center &&
            typeof json.center.lat === "number" &&
            typeof json.center.lng === "number"
          ) {
            setCenter(json.center);
          }
          setNonce(json.nonce);
        }
      } catch (e) {
        if (!alive) return;
        console.error("verifyClinicInvite failed:", e);
        setValid(false);
        setInvalidReason(String(e?.message || e || "network error"));
      } finally {
        if (alive) setVerifying(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [clinicId, token]);

  const choices = useMemo(
    () => [
      { key: "gp", label: "GP" },
      {
        key: "specialists",
        label:
          "Specialists (dermatology for skin, behavior specialist, pathology for cancer consult)",
      },
      { key: "dog_trainers", label: "Certified dog trainers" },
      { key: "none", label: "None of the above" },
    ],
    []
  );

  const toggle = (key) => {
    const next = new Set(selected);
    if (key === "none") {
      next.clear();
      next.add("none");
    } else {
      if (next.has("none")) next.delete("none");
      next.has(key) ? next.delete(key) : next.add(key);
    }
    setSelected(next);
  };

  const submit = async () => {
    if (selected.size === 0 || !nonce) return;
    setSubmitting(true);
    try {
      const resp = await fetch(FN_SUBMIT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicId,
          token,
          nonce,
          interests: Array.from(selected),
        }),
      });
      const json = await resp.json();
      if (!json.ok) throw new Error(json.error || "submit failed");
      setDone(true);
    } catch (e) {
      alert(e.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  // Map handlers
  const handleMapLoad = (map) => {
    mapRef.current = map;
  };
  const handleDragEnd = () => setShowSearchBtn(true);
  const handleZoomChanged = () => setShowSearchBtn(true);

  // Fetch clinics in current bounds using geohash ranges
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
        snap.forEach((doc) => {
          if (dedup.has(doc.id)) return;
          const x = doc.data();

          // location can be GeoPoint or {lat,lng}
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
            dedup.set(doc.id, {
              id: doc.id,
              name: x.name || "Clinic",
              position: { lat, lng },
              website: x.website || x.site || undefined,
              email: x.email || undefined,
              _distM: distM,
            });
          }
        });
      }

      // ensure current clinic is visible and highlighted
      if (typeof center.lat === "number" && typeof center.lng === "number") {
        dedup.set("__current", {
          id: "__current",
          name: clinicName || "Selected clinic",
          position: { lat: center.lat, lng: center.lng },
          highlight: true,
          _distM: 0,
        });
      }

      const rows = Array.from(dedup.values()).sort(
        (a, b) => a._distM - b._distM
      );
      rows.forEach((r) => delete r._distM);

      setMarkers(rows);
      setShowSearchBtn(false);
    } catch (err) {
      console.error("Firestore geohash fetch error:", err);
    } finally {
      setLoadingClinics(false);
    }
  };

  // Initial fetch once map is idle the first time
  const handleIdle = () => {
    if (markers.length === 0) fetchClinicsForCurrentBounds();
  };

  if (verifying) {
    return (
      <Page>
        <DesktopCard>
          <H1>Loading…</H1>
          <Muted>Verifying your invite link.</Muted>
        </DesktopCard>
      </Page>
    );
  }

  if (!valid) {
    return (
      <Page>
        <DesktopCard>
          <H1>Link unavailable</H1>
          <P>This invite link is invalid, expired, or already used.</P>
          {invalidReason && <Muted>Reason: {invalidReason}</Muted>}
        </DesktopCard>
      </Page>
    );
  }

  const FormContent = (
    <>
      <H1>{clinicName}</H1>
      {!done ? (
        <>
          <P>
            If you want to expand your service under your brand to your clients,
            which of the following are you interested in collaborating with?
            Select all that apply.
          </P>
          {choices.map((c) => {
            const active = selected.has(c.key);
            return (
              <Choice
                key={c.key}
                onClick={() => toggle(c.key)}
                $active={active}
              >
                {active ? <FaCheckSquare /> : <FaRegSquare />}{" "}
                <span>{c.label}</span>
              </Choice>
            );
          })}
          <Submit onClick={submit} disabled={submitting || selected.size === 0}>
            {submitting ? "Submitting..." : "Submit"}
          </Submit>
          <Muted style={{ marginTop: 8 }}>
            Showing clinics near the visible area (max ~5 km radius). Your
            response will be recorded for this clinic.
          </Muted>
        </>
      ) : (
        <P>Thank you. Your preferences have been saved.</P>
      )}
    </>
  );

  return (
    <Page>
      <BgMapWrap>
        {isLoaded && (
          <GoogleMap
            onLoad={handleMapLoad}
            onIdle={handleIdle}
            onDragEnd={handleDragEnd}
            onZoomChanged={handleZoomChanged}
            center={center}
            zoom={13}
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
            {/* Overlay "Search this area" button */}
            {showSearchBtn && (
              <SearchButton
                onClick={fetchClinicsForCurrentBounds}
                disabled={loadingClinics}
              >
                {loadingClinics ? "Searching…" : "Search this area"}
              </SearchButton>
            )}

            {/* Nearby clinic markers */}
            {markers.map((m, i) => {
              const isCurrent = m.id === "__current" || m.highlight;
              return (
                <MarkerF
                  key={`${m.id}-${i}`}
                  position={m.position}
                  onClick={() => setActive(i)}
                  label={
                    isCurrent
                      ? { text: m.name, color: "#d32f2f", fontWeight: "700" }
                      : { text: m.name, color: "#1a1a1a", fontWeight: "500" }
                  }
                  // simple highlight: larger red-dot symbol for the selected clinic
                  icon={
                    isCurrent
                      ? {
                          path: window.google?.maps?.SymbolPath?.CIRCLE,
                          scale: 8,
                          fillColor: "#d32f2f",
                          fillOpacity: 1,
                          strokeColor: "#ffffff",
                          strokeWeight: 2,
                        }
                      : undefined
                  }
                />
              );
            })}

            {active !== null && markers[active] && (
              <InfoWindowF
                position={markers[active].position}
                onCloseClick={() => setActive(null)}
                options={{
                  pixelOffset: new window.google.maps.Size(0, -10),
                  maxWidth: 220,
                }}
              >
                <div
                  style={{
                    cursor: markers[active].website ? "pointer" : "default",
                  }}
                  onClick={() =>
                    markers[active].website &&
                    window.open(markers[active].website, "_blank")
                  }
                >
                  <strong style={{ fontSize: 14 }}>
                    {markers[active].name}
                  </strong>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                    {markers[active].website
                      ? "Visit site ↗"
                      : markers[active].email || "No link"}
                  </div>
                </div>
              </InfoWindowF>
            )}
            <Helper>
              Showing clinics near the visible area (max ~5 km radius).
            </Helper>
          </GoogleMap>
        )}
      </BgMapWrap>

      {/* Desktop: left card. Mobile: draggable bottom sheet */}
      {isMobile ? (
        <MobileSheet
          $height={sheetH}
          onPointerDown={startDrag}
          onPointerMove={onDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onTouchStart={startDrag}
          onTouchMove={onDrag}
          onTouchEnd={endDrag}
        >
          <Grabber />
          <SheetBody
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            {FormContent}
          </SheetBody>
        </MobileSheet>
      ) : (
        <DesktopCard>{FormContent}</DesktopCard>
      )}
    </Page>
  );
}
