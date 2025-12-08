// src/pages/AiLibraryPage.jsx
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
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
  font-size: 9px;
  color: #e5e7eb;
`;

const ComposerColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

/* Layout */

const Page = styled.div`
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  height: 100vh;
  background: #020617;
  color: #e5e7eb;
  overflow-x: hidden; /* NEW */
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
  background: #181818; /* UPDATED */
  @media (max-width: 900px) {
    border-right: none;
    border-bottom: 1px solid #1f2933;
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
  font-size: 18px;
  font-weight: 600;
`;

const ModalSubtitle = styled.p`
  margin: 6px 0 16px;
  font-size: 13px;
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
  font-size: 14px;
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
  font-size: 13px;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;

  &:hover {
    background: #111827;
  }
`;

const ModalPrimaryButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 6px 16px;
  font-size: 13px;
  background: #2563eb;
  color: #fff;
  cursor: pointer;

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
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #9ca3af;
`;

const NewPatientButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #111827;
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
  max-height: 40vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PatientRow = styled.button`
  width: 100%;
  border: none;
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 13px;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  background: ${(p) => (p.$active ? "#111827" : "transparent")};
  color: #e5e7eb;

  &:hover {
    background: #111827;
  }

  svg {
    flex-shrink: 0;
  }
`;

const PatientName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PatientEmptyState = styled.div`
  font-size: 12px;
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
  font-size: 12px;
  text-align: left;
  background: ${(p) => (p.$active ? "#111827" : "transparent")};
  color: ${(p) => (p.$active ? "#e5e7eb" : "#9ca3af")};
  cursor: pointer;

  &:hover {
    background: #111827;
    color: #e5e7eb;
  }
`;

const SubchatTitle = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* Library */

const SectionDivider = styled.div`
  height: 1px;
  background: #111827;
  margin: 8px 0 4px;
`;

const SectionHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SidebarTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #9ca3af;
`;

const SidebarCount = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const UploadBox = styled.label`
  border: 1px dashed #4b5563;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  background: #181818; /* was #020617 */
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
  font-size: 11px;
  color: #6b7280;
`;

const SourceList = styled.div`
  flex: 1;
  overflow-y: auto;
  font-size: 14px;
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
  border: 1px solid #111827;
`;

const SourceMain = styled.div`
  flex: 1;
  min-width: 0;
`;

const SourceTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SourceMeta = styled.div`
  margin-top: 2px;
  font-size: 11px;
  color: #6b7280;
`;

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
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
    background: #111827;
  }

  svg {
    width: 16px;
    height: 16px;
    color: #6b7280;
  }
`;

const EmptyState = styled.div`
  font-size: 13px;
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
  margin-bottom: ${(p) => (p.$isNewChat ? "32px" : "12px")};
`;

const ChatTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const ChatSubtitle = styled.div`
  font-size: 12px;
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
  display: inline-block; /* NEW */
  max-width: 100%; /* NEW so it respects MessageContent */
  padding: 10px 12px;
  border-radius: 14px;
  font-size: 14px;
  background: ${(p) => (p.$role === "user" ? "#2563eb" : "#303030")};
  color: #e5e7eb;
  word-wrap: break-word; /* NEW */
  overflow-wrap: break-word; /* NEW */
  white-space: pre-wrap; /* NEW so short lines stay inside */
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
  background: #303030; /* match chatbox */
  border: 1px solid #424242;
  font-size: 12px;
`;

const AttachFilename = styled.span`
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AttachStatus = styled.span`
  font-size: 11px;
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
    background: #111827;
  }
`;

/* Composer row */

const InputRow = styled.form`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  align-items: flex-end;
`;

const AttachButtonWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const AttachButton = styled.button`
  border: none;
  border-radius: 999px;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #020617;
  border: 1px solid #1f2937;
  color: #e5e7eb;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: #111827;
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

