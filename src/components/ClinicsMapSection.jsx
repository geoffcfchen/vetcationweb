// src/components/ClinicsMapSection.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
  OverlayViewF,
} from "@react-google-maps/api";
import { IoLocationOutline } from "react-icons/io5";

// Firestore (modular)
import { firestore } from "../lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  startAt,
  endAt,
  limit,
  writeBatch,
  GeoPoint,
} from "firebase/firestore";

// Geohash helpers
import {
  distanceBetween,
  geohashQueryBounds,
  geohashForLocation,
} from "geofire-common";

// Reuse your clinic panel + map style
import { ClinicPanel, defaultCleanStyle } from "../pages/InviteSurvey";

const SECTION_HEIGHT = "100vh";
const MAX_RADIUS_M = 10000;

// NEW: picker info card
const PickerCard = styled.div`
  width: 280px;
  color: #0f172a;
`;

const PickerTitle = styled.div`
  font-size: 14px;
  font-weight: 900;
`;

const PickerSub = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
`;

const PickerRow = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
`;

const PickerBtn = styled.button`
  border: none;
  background: #2563eb;
  color: #ffffff;
  border-radius: 999px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 900;

  &:hover {
    background: #1d4ed8;
  }
`;

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

const UseLocButton = styled.button`
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 5;
  background: #ffffff;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);

  &:hover {
    background: #f8fafc;
  }
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
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
  cursor: pointer;

  &.selected {
    border-color: rgba(29, 78, 216, 0.35);
    background: rgba(239, 246, 255, 1);
    color: #1d4ed8;
    font-weight: 800;
  }

  &.active {
    border-color: #4d9fec;
    background: #e9f3ff;
    box-shadow:
      0 14px 28px rgba(77, 159, 236, 0.25),
      0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translate(-50%, -34px) scale(1.03);
    font-weight: 700;
  }
`;

const PanelShell = styled.div`
  width: 360px;
  max-width: 360px;
`;

const PickerTopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  padding: 10px 10px 12px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.22);
  background: #ffffff;
`;

const PickerMeta = styled.div`
  min-width: 0;
