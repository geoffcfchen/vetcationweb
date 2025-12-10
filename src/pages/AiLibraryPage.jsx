// src/pages/AiLibraryPage.jsx
import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import {
  FiUpload,
  FiFileText,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiTrash2,
  FiPlus,
  FiUser,
  FiPaperclip,
  FiSearch,
  FiShoppingBag,
  FiImage,
  FiMoreHorizontal,
  FiEdit3, // <--- add this
  FiGlobe, // NEW
} from "react-icons/fi";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { auth, firestore, storage } from "../lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc, // NEW
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";

const AttachProgressRing = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: ${({ $percent = 0 }) =>
    `conic-gradient(#2563eb ${$percent}%, #1f2937 0)`};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const AttachProgressInner = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: #020617;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #e5e7eb;
`;

/* top area text + chips stays in a column */

const ComposerColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ComposerBottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ComposerBottomLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ComposerBottomRight = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
/* Layout */

const Page = styled.div`
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  height: 100vh;
  background: #020617;
  color: #e5e7eb;
  overflow-x: hidden;
  overflow-y: hidden; /* NEW: prevent whole page from scrolling */
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  border-right: 1px solid #1f2933;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #181818;
  height: 100vh; /* ✨ key: fix sidebar height */
  box-sizing: border-box;
  @media (max-width: 900px) {
    border-right: none;
    border-bottom: 1px solid #1f2933;
    height: auto; /* on mobile let it grow normally */
  }
`;

/* Modal for New Patient */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
`;

const ModalCard = styled.div`
  background: #020617;
  border-radius: 16px;
  border: 1px solid #1f2937;
  padding: 20px 24px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #e5e7eb;
`;

const ModalSubtitle = styled.p`
  margin: 6px 0 16px;
  font-size: 15px;
  color: #9ca3af;
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ModalInput = styled.input`
  border-radius: 999px;
  border: 1px solid #1f2937;
  background: #020617;
  color: #e5e7eb;
  padding: 10px 12px;
  font-size: 16px; /* was 14px */
  width: 100%;

  &::placeholder {
    color: #6b7280;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 6px;
`;

const ModalSecondaryButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 15px; /* was 13px */
  background: transparent;
  color: #9ca3af;
  cursor: pointer;

  &:hover {
    background: #303030;
  }
`;

const ModalPrimaryButton = styled.button`
  border-radius: 999px;
  padding: 6px 16px;
  font-size: 15px; /* was 13px */
  background: #ffffff;
  color: #000000;
  border: 1px solid #e5e7eb;
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;
/* Patients */

const PatientsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PatientsTitle = styled.div`
  font-size: 15px; /* was 13px */
  font-weight: 600;

  letter-spacing: 0.04em;
  color: #9ca3af;
`;

const NewPatientButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 14px; /* was 12px */
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #303030;
  color: #e5e7eb;
  cursor: pointer;

  &:hover {
    background: #1f2937;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;
const PatientList = styled.div`
  margin-top: 8px;
  max-height: 30vh; /* ✨ cap how tall the patient list can get */
  overflow-y: auto; /* ✨ make it scrollable */
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PatientRow = styled.button`
  width: 100%;
  border: none;
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 15px;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  background: ${(p) => (p.$active ? "#303030" : "transparent")};
  color: #e5e7eb;
  min-width: 0;
  position: relative; /* allow absolute three dot button */

  &:hover {
    background: #303030;
  }

  svg {
    flex-shrink: 0;
  }
`;

const PatientName = styled.span`
  flex: 1;
  min-width: 0;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 28px; /* reserve space for the three dots */
`;

const RowMenu = styled.div`
  position: absolute;
  top: 50%;
  right: 32px;
  transform: translateY(-50%);
  background: #181818;
  border-radius: 8px;
  border: 1px solid #303030;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
  padding: 4px 0;
  min-width: 140px;
  z-index: 25;
`;

const RowMenuItem = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  color: #e5e7eb;
  font-size: 14px;
  text-align: left;
  padding: 6px 10px;
  cursor: pointer;

  &:hover {
    background: #303030;
  }
`;

const PatientEmptyState = styled.div`
  font-size: 14px;
  color: #6b7280;
  padding: 4px 2px;
`;

/* Subchats nested under patient */

const SubchatList = styled.div`
  margin-left: 22px;
  margin-top: 2px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SubchatRow = styled.button`
  width: 100%;
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 14px;
  text-align: left;
  background: ${(p) => (p.$active ? "#303030" : "transparent")};
  color: ${(p) => (p.$active ? "#e5e7eb" : "#9ca3af")};
  cursor: pointer;

  /* IMPORTANT: make it flex so we can control child width */
  display: flex;
  align-items: center;
  position: relative; /* for the three-dot button */

  &:hover {
    background: #303030;
    color: #e5e7eb;
  }
`;

const SubchatTitle = styled.span`
  /* fixed narrow width so it hits "..." earlier */
  flex: 0 0 180px; /* change 120 → 100 for even fewer chars */
  max-width: 180px;
  min-width: 0;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  padding-right: 2px; /* keep space for the three-dot button if you have it */
`;

const PersonalChatList = styled.div`
  margin-top: 8px;
  max-height: 22vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PersonalChatRow = styled.button`
  width: 100%;
  border: none;
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 15px;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  background: ${(p) => (p.$active ? "#303030" : "transparent")};
  color: #e5e7eb;
  min-width: 0;
  position: relative;

  &:hover {
    background: #303030;
  }

  svg {
    flex-shrink: 0;
  }
`;

const PersonalChatTitle = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 28px; /* room for three dots */
`;

/* three dot menu and inline edit */

const RowMenuButton = styled.button`
  position: absolute;
  top: 50%;
  right: 4px;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  border-radius: 999px;
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  cursor: pointer;

  opacity: ${(p) => (p.$forceVisible ? 1 : 0)};
  pointer-events: ${(p) => (p.$forceVisible ? "auto" : "none")};
  transition: opacity 0.15s ease;

  /* always show on hover */
  ${PatientRow}:hover &,
  ${SubchatRow}:hover &,
  ${PersonalChatRow}:hover &,
  .chat-list-item:hover & {
    // NEW: when hovering a previous-chat row
    opacity: 1;
    pointer-events: auto;
  }

  &:hover {
    background: #303030;
    color: #e5e7eb;
  }
`;
const InlineEditInput = styled.input`
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  padding: 0;
  margin: 0;
  outline: none;
  width: 100%;
`;

const SectionDivider = styled.div`
  height: 1px;
  background: #303030;
  margin: 8px 0 4px;
`;

const SectionHeaderRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SidebarTitle = styled.div`
  font-size: 15px; /* was 13px */
  font-weight: 600;
  color: #9ca3af;
`;

const SidebarCount = styled.div`
  font-size: 14px; /* was 12px */
  color: #6b7280;
`;

const LibraryUploadButton = styled(NewPatientButton)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const LibraryHint = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-top: 10px;
`;

const UploadBox = styled.label`
  border: 1px dashed #4b5563;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  font-size: 15px; /* was 13px */
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  background: #181818;
  margin-top: 6px;

  &:hover {
    background: #202020;
    border-color: #6b7280;
  }

  input {
    display: none;
  }
`;

const UploadHint = styled.div`
  font-size: 13px; /* was 11px */
  color: #6b7280;
`;

const SourceList = styled.div`
  flex: 1;
  overflow-y: auto;
  font-size: 16px; /* was 14px */
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 4px;
  margin-top: 8px;
`;

const SourceRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;
  border-radius: 10px;
  background: #181818; /* was #020617 */
  border: 1px solid #303030;
`;

const SourceMain = styled.div`
  flex: 1;
  min-width: 0;
`;

const SourceTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SourceMeta = styled.div`
  margin-top: 2px;
  font-size: 13px; /* was 11px */
  color: #6b7280;
`;

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px; /* was 11px */
  color: ${(p) =>
    p.$status === "ready"
      ? "#22c55e"
      : p.$status === "error"
      ? "#f97316"
      : "#9ca3af"};
`;

const SourceActions = styled.div`
  display: flex;
  align-items: center;
  margin-left: 4px;
`;

const IconButton = styled.button`
  border: none;
  background: transparent;
  padding: 4px;
  cursor: pointer;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #303030;
  }

  svg {
    width: 16px;
    height: 16px;
    color: #6b7280;
  }
`;

const EmptyState = styled.div`
  font-size: 15px;
  color: #6b7280;
  padding: 8px 2px;
`;

/* Chat layout */

const ChatPane = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  min-height: 0;
  position: relative;
  background: #212121;
  overflow-x: hidden;
`;

const ChatInner = styled.div`
  flex: 1;
  min-height: 0; /* important so Messages can scroll */
  width: 100%;
  max-width: 880px;
  margin: 0 auto;
  padding-top: 32px;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  margin-bottom: ${(p) => (p.$isNewChat ? "10px" : "12px")};
  text-align: ${(p) => (p.$isCentered ? "center" : "left")};
`;

const ChatTitle = styled.div`
  font-size: 28px;
  font-weight: 500;
`;

const ChatSubtitle = styled.div`
  font-size: 14px; /* was 12px */
  color: #6b7280;
  margin-top: 2px;
`;

const Messages = styled.div`
  flex: 1;
  min-height: 0; /* important */
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MessageRow = styled.div`
  display: flex;
  justify-content: ${(p) => (p.$role === "user" ? "flex-end" : "flex-start")};
`;

const Bubble = styled.div`
  display: inline-block;
  max-width: 100%;
  padding: 10px 12px;
  border-radius: 14px;
  font-size: 16px; /* was 14px */
  background: ${(p) => (p.$role === "user" ? "#303030" : "transparent")};
  color: #e5e7eb;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
`;

const thinkingPulse = keyframes`
  0%, 100% { opacity: 0.4; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-1px); }
`;

const ThinkingRow = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const ThinkingBubble = styled(Bubble)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const ThinkingLabel = styled.span`
  font-size: 14px; /* was 12px */
  color: #e5e7eb;
  animation: ${thinkingPulse} 1.2s infinite;
`;

const ThinkingDots = styled.span`
  display: inline-flex;
  gap: 3px;
`;

const ThinkingDot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: #e5e7eb;
  opacity: 0.7;
  animation: ${thinkingPulse} 1.2s infinite;
  animation-delay: ${(p) => p.$delay || "0s"};
`;

/* NEW: attachment chips bar */

const AttachBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
`;

const AttachChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #303030;
  border: 1px solid #424242;
  font-size: 14px; /* was 12px */
`;

const AttachFilename = styled.span`
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AttachStatus = styled.span`
  font-size: 15px;
  color: #9ca3af;
`;

const AttachRemoveButton = styled.button`
  border: none;
  background: transparent;
  border-radius: 999px;
  padding: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  cursor: pointer;

  &:hover {
    background: #303030;
  }
`;

/* Composer row */

const InputRow = styled.form`
  margin-top: 12px;
`;

/* NEW: outer shell around +, attachments, and textarea */

const ComposerShell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 24px;
  background: #303030;
  border: 1px solid #424242;
`;
/* NEW: small icon-style attach button inside the shell */

const AttachIconButton = styled.button`
  border: none;
  border-radius: 999px;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #e5e7eb;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: #383838;
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

const WebSearchPill = styled.button`
  border: none;
  border-radius: 999px;
  padding: 6px 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #181818;
  border: 1px solid #424242;
  color: #e5e7eb;
  cursor: pointer;
  font-size: 14px;

  .pill-label {
    transition: color 0.12s ease;
  }

  .pill-close {
    opacity: 0;
    transform: scale(0.8);
    margin-left: 2px;
    transition: opacity 0.12s ease, transform 0.12s ease;
  }

  &:hover {
    background: #202020;
    border-color: #6b7280;
  }

  &:hover .pill-close {
    opacity: 1;
    transform: scale(1);
  }
`;

/* NEW: white circular send button, ChatGPT style */

const SendFabButton = styled.button`
  border: none;
  border-radius: 999px;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  color: #000000;
  cursor: pointer;
  flex-shrink: 0;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const AttachButtonWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const TextInput = styled.textarea`
  width: 100%;
  resize: none;
  min-height: 48px;
  max-height: 160px;
  overflow-y: auto;
  border: none;
  border-radius: 0;
  background: transparent;
  color: #e5e7eb;
  padding: 6px 14px 4px; /* was 6px 0 4px  → adds left/right padding */
  font-size: 16px; /* was 14px */

  &::placeholder {
    color: #9e9e9e;
  }

  &:focus {
    outline: none;
  }
`;

const SendButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 0 18px;
  background: #2563eb;
  color: #fff;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const ChatEmptyState = styled.div`
  font-size: 15px; /* was 13px */
  color: #6b7280;
  padding: 12px 2px;
`;

const NewChatCenter = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch; // ← was center
  justify-content: center;
  max-width: 880px; // match ChatInner max-width if you like
  width: 100%;
  margin: 0 auto;
  gap: 16px;
`;
/* NEW: attachment menu, ChatGPT style */

const CenterEmptyWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 80px;
`;

const CenterEmptyCard = styled.div`
  max-width: 460px;
  width: 100%;
  text-align: center;
  padding: 24px 28px;
  border-radius: 16px;
  background: #181818;
  border: 1px solid #2f2f2f;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.45);