const TextInput = styled.textarea`
  flex: 1;
  resize: none;
  min-height: 48px;
  max-height: 120px;
  border-radius: 10px;
  border: 1px solid #424242; /* UPDATED */
  background: #303030; /* UPDATED */
  color: #e5e7eb;
  padding: 10px 12px;
  font-size: 14px;

  &::placeholder {
    color: #9e9e9e;
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
  font-size: 13px;
  color: #6b7280;
  padding: 12px 2px;
`;

/* NEW: attachment menu, ChatGPT style */

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
  font-size: 13px;
  color: #e5e7eb;
  cursor: pointer;

  &:hover {
    background: #111827;
  }

  span {
    flex: 1;
    text-align: left;
  }
`;

const AttachMenuDivider = styled.div`
  height: 1px;
  margin: 4px 0;
  background: #111827;
`;

/* Subchat list (project history on main pane) */

const ChatListSection = styled.div`
  margin-top: 16px;
  padding-top: 8px;
  border-top: 1px solid #111827;
`;

const ChatListTitle = styled.div`
  font-size: 12px;
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
  font-size: 13px;
  text-align: left;
  background: ${(p) => (p.$active ? "#111827" : "transparent")};
  color: #e5e7eb;
  cursor: pointer;

  &:hover {
    background: #111827;
  }
`;

const ChatListItemTitle = styled.div`
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChatListItemMeta = styled.div`
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
`;
const MessageContent = styled.div`
  max-width: 68%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: ${(p) => (p.$role === "user" ? "flex-end" : "flex-start")};
`;

/* markdown helpers remain unchanged */

function normalizeTableMarkdown(input) {
  if (!input) return "";

  let out = input;

  if (/\n\|[^|\n]+\|[^|\n]+\|\n\|[-:]/.test(out)) {
    return out;
  }

  out = out.replace(/:\s*\|/g, ":\n\n|");
  out = out.replace(/\|\s+\|/g, "|\n|");

  return out;
}

function normalizeMathDelimiters(input) {
  if (!input) return "";

  const sanitizeMath = (s) => s.replace(/\|/g, "\\vert ");

  let out = input;

  out = out.replace(/\\{1,2}\[([\s\S]*?)\\{1,2}\]/g, (_, content) => {
    const inner = sanitizeMath(content.trim());
    return `\n\n$$\n${inner}\n$$\n\n`;
  });

  out = out.replace(/\\{1,2}\(([\s\S]*?)\\{1,2}\)/g, (_, content) => {
    const inner = sanitizeMath(content.trim());
    return `$${inner}$`;
  });

  return out;
}

function normalizeMarkdown(input) {
  if (!input) return "";
  const withMath = normalizeMathDelimiters(input);
  const withTables = normalizeTableMarkdown(withMath);

  return withTables;
}

function AssistantMessageBubble({ message }) {
  const { content, sources } = message;

  const baseMarkdownProps = {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeKatex],
    components: {
      p: ({ node, ...props }) => (
        <p style={{ margin: "0 0 6px 0" }} {...props} />
      ),
      h1: ({ node, ...props }) => (
        <h3
          style={{ margin: "10px 0", fontSize: 20, fontWeight: 700 }}
          {...props}
        />
      ),
      h2: ({ node, ...props }) => (
        <h4
          style={{ margin: "8px 0", fontSize: 18, fontWeight: 700 }}
          {...props}
        />
      ),
      h3: ({ node, ...props }) => (
        <h5
          style={{ margin: "6px 0", fontSize: 16, fontWeight: 600 }}
          {...props}
        />
      ),
      li: ({ node, ...props }) => <li style={{ marginLeft: 16 }} {...props} />,
      code: ({ node, inline, ...props }) =>
        inline ? (
          <code
            style={{
              background: "#020617",
              padding: "2px 4px",
              borderRadius: 4,
              fontSize: 12,
            }}
            {...props}
          />
        ) : (
          <pre
            style={{
              background: "#020617",
              padding: 8,
              borderRadius: 6,
              overflowX: "auto",
            }}
          >
            <code {...props} />
          </pre>
        ),
      table: ({ node, ...props }) => (
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            margin: "6px 0",
          }}
        >
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              fontSize: 12,
            }}
            {...props}
          />
        </div>
      ),
      thead: ({ node, ...props }) => (
        <thead
          style={{
            backgroundColor: "#020617",
          }}
          {...props}
        />
      ),
      th: ({ node, ...props }) => (
        <th
          style={{
            border: "1px solid #1f2937",
            padding: "4px 6px",
            textAlign: "left",
            fontWeight: 600,
          }}
          {...props}
        />
      ),
      td: ({ node, ...props }) => (
        <td
          style={{
            border: "1px solid #1f2937",
            padding: "4px 6px",
            verticalAlign: "top",
          }}
          {...props}
        />
      ),
      tr: ({ node, ...props }) => (
        <tr
          style={{
            backgroundColor: "#020617",
          }}
          {...props}
        />
      ),
    },
  };

  const normalized = normalizeMarkdown(content || "");

  return (
    <div>
      <ReactMarkdown {...baseMarkdownProps}>{normalized}</ReactMarkdown>

      {Array.isArray(sources) && sources.length > 0 && (
        <div
          style={{
            marginTop: 8,
            fontSize: 11,
            color: "#9ca3af",
          }}
        >
          Sources: {sources.map((s) => s.key).join(", ")}
        </div>
      )}
    </div>
  );
}

