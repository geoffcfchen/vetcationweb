// src/pages/InviteSurvey.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
  OverlayViewF,
  CircleF,
} from "@react-google-maps/api";
import { useParams } from "react-router-dom";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaExternalLinkAlt,
  FaBullseye,
  FaGraduationCap,
  FaUserAlt,
  FaRegSquare,
  FaCheckSquare,
} from "react-icons/fa";

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
  doc,
  getDoc,
} from "firebase/firestore";

// Geohash helpers
import { distanceBetween, geohashQueryBounds } from "geofire-common";
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoCallOutline,
  IoLocationOutline,
} from "react-icons/io5";

const BREAKPOINT = 768; // <768 = mobile sheet, >=768 = left card
const MAX_RADIUS_M = 10000;
const SERVICE_RADIUS_FULL_M = 10000; // 10 km service radius when toggle is ON

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
  width: clamp(320px, 26vw, 420px);
  max-width: 90vw;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);

  @media (min-width: 1600px) {
    width: clamp(320px, 22vw, 380px);
  }
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
  flex: 1;
  min-height: 0; /* critical */
  display: flex; /* NEW */
  flex-direction: column; /* NEW */
  padding: 16px;
  overflow: auto; /* keep sheet scroll when showing the survey */
  -webkit-overflow-scrolling: touch;
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
  svg {
    flex: 0 0 20px;
    width: 20px;
    height: 20px;
  }
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

// ===== Label chip =====
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

  &.current {
    border-color: #f3c4c4;
    background: #fff7f7;
    color: #b71c1c;
    font-weight: 700;
  }

  &.active {
    border-color: #4d9fec;
    background: #e9f3ff;
    box-shadow: 0 14px 28px rgba(77, 159, 236, 0.25),
      0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translate(-50%, -34px) scale(1.03);
    font-weight: 700;
    z-index: 9999; /* defensive, pane switch below does the real work */
  }

  &:hover {
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);
  }
`;

// ====== Clinic panel for InfoWindow ======
const PanelWrap = styled.div`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  display: flex; /* NEW */
  flex-direction: column; /* NEW */
  min-height: 0; /* NEW: enables inner overflow children */

  font-family: system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue",
    Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji";
  /* On wider viewports (e.g., InfoWindow desktop), gently cap width */
  @media (min-width: 640px) {
    max-width: 360px;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`;

const PanelTitle = styled.h3`
  font-size: 16px;
  line-height: 1.2;
  margin: 0;
  flex: 1;
`;

const PanelSubtitle = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const TabsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin: 10px 0 12px;
`;

const TabBtn = styled.button`
  border: 1px solid ${(p) => (p.$active ? "#4d9fec" : "#e5e7eb")};
  background: ${(p) => (p.$active ? "#e9f3ff" : "#fff")};
  color: ${(p) => (p.$active ? "#1f2937" : "#374151")};
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`;

const ListWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${(p) =>
    p.$fill
      ? `
    flex: 1;
    min-height: 0;   /* critical for overflow */
    overflow: auto;
    max-height: none;
  `
      : `
    max-height: 260px;  /* desktop InfoWindow stays compact */
    overflow: auto;
  `}
`;

const UserCard = styled.div`
  display: grid;
  grid-template-columns: 42px 1fr auto;
  align-items: start; /* 👈 top-align avatar instead of centering */
  gap: 10px;
  padding: 8px 8px;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  background: #fff;
`;

const Avatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: #e5f1ff;
  display: grid;
  place-items: center;
  font-weight: 700;
  color: #1e40af;
`;

const Meta = styled.div`
  min-width: 0;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Name = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #111827;
`;

const Username = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

const ClinicChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  font-size: 12px;
  color: #4b5563;
  background: #eef6ff;
  border: 1px solid #dbeafe;
  border-radius: 999px;
  margin-top: 4px;
`;

const Bio = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SmallLine = styled.div`
  font-size: 11px;
  color: #6b7280;
`;

// (kept for demo vets)
const SlotRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 12px;
`;

const SlotChip = styled.button`
  display: grid;
  gap: 6px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 10px 12px;
  background: #ffffff;
  text-align: left;
  cursor: pointer;
`;

const SlotChipLine = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SlotChipText = styled.span`
  font-size: 14px;
  color: #111827;
`;

// --- In-house section styling ---
const Section = styled.div`
  margin-top: 8px;
  padding: 10px;
  border: 1px solid #eef2f7;
  border-radius: 12px;
  background: #fbfdff;
`;

const SecHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
`;

const SecIcon = styled.span`
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: #e8f1ff;
  color: #1e40af;
  font-size: 12px;
`;

const SecTitle = styled.div`
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: #0f172a;
`;

const SecBody = styled.div`
  font-size: 12px;
  color: #374151;
  line-height: 1.45;
`;

// ---- Expandable text (used by in-house bios & reviews) ----
const ExpandWrap = styled.div`
  margin-top: 4px;
`;

const ExpandPara = styled.p`
  margin: 0;
  font-size: 12px;
  color: #374151;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  ${(p) =>
    p.$open
      ? ""
      : `
  -webkit-line-clamp: ${p.$lines || 5};
`}
`;

const ExpandToggle = styled.button`
  margin-top: 6px;
  border: 0;
  background: transparent;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