`;

const CenterEmptyTitle = styled.h2`
  margin: 0 0 8px;
  font-size: 20px; /* was 18px */
  font-weight: 600;
  color: #e5e7eb;
`;

const CenterEmptySubtitle = styled.p`
  margin: 0 0 16px;
  font-size: 15px; /* was 13px */
  color: #9ca3af;
`;

const CenterEmptyHint = styled.p`
  margin: 10px 0 0;
  font-size: 14px; /* was 12px */
  color: #6b7280;
`;

const CenterEmptyIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 999px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #303030;
  color: #e5e7eb;
`;

const CenterEmptyPrimaryButton = styled.button`
  margin-top: 4px;
  border-radius: 999px;
  padding: 10px 18px;
  font-size: 16px; /* was 14px */
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  color: #000000;
  border: 1px solid #e5e7eb;
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const AttachMenu = styled.div`
  position: absolute;
  width: 260px;
  background: #303030;
  border-radius: 16px;
  border: 1px solid #424242;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  padding: 6px 0;
  z-index: 30;

  ${(p) =>
    p.$direction === "down"
      ? `
        top: 48px;
        left: 0;
      `
      : `
        bottom: 48px;
        left: 0;
      `}
`;

const AttachMenuItem = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  color: #e5e7eb;
  cursor: pointer;

  &:hover {
    background: #464646;
  }

  span {
    flex: 1;
    text-align: left;
  }
`;

const ContextMenuBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 60;
`;

const ContextMenuCard = styled.div`
  position: absolute;
  top: ${(p) => p.$top}px;
  left: ${(p) => p.$left}px;
  min-width: 200px;
  background: #242424;
  border-radius: 18px;
  border: 1px solid #3a3a3a;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.7);
  padding: 6px 0;
`;

const ContextMenuItem = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #e5e7eb;
  cursor: pointer;

  &:hover {
    background: #333333;
  }

  svg {
    flex-shrink: 0;
  }
`;

const ContextMenuItemDanger = styled(ContextMenuItem)`
  color: #f97373;
`;

const ContextMenuDivider = styled.div`
  height: 1px;
  margin: 4px 0;
  background: #3a3a3a;
`;

/* Subchat list (project history on main pane) */

const ChatListSection = styled.div`
  margin-top: 16px;
  padding-top: 8px;
  border-top: 1px solid #303030;
  width: 100%; /* NEW: match the composer width inside NewChatCenter */
`;

const ChatListTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #9ca3af;
  margin-bottom: 6px;
`;

const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ChatListItem = styled.button`
  width: 100%;
  border: none;
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 15px;
  text-align: left;
  background: ${(p) => (p.$active ? "#303030" : "transparent")};
  color: #e5e7eb;
  cursor: pointer;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;

  position: relative; // NEW: so three dots can be absolutely positioned

  &:hover {
    background: #3a3a3a; // FIX: no quotes
  }
`;

const ChatListText = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChatListItemTitle = styled.div`
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChatListItemPreview = styled.div`
  margin-top: 2px;
  font-size: 13px;
  color: #9ca3af;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChatListItemTime = styled.div`
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  margin-left: 4px;
  margin-right: 28px; // NEW: room for three dots
`;

const ChatListItemMeta = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
`;
const MessageContent = styled.div`
  max-width: ${(p) => (p.$role === "user" ? "68%" : "100%")};
  width: ${(p) => (p.$role === "user" ? "auto" : "100%")};
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: ${(p) => (p.$role === "user" ? "flex-end" : "flex-start")};
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: #10a37f;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

// const Bubble = styled.div`
//   background-color: #212121;
//   border: 1px solid #2f2f2f;
//   border-radius: 8px;
//   padding: 10px 14px;
//   color: #e5e7eb;
//   font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
//     sans-serif;
//   font-size: 0.95rem;
//   line-height: 1.6;
//   width: 100%;
// `;

const MarkdownBody = styled(ReactMarkdown)`
  /* Base text */
  & p {
    margin: 0 0 8px 0;
  }

  /* Headings */
  & h1,
  & h2,
  & h3,
  & h4,
  & h5,
  & h6 {
    margin: 8px 0 6px;
    font-weight: 600;
  }

  & h1 {
    font-size: 1.25rem;
  }
  & h2 {
    font-size: 1.15rem;
  }
  & h3 {
    font-size: 1.05rem;
  }

  /* Lists */
  & ul,
  & ol {
    margin: 6px 0 8px;
    padding-left: 1.4rem;
  }

  & li {
    margin: 2px 0;
  }

  /* Links */
  & a {
    color: #93c5fd;
    text-decoration: underline;
  }

  /* Blockquote */
  & blockquote {
    border-left: 3px solid #4b5563;
    margin: 6px 0;
    padding-left: 10px;
    color: #9ca3af;
    font-style: italic;
  }

  /* Horizontal rule */
  & hr {
    border: none;
    border-top: 1px solid #374151;
    margin: 10px 0;
  }

  /* Inline code */
  & code {
    background: #020617;
    padding: 2px 4px;
    border-radius: 4px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      "Liberation Mono", "Courier New", monospace;
    font-size: 0.85em;
  }

  /* Code blocks */
  & pre {
    background: #171717;
    padding: 10px 12px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 8px 0 10px;
  }

  & pre code {
    background: transparent;
    padding: 0;
  }

  /* Tables */
  & table {
    border-collapse: collapse;
    width: 100%;
    font-size: 0.9em;
    margin: 6px 0 10px;
  }

  & th,
  & td {
    border: 1px solid #374151;
    padding: 4px 6px;
    vertical-align: top;
  }

  & th {
    background: #111827;
    font-weight: 600;
  }
`;

/**
 * This is the styled wrapper around the markdown.
 * Important: it wraps ReactMarkdown, it does NOT wrap ReactMarkdown itself.
 */
const MarkdownWrapper = styled.div`
  /* Base text */
  & p {
    margin: 0 0 8px 0;
  }

  /* Headings */
  & h1,
  & h2,
  & h3,
  & h4,
  & h5,
  & h6 {
    margin: 8px 0 6px;
    font-weight: 600;
  }

  & h1 {
    font-size: 1.25rem;
  }
  & h2 {
    font-size: 1.15rem;
  }
  & h3 {
    font-size: 1.05rem;
  }

  /* Lists */
  & ul,
  & ol {
    margin: 6px 0 8px;
    padding-left: 1.4rem;
  }

  & li {
    margin: 2px 0;
  }

  /* Links */
  & a {
    color: #93c5fd;
    text-decoration: underline;
  }

  /* Blockquote */
  & blockquote {
    border-left: 3px solid #4b5563;
    margin: 6px 0;
    padding-left: 10px;
    color: #9ca3af;
    font-style: italic;
  }

  /* Horizontal rule */
  & hr {
    border: none;
    border-top: 1px solid #374151;
    margin: 10px 0;
  }

  /* Inline code */
  & code {
    background: #020617;
    padding: 2px 4px;
    border-radius: 4px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      "Liberation Mono", "Courier New", monospace;
    font-size: 0.85em;
  }

  /* Code blocks */
  & pre {
    background: #171717;
    padding: 10px 12px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 8px 0 10px;
  }

  & pre code {
    background: transparent;
    padding: 0;
  }

  /* Tables */
  & table {
    border-collapse: collapse;
    width: 100%;
    font-size: 0.9em;
    margin: 6px 0 10px;
  }

  & th,
  & td {
    border: 1px solid #374151;
    padding: 4px 6px;
    vertical-align: top;
  }

  & th {
    background: #111827;
    font-weight: 600;
  }
`;

const CodeBlock = styled.div`
  margin: 8px 0 10px;
  border-radius: 8px;
  background-color: #171717;
  overflow: hidden;
`;

const CodeHeader = styled.div`
  padding: 6px 10px;
  font-size: 0.75rem;
  color: #9ca3af;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #222222;
`;

const SourcesRow = styled.div`
  margin-top: 8px;
  font-size: 0.75rem;
  color: #9ca3af;
  border-top: 1px solid #374151;
  padding-top: 6px;
`;

function normalizeLooseOrderedLists(input) {
  if (!input) return "";

  // Collapse blank lines directly before an ordered-list item:
  // "...something\n\n2. Text" -> "...something\n2. Text"
  return input.replace(/\n\n(?=\d+\.\s)/g, "\n");
}

function normalizeMarkdown(input) {
  if (!input) return "";
  let out = normalizeMathDelimiters(input);
  // if you added a <br> normalizer, keep that too
  // out = normalizeHtmlBreaks(out);
  out = normalizeLooseOrderedLists(out);
  return out;
}
function normalizeMathDelimiters(input) {
  if (!input) return "";

  const sanitizeMath = (s) => s.replace(/\|/g, "\\vert ");

  let out = input;

  // \[ ... \]  -> $$ ... $$
  out = out.replace(/\\{1,2}\[([\s\S]*?)\\{1,2}\]/g, (_, content) => {
    const inner = sanitizeMath(content.trim());
    return `\n\n$$\n${inner}\n$$\n\n`;
  });

  // \( ... \) -> $ ... $
  out = out.replace(/\\{1,2}\(([\s\S]*?)\\{1,2}\)/g, (_, content) => {
    const inner = sanitizeMath(content.trim());
    return `$${inner}$`;
  });

  return out;
}

function AssistantMessageBubble({ message }) {
  const { content, sources } = message || {};
  const normalized = normalizeMarkdown(content || "");
  console.log("Normalized content:", JSON.stringify(normalized));

  return (
    <Row>
      <Bubble>
        <MarkdownWrapper>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const lang = match?.[1];

                if (inline) {
                  return <code {...props}>{children}</code>;
                }

                return (
                  <CodeBlock>
                    <CodeHeader>
                      <span>{lang || "code"}</span>
                    </CodeHeader>
                    <pre>
                      <code {...props}>{children}</code>
                    </pre>
                  </CodeBlock>
                );
              },
            }}
          >
            {normalized}
          </ReactMarkdown>
        </MarkdownWrapper>

        {Array.isArray(sources) && sources.length > 0 && (
          <SourcesRow>
            Sources: {sources.map((s) => s.key || s).join(", ")}
          </SourcesRow>
        )}
      </Bubble>
    </Row>
  );
}