/* Chat shell with attachment UI */
function ChatShell({ currentUser, cases, activeCaseChats }) {
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

  const [uploadProgress, setUploadProgress] = useState({}); // <--- NEW

  const messagesEndRef = useRef(null); // new
  const isExistingChat = !!chatId; // optional helper

  const activeCase = caseId ? cases.find((c) => c.id === caseId) || null : null;

  const scrollToBottom = (behavior = "auto") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior,
        block: "end",
      });
    }
  };

  useEffect(() => {
    if (!chatId) return;
    if (messages.length === 0) return;
    scrollToBottom("auto");
  }, [chatId, messages.length]);

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

  const hasUploadingPending = caseAttachments.some(
    (att) => pendingAttachmentIds.includes(att.id) && att.status === "uploading"
  );

  const callAssistant = async (
    vetUid,
    caseIdArg,
    chatIdArg,
    convo,
    triggerMessageId
  ) => {
    try {
      const payload = {
        vetUid,
        caseId: caseIdArg,
        chatId: chatIdArg,
        messages: convo,
        triggerMessageId,
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
    } catch (err) {
      console.error("Assistant call failed:", err);
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
  const handleRemoveAttachment = async (attachment) => {
    if (!currentUser || !caseId) return;
    const ok = window.confirm(
      `Remove "${attachment.title || "attachment"}" from this message?`
    );
    if (!ok) return;

    try {
      setPendingAttachmentIds((prev) =>
        prev.filter((id) => id !== attachment.id)
      );

      if (attachment.filePath) {
        try {
          const storageRef = ref(storage, attachment.filePath);
          await deleteObject(storageRef);
        } catch (e2) {
          console.warn("Failed to delete attachment file from Storage", e2);
        }
      }

      const attachmentRef = doc(
        firestore,
        "vetAiCases",
        caseId,
        "attachments",
        attachment.id
      );
      await deleteDoc(attachmentRef);
    } catch (err) {
      console.error("Failed to remove attachment", err);
      alert("Could not remove attachment. Please try again.");
    }
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
      // New chat
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

        // Link pending attachments to this chat + message
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

        // Clear from composer immediately
        setPendingAttachmentIds([]);

        // Update URL so chatId is present
        navigateInner(`/ai/library/p/${caseId}/c/${newChatId}`, {
          replace: true,
        });

        const convo = [{ role: "user", content: text }];

        await callAssistant(
          currentUser.uid,
          caseId,
          newChatId,
          convo,
          messageId
        );

        scrollToBottom("smooth");
        setPendingAttachmentIds([]);
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

        await callAssistant(currentUser.uid, caseId, chatId, convo, messageId);

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
        <ChatHeader $isNewChat={isNewChat}>
          {activeCase ? (
            <>
              <ChatTitle>{activeCase.patientName}</ChatTitle>
              <ChatSubtitle>
                {chatId
                  ? "AI conversation for this patient."
                  : "Start a new chat for this patient, or open a previous one."}
              </ChatSubtitle>
            </>
          ) : (
            <>
              <ChatTitle>Start with a patient</ChatTitle>
              <ChatSubtitle>
                Create or select a patient on the left to start a case
                conversation.
              </ChatSubtitle>
            </>
          )}
        </ChatHeader>

        {!activeCase && (
          <ChatEmptyState>
            Choose a patient from the left sidebar to get started.
          </ChatEmptyState>
        )}

        {activeCase && !chatId && (
          <>
            <InputRow onSubmit={handleSubmit}>
              <AttachButtonWrapper>
                <AttachButton
                  type="button"
                  onClick={handleToggleAttachMenu}
                  disabled={!currentUser || !caseId}
                >
                  <FiPlus />
                </AttachButton>

                {attachMenuOpen && (
                  <AttachMenu $direction="down">
                    <AttachMenuItem
                      type="button"
                      onClick={handleAttachFilesClick}
                    >
                      <FiPaperclip />
                      <span>Add lab report / PDF</span>
                    </AttachMenuItem>
                    {/* <AttachMenuDivider /> */}
                    {/* <AttachMenuItem type="button">
                      <FiSearch />
                      <span>Deep research</span>
                    </AttachMenuItem> */}

                    {/* <AttachMenuDivider /> */}
                    {/* <AttachMenuItem type="button">
                      <FiMoreHorizontal />
                      <span>More</span>
                    </AttachMenuItem> */}
                  </AttachMenu>
                )}
              </AttachButtonWrapper>

              <ComposerColumn>
                {renderAttachBar()}
                <TextInput
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleComposerKeyDown}
                  placeholder="New chat for this patient, for example: 'Help me interpret today's lab panel...'"
                  disabled={!currentUser}
                />
              </ComposerColumn>

              <SendButton
                type="submit"
                disabled={
                  !currentUser || !messageInput.trim() || hasUploadingPending
                }
              >
                <FiSend />
                Send
              </SendButton>
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
                    return (
                      <ChatListItem
                        key={ch.id}
                        type="button"
                        onClick={() => handleOpenChat(ch.id)}
                        $active={ch.id === chatId}
                      >
                        <ChatListItemTitle title={title}>
                          {title}
                        </ChatListItemTitle>
                        <ChatListItemMeta>
                          {created &&
                            created.toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                        </ChatListItemMeta>
                      </ChatListItem>
                    );
                  })}
                </ChatList>
              )}
            </ChatListSection>
          </>
        )}

        {activeCase && chatId && (
          <>
            {messages.length === 0 ? (
              <ChatEmptyState>Loading conversation…</ChatEmptyState>
            ) : (
              <Messages>
                {messages.map((m) => {
                  const messageAttachments = caseAttachments.filter(
                    (att) => att.chatId === chatId && att.messageId === m.id
                  );

                  return (
                    <MessageRow key={m.id} $role={m.role}>
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
                <div ref={messagesEndRef} /> {/* new sentinel */}
              </Messages>
            )}

            {/* {renderAttachBar()} */}

            <InputRow onSubmit={handleSubmit}>
              <AttachButtonWrapper>
                <AttachButton
                  type="button"
                  onClick={handleToggleAttachMenu}
                  disabled={!currentUser || !caseId}
                >
                  <FiPlus />
                </AttachButton>

                {attachMenuOpen && (
                  <AttachMenu $direction="up">
                    <AttachMenuItem
                      type="button"
                      onClick={handleAttachFilesClick}
                    >
                      <FiPaperclip />
                      <span>Add lab report / PDF</span>
                    </AttachMenuItem>
                    {/* <AttachMenuDivider /> */}
                    {/* <AttachMenuItem type="button">
                      <FiSearch />
                      <span>Deep research</span>
                    </AttachMenuItem> */}

                    {/* <AttachMenuDivider /> */}
                    {/* <AttachMenuItem type="button">
                      <FiMoreHorizontal />
                      <span>More</span>
                    </AttachMenuItem> */}
                  </AttachMenu>
                )}
              </AttachButtonWrapper>

              <ComposerColumn>
                {renderAttachBar()}
                <TextInput
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleComposerKeyDown}
                  placeholder="Ask anything about this patient's case or lab panel..."
                  disabled={!currentUser}
                />
              </ComposerColumn>

              <SendButton
                type="submit"
                disabled={
                  !currentUser || !messageInput.trim() || hasUploadingPending
                }
              >
                <FiSend />
                Send
              </SendButton>
            </InputRow>
          </>
        )}
      </ChatInner>
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

  const handleSelectCase = (caseId) => {
    navigate(`/ai/library/p/${caseId}/project`);
  };

  const handleOpenSubchat = (caseId, chatId) => {
    navigate(`/ai/library/p/${caseId}/c/${chatId}`);
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

  const handleDeleteSource = async (source) => {
    if (!currentUser) return;
    if (!window.confirm(`Remove "${source.title}" from your library?`)) {
      return;
    }

    try {
      if (source.filePath) {
        const storageRef = ref(storage, source.filePath);
        try {
          await deleteObject(storageRef);
        } catch (err) {
          console.warn("Failed to delete storage object:", err);
        }
      }

      const srcRef = doc(firestore, "vetLibrarySources", source.id);
      await deleteDoc(srcRef);
    } catch (err) {
      console.error("Failed to delete source:", err);
      alert("Could not delete this item. Please try again.");
    }
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

          <PatientList>
            {cases.length === 0 && (
              <PatientEmptyState>
                No patients yet. Create one to start a case.
              </PatientEmptyState>
            )}
            {cases.map((c) => (
              <React.Fragment key={c.id}>
                <PatientRow
                  type="button"
                  onClick={() => handleSelectCase(c.id)}
                  $active={c.id === activeCaseIdFromUrl && !activeChatIdFromUrl}
                >
                  <FiUser />
                  <PatientName>
                    {c.patientName || "Untitled patient"}
                  </PatientName>
                </PatientRow>

                {c.id === activeCaseIdFromUrl && activeCaseChats.length > 0 && (
                  <SubchatList>
                    {activeCaseChats.map((ch) => {
                      const title =
                        ch.title ||
                        (ch.lastMessagePreview
                          ? ch.lastMessagePreview.slice(0, 36) + "..."
                          : "Untitled chat");
                      return (
                        <SubchatRow
                          key={ch.id}
                          type="button"
                          onClick={() => handleOpenSubchat(c.id, ch.id)}
                          $active={ch.id === activeChatIdFromUrl}
                        >
                          <SubchatTitle title={title}>{title}</SubchatTitle>
                        </SubchatRow>
                      );
                    })}
                  </SubchatList>
                )}
              </React.Fragment>
            ))}
          </PatientList>

          <SectionDivider />

          <SectionHeaderRow>
            <SidebarTitle>Your library</SidebarTitle>
            <SidebarCount>
              {sources.length} file{sources.length === 1 ? "" : "s"}
            </SidebarCount>
          </SectionHeaderRow>

          <UploadBox>
            <FiUpload size={18} />
            <div>Upload PDF (books, papers)</div>
            <UploadHint>
              {currentUser
                ? isUploading
                  ? "Uploading..."
                  : "Files will appear in your library below"
                : "Log in to upload and build your library"}
            </UploadHint>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleUpload}
              disabled={!currentUser || isUploading}
            />
          </UploadBox>

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
            element={
              <ChatShell
                currentUser={currentUser}
                cases={cases}
                activeCaseChats={activeCaseChats}
              />
            }
          />
          <Route
            path="p/:caseId/project"
            element={
              <ChatShell
                currentUser={currentUser}
                cases={cases}
                activeCaseChats={activeCaseChats}
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
    </>
  );
}