`;

// ---- Reviews UI (kept for demo vets) ----
const ReviewCard = styled.div`
  display: grid;
  grid-template-columns: 42px 1fr auto;
  gap: 10px;
  align-items: start;
  padding: 10px 10px;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  background: #fff;
`;

const ReviewerAvatar = styled(Avatar)`
  background: #f1f5f9;
  color: #0f172a;
`;

const ReviewBody = styled.div`
  min-width: 0;
`;

const ReviewHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const ReviewerName = styled(Name)`
  font-size: 14px;
`;

const ReviewMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
`;

const Stars = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: #f59e0b;
`;

const SourceBadge = styled.span`
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #4b5563;
  font-size: 12px;
`;

const ReviewText = styled.p`
  margin: 6px 0 0;
  font-size: 13px;
  color: #374151;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ReviewActions = styled.div`
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TinyLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #2563eb;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const PendingBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid #f59e0b;
  background: #fffbeb;
  color: #92400e;
  font-size: 12px;
  font-weight: 700;
`;

const EmptyWrap = styled.div`
  border: 1px dashed #e5e7eb;
  background: #fafafa;
  color: #6b7280;
  border-radius: 12px;
  padding: 14px;
  font-size: 13px;
`;

const ToggleRow = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  background: #fff;
  margin: 0 0 12px;
`;

const ToggleText = styled.span`
  font-size: 14px;
  color: #111827;
  line-height: 1.3;
`;

const ToggleSwitch = styled.input.attrs({ type: "checkbox" })`
  appearance: none;
  width: 44px;
  height: 26px;
  border-radius: 999px;
  background: ${(p) => (p.checked ? "#4d9fec" : "#e5e7eb")};
  position: relative;
  outline: none;
  cursor: pointer;
  transition: background 0.2s ease;
  &::after {
    content: "";
    position: absolute;
    top: 3px;
    left: ${(p) => (p.checked ? "22px" : "3px")};
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    transition: left 0.2s ease;
  }
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #4d9fec;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
  margin: 0 auto 12px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// --- Helpers ---
function domainFromUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

// --- Clinic meta rows under the title ---
const InfoGrid = styled.div`
  display: grid;
  gap: 6px;
  margin: 6px 0 10px;
`;

const InfoLine = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #374151;
  a {
    color: #1d4ed8;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`;

const PrimaryCTA = styled.button`
  margin-top: 12px;
  background: #4d9fec;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 700;
  width: 100%;
`;

const BackLink = styled.button`
  border: 0;
  background: transparent;
  color: #2563eb;
  font-size: 13px;
  font-weight: 700;
  padding: 0;
  margin-bottom: 10px;
  cursor: pointer;
  text-align: left;
`;

const RatingRow = styled(InfoLine)`
  color: #111827;
  ${Stars} {
    transform: translateY(-1px);
  }
`;

// New: two-column header+info with a right CTA (mobile only)
const PanelTop = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: 10px;
`;

// Replace previous InlineCTAWrap / InlineCTAButton with this:
const InlineCTAWrap = styled.div`
  display: none;
  @media (max-width: 767px) {
    display: flex;
    justify-self: end;
    align-items: flex-start;
  }
`;

const InlineCTAButton = styled(PrimaryCTA)`
  /* compact, centered pill */
  width: auto;
  min-height: 44px;
  max-width: 180px;
  padding: 12px 12px;
  border-radius: 12px;
  white-space: normal; /* allow wrap */
  display: inline-flex;
  align-items: center; /* center vertically */
  justify-content: center; /* center horizontally */
  text-align: center; /* center multi-line text */
  line-height: 1.2;
  gap: 0;

  font-size: 13px; /* single size */
  font-weight: 800; /* single weight */

  box-shadow: 0 8px 20px rgba(77, 159, 236, 0.25), 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.08s ease, box-shadow 0.12s ease;

  &:hover {
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 6px 16px rgba(77, 159, 236, 0.22),
      0 1px 6px rgba(0, 0, 0, 0.08);
  }
  &:focus-visible {
    outline: 0;
    box-shadow: 0 0 0 3px rgba(77, 159, 236, 0.35),
      0 8px 20px rgba(77, 159, 236, 0.25), 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 360px) {
    max-width: 150px;
  }