`;

const PickerName = styled.div`
  font-size: 13px;
  font-weight: 900;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PickerAddr = styled.div`
  margin-top: 3px;
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PickerBtnSmart = styled.button`
  border: none;
  border-radius: 999px;
  padding: 9px 12px;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  white-space: nowrap;

  background: #2563eb;
  color: #ffffff;

  &:hover {
    background: #1d4ed8;
  }

  &:disabled {
    cursor: default;
    opacity: 0.7;
    background: rgba(148, 163, 184, 0.35);
    color: #0f172a;
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

function safeAssign(value, defaultValue = null) {
  return value !== undefined ? value : defaultValue;
}

function stateFromPlusCode(plusCode) {
  const compoundCode = plusCode?.compound_code || "";
  const state = compoundCode.split(", ")[1] || "Unknown";
  return state;
}

function toPlainLatLng(gLatLng) {
  if (!gLatLng) return null;
  if (typeof gLatLng.lat === "function" && typeof gLatLng.lng === "function") {
    return { lat: gLatLng.lat(), lng: gLatLng.lng() };
  }
  if (typeof gLatLng.lat === "number" && typeof gLatLng.lng === "number") {
    return { lat: gLatLng.lat, lng: gLatLng.lng };
  }
  return null;
}

function isLikelyShelter(place) {
  const types = place?.types || [];
  const name = place?.name || "";
  const vicinity = place?.vicinity || "";
  const hay = `${name} ${vicinity}`.toLowerCase();

  // Hard reject vet clinics
  if (types.includes("veterinary_care")) return false;

  // Hard accept official category
  if (types.includes("animal_shelter")) return true;

  // Accept common adoption/rescue brands and terms
  const positive = [
    "adoption",
    "rescue",
    "shelter",
    "humane",
    "spca",
    "animal services",
    "petspace", // Wallis Annenberg PetSpace
  ].some((s) => hay.includes(s));

  // Reject obvious non-shelter places
  const negative = [
    "veterinary",
    "vet",
    "animal hospital",
    "pet hospital",
    "clinic",
    "emergency",
    "banfield",
    "vca",
  ].some((s) => hay.includes(s));

  // If it is not obviously a vet clinic and it matches positive terms, keep it
  if (positive && !negative) return true;

  // If it does not match positive terms, drop it (keeps results clean)
  return false;
}

function dedupeByPlaceId(arr) {
  const m = new Map();
  for (const x of arr) {
    const k = x?.place_id || x?.id;
    if (k && !m.has(k)) m.set(k, x);
  }
  return Array.from(m.values());
}

// Promise wrapper for Places nearbySearch with pagination (max ~60 results)
function nearbySearchAllPages(service, request) {
  return new Promise((resolve) => {
    const out = [];
    const handle = (results, status, pagination) => {
      const ok = status === window.google.maps.places.PlacesServiceStatus.OK;

      if (ok && Array.isArray(results)) out.push(...results);

      // ZERO_RESULTS or anything else: stop
      if (!pagination || !pagination.hasNextPage) {
        resolve(out);
        return;
      }

      // next_page needs a short delay
      setTimeout(() => {
        try {
          pagination.nextPage();
        } catch {
          resolve(out);
        }
      }, 1200);
    };

    try {
      service.nearbySearch(request, handle);
    } catch {
      resolve(out);
    }
  });
}

function getPlaceDetails(service, placeId) {
  const fields = [
    "formatted_phone_number",
    "international_phone_number",
    "website",
    "rating",
    "user_ratings_total",
    "formatted_address",
    "url",
    "opening_hours",
    "editorial_summary",
    "photos",
    "plus_code",
    "types",
    "business_status",
    "price_level",
  ];

  return new Promise((resolve) => {
    try {
      service.getDetails({ placeId, fields }, (res, status) => {
        const ok =
          status === window.google.maps.places.PlacesServiceStatus.OK && res;
        resolve(ok ? res : null);
      });
    } catch {
      resolve(null);
    }
  });
}

function mergeGoogleDetails(base, details) {
  if (!details) return base;

  return {
    ...base,
    address: base.address || details.formatted_address || null,
    website: details.website || base.website || null,
    phone:
      details.international_phone_number ||
      details.formatted_phone_number ||
      base.phone ||
      null,
    rating:
      typeof base.rating === "number"
        ? base.rating
        : typeof details.rating === "number"
          ? details.rating
          : null,
    total_ratings:
      typeof base.total_ratings === "number"
        ? base.total_ratings
        : typeof details.user_ratings_total === "number"
          ? details.user_ratings_total
          : null,
    plus_code: base.plus_code || details.plus_code || null,
    types: base.types || details.types || null,
    business_status: base.business_status || details.business_status || null,
    price_level:
      typeof base.price_level === "number"
        ? base.price_level
        : (details.price_level ?? -1),
    place: {
      ...(base.place || {}),
      place_id: base.place_id,
      url: details.url || base.place?.url || null,
      opening_hours: details.opening_hours || base.place?.opening_hours || null,
      editorial_summary:
        details.editorial_summary || base.place?.editorial_summary || null,
    },
    photos: base.photos || details.photos || null,
  };
}

export default function ClinicsMapSection({
  height = SECTION_HEIGHT,
  initialCenter = { lat: 34.04707440503318, lng: -118.23408222822691 },
  initialZoom = 13,

  // NEW props for your “picker” use case
  mode = "browse", // "browse" | "picker"
  selectedClinicId = "",
  onPickClinic = null,
  selectButtonLabel = "Select",
  closeInfoOnPick = true,

  // NEW: data source mode
  source = "firestore", // "firestore" | "places"

  // when source="places"
  placesKind = "shelter", // currently: "shelter"
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: ["places"], // IMPORTANT for PlacesService
  });

  const mapRef = useRef(null);
  const [center, setCenter] = useState(initialCenter);
  const [userPos, setUserPos] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [active, setActive] = useState(null);
  const [showSearchBtn, setShowSearchBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    setMarkers([]);
    setActive(null);
    setShowSearchBtn(true); // show button so user can re-search immediately
  }, [source, placesKind]);

  // Optional nicety: if permission already granted, center quietly
  useEffect(() => {
    if (!isLoaded) return;
    if (!("permissions" in navigator) || !("geolocation" in navigator)) return;

    try {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((status) => {
          if (status.state === "granted") {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const next = {
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                };
                setUserPos(next);
                setCenter(next);
                mapRef.current?.panTo(next);
                mapRef.current?.setZoom(
                  Math.max(mapRef.current?.getZoom() ?? 0, 13),
                );
              },
              () => {},
            );
          }
        })
        .catch(() => {});
    } catch {}
  }, [isLoaded]);

  const handleUseMyLocation = () => {
    if (!("geolocation" in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPos(next);
        setCenter(next);
        mapRef.current?.panTo(next);
        mapRef.current?.setZoom(Math.max(mapRef.current?.getZoom() ?? 0, 13));
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, maximumAge: 60000, timeout: 8000 },
    );
  };

  const handleMapLoad = (map) => {
    mapRef.current = map;
  };
  const handleDragEnd = () => setShowSearchBtn(true);
  const handleZoomChanged = () => setShowSearchBtn(true);

  const placesService = useMemo(() => {
    const map = mapRef.current;
    if (!map) return null;
    if (!window.google?.maps?.places) return null;
    return new window.google.maps.places.PlacesService(map);
  }, [isLoaded]);

  // Existing Firestore behavior (unchanged)
  const fetchFromFirestore = async () => {
    if (!mapRef.current) return;
    const bounds = mapRef.current.getBounds();
    if (!bounds) return;

    const approxRadius = radiusFromBounds(bounds) || MAX_RADIUS_M;
    const radius = Math.min(approxRadius, MAX_RADIUS_M);

    const c = mapRef.current.getCenter();
    const centerLat = c.lat();
    const centerLng = c.lng();

    setLoading(true);
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
              limit(perRangeLimit),
            ),
          ),
        ),
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
                "",
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
              inviteState: Number.isFinite(x?.invite?.state)
                ? x.invite.state
                : 0,
              _distM: distM,
            });
          }
        });
      }

      const rows = Array.from(dedup.values()).sort(
        (a, b) => a._distM - b._distM,
      );
      rows.forEach((r) => delete r._distM);

      setMarkers(rows);
      setShowSearchBtn(false);

      setActive((prev) => {
        if (prev !== null) return prev;
        return rows.length ? 0 : null;
      });
    } catch (err) {
      console.error("Firestore geohash fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Places behavior for shelters/rescues/adoption centers
  const fetchFromPlaces = async () => {
    if (!mapRef.current) return;
    if (!window.google?.maps?.places) return;

    const bounds = mapRef.current.getBounds();
    if (!bounds) return;

    const approxRadius = radiusFromBounds(bounds) || MAX_RADIUS_M;
    const radius = Math.min(approxRadius, MAX_RADIUS_M);

    const c = mapRef.current.getCenter();
    const centerLat = c.lat();
    const centerLng = c.lng();

    const service = new window.google.maps.places.PlacesService(mapRef.current);

    setLoading(true);
    try {
      // You can tune these keywords any time
      const keywordQueries =
        placesKind === "shelter"
          ? [
              { type: "animal_shelter" },
              { keyword: "pet adoption" },
              { keyword: "animal adoption" },
              { keyword: "adoption center" },
              { keyword: "animal rescue" },
              { keyword: "humane society" },
              { keyword: "SPCA" },
              { keyword: "petspace" }, // catches names like “PetSpace”
            ]
          : [{ keyword: "animal shelter" }];

      const pages = await Promise.all(
        keywordQueries.map((q) =>
          nearbySearchAllPages(service, {
            location: new window.google.maps.LatLng(centerLat, centerLng),
            radius,
            ...q,
          }),
        ),
      );

      const raw = dedupeByPlaceId(pages.flat());
      const vetted = raw
        .filter((p) => (p.business_status ?? "OPERATIONAL") === "OPERATIONAL")
        .filter(isLikelyShelter);

      // Merge with Firestore + write into clinics collection, same core schema as RN fetchClinics
      const merged = await Promise.all(
        vetted.slice(0, 80).map(async (place) => {
          const placeId = place.place_id;
          const g = place.geometry?.location;
          const ll = toPlainLatLng(g);
          if (!placeId || !ll) return null;

          // read existing clinic doc (if any) so email/inviteState/etc show immediately
          let firebaseData = {};
          try {
            const snap = await getDoc(doc(firestore, "clinics", placeId));
            if (snap.exists()) firebaseData = snap.data() || {};
          } catch {}

          const state = stateFromPlusCode(place.plus_code);

          const baseDoc = {
            place_id: safeAssign(placeId),
            name: safeAssign(place.name),
            address: safeAssign(place.vicinity || ""),
            state: safeAssign(state),
            location: safeAssign({ lat: ll.lat, lng: ll.lng }),
            geometry: safeAssign({ location: { lat: ll.lat, lng: ll.lng } }),
            rating: place.rating ?? null,
            total_ratings: safeAssign(place.user_ratings_total, 0),
            icon: safeAssign(place.icon),
            types: safeAssign(place.types),
            opening_hours: safeAssign(place.opening_hours),
            plus_code: safeAssign(place.plus_code),
            business_status: safeAssign(place.business_status),
            user_ratings: safeAssign(place.user_ratings),
            price_level: safeAssign(place.price_level, -1),
            scope: safeAssign(place.scope),
            permanently_closed: safeAssign(place.permanently_closed, false),

            // Optional fields (kept consistent with your RN pattern)
            website: firebaseData.website || undefined,
            phone:
              firebaseData.phone ||
              firebaseData.formatted_phone_number ||
              firebaseData.tel ||
              undefined,

            ...firebaseData, // same idea as your RN code: keep Firestore overrides
          };

          // Ensure geohash exists so your older pages (InviteSurvey) can still query by geohash
          const geohash = geohashForLocation([ll.lat, ll.lng]);

          // Write a normalized doc into clinics collection
          try {
            const batch = writeBatch(firestore);
            batch.set(
              doc(firestore, "clinics", placeId),
              {
                ...baseDoc,
                geohash,
                // helpful: also store GeoPoint for any future geospatial reads
                locationGeo: new GeoPoint(ll.lat, ll.lng),
              },
              { merge: true },
            );
            await batch.commit();
          } catch (e) {
            console.warn("Failed writing shelter into clinics:", e);
          }

          // Shape the marker object used by this component + ClinicPanel
          return {
            id: placeId,
            name: baseDoc.name || "Shelter",
            position: { lat: ll.lat, lng: ll.lng },
            website: baseDoc.website || baseDoc.site || undefined,
            email: baseDoc.email || undefined,
            phone: baseDoc.phone || undefined,
            address: baseDoc.address || baseDoc.formatted_address || "",
            rating:
              typeof baseDoc.rating === "number" ? baseDoc.rating : undefined,
            reviewsCount:
              baseDoc.reviewsCount ??
              baseDoc.reviewCount ??
              baseDoc.total_ratings ??
              baseDoc?.place?.user_ratings_total ??
              undefined,
            inviteState: Number.isFinite(baseDoc?.invite?.state)
              ? baseDoc.invite.state
              : 0,
            // keep these for later “details” merge
            place_id: baseDoc.place_id,
            total_ratings: baseDoc.total_ratings,
            plus_code: baseDoc.plus_code,
            types: baseDoc.types,
            business_status: baseDoc.business_status,
            price_level: baseDoc.price_level,
            opening_hours: baseDoc.opening_hours,
            scope: baseDoc.scope,
            permanently_closed: baseDoc.permanently_closed,
            geometry: baseDoc.geometry,
          };
        }),
      );

      const rows = merged.filter(Boolean);

      // Sort by distance from current center for nicer UX
      rows.sort((a, b) => {
        const da = distanceBetween(
          [centerLat, centerLng],
          [a.position.lat, a.position.lng],
        );
        const db = distanceBetween(
          [centerLat, centerLng],
          [b.position.lat, b.position.lng],
        );
        return da - db;
      });

      setMarkers(rows);
      setShowSearchBtn(false);
      setActive((prev) => {
        if (prev !== null) return prev;
        return rows.length ? 0 : null;
      });
    } catch (err) {
      console.error("Places fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchForCurrentBounds = async () => {
    if (source === "places") return fetchFromPlaces();
    return fetchFromFirestore();
  };

  const handleIdle = () => {
    if (markers.length === 0) fetchForCurrentBounds();
  };

  const activeClinic = active !== null ? markers[active] : null;

  const handleMarkerClick = async (i) => {
    setActive(i);

    // Opportunistic: enrich with Place Details so the doc matches your RN pattern better
    // (website, phone, url, formatted_address, photos, etc.)
    if (source !== "places") return;
    const row = markers[i];
    if (!row?.id) return;

    const service = window.google?.maps?.places
      ? new window.google.maps.places.PlacesService(mapRef.current)
      : null;
    if (!service) return;

    const needsDetails = !row.website || !row.phone || !row.address;
    if (!needsDetails) return;

    const details = await getPlaceDetails(service, row.id);
    if (!details) return;

    const updated = mergeGoogleDetails(
      {
        ...row,
        place_id: row.id,
        name: row.name,
        // keep your saved shape
        total_ratings:
          typeof row.total_ratings === "number" ? row.total_ratings : null,
      },
      details,
    );

    // Update UI
    setMarkers((prev) => {
      const next = [...prev];
      next[i] = {
        ...next[i],
        website: updated.website || next[i].website,
        phone: updated.phone || next[i].phone,
        address: updated.address || next[i].address,
        rating:
          typeof updated.rating === "number" ? updated.rating : next[i].rating,
        reviewsCount:
          typeof updated.total_ratings === "number"
            ? updated.total_ratings
            : next[i].reviewsCount,
        place: updated.place || next[i].place,
        photos: updated.photos || next[i].photos,
        plus_code: updated.plus_code || next[i].plus_code,
        types: updated.types || next[i].types,
        business_status: updated.business_status || next[i].business_status,
        price_level:
          typeof updated.price_level === "number"
            ? updated.price_level
            : next[i].price_level,
      };
      return next;
    });

    // Write to Firestore (merge) so shelters are “treated the same” as clinics
    try {
      await writeBatch(firestore)
        .set(
          doc(firestore, "clinics", row.id),
          {
            place_id: row.id,
            name: row.name,
            address: updated.address || row.address || "",
            website: updated.website || row.website || null,
            phone: updated.phone || row.phone || null,
            rating: typeof updated.rating === "number" ? updated.rating : null,
            total_ratings:
              typeof updated.total_ratings === "number"
                ? updated.total_ratings
                : null,
            place: updated.place || null,
            photos: updated.photos || null,
            plus_code: updated.plus_code || null,
            types: updated.types || null,
            business_status: updated.business_status || null,
            price_level:
              typeof updated.price_level === "number"
                ? updated.price_level
                : -1,
          },
          { merge: true },
        )
        .commit();
    } catch (e) {
      console.warn("Failed to write Place Details merge:", e);
    }
  };

  const activeIsSelected =
    !!selectedClinicId && activeClinic?.id === selectedClinicId;

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
            <SearchButton onClick={fetchForCurrentBounds} disabled={loading}>
              {loading ? "Searching…" : "Search this area"}
            </SearchButton>
          )}

          <UseLocButton
            type="button"
            onClick={handleUseMyLocation}
            disabled={locating}
            aria-label="Use my location"
            title="Use my location"
          >
            <IoLocationOutline aria-hidden="true" />
            {locating ? "Locating…" : "Use my location"}
          </UseLocButton>

          {markers.map((m, i) => {
            const isActive = active === i;
            const isSelected = selectedClinicId && selectedClinicId === m.id;

            const icon = {
              path: window.google?.maps?.SymbolPath?.CIRCLE,
              scale: isSelected ? 9 : isActive ? 8 : 6,
              fillColor: isSelected ? "#1d4ed8" : "#4D9FEC",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            };

            const chipClass = [
              isSelected ? "selected" : "",
              isActive ? "active" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <React.Fragment key={`${m.id}-${i}`}>
                <MarkerF
                  position={m.position}
                  onClick={() => handleMarkerClick(i)}
                  icon={icon}
                  zIndex={
                    isSelected
                      ? window.google?.maps?.Marker?.MAX_ZINDEX
                      : isActive
                        ? window.google?.maps?.Marker?.MAX_ZINDEX - 1
                        : undefined
                  }
                />
                <OverlayViewF
                  position={m.position}
                  mapPaneName={isActive ? "floatPane" : "overlayMouseTarget"}
                >
                  <LabelChip
                    className={chipClass}
                    onClick={() => handleMarkerClick(i)}
                    title={m.name}
                  >
                    {m.name} (
                    {Number.isFinite(m.inviteState) ? m.inviteState : 0})
                  </LabelChip>
                </OverlayViewF>
              </React.Fragment>
            );
          })}
          {activeClinic && (
            <InfoWindowF
              position={activeClinic.position}
              onCloseClick={() => setActive(null)}
              options={{
                pixelOffset: new window.google.maps.Size(0, -40),
                maxWidth: 360,
                disableAutoPan: false,
              }}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <ClinicPanel
                  clinicId={activeClinic.id}
                  clinicName={activeClinic.name}
                  isPrimary={false}
                  clinicMeta={activeClinic}
                  // picker integration
                  pickerMode={mode === "picker"}
                  pickerButtonLabel={selectButtonLabel}
                  pickerSelected={activeIsSelected}
                  onPick={() => {
                    onPickClinic?.({
                      place_id: activeClinic.id,
                      name: activeClinic.name,
                    });
                    if (closeInfoOnPick) setActive(null);
                  }}
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