function PersonalChatShell({ currentUser }) {
  const { personalChatId } = useParams();
  const isExistingChat = !!personalChatId;
  const navigateInner = useNavigate();

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const [chatAttachments, setChatAttachments] = useState([]);
  const [pendingAttachmentIds, setPendingAttachmentIds] = useState([]);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState({});

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const lastMessageRef = useRef(null);
  const thinkingRef = useRef(null);

  const [isThinking, setIsThinking] = useState(false);
  const [deleteAttachmentTarget, setDeleteAttachmentTarget] = useState(null);
  const [initialAssistantTriggered, setInitialAssistantTriggered] =
    useState(false);
  const [isWebSearchEnabled, setIsWebSearchEnabled] = useState(false);

  useEffect(() => {
    // Only in the personal chat route, not on the root "/" view
    if (!currentUser || !personalChatId) return;
    if (initialAssistantTriggered) return;
    if (messages.length === 0) return;

    const hasAssistant = messages.some((m) => m.role === "assistant");
    const last = messages[messages.length - 1];

    // Brand new chat: only user messages, no assistant yet
    if (!hasAssistant && last.role === "user") {
      setInitialAssistantTriggered(true);

      const convo = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      setIsThinking(true);
      // reuse your existing helper
      callPersonalAssistant(
        currentUser.uid,
        personalChatId,
        convo,
        last.id,
        isWebSearchEnabled
      );
    }
  }, [currentUser, personalChatId, messages, initialAssistantTriggered]);

  const scrollToBottom = (behavior = "auto") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior,
        block: "end",
      });
    }
  };

  // keep "Thinking" visible
  useEffect(() => {
    if (!isThinking || !thinkingRef.current) return;

    thinkingRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [isThinking]);

  // reset thinking on chat change
  useEffect(() => {
    setIsThinking(false);
    setMessageInput("");
  }, [personalChatId]);

  // scroll when messages update
  useEffect(() => {
    if (!personalChatId) return;
    if (messages.length === 0) return;
    scrollToBottom("auto");
  }, [personalChatId, messages.length]);

  // keep last user message in view
  useEffect(() => {
    if (!messagesContainerRef.current || !lastMessageRef.current) return;
    if (messages.length === 0) return;

    const last = messages[messages.length - 1];
    if (!last || last.role !== "user") {
      return;
    }

    const container = messagesContainerRef.current;
    const lastEl = lastMessageRef.current;

    const containerRect = container.getBoundingClientRect();
    const lastRect = lastEl.getBoundingClientRect();

    const bottomRelative = lastRect.bottom - containerRect.top;
    const desiredOffsetFromTop = 72;

    const delta = bottomRelative - desiredOffsetFromTop;
    const nextScrollTop = Math.max(0, container.scrollTop + delta);

    container.scrollTo({
      top: nextScrollTop,
      behavior: "smooth",
    });
  }, [messages.length, messagesContainerRef, lastMessageRef]);

  // subscribe to messages for an existing chat
  useEffect(() => {
    if (!currentUser || !personalChatId) {
      setMessages([]);
      return;
    }

    const msgsCol = collection(
      firestore,
      "vetPersonalChats",
      currentUser.uid,
      "chats",
      personalChatId,
      "messages"
    );
    const qMsgs = query(msgsCol, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(qMsgs, (snap) => {
      const rows = [];
      snap.forEach((docSnap) =>
        rows.push({ id: docSnap.id, ...docSnap.data() })
      );
      setMessages(rows);
    });

    return () => unsub();
  }, [currentUser, personalChatId]);

  // subscribe to attachments for this "session"
  // if personalChatId exists -> chatId == personalChatId
  // if root view -> chatId == null
  useEffect(() => {
    if (!currentUser) {
      setChatAttachments([]);
      return;
    }

    const attachmentsCol = collection(
      firestore,
      "vetPersonalChats",
      currentUser.uid,
      "attachments"
    );

    const chatIdToUse = personalChatId || null;

    const qAtt = query(
      attachmentsCol,
      where("chatId", "==", chatIdToUse),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(qAtt, (snap) => {
      const rows = [];
      snap.forEach((docSnap) =>
        rows.push({ id: docSnap.id, ...docSnap.data() })
      );
      setChatAttachments(rows);
    });

    return () => unsub();
  }, [currentUser, personalChatId]);

  // clear pending list when chat id changes
  useEffect(() => {
    setPendingAttachmentIds([]);
  }, [personalChatId]);

  const hasUploadingPending = chatAttachments.some(
    (att) => pendingAttachmentIds.includes(att.id) && att.status === "uploading"
  );

  const handleEnableWebSearch = () => {
    if (!currentUser) {
      alert("Please log in first.");
      return;
    }
    setIsWebSearchEnabled(true);
    setAttachMenuOpen(false);
  };

  const handleDisableWebSearch = () => {
    setIsWebSearchEnabled(false);
  };

  const callPersonalAssistant = async (
    vetUid,
    chatIdArg,
    convo,
    triggerId,
    webSearchEnabled
  ) => {
    try {
      const payload = {
        vetUid,
        chatId: chatIdArg,
        messages: convo,
        triggerMessageId: triggerId,
        webSearchEnabled: !!webSearchEnabled, // <--- NEW
      };

      const res = await fetch(
        "https://us-central1-vetcationapp.cloudfunctions.net/vetPersonalAssistant",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      let json;
      try {
        json = await res.json();
      } catch (e) {
        console.error("Failed to parse vetPersonalAssistant JSON", e);
        throw new Error(
          `Non-JSON response from vetPersonalAssistant (status ${res.status})`
        );
      }

      const chatDocRef = doc(
        firestore,
        "vetPersonalChats",
        vetUid,
        "chats",
        chatIdArg
      );
      const msgsCol = collection(chatDocRef, "messages");

      if (!res.ok) {
        console.error("vetPersonalAssistant HTTP error:", res.status, json);

        await addDoc(msgsCol, {
          role: "assistant",
          content:
            json?.error ||
            "Sorry, the AI assistant ran into an error. Please try again.",
          createdAt: serverTimestamp(),
        });

        setIsThinking(false);
        return;
      }

      await addDoc(msgsCol, {
        role: "assistant",
        content: json.reply,
        structured: json.structured || null,
        sources: json.sources || [],
        createdAt: serverTimestamp(),
      });

      await updateDoc(chatDocRef, {
        updatedAt: serverTimestamp(),
        lastMessagePreview: json.reply.slice(0, 140),
      });

      setIsThinking(false);
    } catch (err) {
      console.error("Personal assistant call failed:", err);
      setIsThinking(false);
    }
  };

  const handleToggleAttachMenu = () => {
    if (!currentUser) {
      alert("Please log in first.");
      return;
    }
    setAttachMenuOpen((open) => !open);
  };

  const handleAttachFilesClick = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleAttachmentFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!currentUser) {
      alert("Please log in first.");
      return;
    }

    try {
      setAttachMenuOpen(false);

      const attachmentsCol = collection(
        firestore,
        "vetPersonalChats",
        currentUser.uid,
        "attachments"
      );

      const attachmentDocRef = await addDoc(attachmentsCol, {
        vetUid: currentUser.uid,
        chatId: personalChatId || null, // null before first chat
        messageId: null,
        title: file.name,
        status: "uploading",
        filePath: null,
        downloadUrl: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const attachmentId = attachmentDocRef.id;

      setPendingAttachmentIds((prev) =>
        prev.includes(attachmentId) ? prev : [...prev, attachmentId]
      );
      setUploadProgress((prev) => ({ ...prev, [attachmentId]: 0 }));

      const path = `aiPersonalUploads/${currentUser.uid}/${
        personalChatId || "pending"
      }/${attachmentId}.pdf`;
      const storageRef = ref(storage, path);
      const task = uploadBytesResumable(storageRef, file);

      task.on(
        "state_changed",
        (snapshot) => {
          const percent = snapshot.totalBytes
            ? Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              )
            : 0;
          setUploadProgress((prev) => ({
            ...prev,
            [attachmentId]: percent,
          }));
        },
        async (error) => {
          console.error("Attachment upload error", error);
          await updateDoc(attachmentDocRef, {
            status: "error",
            updatedAt: serverTimestamp(),
          });
          setUploadProgress((prev) => {
            const { [attachmentId]: _ignore, ...rest } = prev;
            return rest;
          });
        },
        async () => {
          const url = await getDownloadURL(storageRef);
          await updateDoc(attachmentDocRef, {
            status: "uploaded",
            filePath: path,
            downloadUrl: url,
            updatedAt: serverTimestamp(),
          });
          setUploadProgress((prev) => {
            const { [attachmentId]: _ignore, ...rest } = prev;
            return rest;
          });
        }
      );
    } catch (err) {
      console.error("Failed to attach file", err);
      alert("Could not attach file. Please try again.");
    } finally {
      e.target.value = "";
    }
  };

  const handleRemoveAttachment = (attachment) => {
    if (!currentUser) return;

    setDeleteAttachmentTarget({
      id: attachment.id,
      title: attachment.title || "Attachment",
      filePath: attachment.filePath || null,
    });
  };

  const canSendMessage = () => {
    const text = messageInput.trim();
    if (!text) return false;

    if (!currentUser) {
      alert("Please log in first.");
      return false;
    }

    if (hasUploadingPending) {
      alert("Please wait for attachments to finish uploading before sending.");
      return false;
    }

    return true;
  };

  const sendMessage = async () => {
    if (!canSendMessage()) return;

    const text = messageInput.trim();
    setMessageInput("");

    if (!currentUser) return;

    if (!isExistingChat) {
      try {
        const chatsCol = collection(
          firestore,
          "vetPersonalChats",
          currentUser.uid,
          "chats"
        );
        const chatDocRef = await addDoc(chatsCol, {
          vetUid: currentUser.uid,
          title: null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastMessagePreview: text.slice(0, 140),
        });

        const newChatId = chatDocRef.id;
        const msgsCol = collection(chatDocRef, "messages");
        const userMessageRef = await addDoc(msgsCol, {
          role: "user",
          content: text,
          createdAt: serverTimestamp(),
        });
        const messageId = userMessageRef.id;

        const title =
          text.length > 40 ? text.slice(0, 40).trimEnd() + "..." : text;
        await updateDoc(chatDocRef, { title });

        // link pending attachments to this new chat + message
        if (pendingAttachmentIds.length > 0) {
          const now = serverTimestamp();
          await Promise.all(
            pendingAttachmentIds.map((attId) =>
              updateDoc(
                doc(
                  firestore,
                  "vetPersonalChats",
                  currentUser.uid,
                  "attachments",
                  attId
                ),
                {
                  chatId: newChatId,
                  messageId,
                  updatedAt: now,
                }
              ).catch((err) => {
                console.warn("Failed to link attachment", attId, err);
              })
            )
          );
        }

        setPendingAttachmentIds([]);

        // navigate into the new chat view
        navigateInner(`/ai/library/personal/${newChatId}`, {
          replace: true,
        });
        // New PersonalChatShell instance will see the single user message,
        // then the effect above will set isThinking and call the assistant.
      } catch (err) {
        console.error("Failed to start personal chat:", err);
        alert("Could not start chat. Please try again.");
      }
    } else {
      // existing personal chat
      try {
        const chatDocRef = doc(
          firestore,
          "vetPersonalChats",
          currentUser.uid,
          "chats",
          personalChatId
        );
        const msgsCol = collection(chatDocRef, "messages");

        const existingConvo = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));
        const newMessage = { role: "user", content: text };

        const userMessageRef = await addDoc(msgsCol, {
          role: "user",
          content: text,
          createdAt: serverTimestamp(),
        });
        const messageId = userMessageRef.id;

        await updateDoc(chatDocRef, {
          updatedAt: serverTimestamp(),
          lastMessagePreview: text.slice(0, 140),
        });

        // link any pending attachments to this message
        if (pendingAttachmentIds.length > 0) {
          const now = serverTimestamp();
          await Promise.all(
            pendingAttachmentIds.map((attId) =>
              updateDoc(
                doc(
                  firestore,
                  "vetPersonalChats",
                  currentUser.uid,
                  "attachments",
                  attId
                ),
                {
                  chatId: personalChatId,
                  messageId,
                  updatedAt: now,
                }
              ).catch((err) => {
                console.warn("Failed to link attachment", attId, err);
              })
            )
          );
        }

        setPendingAttachmentIds([]);

        const convo = [...existingConvo, newMessage];

        setIsThinking(true);
        await callPersonalAssistant(
          currentUser.uid,
          personalChatId,
          convo,
          messageId,
          isWebSearchEnabled
        );

        scrollToBottom("smooth");
        setPendingAttachmentIds([]);
      } catch (err) {
        console.error("Failed to send message:", err);
        alert("Could not send message. Please try again.");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleComposerChange = (e) => {
    const el = e.target;
    setMessageInput(el.value);

    el.style.height = "0px";
    const maxHeight = 260;
    const newHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = newHeight + "px";
  };

  const handleComposerKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderAttachBar = () => {
    const chips = chatAttachments.filter((att) =>
      pendingAttachmentIds.includes(att.id)
    );
    if (chips.length === 0) return null;

    return (
      <AttachBar>
        {chips.map((att) => {
          const isUploading = att.status === "uploading";
          const percentRaw =
            typeof uploadProgress[att.id] === "number"
              ? uploadProgress[att.id]
              : null;
          const percent =
            percentRaw != null ? Math.min(100, Math.max(0, percentRaw)) : null;

          let statusLabel = "";
          if (isUploading) {
            statusLabel =
              percent != null ? `Uploading ${percent}%` : "Uploading";
          } else if (att.status === "uploaded") {
            statusLabel = "Uploaded";
          } else if (att.status === "processing") {
            statusLabel = "Processing";
          } else if (att.status === "error") {
            statusLabel = "Error";
          } else if (att.status) {
            statusLabel = att.status;
          }

          return (
            <AttachChip key={att.id}>
              {isUploading && percent != null ? (
                <AttachProgressRing $percent={percent}>
                  <AttachProgressInner>
                    {percent > 0 && percent < 100 ? `${percent}` : ""}
                  </AttachProgressInner>
                </AttachProgressRing>
              ) : (
                <FiFileText size={14} />
              )}

              <AttachFilename title={att.title || "Attachment"}>
                {att.title || "Attachment"}
              </AttachFilename>

              {statusLabel && <AttachStatus>{statusLabel}</AttachStatus>}

              <AttachRemoveButton
                type="button"
                onClick={() => handleRemoveAttachment(att)}
                title="Remove attachment"
              >
                ×
              </AttachRemoveButton>
            </AttachChip>
          );
        })}
      </AttachBar>
    );
  };

  return (
    <ChatPane>
      {/* hidden input for attaching PDFs */}
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleAttachmentFileChange}
      />
      <ChatInner>
        {isExistingChat ? (
          <>
            {messages.length === 0 ? (
              <ChatEmptyState>Loading conversation…</ChatEmptyState>
            ) : (
              <Messages ref={messagesContainerRef}>
                {messages.map((m, index) => {
                  const messageAttachments = chatAttachments.filter(
                    (att) => att.messageId === m.id
                  );
                  const isLast = index === messages.length - 1;

                  return (
                    <MessageRow
                      key={m.id}
                      $role={m.role}
                      ref={isLast ? lastMessageRef : null}
                    >
                      <MessageContent $role={m.role}>
                        {messageAttachments.length > 0 && (
                          <AttachBar style={{ marginBottom: 4 }}>
                            {messageAttachments.map((att) => (
                              <AttachChip
                                key={att.id}
                                as={att.downloadUrl ? "a" : "div"}
                                href={att.downloadUrl || undefined}
                                target={att.downloadUrl ? "_blank" : undefined}
                                rel={att.downloadUrl ? "noreferrer" : undefined}
                              >
                                <FiFileText size={14} />
                                <AttachFilename
                                  title={att.title || "Attachment"}
                                >
                                  {att.title || "Attachment"}
                                </AttachFilename>
                                {att.status && (
                                  <AttachStatus>
                                    {att.status === "uploaded"
                                      ? "Attached"
                                      : att.status === "processing"
                                      ? "Processing"
                                      : att.status === "error"
                                      ? "Error"
                                      : att.status}
                                  </AttachStatus>
                                )}
                              </AttachChip>
                            ))}
                          </AttachBar>
                        )}

                        <Bubble $role={m.role}>
                          {m.role === "assistant" ? (
                            <AssistantMessageBubble message={m} />
                          ) : (
                            m.content
                          )}
                        </Bubble>
                      </MessageContent>
                    </MessageRow>
                  );
                })}

                {isThinking && (
                  <ThinkingRow ref={thinkingRef}>
                    <MessageContent $role="assistant">
                      <ThinkingBubble $role="assistant">
                        <ThinkingLabel>Thinking</ThinkingLabel>
                        <ThinkingDots>
                          <ThinkingDot />
                          <ThinkingDot $delay="0.15s" />
                          <ThinkingDot $delay="0.3s" />
                        </ThinkingDots>
                      </ThinkingBubble>
                    </MessageContent>
                  </ThinkingRow>
                )}

                <div ref={messagesEndRef} />
              </Messages>
            )}

            <InputRow onSubmit={handleSubmit}>
              <ComposerShell>
                <ComposerColumn>
                  {renderAttachBar()}
                  <TextInput
                    value={messageInput}
                    onChange={handleComposerChange}
                    onKeyDown={handleComposerKeyDown}
                    placeholder="Ask anything you want to study..."
                    disabled={!currentUser}
                  />
                </ComposerColumn>

                <ComposerBottomRow>
                  <ComposerBottomLeft>
                    <AttachButtonWrapper>
                      <AttachIconButton
                        type="button"
                        onClick={handleToggleAttachMenu}
                        disabled={!currentUser}
                        aria-label="Add attachment"
                      >
                        <FiPlus />
                      </AttachIconButton>

                      {attachMenuOpen && (
                        <AttachMenu $direction="up">
                          <AttachMenuItem
                            type="button"
                            onClick={handleAttachFilesClick}
                          >
                            <FiPaperclip />
                            <span>Add PDF for this turn</span>
                          </AttachMenuItem>

                          <AttachMenuItem
                            type="button"
                            onClick={handleEnableWebSearch}
                          >
                            <FiGlobe />
                            <span>Enable web search</span>
                          </AttachMenuItem>
                        </AttachMenu>
                      )}
                    </AttachButtonWrapper>
                    {isWebSearchEnabled && (
                      <WebSearchPill
                        type="button"
                        onClick={handleDisableWebSearch}
                        title="Disable web search for this turn"
                      >
                        <FiGlobe size={14} />
                        <span className="pill-label">Search web</span>
                        <span className="pill-close">×</span>
                      </WebSearchPill>
                    )}
                  </ComposerBottomLeft>

                  <ComposerBottomRight>
                    <SendFabButton
                      type="submit"
                      disabled={
                        !currentUser ||
                        !messageInput.trim() ||
                        hasUploadingPending
                      }
                    >
                      <FiSend />
                    </SendFabButton>
                  </ComposerBottomRight>
                </ComposerBottomRow>
              </ComposerShell>
            </InputRow>
          </>
        ) : (
          <NewChatCenter>
            <ChatHeader $isNewChat $isCentered>
              <ChatTitle>What do you want to learn today?</ChatTitle>
              <ChatSubtitle>
                Use this space for personal study. Ask questions and reference
                your uploaded library.
              </ChatSubtitle>
            </ChatHeader>

            <InputRow onSubmit={handleSubmit} style={{ width: "100%" }}>
              <ComposerShell>
                <ComposerColumn>
                  {renderAttachBar()}
                  <TextInput
                    value={messageInput}
                    onChange={handleComposerChange}
                    onKeyDown={handleComposerKeyDown}
                    placeholder="Type a question you want to learn about..."
                    disabled={!currentUser}
                  />
                </ComposerColumn>

                <ComposerBottomRow>
                  <ComposerBottomLeft>
                    <AttachButtonWrapper>
                      <AttachIconButton
                        type="button"
                        onClick={handleToggleAttachMenu}
                        disabled={!currentUser}
                        aria-label="Add attachment"
                      >
                        <FiPlus />
                      </AttachIconButton>

                      {attachMenuOpen && (
                        <AttachMenu $direction="up">
                          <AttachMenuItem
                            type="button"
                            onClick={handleAttachFilesClick}
                          >
                            <FiPaperclip />
                            <span>Add PDF for this turn</span>
                          </AttachMenuItem>

                          <AttachMenuItem
                            type="button"
                            onClick={handleEnableWebSearch}
                          >
                            <FiGlobe />
                            <span>Enable web search</span>
                          </AttachMenuItem>
                        </AttachMenu>
                      )}
                    </AttachButtonWrapper>

                    {isWebSearchEnabled && (
                      <WebSearchPill
                        type="button"
                        onClick={handleDisableWebSearch}
                        title="Disable web search for this turn"
                      >
                        <FiGlobe size={14} />
                        <span className="pill-label">Search web</span>
                        <span className="pill-close">×</span>
                      </WebSearchPill>
                    )}
                  </ComposerBottomLeft>

                  <ComposerBottomRight>
                    <SendFabButton
                      type="submit"
                      disabled={
                        !currentUser ||
                        !messageInput.trim() ||
                        hasUploadingPending
                      }
                    >
                      <FiSend />
                    </SendFabButton>
                  </ComposerBottomRight>
                </ComposerBottomRow>
              </ComposerShell>
            </InputRow>
          </NewChatCenter>
        )}
      </ChatInner>

      {deleteAttachmentTarget && (
        <ModalOverlay
          onClick={() => {
            setDeleteAttachmentTarget(null);
          }}
        >
          <ModalCard
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ModalTitle>Remove attachment</ModalTitle>
            <ModalSubtitle>
              {`This will remove "${deleteAttachmentTarget.title}" from this message.`}
            </ModalSubtitle>

            <ModalActions>
              <ModalSecondaryButton
                type="button"
                onClick={() => setDeleteAttachmentTarget(null)}
              >
                Cancel
              </ModalSecondaryButton>

              <ModalPrimaryButton
                type="button"
                onClick={async () => {
                  try {
                    setPendingAttachmentIds((prev) =>
                      prev.filter((id) => id !== deleteAttachmentTarget.id)
                    );

                    if (deleteAttachmentTarget.filePath) {
                      try {
                        const storageRef = ref(
                          storage,
                          deleteAttachmentTarget.filePath
                        );
                        await deleteObject(storageRef);
                      } catch (e2) {
                        console.warn(
                          "Failed to delete attachment file from Storage",
                          e2
                        );
                      }
                    }

                    if (currentUser) {
                      const attachmentRef = doc(
                        firestore,
                        "vetPersonalChats",
                        currentUser.uid,
                        "attachments",
                        deleteAttachmentTarget.id
                      );
                      await deleteDoc(attachmentRef);
                    }
                  } catch (err) {
                    console.error("Failed to remove attachment", err);
                    alert("Could not remove attachment. Please try again.");
                  } finally {
                    setDeleteAttachmentTarget(null);
                  }
                }}
              >
                Delete
              </ModalPrimaryButton>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </ChatPane>
  );
}

/* Chat shell with attachment UI */
function ChatShell({
  currentUser,
  cases,
  activeCaseChats,
  onNewPatient,
  rowMenu,
  onOpenChatContextMenu,
  editingChatId,
  editingChatOrigin,
  editingChatTitle,
  setEditingChatTitle,
  handleInlineChatKeyDown,
  commitChatRename,
}) {
  const { caseId, chatId } = useParams();
  const isNewChat = !!caseId && !chatId;
  const navigateInner = useNavigate();

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  // All attachments for this case (from Firestore)
  const [caseAttachments, setCaseAttachments] = useState([]);
  // Which attachments belong to the current "pending send"
  const [pendingAttachmentIds, setPendingAttachmentIds] = useState([]);

  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  const [uploadProgress, setUploadProgress] = useState({});

  const messagesEndRef = useRef(null); // new
  const messagesContainerRef = useRef(null); // NEW: scroll container
  const lastMessageRef = useRef(null); // NEW: last message bubble
  const thinkingRef = useRef(null); // NEW

  const [isThinking, setIsThinking] = useState(false); // NEW
  const [deleteAttachmentTarget, setDeleteAttachmentTarget] = useState(null);
  const [initialAssistantTriggered, setInitialAssistantTriggered] =
    useState(false);

  const [isWebSearchEnabled, setIsWebSearchEnabled] = useState(false);

  // shape: { id, title, filePath }

  const isExistingChat = !!chatId; // optional helper

  const activeCase = caseId ? cases.find((c) => c.id === caseId) || null : null;

  const hasAnyCases = Array.isArray(cases) && cases.length > 0;

  const scrollToBottom = (behavior = "auto") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior,
        block: "end",
      });
    }
  };

  useEffect(() => {
    if (!currentUser || !caseId || !chatId) return;
    if (initialAssistantTriggered) return;
    if (messages.length === 0) return;

    const hasAssistant = messages.some((m) => m.role === "assistant");
    const last = messages[messages.length - 1];

    // New chat: only user messages so far
    if (!hasAssistant && last.role === "user") {
      setInitialAssistantTriggered(true);

      const convo = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      setIsThinking(true);
      callAssistant(
        currentUser.uid,
        caseId,
        chatId,
        convo,
        last.id,
        isWebSearchEnabled
      );
    }
  }, [currentUser, caseId, chatId, messages, initialAssistantTriggered]);

  // When the assistant is "thinking", scroll so the thinking bubble is visible
  useEffect(() => {
    if (!isThinking || !thinkingRef.current) return;

    thinkingRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [isThinking]);

  useEffect(() => {
    setIsThinking(false);
  }, [caseId, chatId]);

  useEffect(() => {
    if (!chatId) return;
    if (messages.length === 0) return;
    scrollToBottom("auto");
  }, [chatId, messages.length]);

  // When the last message is from the user, scroll so that
  // the bottom of that bubble sits near the top of the chat.
  useEffect(() => {
    if (!messagesContainerRef.current || !lastMessageRef.current) return;
    if (messages.length === 0) return;

    const last = messages[messages.length - 1];
    if (!last || last.role !== "user") {
      // Only adjust in the "user just asked a question" state
      return;
    }

    const container = messagesContainerRef.current;
    const lastEl = lastMessageRef.current;

    const containerRect = container.getBoundingClientRect();
    const lastRect = lastEl.getBoundingClientRect();

    // Distance from top of container to bottom of last message
    const bottomRelative = lastRect.bottom - containerRect.top;

    // Where we want that bottom to sit (tweak this number if you want higher/lower)
    const desiredOffsetFromTop = 72; // pixels

    const delta = bottomRelative - desiredOffsetFromTop;
    const nextScrollTop = Math.max(0, container.scrollTop + delta);

    container.scrollTo({
      top: nextScrollTop,
      behavior: "smooth",
    });
  }, [messages.length, messagesContainerRef, lastMessageRef]);

  // Listen to messages of this chat
  useEffect(() => {
    if (!currentUser || !caseId || !chatId) {
      setMessages([]);
      return;
    }

    const msgsCol = collection(
      firestore,
      "vetAiCases",
      caseId,
      "chats",
      chatId,
      "messages"
    );
    const qMsgs = query(msgsCol, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(qMsgs, (snap) => {
      const rows = [];
      snap.forEach((docSnap) =>
        rows.push({ id: docSnap.id, ...docSnap.data() })
      );
      setMessages(rows);
    });

    return () => unsub();
  }, [currentUser, caseId, chatId]);

  // Listen to all attachments for this case
  useEffect(() => {
    if (!currentUser || !caseId) {
      setCaseAttachments([]);
      return;
    }

    const attachmentsCol = collection(
      firestore,
      "vetAiCases",
      caseId,
      "attachments"
    );
    const qAtt = query(attachmentsCol, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(qAtt, (snap) => {
      const rows = [];
      snap.forEach((docSnap) =>
        rows.push({ id: docSnap.id, ...docSnap.data() })
      );
      setCaseAttachments(rows);
    });

    return () => unsub();
  }, [currentUser, caseId]);

  // When case or chat changes, clear pending selection
  useEffect(() => {
    setPendingAttachmentIds([]);
  }, [caseId, chatId]);

  const handleEnableWebSearch = () => {
    if (!currentUser) {
      alert("Please log in first.");
      return;
    }
    if (!caseId) {
      alert("Create or select a patient first.");
      return;
    }
    setIsWebSearchEnabled(true);
    setAttachMenuOpen(false);
  };

  const handleDisableWebSearch = () => {
    setIsWebSearchEnabled(false);
  };

  const hasUploadingPending = caseAttachments.some(
    (att) => pendingAttachmentIds.includes(att.id) && att.status === "uploading"
  );

  const callAssistant = async (
    vetUid,
    caseIdArg,
    chatIdArg,
    convo,
    triggerMessageId,
    webSearchEnabled // NEW
  ) => {
    try {
      const payload = {
        vetUid,
        caseId: caseIdArg,
        chatId: chatIdArg,
        messages: convo,
        triggerMessageId,
        webSearchEnabled: !!webSearchEnabled, // NEW
      };

      const res = await fetch(
        "https://us-central1-vetcationapp.cloudfunctions.net/vetCaseAssistant",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      let json;
      try {
        json = await res.json();
      } catch (e) {
        console.error("Failed to parse vetCaseAssistant response JSON", e);
        throw new Error(
          `Non-JSON response from vetCaseAssistant (status ${res.status})`
        );
      }

      if (!res.ok) {
        console.error("vetCaseAssistant HTTP error:", res.status, json);
        const chatDocRef = doc(
          firestore,
          "vetAiCases",
          caseIdArg,
          "chats",
          chatIdArg
        );
        const msgsCol = collection(chatDocRef, "messages");

        await addDoc(msgsCol, {
          role: "assistant",
          content:
            json?.error ||
            "Sorry, the AI assistant ran into an error. Please try again.",
          createdAt: serverTimestamp(),
        });

        setIsThinking(false); // NEW
        return;
      }

      const chatDocRef = doc(
        firestore,
        "vetAiCases",
        caseIdArg,
        "chats",
        chatIdArg
      );
      const msgsCol = collection(chatDocRef, "messages");

      await addDoc(msgsCol, {
        role: "assistant",
        content: json.reply,
        structured: json.structured || null,
        sources: json.sources || [],
        createdAt: serverTimestamp(),
      });

      await updateDoc(chatDocRef, {
        updatedAt: serverTimestamp(),
        lastMessagePreview: json.reply.slice(0, 140),
      });

      setIsThinking(false); // NEW
    } catch (err) {
      console.error("Assistant call failed:", err);
      setIsThinking(false); // NEW
    }
  };

  const handleToggleAttachMenu = () => {
    if (!currentUser) {
      alert("Please log in first.");
      return;
    }
    if (!caseId) {
      alert("Create or select a patient first.");
      return;
    }
    setAttachMenuOpen((open) => !open);
  };

  const handleAttachFilesClick = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  // Upload a PDF and create an attachment doc linked to the case.
  // We associate it with a specific message after Send.
  const handleAttachmentFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!currentUser) {
      alert("Please log in first.");
      return;
    }
    if (!caseId) {
      alert("Create or select a patient first.");
      return;
    }

    try {
      setAttachMenuOpen(false);

      const attachmentsCol = collection(
        firestore,
        "vetAiCases",
        caseId,
        "attachments"
      );

      // Create attachment doc first so we can use its id in the storage path
      const attachmentDocRef = await addDoc(attachmentsCol, {
        vetUid: currentUser.uid,
        caseId,
        chatId: null, // filled on Send
        messageId: null, // filled on Send
        title: file.name,
        status: "uploading",
        filePath: null,
        downloadUrl: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const attachmentId = attachmentDocRef.id;

      // Mark it as pending for this message
      setPendingAttachmentIds((prev) =>
        prev.includes(attachmentId) ? prev : [...prev, attachmentId]
      );
      setUploadProgress((prev) => ({ ...prev, [attachmentId]: 0 }));

      const path = `aiCaseUploads/${currentUser.uid}/${caseId}/${attachmentId}.pdf`;
      const storageRef = ref(storage, path);
      const task = uploadBytesResumable(storageRef, file);

      task.on(
        "state_changed",
        (snapshot) => {
          const percent = snapshot.totalBytes
            ? Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              )
            : 0;
          setUploadProgress((prev) => ({
            ...prev,
            [attachmentId]: percent,
          }));
        },
        async (error) => {
          console.error("Attachment upload error", error);
          await updateDoc(attachmentDocRef, {
            status: "error",
            updatedAt: serverTimestamp(),
          });
          setUploadProgress((prev) => {
            const { [attachmentId]: _ignore, ...rest } = prev;
            return rest;
          });
        },
        async () => {
          const url = await getDownloadURL(storageRef);
          await updateDoc(attachmentDocRef, {
            status: "uploaded",
            filePath: path,
            downloadUrl: url,
            updatedAt: serverTimestamp(),
          });
          setUploadProgress((prev) => {
            const { [attachmentId]: _ignore, ...rest } = prev;
            return rest;
          });
        }
      );
    } catch (err) {
      console.error("Failed to attach file", err);
      alert("Could not attach file. Please try again.");
    } finally {
      e.target.value = "";
    }
  };

  // Remove an attachment from the pending send (and delete from Firestore/Storage)
  const handleRemoveAttachment = (attachment) => {
    if (!currentUser || !caseId) return;

    setDeleteAttachmentTarget({
      id: attachment.id,
      title: attachment.title || "Attachment",
      filePath: attachment.filePath || null,
    });
  };

  const canSendMessage = () => {
    const text = messageInput.trim();
    if (!text) return false;

    if (!currentUser) {
      alert("Please log in first.");
      return false;
    }
    if (!caseId) {
      alert("Create or select a patient first.");
      return false;
    }

    if (hasUploadingPending) {
      alert("Please wait for attachments to finish uploading before sending.");
      return false;
    }

    return true;
  };

  const sendMessage = async () => {
    if (!canSendMessage()) return;

    const text = messageInput.trim();

    // Clear input immediately for snappy feel
    setMessageInput("");

    if (!chatId) {
      try {
        const chatsCol = collection(firestore, "vetAiCases", caseId, "chats");
        const chatDocRef = await addDoc(chatsCol, {
          vetUid: currentUser.uid,
          caseId,
          title: null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastMessagePreview: text.slice(0, 140),
        });

        const msgsCol = collection(chatDocRef, "messages");
        const userMessageRef = await addDoc(msgsCol, {
          role: "user",
          content: text,
          createdAt: serverTimestamp(),
        });
        const messageId = userMessageRef.id;
        const newChatId = chatDocRef.id;

        const title =
          text.length > 40 ? text.slice(0, 40).trimEnd() + "..." : text;
        await updateDoc(chatDocRef, { title });

        if (pendingAttachmentIds.length > 0) {
          const now = serverTimestamp();
          await Promise.all(
            pendingAttachmentIds.map((attId) =>
              updateDoc(
                doc(firestore, "vetAiCases", caseId, "attachments", attId),
                {
                  chatId: newChatId,
                  messageId,
                  updatedAt: now,
                }
              ).catch((err) => {
                console.warn("Failed to link attachment", attId, err);
              })
            )
          );
        }

        setPendingAttachmentIds([]);

        // Route into the chat view. Once messages arrive there,
        // the effect above will set isThinking and call the assistant.
        navigateInner(`/ai/library/p/${caseId}/c/${newChatId}`, {
          replace: true,
        });
      } catch (err) {
        console.error("Failed to start new chat:", err);
        alert("Could not start chat. Please try again.");
      }
    } else {
      // Existing chat
      try {
        const chatDocRef = doc(
          firestore,
          "vetAiCases",
          caseId,
          "chats",
          chatId
        );
        const msgsCol = collection(chatDocRef, "messages");

        const existingConvo = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));
        const newMessage = { role: "user", content: text };

        const userMessageRef = await addDoc(msgsCol, {
          role: "user",
          content: text,
          createdAt: serverTimestamp(),
        });
        const messageId = userMessageRef.id;

        await updateDoc(chatDocRef, {
          updatedAt: serverTimestamp(),
          lastMessagePreview: text.slice(0, 140),
        });

        // Link pending attachments to this chat + message
        if (pendingAttachmentIds.length > 0) {
          const now = serverTimestamp();
          await Promise.all(
            pendingAttachmentIds.map((attId) =>
              updateDoc(
                doc(firestore, "vetAiCases", caseId, "attachments", attId),
                {
                  chatId,
                  messageId,
                  updatedAt: now,
                }
              ).catch((err) => {
                console.warn("Failed to link attachment", attId, err);
              })
            )
          );
        }

        // Clear from composer right away
        setPendingAttachmentIds([]);

        const convo = [...existingConvo, newMessage];

        setIsThinking(true); // NEW
        await callAssistant(
          currentUser.uid,
          caseId,
          chatId,
          convo,
          messageId,
          isWebSearchEnabled
        );

        scrollToBottom("smooth");
        setPendingAttachmentIds([]);
      } catch (err) {
        console.error("Failed to send message:", err);
        alert("Could not send message. Please try again.");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleComposerChange = (e) => {
    const el = e.target;
    setMessageInput(el.value);

    // auto-grow
    el.style.height = "0px";
    const maxHeight = 260;
    const newHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = newHeight + "px";
  };

  const handleComposerKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleOpenChat = (chatIdToOpen) => {
    if (!caseId) return;
    navigateInner(`/ai/library/p/${caseId}/c/${chatIdToOpen}`);
  };

  const renderAttachBar = () => {
    const chips = caseAttachments.filter((att) =>
      pendingAttachmentIds.includes(att.id)
    );
    if (chips.length === 0) return null;

    return (
      <AttachBar>
        {chips.map((att) => {
          const isUploading = att.status === "uploading";
          const percentRaw =
            typeof uploadProgress[att.id] === "number"
              ? uploadProgress[att.id]
              : null;
          const percent =
            percentRaw != null ? Math.min(100, Math.max(0, percentRaw)) : null;

          let statusLabel = "";
          if (isUploading) {
            statusLabel =
              percent != null ? `Uploading ${percent}%` : "Uploading";
          } else if (att.status === "uploaded") {
            statusLabel = "Uploaded";
          } else if (att.status === "processing") {
            statusLabel = "Processing";
          } else if (att.status === "error") {
            statusLabel = "Error";
          } else if (att.status) {
            statusLabel = att.status;
          }

          return (
            <AttachChip key={att.id}>
              {isUploading && percent != null ? (
                <AttachProgressRing $percent={percent}>
                  <AttachProgressInner>
                    {percent > 0 && percent < 100 ? `${percent}` : ""}
                  </AttachProgressInner>
                </AttachProgressRing>
              ) : (
                <FiFileText size={14} />
              )}

              <AttachFilename title={att.title || "Attachment"}>
                {att.title || "Attachment"}
              </AttachFilename>

              {statusLabel && <AttachStatus>{statusLabel}</AttachStatus>}

              <AttachRemoveButton
                type="button"
                onClick={() => handleRemoveAttachment(att)}
                title="Remove attachment"
              >
                ×
              </AttachRemoveButton>
            </AttachChip>
          );
        })}
      </AttachBar>
    );
  };

  return (
    <ChatPane>
      {/* hidden input for attaching PDFs */}
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleAttachmentFileChange}
      />
      <ChatInner>
        {/* No active patient selected */}
        {!activeCase &&
          (hasAnyCases ? (
            <>
              <ChatHeader $isNewChat={false} $isCentered>
                <ChatTitle>Start with a patient</ChatTitle>
                <ChatSubtitle>
                  Select a patient on the left to start an AI case conversation,
                  or create a new one.
                </ChatSubtitle>
              </ChatHeader>

              <ChatEmptyState>
                Choose a patient from the left sidebar to get started or use the
                New button above to create one.
              </ChatEmptyState>
            </>
          ) : (
            <CenterEmptyWrapper>
              <CenterEmptyCard>
                <CenterEmptyIcon>
                  <FiUser size={20} />
                </CenterEmptyIcon>
                <CenterEmptyTitle>Create your first patient</CenterEmptyTitle>
                <CenterEmptySubtitle>
                  Keep each AI case tied to a specific patient so you can
                  organize lab panels, notes, and conversations in one place.
                </CenterEmptySubtitle>
                <CenterEmptyPrimaryButton
                  type="button"
                  onClick={() => onNewPatient && onNewPatient()}
                  disabled={!currentUser}
                >
                  <FiPlus />
                  New patient
                </CenterEmptyPrimaryButton>
                {!currentUser && (
                  <CenterEmptyHint>
                    Sign in to create and save patients.
                  </CenterEmptyHint>
                )}
              </CenterEmptyCard>
            </CenterEmptyWrapper>
          ))}

        {/* Active patient, but no chat yet: center like ChatGPT */}
        {activeCase && !chatId && (
          <NewChatCenter>
            <ChatHeader $isNewChat>
              <ChatTitle>{activeCase.patientName}</ChatTitle>
              <ChatSubtitle>
                Start a new chat for this patient, or open a previous one.
              </ChatSubtitle>
            </ChatHeader>

            <InputRow onSubmit={handleSubmit} style={{ width: "100%" }}>
              <ComposerShell>
                <ComposerColumn>
                  {renderAttachBar()}
                  <TextInput
                    value={messageInput}
                    onChange={handleComposerChange}
                    onKeyDown={handleComposerKeyDown}
                    placeholder="New chat for this patient, for example: 'Help me interpret today's lab panel...'"
                    disabled={!currentUser}
                  />
                </ComposerColumn>

                <ComposerBottomRow>
                  <ComposerBottomLeft>
                    <AttachButtonWrapper>
                      <AttachIconButton
                        type="button"
                        onClick={handleToggleAttachMenu}
                        disabled={!currentUser || !caseId}
                        aria-label="Add attachment"
                      >
                        <FiPlus />
                      </AttachIconButton>

                      {attachMenuOpen && (
                        <AttachMenu $direction="down">
                          <AttachMenuItem
                            type="button"
                            onClick={handleAttachFilesClick}
                          >
                            <FiPaperclip />
                            <span>Add lab report / PDF</span>
                          </AttachMenuItem>

                          <AttachMenuItem
                            type="button"
                            onClick={handleEnableWebSearch}
                          >
                            <FiGlobe />
                            <span>Enable web search</span>
                          </AttachMenuItem>
                        </AttachMenu>
                      )}
                    </AttachButtonWrapper>

                    {isWebSearchEnabled && (
                      <WebSearchPill
                        type="button"
                        onClick={handleDisableWebSearch}
                        title="Disable web search for this turn"
                      >
                        <FiGlobe size={14} />
                        <span className="pill-label">Search web</span>
                        <span className="pill-close">×</span>
                      </WebSearchPill>
                    )}
                  </ComposerBottomLeft>

                  <ComposerBottomRight>
                    <SendFabButton
                      type="submit"
                      disabled={
                        !currentUser ||
                        !messageInput.trim() ||
                        hasUploadingPending
                      }
                    >
                      <FiSend />
                    </SendFabButton>
                  </ComposerBottomRight>
                </ComposerBottomRow>
              </ComposerShell>
            </InputRow>

            <ChatListSection>
              <ChatListTitle>Previous chats</ChatListTitle>
              {activeCaseChats.length === 0 && (
                <ChatEmptyState>No chats yet for this patient.</ChatEmptyState>
              )}
              {activeCaseChats.length > 0 && (
                <ChatList>
                  {activeCaseChats.map((ch) => {
                    const created =
                      ch.createdAt && ch.createdAt.toDate
                        ? ch.createdAt.toDate()
                        : null;
                    const title =
                      ch.title ||
                      (ch.lastMessagePreview
                        ? ch.lastMessagePreview.slice(0, 40) + "..."
                        : "Untitled chat");

                    const isEditingHere =
                      editingChatId === ch.id && editingChatOrigin === "main";

                    const displayTitle = isEditingHere
                      ? editingChatTitle
                      : title;

                    return (
                      <ChatListItem
                        key={ch.id}
                        className="chat-list-item" // NEW: used by RowMenuButton CSS
                        type="button"
                        onClick={() => handleOpenChat(ch.id)}
                        $active={ch.id === chatId}
                      >
                        <ChatListText>
                          <ChatListItemTitle title={displayTitle}>
                            {isEditingHere ? (
                              <InlineEditInput
                                value={editingChatTitle}
                                onChange={(e) =>
                                  setEditingChatTitle(e.target.value)
                                }
                                onKeyDown={handleInlineChatKeyDown}
                                onBlur={commitChatRename}
                                autoFocus
                              />
                            ) : (
                              displayTitle
                            )}
                          </ChatListItemTitle>

                          {!isEditingHere && ch.lastMessagePreview && (
                            <ChatListItemPreview title={ch.lastMessagePreview}>
                              {ch.lastMessagePreview}
                            </ChatListItemPreview>
                          )}
                        </ChatListText>

                        {created && (
                          <ChatListItemTime>
                            {created.toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </ChatListItemTime>
                        )}

                        {/* NEW: three-dot menu button, same behavior as sidebar */}
                        <RowMenuButton
                          type="button"
                          aria-label="Chat actions"
                          $forceVisible={
                            rowMenu &&
                            rowMenu.kind === "chat" &&
                            rowMenu.id === ch.id
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenChatContextMenu) {
                              onOpenChatContextMenu(e, caseId, ch);
                            }
                          }}
                        >
                          <FiMoreHorizontal size={16} />
                        </RowMenuButton>
                      </ChatListItem>
                    );
                  })}
                </ChatList>
              )}
            </ChatListSection>
          </NewChatCenter>
        )}

        {/* Active patient and active chat: no header, just messages + composer */}
        {activeCase && chatId && (
          <>
            {messages.length === 0 ? (
              <ChatEmptyState>Loading conversation…</ChatEmptyState>
            ) : (
              <Messages ref={messagesContainerRef}>
                {messages.map((m, index) => {
                  const messageAttachments = caseAttachments.filter(
                    (att) => att.chatId === chatId && att.messageId === m.id
                  );
                  const isLast = index === messages.length - 1;

                  return (
                    <MessageRow
                      key={m.id}
                      $role={m.role}
                      ref={isLast ? lastMessageRef : null}
                    >
                      <MessageContent $role={m.role}>
                        {messageAttachments.length > 0 && (
                          <AttachBar style={{ marginBottom: 4 }}>
                            {messageAttachments.map((att) => (
                              <AttachChip
                                key={att.id}
                                as={att.downloadUrl ? "a" : "div"}
                                href={att.downloadUrl || undefined}
                                target={att.downloadUrl ? "_blank" : undefined}
                                rel={att.downloadUrl ? "noreferrer" : undefined}
                              >
                                <FiFileText size={14} />
                                <AttachFilename
                                  title={att.title || "Attachment"}
                                >
                                  {att.title || "Attachment"}
                                </AttachFilename>
                                {att.status && (
                                  <AttachStatus>
                                    {att.status === "uploaded"
                                      ? "Attached"
                                      : att.status === "processing"
                                      ? "Processing"
                                      : att.status === "error"
                                      ? "Error"
                                      : att.status}
                                  </AttachStatus>
                                )}
                              </AttachChip>
                            ))}
                          </AttachBar>
                        )}

                        <Bubble $role={m.role}>
                          {m.role === "assistant" ? (
                            <AssistantMessageBubble message={m} />
                          ) : (
                            m.content
                          )}
                        </Bubble>
                      </MessageContent>
                    </MessageRow>
                  );
                })}

                {isThinking && (
                  <ThinkingRow ref={thinkingRef}>
                    <MessageContent $role="assistant">
                      <ThinkingBubble $role="assistant">
                        <ThinkingLabel>Thinking</ThinkingLabel>
                        <ThinkingDots>
                          <ThinkingDot />
                          <ThinkingDot $delay="0.15s" />
                          <ThinkingDot $delay="0.3s" />
                        </ThinkingDots>
                      </ThinkingBubble>
                    </MessageContent>
                  </ThinkingRow>
                )}

                <div ref={messagesEndRef} />
              </Messages>
            )}

            <InputRow onSubmit={handleSubmit}>
              <ComposerShell>
                <ComposerColumn>
                  {renderAttachBar()}
                  <TextInput
                    value={messageInput}
                    onChange={handleComposerChange}
                    onKeyDown={handleComposerKeyDown}
                    placeholder="Ask anything about this patient's case or lab panel..."
                    disabled={!currentUser}
                  />
                </ComposerColumn>

                <ComposerBottomRow>
                  <ComposerBottomLeft>
                    <AttachButtonWrapper>
                      <AttachIconButton
                        type="button"
                        onClick={handleToggleAttachMenu}
                        disabled={!currentUser || !caseId}
                        aria-label="Add attachment"
                      >
                        <FiPlus />
                      </AttachIconButton>

                      {attachMenuOpen && (
                        <AttachMenu $direction="up">
                          <AttachMenuItem
                            type="button"
                            onClick={handleAttachFilesClick}
                          >
                            <FiPaperclip />
                            <span>Add lab report / PDF</span>
                          </AttachMenuItem>

                          <AttachMenuItem
                            type="button"
                            onClick={handleEnableWebSearch}
                          >
                            <FiGlobe />
                            <span>Enable web search</span>
                          </AttachMenuItem>
                        </AttachMenu>
                      )}
                    </AttachButtonWrapper>

                    {isWebSearchEnabled && (
                      <WebSearchPill
                        type="button"
                        onClick={handleDisableWebSearch}
                        title="Disable web search for this turn"
                      >
                        <FiGlobe size={14} />
                        <span className="pill-label">Search web</span>
                        <span className="pill-close">×</span>
                      </WebSearchPill>
                    )}
                  </ComposerBottomLeft>

                  <ComposerBottomRight>
                    <SendFabButton
                      type="submit"
                      disabled={
                        !currentUser ||
                        !messageInput.trim() ||
                        hasUploadingPending
                      }
                    >
                      <FiSend />
                    </SendFabButton>
                  </ComposerBottomRight>
                </ComposerBottomRow>
              </ComposerShell>
            </InputRow>
          </>
        )}
      </ChatInner>

      {deleteAttachmentTarget && (
        <ModalOverlay
          onClick={() => {
            setDeleteAttachmentTarget(null);
          }}
        >
          <ModalCard
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ModalTitle>Remove attachment</ModalTitle>
            <ModalSubtitle>
              {`This will remove "${deleteAttachmentTarget.title}" from this message.`}
            </ModalSubtitle>

            <ModalActions>
              <ModalSecondaryButton
                type="button"
                onClick={() => setDeleteAttachmentTarget(null)}
              >
                Cancel
              </ModalSecondaryButton>

              <ModalPrimaryButton
                type="button"
                onClick={async () => {
                  try {
                    setPendingAttachmentIds((prev) =>
                      prev.filter((id) => id !== deleteAttachmentTarget.id)
                    );

                    if (deleteAttachmentTarget.filePath) {
                      try {
                        const storageRef = ref(
                          storage,
                          deleteAttachmentTarget.filePath
                        );
                        await deleteObject(storageRef);
                      } catch (e2) {
                        console.warn(
                          "Failed to delete attachment file from Storage",
                          e2
                        );
                      }
                    }

                    const attachmentRef = doc(
                      firestore,
                      "vetAiCases",
                      caseId,
                      "attachments",
                      deleteAttachmentTarget.id
                    );
                    await deleteDoc(attachmentRef);
                  } catch (err) {
                    console.error("Failed to remove attachment", err);
                    alert("Could not remove attachment. Please try again.");
                  } finally {
                    setDeleteAttachmentTarget(null);
                  }
                }}
              >
                Delete
              </ModalPrimaryButton>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </ChatPane>
  );
}

/* ---------- Main component ---------- */

export default function AiLibraryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [cases, setCases] = useState([]);
  const [sources, setSources] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState("");

  const [activeCaseChats, setActiveCaseChats] = useState([]);
  const patientListRef = useRef(null); // ✨ NEW

  const [openRowMenu, setOpenRowMenu] = useState(null); // { type: 'patient' | 'chat', id }
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [editingPatientName, setEditingPatientName] = useState("");

  const [editingChatId, setEditingChatId] = useState(null);
  const [editingChatCaseId, setEditingChatCaseId] = useState(null);
  const [editingChatTitle, setEditingChatTitle] = useState("");
  const [editingChatOrigin, setEditingChatOrigin] = useState(null); // 'sidebar' | 'main'

  const [deleteTarget, setDeleteTarget] = useState(null); // { type, id, caseId?, name }
  const [rowMenu, setRowMenu] = useState(null);
  const [personalChats, setPersonalChats] = useState([]);
  const [editingPersonalChatId, setEditingPersonalChatId] = useState(null);
  const [editingPersonalChatTitle, setEditingPersonalChatTitle] = useState("");

  // track which personal chat is active from URL
  const personalChatMatch = location.pathname.match(
    /\/ai\/library\/personal\/([^/]+)/
  );
  const activePersonalChatIdFromUrl = personalChatMatch
    ? personalChatMatch[1]
    : null;

  const libraryFileInputRef = useRef(null); // ✨ NEW

  const caseMatch = location.pathname.match(/\/ai\/library\/p\/([^/]+)/);
  const activeCaseIdFromUrl = caseMatch ? caseMatch[1] : null;

  const chatMatch = location.pathname.match(
    /\/ai\/library\/p\/[^/]+\/c\/([^/]+)/
  );
  const activeChatIdFromUrl = chatMatch ? chatMatch[1] : null;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setCurrentUser(firebaseUser);

      if (!firebaseUser) {
        setCustomerData(null);
        setCases([]);
        setActiveCaseChats([]);
        console.log("No user signed in");
        return;
      }

      try {
        const customerRef = doc(firestore, "customers", firebaseUser.uid);
        const snap = await getDoc(customerRef);

        if (snap.exists()) {
          const data = { uid: firebaseUser.uid, ...snap.data() };
          setCustomerData(data);
          console.log("Customer data:", data);
        } else {
          console.log("No customer document found for uid:", firebaseUser.uid);
        }
      } catch (err) {
        console.error("Error loading customer document:", err);
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!patientListRef.current) return;
    if (!activeCaseIdFromUrl) return;

    // Find the index of the active case
    const idx = cases.findIndex((c) => c.id === activeCaseIdFromUrl);
    if (idx === -1) return;

    const isLast = idx === cases.length - 1;

    // Only auto scroll when the last patient has chats and the list is scrollable
    if (isLast && activeCaseChats.length > 0) {
      const container = patientListRef.current;

      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [activeCaseIdFromUrl, activeCaseChats.length, cases]);

  useEffect(() => {
    if (!currentUser) return;

    const qCases = query(
      collection(firestore, "vetAiCases"),
      where("vetUid", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(qCases, (snap) => {
      const rows = [];
      snap.forEach((docSnap) =>
        rows.push({ id: docSnap.id, ...docSnap.data() })
      );
      setCases(rows);
    });

    return () => unsub();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || !activeCaseIdFromUrl) {
      setActiveCaseChats([]);
      return;
    }

    // Immediately clear previous case's chats so they don't flash
    setActiveCaseChats([]);

    const chatsCol = collection(
      firestore,
      "vetAiCases",
      activeCaseIdFromUrl,
      "chats"
    );
    const qChats = query(chatsCol, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(qChats, (snap) => {
      const rows = [];
      snap.forEach((docSnap) =>
        rows.push({ id: docSnap.id, ...docSnap.data() })
      );
      setActiveCaseChats(rows);
    });

    return () => unsub();
  }, [currentUser, activeCaseIdFromUrl]);

  useEffect(() => {
    if (!currentUser) return;

    const qSources = query(
      collection(firestore, "vetLibrarySources"),
      where("vetUid", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(qSources, (snap) => {
      const rows = [];
      snap.forEach((docSnap) =>
        rows.push({ id: docSnap.id, ...docSnap.data() })
      );
      setSources(rows);
    });

    return () => unsub();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      setPersonalChats([]);
      return;
    }

    const personalChatsCol = collection(
      firestore,
      "vetPersonalChats",
      currentUser.uid,
      "chats"
    );

    const qPersonal = query(personalChatsCol, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(qPersonal, (snap) => {
      const rows = [];
      snap.forEach((docSnap) =>
        rows.push({ id: docSnap.id, ...docSnap.data() })
      );
      setPersonalChats(rows);
    });

    return () => unsub();
  }, [currentUser]);

  const openRowMenuForPatient = (event, patient) => {
    const rect = event.currentTarget.getBoundingClientRect();
    let left = rect.right + 8;
    let top = rect.top + rect.height / 2;

    const cardWidth = 220;
    const cardHeight = 140;

    if (left + cardWidth > window.innerWidth - 8) {
      left = window.innerWidth - cardWidth - 8;
    }
    if (top + cardHeight / 2 > window.innerHeight - 8) {
      top = window.innerHeight - cardHeight / 2 - 8;
    }
    if (top - cardHeight / 2 < 8) {
      top = cardHeight / 2 + 8;
    }

    setRowMenu({
      kind: "patient",
      id: patient.id,
      name: patient.patientName || "Untitled patient",
      x: left,
      y: top,
    });
  };

  const openRowMenuForChat = (event, caseId, chat, origin = "sidebar") => {
    const rect = event.currentTarget.getBoundingClientRect();
    let left = rect.right + 8;
    let top = rect.top + rect.height / 2;

    const cardWidth = 220;
    const cardHeight = 140;

    if (left + cardWidth > window.innerWidth - 8) {
      left = window.innerWidth - cardWidth - 8;
    }
    if (top + cardHeight / 2 > window.innerHeight - 8) {
      top = window.innerHeight - cardHeight / 2 - 8;
    }
    if (top - cardHeight / 2 < 8) {
      top = cardHeight / 2 + 8;
    }

    const baseTitle =
      chat.title ||
      (chat.lastMessagePreview
        ? chat.lastMessagePreview.slice(0, 36) + "..."
        : "Untitled chat");

    setRowMenu({
      kind: "chat",
      origin, // NEW
      id: chat.id,
      caseId,
      name: baseTitle,
      x: left,
      y: top,
    });
  };

  const openRowMenuForPersonalChat = (event, chat) => {
    const rect = event.currentTarget.getBoundingClientRect();
    let left = rect.right + 8;
    let top = rect.top + rect.height / 2;

    const cardWidth = 220;
    const cardHeight = 140;

    if (left + cardWidth > window.innerWidth - 8) {
      left = window.innerWidth - cardWidth - 8;
    }
    if (top + cardHeight / 2 > window.innerHeight - 8) {
      top = window.innerHeight - cardHeight / 2 - 8;
    }
    if (top - cardHeight / 2 < 8) {
      top = cardHeight / 2 + 8;
    }

    const baseTitle =
      chat.title ||
      (chat.lastMessagePreview
        ? chat.lastMessagePreview.slice(0, 36) + "..."
        : "Untitled chat");

    setRowMenu({
      kind: "personal",
      id: chat.id,
      name: baseTitle,
      x: left,
      y: top,
    });
  };

  const handleCreatePatientClick = () => {
    if (!currentUser) return;
    setNewPatientName("");
    setShowNewPatientModal(true);
  };

  const handleCreatePatientSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const name = newPatientName.trim();
    if (!name) return;

    try {
      const casesCol = collection(firestore, "vetAiCases");
      const docRef = await addDoc(casesCol, {
        vetUid: currentUser.uid,
        patientName: name,
        mode: "sandbox",
        petId: null,
        petSnapshot: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessagePreview: "",
      });

      setShowNewPatientModal(false);
      setNewPatientName("");

      navigate(`/ai/library/p/${docRef.id}/project`);
    } catch (err) {
      console.error("Failed to create patient:", err);
      alert("Could not create patient. Please try again.");
    }
  };

  const handleCancelNewPatient = () => {
    setShowNewPatientModal(false);
    setNewPatientName("");
  };

  const closeRowMenu = () => setOpenRowMenu(null);

  const beginRenamePatient = (patient) => {
    setRowMenu(null);
    setEditingPatientId(patient.id);
    setEditingPatientName(patient.patientName || "Untitled patient");
  };

  const beginRenameChat = (caseId, chat, origin = "sidebar") => {
    setRowMenu(null);
    setEditingChatId(chat.id);
    setEditingChatCaseId(caseId);
    setEditingChatOrigin(origin); // NEW

    const baseTitle =
      chat.title ||
      (chat.lastMessagePreview
        ? chat.lastMessagePreview.slice(0, 36) + "..."
        : "Untitled chat");
    setEditingChatTitle(baseTitle);
  };

  const beginRenamePersonalChat = (chat) => {
    setRowMenu(null);
    setEditingPersonalChatId(chat.id);
    const baseTitle =
      chat.title ||
      (chat.lastMessagePreview
        ? chat.lastMessagePreview.slice(0, 36) + "..."
        : "Untitled chat");
    setEditingPersonalChatTitle(baseTitle);
  };

  const commitPatientRename = async () => {
    if (!editingPatientId) {
      setEditingPatientId(null);
      setEditingPatientName("");
      return;
    }
    const name = editingPatientName.trim();
    if (!name || !currentUser) {
      setEditingPatientId(null);
      setEditingPatientName("");
      return;
    }

    try {
      await updateDoc(doc(firestore, "vetAiCases", editingPatientId), {
        patientName: name,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to rename patient:", err);
      alert("Could not rename patient. Please try again.");
    } finally {
      setEditingPatientId(null);
      setEditingPatientName("");
    }
  };

  const commitChatRename = async () => {
    if (!editingChatId || !editingChatCaseId) {
      setEditingChatId(null);
      setEditingChatCaseId(null);
      setEditingChatTitle("");
      setEditingChatOrigin(null); // NEW
      return;
    }
    const title = editingChatTitle.trim();
    if (!title || !currentUser) {
      setEditingChatId(null);
      setEditingChatCaseId(null);
      setEditingChatTitle("");
      setEditingChatOrigin(null); // NEW
      return;
    }

    try {
      const chatRef = doc(
        firestore,
        "vetAiCases",
        editingChatCaseId,
        "chats",
        editingChatId
      );
      await updateDoc(chatRef, {
        title,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to rename chat:", err);
      alert("Could not rename chat. Please try again.");
    } finally {
      setEditingChatId(null);
      setEditingChatCaseId(null);
      setEditingChatTitle("");
      setEditingChatOrigin(null); // NEW
    }
  };

  const commitPersonalChatRename = async () => {
    if (!editingPersonalChatId) {
      setEditingPersonalChatId(null);
      setEditingPersonalChatTitle("");
      return;
    }
    const title = editingPersonalChatTitle.trim();
    if (!title || !currentUser) {
      setEditingPersonalChatId(null);
      setEditingPersonalChatTitle("");
      return;
    }

    try {
      const chatRef = doc(
        firestore,
        "vetPersonalChats",
        currentUser.uid,
        "chats",
        editingPersonalChatId
      );
      await updateDoc(chatRef, {
        title,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to rename personal chat:", err);
      alert("Could not rename chat. Please try again.");
    } finally {
      setEditingPersonalChatId(null);
      setEditingPersonalChatTitle("");
    }
  };

  const handleInlinePersonalChatKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitPersonalChatRename();
    } else if (e.key === "Escape") {
      setEditingPersonalChatId(null);
      setEditingPersonalChatTitle("");
    }
  };

  const handleInlinePatientKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitPatientRename();
    } else if (e.key === "Escape") {
      setEditingPatientId(null);
      setEditingPatientName("");
    }
  };

  const handleInlineChatKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitChatRename();
    } else if (e.key === "Escape") {
      setEditingChatId(null);
      setEditingChatCaseId(null);
      setEditingChatTitle("");
      setEditingChatOrigin(null); // NEW
    }
  };

  const requestDeletePatient = (patient) => {
    setRowMenu(null);
    setDeleteTarget({
      type: "patient",
      id: patient.id,
      name: patient.patientName || "Untitled patient",
    });
  };

  const requestDeleteChat = (caseId, chat) => {
    setRowMenu(null);
    const title =
      chat.title ||
      (chat.lastMessagePreview
        ? chat.lastMessagePreview.slice(0, 36) + "..."
        : "Untitled chat");

    setDeleteTarget({
      type: "chat",
      id: chat.id,
      caseId,
      name: title,
    });
  };

  const requestDeletePersonalChat = (chat) => {
    setRowMenu(null);
    const baseTitle =
      chat.title ||
      (chat.lastMessagePreview
        ? chat.lastMessagePreview.slice(0, 36) + "..."
        : "Untitled chat");

    setDeleteTarget({
      type: "personalChat",
      id: chat.id,
      name: baseTitle,
    });
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || !currentUser) {
      setDeleteTarget(null);
      return;
    }

    try {
      if (deleteTarget.type === "patient") {
        await deleteDoc(doc(firestore, "vetAiCases", deleteTarget.id));

        if (activeCaseIdFromUrl === deleteTarget.id) {
          navigate("/ai/library");
        }
      } else if (deleteTarget.type === "chat") {
        const chatRef = doc(
          firestore,
          "vetAiCases",
          deleteTarget.caseId,
          "chats",
          deleteTarget.id
        );
        await deleteDoc(chatRef);

        if (
          activeCaseIdFromUrl === deleteTarget.caseId &&
          activeChatIdFromUrl === deleteTarget.id
        ) {
          navigate(`/ai/library/p/${deleteTarget.caseId}/project`);
        }
      } else if (deleteTarget.type === "personalChat") {
        const chatRef = doc(
          firestore,
          "vetPersonalChats",
          currentUser.uid,
          "chats",
          deleteTarget.id
        );
        await deleteDoc(chatRef);

        if (activePersonalChatIdFromUrl === deleteTarget.id) {
          navigate("/ai/library");
        }
      } else if (deleteTarget.type === "source") {
        // delete library PDF
        if (deleteTarget.filePath) {
          try {
            const storageRef = ref(storage, deleteTarget.filePath);
            await deleteObject(storageRef);
          } catch (err) {
            console.warn("Failed to delete storage object:", err);
          }
        }

        const srcRef = doc(firestore, "vetLibrarySources", deleteTarget.id);
        await deleteDoc(srcRef);
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert("Could not delete. Please try again.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSelectCase = (caseId) => {
    navigate(`/ai/library/p/${caseId}/project`);
  };

  const handleOpenSubchat = (caseId, chatId) => {
    navigate(`/ai/library/p/${caseId}/c/${chatId}`);
  };

  const handleSelectPersonalChat = (chatId) => {
    if (!chatId) {
      navigate("/ai/library");
      return;
    }
    navigate(`/ai/library/personal/${chatId}`);
  };

  const handleCreatePersonalChatClick = () => {
    if (!currentUser) return;
    // Do not create chat yet. First message will create chatId.
    navigate("/ai/library");
  };

  const handleLibraryUploadClick = () => {
    if (!currentUser || !libraryFileInputRef.current) return;
    libraryFileInputRef.current.click();
  };

  const handleUpload = async (e) => {
    if (!currentUser) {
      console.warn("No user, cannot upload");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const srcDocRef = await addDoc(
        collection(firestore, "vetLibrarySources"),
        {
          vetUid: currentUser.uid,
          title: file.name,
          fileName: file.name,
          kind: "unknown",
          status: "uploaded",
          errorMessage: null,
          filePath: null,
          downloadUrl: null,
          pageCount: null,
          chunkCount: null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );

      const path = `aiLibraries/${currentUser.uid}/${srcDocRef.id}.pdf`;
      const storageRef = ref(storage, path);
      const task = uploadBytesResumable(storageRef, file);

      task.on(
        "state_changed",
        null,
        async (error) => {
          console.error(error);
          await updateDoc(srcDocRef, {
            status: "error",
            errorMessage: error.message,
            updatedAt: serverTimestamp(),
          });
          setIsUploading(false);
        },
        async () => {
          const url = await getDownloadURL(storageRef);
          await updateDoc(srcDocRef, {
            status: "processing",
            filePath: path,
            downloadUrl: url,
            updatedAt: serverTimestamp(),
          });
          setIsUploading(false);
        }
      );
    } catch (err) {
      console.error("Upload failed:", err);
      setIsUploading(false);
    }
  };

  const handleDeleteSource = (source) => {
    if (!currentUser) return;

    setDeleteTarget({
      type: "source",
      id: source.id,
      name: source.title || "Untitled PDF",
      filePath: source.filePath || null,
    });
  };

  return (
    <>
      <Page>
        <Sidebar>
          <PatientsHeader>
            <PatientsTitle>Patients</PatientsTitle>
            <NewPatientButton
              type="button"
              onClick={handleCreatePatientClick}
              disabled={!currentUser}
            >
              <FiPlus />
              New
            </NewPatientButton>
          </PatientsHeader>

          <PatientList ref={patientListRef}>
            {cases.length === 0 && (
              <PatientEmptyState>
                No patients yet. Create one to start a case.
              </PatientEmptyState>
            )}
            {cases.map((c) => (
              <React.Fragment key={c.id}>
                <PatientRow
                  type="button"
                  onClick={() => {
                    if (editingPatientId === c.id) return;
                    handleSelectCase(c.id);
                  }}
                  $active={c.id === activeCaseIdFromUrl && !activeChatIdFromUrl}
                >
                  <FiUser />
                  <PatientName>
                    {editingPatientId === c.id ? (
                      <InlineEditInput
                        value={editingPatientName}
                        onChange={(e) => setEditingPatientName(e.target.value)}
                        onKeyDown={handleInlinePatientKeyDown}
                        onBlur={commitPatientRename}
                        autoFocus
                      />
                    ) : (
                      c.patientName || "Untitled patient"
                    )}
                  </PatientName>

                  <RowMenuButton
                    type="button"
                    aria-label="Patient actions"
                    $forceVisible={
                      rowMenu &&
                      rowMenu.kind === "patient" &&
                      rowMenu.id === c.id
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      openRowMenuForPatient(e, c); // <- use the patient helper and pass the patient
                    }}
                  >
                    <FiMoreHorizontal size={16} />
                  </RowMenuButton>
                </PatientRow>

                {c.id === activeCaseIdFromUrl && activeCaseChats.length > 0 && (
                  <SubchatList>
                    {activeCaseChats.map((ch) => {
                      const baseTitle =
                        ch.title ||
                        (ch.lastMessagePreview
                          ? ch.lastMessagePreview.slice(0, 36) + "..."
                          : "Untitled chat");

                      const isEditingSidebar =
                        editingChatId === ch.id &&
                        editingChatOrigin === "sidebar";

                      const displayTitle = isEditingSidebar
                        ? editingChatTitle
                        : baseTitle;

                      return (
                        <SubchatRow
                          key={ch.id}
                          type="button"
                          onClick={() => {
                            if (editingChatId === ch.id) return;
                            handleOpenSubchat(c.id, ch.id);
                          }}
                          $active={ch.id === activeChatIdFromUrl}
                        >
                          <SubchatTitle title={displayTitle}>
                            {isEditingSidebar ? (
                              <InlineEditInput
                                value={editingChatTitle}
                                onChange={(e) =>
                                  setEditingChatTitle(e.target.value)
                                }
                                onKeyDown={handleInlineChatKeyDown}
                                onBlur={commitChatRename}
                                autoFocus
                              />
                            ) : (
                              displayTitle
                            )}
                          </SubchatTitle>

                          <RowMenuButton
                            type="button"
                            aria-label="Chat actions"
                            $forceVisible={
                              rowMenu &&
                              rowMenu.kind === "chat" &&
                              rowMenu.id === ch.id
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              openRowMenuForChat(e, c.id, ch);
                            }}
                          >
                            <FiMoreHorizontal size={16} />
                          </RowMenuButton>
                        </SubchatRow>
                      );
                    })}
                  </SubchatList>
                )}
              </React.Fragment>
            ))}
          </PatientList>

          <SectionDivider />

          <PatientsHeader>
            <PatientsTitle>Notebook chats</PatientsTitle>
            <NewPatientButton
              type="button"
              onClick={handleCreatePersonalChatClick}
              disabled={!currentUser}
            >
              <FiPlus />
              New
            </NewPatientButton>
          </PatientsHeader>

          <PersonalChatList>
            {personalChats.length === 0 && (
              <PatientEmptyState>
                No personal chats yet. Ask a question to start one.
              </PatientEmptyState>
            )}
            {personalChats.map((chat) => {
              const baseTitle =
                chat.title ||
                (chat.lastMessagePreview
                  ? chat.lastMessagePreview.slice(0, 36) + "..."
                  : "Untitled chat");
              const displayTitle =
                editingPersonalChatId === chat.id
                  ? editingPersonalChatTitle
                  : baseTitle;

              return (
                <PersonalChatRow
                  key={chat.id}
                  type="button"
                  onClick={() => {
                    if (editingPersonalChatId === chat.id) return;
                    handleSelectPersonalChat(chat.id);
                  }}
                  $active={chat.id === activePersonalChatIdFromUrl}
                >
                  <FiFileText />
                  <PersonalChatTitle title={displayTitle}>
                    {editingPersonalChatId === chat.id ? (
                      <InlineEditInput
                        value={editingPersonalChatTitle}
                        onChange={(e) =>
                          setEditingPersonalChatTitle(e.target.value)
                        }
                        onKeyDown={handleInlinePersonalChatKeyDown}
                        onBlur={commitPersonalChatRename}
                        autoFocus
                      />
                    ) : (
                      displayTitle
                    )}
                  </PersonalChatTitle>

                  <RowMenuButton
                    type="button"
                    aria-label="Personal chat actions"
                    $forceVisible={
                      rowMenu &&
                      rowMenu.kind === "personal" &&
                      rowMenu.id === chat.id
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      openRowMenuForPersonalChat(e, chat);
                    }}
                  >
                    <FiMoreHorizontal size={16} />
                  </RowMenuButton>
                </PersonalChatRow>
              );
            })}
          </PersonalChatList>

          <SectionDivider />

          {/* Hidden input for library uploads */}
          <input
            type="file"
            accept="application/pdf"
            ref={libraryFileInputRef}
            style={{ display: "none" }}
            onChange={handleUpload}
            disabled={!currentUser || isUploading}
          />

          <SectionHeaderRow>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <SidebarTitle>Your library</SidebarTitle>

              <LibraryUploadButton
                type="button"
                onClick={handleLibraryUploadClick}
                disabled={!currentUser || isUploading}
                aria-label="Upload PDF to library"
              >
                <FiUpload size={14} />
                Upload
              </LibraryUploadButton>
            </div>

            <LibraryHint>
              {sources.length} file{sources.length === 1 ? "" : "s"}
              {currentUser
                ? isUploading
                  ? " • Uploading..."
                  : " • Upload PDF (books, papers)"
                : " • Log in to upload and build your library"}
            </LibraryHint>
          </SectionHeaderRow>

          <SourceList>
            {sources.length === 0 && (
              <EmptyState>
                No PDFs yet. Upload a textbook or paper to get started.
              </EmptyState>
            )}
            {sources.map((s) => {
              const created =
                s.createdAt && s.createdAt.toDate ? s.createdAt.toDate() : null;

              let statusContent = null;
              if (s.status === "ready") {
                statusContent = (
                  <>
                    <FiCheckCircle /> Indexed
                  </>
                );
              } else if (s.status === "error") {
                statusContent = (
                  <>
                    <FiAlertCircle /> Error
                  </>
                );
              } else if (s.status === "processing") {
                statusContent = "Processing";
              } else if (s.status === "uploaded") {
                statusContent = "Waiting to process";
              } else {
                statusContent = s.status || "Unknown";
              }

              return (
                <SourceRow key={s.id}>
                  <FiFileText />
                  <SourceMain>
                    <SourceTitle title={s.title}>{s.title}</SourceTitle>
                    <SourceMeta>
                      <Status $status={s.status}>{statusContent}</Status>
                      {created && (
                        <>
                          {" "}
                          •{" "}
                          {created.toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </>
                      )}
                    </SourceMeta>
                  </SourceMain>
                  <SourceActions>
                    <IconButton
                      type="button"
                      onClick={() => handleDeleteSource(s)}
                      title="Remove from library"
                    >
                      <FiTrash2 />
                    </IconButton>
                  </SourceActions>
                </SourceRow>
              );
            })}
          </SourceList>
        </Sidebar>

        <Routes>
          <Route
            path="/"
            element={<PersonalChatShell currentUser={currentUser} />}
          />
          <Route
            path="personal/:personalChatId"
            element={<PersonalChatShell currentUser={currentUser} />}
          />
          <Route
            path="p/:caseId/project"
            element={
              <ChatShell
                currentUser={currentUser}
                cases={cases}
                activeCaseChats={activeCaseChats}
                onNewPatient={handleCreatePatientClick}
                rowMenu={rowMenu} // NEW
                onOpenChatContextMenu={(e, caseId, chat) =>
                  openRowMenuForChat(e, caseId, chat, "main")
                }
                editingChatId={editingChatId}
                editingChatOrigin={editingChatOrigin}
                editingChatTitle={editingChatTitle}
                setEditingChatTitle={setEditingChatTitle}
                handleInlineChatKeyDown={handleInlineChatKeyDown}
                commitChatRename={commitChatRename}
              />
            }
          />
          <Route
            path="p/:caseId/c/:chatId"
            element={
              <ChatShell
                currentUser={currentUser}
                cases={cases}
                activeCaseChats={activeCaseChats}
                onNewPatient={handleCreatePatientClick}
                rowMenu={rowMenu} // NEW (unused in this view but OK)
                onOpenChatContextMenu={(e, caseId, chat) =>
                  openRowMenuForChat(e, caseId, chat, "main")
                }
                editingChatId={editingChatId}
                editingChatOrigin={editingChatOrigin}
                editingChatTitle={editingChatTitle}
                setEditingChatTitle={setEditingChatTitle}
                handleInlineChatKeyDown={handleInlineChatKeyDown}
                commitChatRename={commitChatRename}
              />
            }
          />
        </Routes>
      </Page>

      {showNewPatientModal && (
        <ModalOverlay onClick={handleCancelNewPatient}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalTitle>New patient</ModalTitle>
            <ModalSubtitle>
              Create a patient so you can keep this AI case separate from other
              patients.
            </ModalSubtitle>
            <ModalForm onSubmit={handleCreatePatientSubmit}>
              <ModalInput
                autoFocus
                placeholder="Patient name, for example Nala"
                value={newPatientName}
                onChange={(e) => setNewPatientName(e.target.value)}
              />
              <ModalActions>
                <ModalSecondaryButton
                  type="button"
                  onClick={handleCancelNewPatient}
                >
                  Cancel
                </ModalSecondaryButton>
                <ModalPrimaryButton
                  type="submit"
                  disabled={!newPatientName.trim()}
                >
                  Save
                </ModalPrimaryButton>
              </ModalActions>
            </ModalForm>
          </ModalCard>
        </ModalOverlay>
      )}
      {deleteTarget && (
        <ModalOverlay onClick={handleCancelDelete}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalTitle>
              {deleteTarget.type === "patient"
                ? "Delete patient"
                : deleteTarget.type === "chat"
                ? "Delete chat"
                : deleteTarget.type === "personalChat"
                ? "Delete personal chat"
                : "Delete from library"}
            </ModalTitle>

            <ModalSubtitle>
              {deleteTarget.type === "patient" &&
                `This will remove "${deleteTarget.name}" from your patient list.`}

              {deleteTarget.type === "chat" &&
                `This will remove the chat "${deleteTarget.name}" from this patient.`}

              {deleteTarget.type === "personalChat" &&
                `This will remove the personal chat "${deleteTarget.name}" from your study list.`}

              {deleteTarget.type === "source" &&
                `This will remove "${deleteTarget.name}" from your library.`}
            </ModalSubtitle>

            <ModalActions>
              <ModalSecondaryButton type="button" onClick={handleCancelDelete}>
                Cancel
              </ModalSecondaryButton>
              <ModalPrimaryButton type="button" onClick={handleConfirmDelete}>
                Delete
              </ModalPrimaryButton>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
      {rowMenu && (
        <ContextMenuBackdrop
          onClick={() => {
            setRowMenu(null);
          }}
        >
          <ContextMenuCard
            $top={rowMenu.y}
            $left={rowMenu.x}
            onClick={(e) => e.stopPropagation()}
          >
            {/* We only need Rename + Delete for now, like your use case */}
            <ContextMenuItem
              type="button"
              onClick={() => {
                if (rowMenu.kind === "patient") {
                  beginRenamePatient({
                    id: rowMenu.id,
                    patientName: rowMenu.name,
                  });
                } else if (rowMenu.kind === "chat") {
                  beginRenameChat(
                    rowMenu.caseId,
                    {
                      id: rowMenu.id,
                      title: rowMenu.name,
                      lastMessagePreview: rowMenu.name,
                    },
                    rowMenu.origin || "sidebar" // NEW
                  );
                } else if (rowMenu.kind === "personal") {
                  beginRenamePersonalChat({
                    id: rowMenu.id,
                    title: rowMenu.name,
                    lastMessagePreview: rowMenu.name,
                  });
                }
              }}
            >
              <FiEdit3 size={14} />
              <span>Rename</span>
            </ContextMenuItem>

            <ContextMenuDivider />

            <ContextMenuItemDanger
              type="button"
              onClick={() => {
                if (rowMenu.kind === "patient") {
                  requestDeletePatient({
                    id: rowMenu.id,
                    patientName: rowMenu.name,
                  });
                } else if (rowMenu.kind === "chat") {
                  requestDeleteChat(rowMenu.caseId, {
                    id: rowMenu.id,
                    title: rowMenu.name,
                    lastMessagePreview: rowMenu.name,
                  });
                } else if (rowMenu.kind === "personal") {
                  requestDeletePersonalChat({
                    id: rowMenu.id,
                    title: rowMenu.name,
                    lastMessagePreview: rowMenu.name,
                  });
                }
              }}
            >
              <FiTrash2 size={14} />
              <span>Delete</span>
            </ContextMenuItemDanger>
          </ContextMenuCard>
        </ContextMenuBackdrop>
      )}
    </>
  );
}