`;

function StarRating({ value = 0, outOf = 5 }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5 ? 1 : 0;
  const empty = outOf - full - half;
  return (
    <Stars aria-label={`${value} out of ${outOf} stars`}>
      {Array.from({ length: full }).map((_, i) => (
        <FaStar key={`f${i}`} />
      ))}
      {half === 1 && <FaStarHalfAlt key="half" />}
      {Array.from({ length: empty }).map((_, i) => (
        <FaRegStar key={`e${i}`} />
      ))}
    </Stars>
  );
}

const LegendWrap = styled.div`
  position: absolute;
  right: 12px;
  bottom: 40px;
  z-index: 6;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px 12px 12px;
  border-radius: 14px;
  border: 1px solid #f5b6b6;
  background: rgba(255, 245, 245, 0.96);
  box-shadow: 0 12px 32px rgba(211, 47, 47, 0.18),
    0 4px 12px rgba(0, 0, 0, 0.08);
  pointer-events: none;
  backdrop-filter: saturate(120%) blur(4px);
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, #ef5350, #d32f2f);
  }

  @media (max-width: 480px) {
    right: 8px;
    bottom: 56px;
  }
`;

const LegendSwatch = styled.span`
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(211, 47, 47, 0.15);
  box-shadow: inset 0 0 0 2px #d32f2f;
`;

const LegendText = styled.span`
  font-size: 13px;
  color: #111827;
  line-height: 1.25;
  strong {
    font-weight: 700;
  }
`;

function shortDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const demoReviews = [
  {
    id: "r1",
    reviewer: "Daniel N.",
    rating: 5,
    date: "2025-08-21",
    snippet:
      "Dr. Nova was incredibly thorough and kind. Our cat’s skin flare-up improved in days with the plan she outlined.",
    source: "Google",
    url: "https://example.com/reviews/1",
  },
  {
    id: "r2",
    reviewer: "Bella P.",
    rating: 4.5,
    date: "2025-07-03",
    snippet:
      "Behavior tips were practical and easy to follow. We already see progress with separation anxiety.",
    source: "Yelp",
    url: "https://example.com/reviews/2",
  },
  {
    id: "r3",
    reviewer: "Chris Y.",
    rating: 5,
    date: "2025-06-12",
    snippet:
      "Fast, professional tele-derm consult. Appreciated the clear instructions and follow-up window.",
    source: "Google",
    url: "https://example.com/reviews/3",
  },
];

const demoVets = [
  {
    id: "v1",
    name: "Dr. Jamie Lee",
    username: "drjamie",
    clinic: "Maple Animal Hospital",
    bio: "Dermatology & GP",
    slots: [
      { appointmentId: "a1", date: "2025-10-16", time: "10:30 AM" },
      { appointmentId: "a2", date: "2025-10-16", time: "2:00 PM" },
    ],
  },
  {
    id: "v2",
    name: "Dr. Omar Patel",
    username: "dromar",
    clinic: "Sunset Pet Clinic",
    bio: "Behavior—fear-free, separation anxiety",
    slots: [
      { appointmentId: "b1", date: "2025-10-17", time: "9:00 AM" },
      { appointmentId: "b2", date: "2025-10-17", time: "1:30 PM" },
    ],
  },
  {
    id: "v3",
    name: "Dr. Chen Yu",
    username: "drchen",
    clinic: "Seaside Veterinary",
    bio: "Internal medicine & nutrition",
    slots: [
      { appointmentId: "c1", date: "2025-10-18", time: "11:15 AM" },
      { appointmentId: "c2", date: "2025-10-18", time: "3:45 PM" },
    ],
  },
];

function initials(full) {
  const parts = String(full || "")
    .trim()
    .split(/\s+/);
  return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
}

function formatDateISO(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

function onSlotClick(slot, user) {
  alert(
    `Demo\nDoctor: ${user.name}\nDate: ${formatDateISO(slot.date)}\nTime: ${
      slot.time
    }`
  );
}

// ===== Partnered vets row (unchanged appearance) =====
function VetRow({ user, clinicName }) {
  const slots = Array.isArray(user.slots) ? user.slots.slice(0, 2) : [];

  return (
    <UserCard>
      <Avatar title={user.name}>{initials(user.name).toUpperCase()}</Avatar>

      <Meta>
        <NameRow>
          <Name title={user.name}>{user.name}</Name>
          <Username>@{user.username}</Username>
        </NameRow>

        {clinicName && (
          <ClinicChip title={clinicName}>🏥 {clinicName}</ClinicChip>
        )}

        {user.bio && <Bio title={user.bio}>{user.bio}</Bio>}

        {slots.length > 0 && (
          <SlotRow>
            {slots.map((slot) => (
              <SlotChip
                key={slot.appointmentId}
                onClick={(e) => {
                  e.stopPropagation();
                  onSlotClick(slot, user);
                }}
                title={`${formatDateISO(slot.date)} • ${slot.time}`}
              >
                <SlotChipLine>
                  <IoCalendarOutline size={14} />
                  <SlotChipText>{formatDateISO(slot.date)}</SlotChipText>
                </SlotChipLine>
                <SlotChipLine>
                  <IoTimeOutline size={14} />
                  <SlotChipText>{slot.time}</SlotChipText>
                </SlotChipLine>
              </SlotChip>
            ))}
          </SlotRow>
        )}
      </Meta>

      <div />
    </UserCard>
  );
}

// ===== In-house vets components =====
function Expandable({ text, lines = 5 }) {
  const [open, setOpen] = useState(false);
  if (!text || !String(text).trim()) return null;
  return (
    <ExpandWrap>
      <ExpandPara $open={open} $lines={lines}>
        {text}
      </ExpandPara>
      <ExpandToggle onClick={() => setOpen((v) => !v)}>
        {open ? "Show less" : "Show more"}
      </ExpandToggle>
    </ExpandWrap>
  );
}

// helper (place near other small helpers)
function hasDrPrefix(name = "") {
  return /^dr\.?\s/i.test(name.trim());
}

function InHouseRow({ doc, clinicName }) {
  const { name, education, bioSummary, reviewSummary } = doc || {};
  const displayName = name || "Doctor";

  return (
    <UserCard>
      <Avatar title={displayName}>{initials(displayName).toUpperCase()}</Avatar>

      <Meta>
        <NameRow>
          <Name title={displayName}>
            {hasDrPrefix(displayName) ? displayName : `Dr. ${displayName}`}
          </Name>
        </NameRow>

        {clinicName && (
          <ClinicChip title={clinicName}>🏥 {clinicName}</ClinicChip>
        )}

        {/* Education */}
        {education && (
          <Section>
            <SecHeader>
              <SecIcon>
                <FaGraduationCap size={12} />
              </SecIcon>
              <SecTitle>Education</SecTitle>
            </SecHeader>
            <SecBody title={education}>{education}</SecBody>
          </Section>
        )}

        {/* Bio (expandable to keep the card compact) */}
        {bioSummary && (
          <Section>
            <SecHeader>
              <SecIcon>
                <FaUserAlt size={12} />
              </SecIcon>
              <SecTitle>Bio</SecTitle>
            </SecHeader>
            <SecBody>
              <Expandable text={bioSummary} lines={5} />
            </SecBody>
          </Section>
        )}

        {/* Review summary (expandable, only if present) */}
        {reviewSummary && (
          <Section>
            <SecHeader>
              <SecIcon>
                <FaStar size={12} />
              </SecIcon>
              <SecTitle>Review summary</SecTitle>
            </SecHeader>
            <SecBody>
              <Expandable text={reviewSummary} lines={5} />
            </SecBody>
          </Section>
        )}
      </Meta>

      <div />
    </UserCard>
  );
}

function InHouseList({ clinicId, clinicName }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        // Synthetic marker ("__current") cannot fetch roster; show empty gently
        if (!clinicId || clinicId.startsWith("__")) {
          if (alive) setRows([]);
          return;
        }
        const snap = await getDoc(doc(firestore, "clinics", clinicId));
        const data = snap.exists() ? snap.data() : {};
        const doctors = data?.roster?.doctors || [];
        // Only map fields we actually need
        const mapped = doctors.map((d) => ({
          name: d?.name || "",
          education: d?.education || "",
          bioSummary: typeof d?.bioSummary === "string" ? d.bioSummary : "",
          reviewSummary:
            typeof d?.reviewSummary === "string" ? d.reviewSummary : "",
        }));
        if (alive) setRows(mapped);
      } catch (e) {
        console.warn("InHouseList roster fetch failed:", e);
        if (alive) setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [clinicId]);

  if (loading) {
    return <SmallLine>Loading in-house roster…</SmallLine>;
  }

  if (!rows.length) {
    return (
      <EmptyWrap>
        {clinicId && !clinicId.startsWith("__")
          ? "No in-house veterinarians found for this clinic yet."
          : "Roster unavailable for this marker."}
      </EmptyWrap>
    );
  }

  return (
    <>
      {rows.map((d, i) => (
        <InHouseRow key={`${d.name}-${i}`} doc={d} clinicName={clinicName} />
      ))}
    </>
  );
}

function pad2(n) {
  return String(n).padStart(2, "0");
}
function toYMD(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function makeTomorrowSlotsAt(times = ["10:30", "14:00"]) {
  const base = new Date();
  base.setDate(base.getDate() + 2); // ← force tomorrow

  return times.map((t, i) => {
    const [hh, mm] = t.split(":").map(Number);
    const d = new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate(),
      hh ?? 9,
      mm ?? 0,
      0,
      0
    );
    return {
      appointmentId: `demo_${d.getTime()}_${i}`,
      date: toYMD(d), // e.g. "2025-10-29"
      time: d.toLocaleTimeString(undefined, {
        // e.g. "10:30 AM"
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  });
}

function buildDemoVets() {
  return [
    {
      id: "v1",
      name: "Dr. Jamie Lee",
      username: "drjamie",
      clinic: "Maple Animal Hospital",
      bio: "Dermatology & GP",
      slots: makeTomorrowSlotsAt(["10:30", "14:00"]),
    },
    {
      id: "v2",
      name: "Dr. Omar Patel",
      username: "dromar",
      clinic: "Sunset Pet Clinic",
      bio: "Behavior—fear-free, separation anxiety",
      slots: makeTomorrowSlotsAt(["09:00", "13:30"]),
    },
    {
      id: "v3",
      name: "Dr. Chen Yu",
      username: "drchen",
      clinic: "Seaside Veterinary",
      bio: "Internal medicine & nutrition",
      slots: makeTomorrowSlotsAt(["11:15", "15:45"]),
    },
  ];
}

// ===== Clinic panel =====

export function ClinicPanel({
  clinicName,
  isPrimary,
  clinicMeta = {},
  clinicId,
  showDemoPartners,
  onTogglePartners,
  showInlineCTA = false, // NEW
  onOpenSurvey, // NEW
  fillScrollable = false, // NEW
}) {
  const [tab, setTab] = useState("vets"); // 'vets' | 'inhouse'
  const demoVetsNow = useMemo(buildDemoVets, []); // ← always-future
  const { rating, reviewsCount, phone, address, website } = clinicMeta || {};

  return (
    <PanelWrap $fill={fillScrollable}>
      {/* NEW: two-column top area */}
      <PanelTop>
        <div>
          <PanelHeader>
            <PanelTitle>{clinicName || "Clinic"}</PanelTitle>
          </PanelHeader>

          {(rating || phone || address || website) && (
            <InfoGrid>
              {typeof rating === "number" && (
                <RatingRow>
                  <StarRating value={rating} />
                  <span>
                    {rating.toFixed(1)}
                    {typeof reviewsCount === "number"
                      ? ` (${reviewsCount})`
                      : ""}
                  </span>
                </RatingRow>
              )}
              {phone && (
                <InfoLine>
                  <IoCallOutline size={16} />
                  <a href={`tel:${phone}`} title={phone}>
                    {phone}
                  </a>
                </InfoLine>
              )}
              {address && (
                <InfoLine title={address}>
                  <IoLocationOutline size={16} />
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {address}
                  </span>
                </InfoLine>
              )}
              {website && (
                <InfoLine>
                  <FaExternalLinkAlt size={12} />
                  <a href={website} target="_blank" rel="noopener noreferrer">
                    {domainFromUrl(website)}
                  </a>
                </InfoLine>
              )}
            </InfoGrid>
          )}
        </div>

        {/* NEW: inline CTA on the right (mobile only),
            only for the primary clinic, only when survey is available */}
        <InlineCTAWrap>
          {showInlineCTA && isPrimary && (
            <InlineCTAButton
              onClick={onOpenSurvey}
              aria-label="Open your clinic’s interest form"
              title="Open your clinic’s interest form"
            >
              <span>Open your clinic’s interest form</span>
            </InlineCTAButton>
          )}
        </InlineCTAWrap>
      </PanelTop>

      <SmallLine>Partner options under your brand:</SmallLine>

      <TabsRow>
        <TabBtn $active={tab === "vets"} onClick={() => setTab("vets")}>
          Partnered online Vets & Professionals
        </TabBtn>
        <TabBtn
          $active={tab === "inhouse"}
          onClick={() => setTab("inhouse")}
          title="In-house veterinarians"
        >
          In-house veterinarians
        </TabBtn>
      </TabsRow>

      <ListWrap $fill={fillScrollable}>
        {tab === "vets" && (
          <>
            {isPrimary && (
              <ToggleRow title="Preview how partnered doctors would appear under your brand">
                <ToggleText>
                  Preview partnered view (demo professionals)
                </ToggleText>
                <ToggleSwitch
                  checked={!!showDemoPartners}
                  onChange={(e) => onTogglePartners?.(e.target.checked)}
                />
              </ToggleRow>
            )}

            {!isPrimary || !showDemoPartners ? (
              <>
                <PendingBadge title="Awaiting partnership approval">
                  Pending
                </PendingBadge>
                <EmptyWrap style={{ marginTop: 10 }}>
                  This hospital hasn’t partnered online yet. Once approved,
                  their partnered doctors and professionals will appear here.
                </EmptyWrap>
              </>
            ) : (
              <>
                <PanelSubtitle style={{ marginTop: 0 }}>
                  Demo professionals — style preview only.
                </PanelSubtitle>
                {demoVetsNow.map((u) => (
                  <VetRow key={u.id} user={u} clinicName={clinicName} />
                ))}
              </>
            )}
          </>
        )}

        {tab === "inhouse" && (
          <InHouseList clinicId={clinicId} clinicName={clinicName} />
        )}
      </ListWrap>
    </PanelWrap>
  );
}

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
  {
    featureType: "poi.park",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
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
  "https://us-central1-vetcationapp.cloudfunctions.net/submitClinicInterest";

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

// Fallback if CF doesn't include basics (kept just in case)
async function fetchClinicBasics(clinicId) {
  try {
    const snap = await getDoc(doc(firestore, "clinics", clinicId));
    if (!snap.exists()) return null;
    const data = snap.data() || {};
    const loc = data.location || {};
    const lat = loc.lat ?? loc.latitude;
    const lng = loc.lng ?? loc.longitude;
    return {
      clinicName: data.name || "Clinic",
      center:
        typeof lat === "number" && typeof lng === "number"
          ? { lat, lng }
          : null,
    };
  } catch (e) {
    console.error("fetchClinicBasics error:", e);
    return null;
  }
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
  // demo/partner preview toggle (default ON)
  const [showDemoPartners, setShowDemoPartners] = useState(true);

  // map + clinics state
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]); // nearby clinics
  const [active, setActive] = useState(null);
  const [showSearchBtn, setShowSearchBtn] = useState(false);
  const [loadingClinics, setLoadingClinics] = useState(false);

  // right under your other state near `minSheet`/`maxSheet`
  const snapPercents = useRef([0.22, 0.45, 0.7, 0.85]); // 22%, 45%, 70%, 85%
  const [snapHeights, setSnapHeights] = useState(() => {
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    return snapPercents.current.map((p) => Math.round(vh * p));
  });

  // bottom sheet drag state
  const minSheet = useMemo(() => Math.min(...snapHeights), [snapHeights]);
  const maxSheet = useMemo(() => Math.max(...snapHeights), [snapHeights]);

  // keep snapHeights fresh when viewport changes (rotation, address bar, etc.)
  useEffect(() => {
    const onResize = () => {
      const vh = window.innerHeight;
      setSnapHeights(snapPercents.current.map((p) => Math.round(vh * p)));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const [sheetH, setSheetH] = useState(() => {
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    const snaps = snapPercents.current.map((p) => Math.round(vh * p));
    return snaps[1]; // initial = 0.45
  });

  const dragRef = useRef({ startY: 0, startH: sheetH, dragging: false });

  // Mobile: show clinic info by default; user can open survey
  const [showSurveyOnMobile, setShowSurveyOnMobile] = useState(false);

  const nearestSnap = (h) => {
    if (!snapHeights.length) return h;
    let best = snapHeights[0],
      diff = Math.abs(h - snapHeights[0]);
    for (let i = 1; i < snapHeights.length; i++) {
      const d = Math.abs(h - snapHeights[i]);
      if (d < diff) {
        diff = d;
        best = snapHeights[i];
      }
    }
    return best;
  };

  // Zoom pulse helper
  const ZOOM_MIN = 3;
  const ZOOM_MAX = 20;
  const zoomPulseTimersRef = useRef([]);
  const didInitZoomRef = useRef(false);

  function fitToServiceRadius(
    center,
    radiusMeters,
    padding = { top: 48, right: 48, bottom: 48, left: 48 }
  ) {
    const map = mapRef.current;
    if (!map || !center || !window.google) return;

    const lat = center.lat;
    const lng = center.lng;
    const dLat = radiusMeters / 111320;
    const dLng = radiusMeters / (111320 * Math.cos((lat * Math.PI) / 180));

    const sw = new window.google.maps.LatLng(lat - dLat, lng - dLng);
    const ne = new window.google.maps.LatLng(lat + dLat, lng + dLng);
    const bounds = new window.google.maps.LatLngBounds(sw, ne);

    map.fitBounds(bounds, padding);
  }

  function animateZoomPulse(isOn) {
    const map = mapRef.current;
    if (!map) return;

    // cancel any running timers
    zoomPulseTimersRef.current.forEach(clearTimeout);
    zoomPulseTimersRef.current = [];

    const z0 = map.getZoom?.() ?? 13;
    const zMid = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z0 + (isOn ? -1 : +1)));

    // step 1: slight zoom change (animates)
    map.setZoom(zMid);

    // step 2: return to original after a short delay
    // const t = setTimeout(() => {
    //   // guard in case user manually changed zoom
    //   const current = map.getZoom?.() ?? zMid;
    //   // if we’re already near original, skip the bounce back
    //   if (Math.abs(current - z0) >= 0.5) map.setZoom(z0);
    // }, 260);

    zoomPulseTimersRef.current.push(t);
  }

  // cleanup on unmount
  useEffect(() => {
    return () => zoomPulseTimersRef.current.forEach(clearTimeout);
  }, []);

  // Circle radius respects the preview toggle (ON=full, OFF=half)
  const serviceRadius = showDemoPartners
    ? SERVICE_RADIUS_FULL_M
    : Math.floor(SERVICE_RADIUS_FULL_M / 2);

  const serviceRadiusKm = Math.round(serviceRadius / 1000);

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
    setSheetH((h) => nearestSnap(h)); // ← snap to nearest %
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  // Verify token; even if invalid, use returned clinicName/center (or fallback) and keep map
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

        let json = null;
        try {
          json = await resp.json();
        } catch (e) {}

        if (!alive) return;

        if (resp.ok && json?.ok) {
          setValid(true);
          setClinicName(json.clinicName || "Your clinic");
          if (
            json.center &&
            typeof json.center.lat === "number" &&
            typeof json.center.lng === "number"
          ) {
            setCenter(json.center);
          }
          setNonce(json.nonce || "");
        } else {
          setValid(false);
          setInvalidReason(json?.error || `HTTP ${resp.status}`);
          if (json?.clinicName) setClinicName(json.clinicName);
          if (
            json?.center &&
            typeof json.center.lat === "number" &&
            typeof json.center.lng === "number"
          ) {
            setCenter(json.center);
          } else {
            const basics = await fetchClinicBasics(clinicId);
            if (basics?.clinicName) setClinicName(basics.clinicName);
            if (basics?.center) setCenter(basics.center);
          }
        }
      } catch (e) {
        if (!alive) return;
        console.error("verifyClinicInvite failed:", e);
        setValid(false);
        setInvalidReason(String(e?.message || e || "network error"));
        const basics = await fetchClinicBasics(clinicId);
        if (basics?.clinicName) setClinicName(basics.clinicName);
        if (basics?.center) setCenter(basics.center);
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
      { key: "gp", label: "General Practice (GP)" },
      {
        key: "specialists",
        label:
          "Specialists (ex: dermatology, behavior, oncology, internal medicine, nutrition)",
      },
      { key: "dog_trainers", label: "Certified dog trainers" },
      { key: "none", label: "None of the above" },
    ],
    []
  );

  const activeMarker = useMemo(() => {
    if (active !== null && markers[active]) return markers[active];
    const idx = markers.findIndex(
      (r) => r.id === clinicId || r.id === "__current"
    );
    if (idx !== -1) return markers[idx];
    return markers[0] || null;
  }, [active, markers, clinicId]);

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
              inviteState: Number.isFinite(x?.invite?.state)
                ? x.invite.state
                : 0,
              _distM: distM,
            });
          }
        });
      }

      // ensure current clinic marker
      if (typeof center.lat === "number" && typeof center.lng === "number") {
        if (dedup.has(clinicId)) {
          const row = dedup.get(clinicId);
          row.highlight = true;
          dedup.set(clinicId, row);
        } else {
          // ⬇️ Add this small fetch to read the clinic's invite.state
          let inviteStatePrimary = 0;
          try {
            const pSnap = await getDoc(doc(firestore, "clinics", clinicId));
            if (pSnap.exists()) {
              inviteStatePrimary = Number(pSnap.data()?.invite?.state || 0);
            }
          } catch {}
          dedup.set("__current", {
            id: "__current",
            name: clinicName || "Selected clinic",
            position: { lat: center.lat, lng: center.lng },
            highlight: true,
            _distM: 0,
          });
        }
      }

      const rows = Array.from(dedup.values()).sort(
        (a, b) => a._distM - b._distM
      );
      rows.forEach((r) => delete r._distM);

      setMarkers(rows);
      setShowSearchBtn(false);

      // Open the InfoWindow for the primary clinic on first load
      setActive((prev) => {
        if (prev !== null) return prev;
        const idx = rows.findIndex(
          (r) => r.id === clinicId || r.id === "__current"
        );
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

  if (verifying) {
    return (
      <Page>
        <DesktopCard style={{ textAlign: "center" }}>
          <Spinner />
          <H1>Loading</H1>
          <Muted>Verifying your invite link…</Muted>
        </DesktopCard>
      </Page>
    );
  }

  const invalidDisplay = (() => {
    const e = String(invalidReason || "").toLowerCase();
    if (e.includes("expired")) return "This survey link has expired.";
    if (e.includes("not active") || e.includes("used"))
      return "This survey has already been submitted.";
    if (e.includes("invalid")) return "This survey link is invalid.";
    return "This survey is unavailable.";
  })();

  const FormContent = (
    <>
      <H1>{clinicName}</H1>
      {valid ? (
        !done ? (
          <>
            <P>
              If you want to expand your service under your brand to your
              clients, which of the following are you interested in
              collaborating with? Select all that apply.
            </P>
            {choices.map((c) => {
              const active = selected.has(c.key);
              return (
                <Choice
                  key={c.key}
                  onClick={() => toggle(c.key)}
                  $active={active}
                >
                  {active ? (
                    <FaCheckSquare size={20} />
                  ) : (
                    <FaRegSquare size={20} />
                  )}{" "}
                  <span>{c.label}</span>
                </Choice>
              );
            })}
            <Submit
              onClick={submit}
              disabled={submitting || selected.size === 0}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Submit>
            <Muted style={{ marginTop: 8 }}>
              Showing clinics near the visible area (max ~10 km radius). Your
              response will be recorded for this clinic.
            </Muted>
          </>
        ) : (
          <P>Thank you. Your preferences have been saved.</P>
        )
      ) : (
        <>
          <P>{invalidDisplay}</P>
          {invalidReason && (
            <Muted style={{ marginTop: 2 }}>Reason: {invalidReason}</Muted>
          )}
          <Muted style={{ marginTop: 8 }}>
            You can still browse nearby clinics on the map.
          </Muted>
        </>
      )}
    </>
  );

  return (
    <Page>
      <BgMapWrap>
        {isLoaded && (
          <GoogleMap
            onLoad={(map) => {
              handleMapLoad(map);
              if (!didInitZoomRef.current) {
                if (isMobile) {
                  // Give more space on the bottom so the circle isn’t hidden by the sheet
                  fitToServiceRadius(center, serviceRadius, {
                    top: 48,
                    right: 48,
                    bottom: 160,
                    left: 48,
                  });
                } else {
                  map.setZoom(13);
                }
                didInitZoomRef.current = true;
              }
            }}
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
            {/* Service radius circle */}
            {center &&
              typeof center.lat === "number" &&
              typeof center.lng === "number" && (
                <CircleF
                  center={center}
                  radius={serviceRadius}
                  options={{
                    clickable: false,
                    zIndex: 0,
                    strokeColor: "#d32f2f",
                    strokeOpacity: 1,
                    strokeWeight: 2,
                    fillColor: "#d32f2f",
                    fillOpacity: 0.15,
                  }}
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
              const isCurrent = m.id === "__current" || m.highlight;
              const isActive = active === i;
              const icon = {
                path: window.google?.maps?.SymbolPath?.CIRCLE,
                // gently larger when selected
                scale: isActive ? 9 : isCurrent ? 8 : 6,
                fillColor: isCurrent ? "#d32f2f" : "#4D9FEC",
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
                    zIndex={
                      isActive || isCurrent
                        ? window.google?.maps?.Marker?.MAX_ZINDEX
                        : undefined
                    }
                  />
                  <OverlayViewF
                    position={m.position}
                    // put the selected clinic’s name on the highest pane
                    mapPaneName={isActive ? "floatPane" : "overlayMouseTarget"}
                  >
                    <LabelChip
                      className={`${isCurrent ? "current" : ""} ${
                        isActive ? "active" : ""
                      }`}
                      onClick={() => setActive(i)}
                      title={`${m.name} (${
                        Number.isFinite(m.inviteState) ? m.inviteState : 0
                      })`}
                    >
                      {m.name} (
                      {Number.isFinite(m.inviteState) ? m.inviteState : 0})
                    </LabelChip>
                  </OverlayViewF>
                </React.Fragment>
              );
            })}

            {!isMobile && active !== null && markers[active] && (
              <InfoWindowF
                position={markers[active].position}
                onCloseClick={() => setActive(null)}
                options={{
                  pixelOffset: new window.google.maps.Size(0, -40),
                  maxWidth: 360,
                  disableAutoPan: false,
                }}
              >
                <div onClick={(e) => e.stopPropagation()}>
                  <ClinicPanel
                    clinicId={markers[active].id}
                    clinicName={markers[active].name}
                    isPrimary={
                      markers[active].id === clinicId ||
                      markers[active].id === "__current"
                    }
                    clinicMeta={markers[active]}
                    showDemoPartners={showDemoPartners}
                    onTogglePartners={(checked) => {
                      setShowDemoPartners(checked);
                      animateZoomPulse(checked); // NEW
                    }}
                  />
                </div>
              </InfoWindowF>
            )}

            <Helper>
              Showing clinics near the visible area (max ~10 km radius).
            </Helper>
          </GoogleMap>
        )}

        {/* Legend */}
        <LegendWrap>
          <LegendSwatch />
          <LegendText>
            <strong>Service area</strong> — customers you can serve
            {typeof serviceRadiusKm === "number"
              ? ` (≈ ${serviceRadiusKm} km radius)`
              : ""}
            {showDemoPartners ? "" : ""}
          </LegendText>
        </LegendWrap>
      </BgMapWrap>

      {/* Desktop vs Mobile container */}
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
            {/* {FormContent} */}
            {showSurveyOnMobile ? (
              <>
                <BackLink onClick={() => setShowSurveyOnMobile(false)}>
                  ← Back to clinic info
                </BackLink>
                {FormContent}
              </>
            ) : (
              <>
                {/* Then the clinic panel (now full width on mobile) */}
                {activeMarker ? (
                  <ClinicPanel
                    clinicId={activeMarker.id}
                    clinicName={activeMarker.name}
                    isPrimary={
                      activeMarker.id === clinicId ||
                      activeMarker.id === "__current"
                    }
                    clinicMeta={activeMarker}
                    showDemoPartners={showDemoPartners}
                    onTogglePartners={(checked) => {
                      setShowDemoPartners(checked);
                      animateZoomPulse(checked); // NEW
                    }}
                    showInlineCTA={isMobile && valid && !done} // NEW
                    onOpenSurvey={() => setShowSurveyOnMobile(true)} // NEW
                    fillScrollable={true} // NEW: makes the list use full height
                  />
                ) : (
                  <SmallLine>
                    No clinic selected yet. Tap a marker to view details.
                  </SmallLine>
                )}
              </>
            )}
          </SheetBody>
        </MobileSheet>
      ) : (
        <DesktopCard>{FormContent}</DesktopCard>
      )}
    </Page>
  );
}
