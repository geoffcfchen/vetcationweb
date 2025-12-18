// src/pages/AiLibraryPage.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
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
  FiEdit3,
  FiGlobe,
  FiLogOut,
  FiRefreshCw, // NEW
} from "react-icons/fi";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import "katex/dist/katex.min.css";

import {
  extractCitationKeysFromMarkdown,
  extractCitationKeysInOrder,
} from "../../utility/citations";
import {
  normalizeLooseLists,
  normalizeMarkdown,
} from "../../utility/markdownNormalize";
import {
  normalizeSourceDescriptor,
  stripOpenAIUtmParams,
} from "../../utility/sourcesNormalize";

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
  padding: 24px 28px;
  width: 100%;
  max-width: ${({ $wide }) => ($wide ? "720px" : "420px")};
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #e5e7eb;

  /* NEW: prevent long strings from overflowing the card */
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;
`;

const ModalSubtitle = styled.p`
  margin: 6px 0 16px;
  font-size: 15px;
  color: #9ca3af;

  /* NEW: prevent long filenames from overflowing the card */
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;
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

const NewProjectButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 4px 10px; //
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

const ProjectRow = styled.button`
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

const sidebarSpinner = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const SidebarLoadingRow = styled.div`
  font-size: 14px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 2px;
`;

/* Subchats nested under patient */

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

const Bubble = styled.div`
  display: inline-block;
  max-width: 100%;
  padding: 10px 12px;
  border-radius: 14px;
  font-size: 17px;
  background: ${(p) => (p.$role === "user" ? "#303030" : "transparent")};
  color: #e5e7eb;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.6;

  /* key change */
  white-space: ${(p) => (p.$role === "user" ? "pre-wrap" : "normal")};
`;

const thinkingPulse = keyframes`
  0%, 100% { opacity: 0.4; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-1px); }
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

/* Subchat list (project history on main pane) */

/**
 * This is the styled wrapper around the markdown.
 * Important: it wraps ReactMarkdown, it does NOT wrap ReactMarkdown itself.
 */
const MarkdownWrapper = styled.div`
  /* Base typography */
  font-size: 17px;
  line-height: 1.6;

  /* Give every direct block a little breathing room */
  & > * {
    margin: 0 0 10px 0;
  }
  & > *:last-child {
    margin-bottom: 0;
  }

  /* Paragraphs */
  & p {
    margin: 0 0 12px 0;
  }

  /* Headings */
  & h1,
  & h2,
  & h3,
  & h4,
  & h5,
  & h6 {
    font-weight: 600;
    margin: 14px 0 8px 0;
    line-height: 1.3;
  }

  & h1:first-child,
  & h2:first-child,
  & h3:first-child {
    margin-top: 0;
  }

  /* Title scale */
  & h1 {
    font-size: 1.55rem;
  }
  & h2 {
    font-size: 1.32rem;
  }
  & h3 {
    font-size: 1.25rem;
  } /* <-- this makes "Clinical Summary" bigger */
  & h4 {
    font-size: 1.08rem;
  }
  & h5 {
    font-size: 1.02rem;
  }
  & h6 {
    font-size: 0.98rem;
  }

  /* Lists */
  & ul,
  & ol {
    margin: 8px 0 10px 0;
    padding-left: 1.4rem;
  }
  & li {
    margin: 4px 0;
  }

  /* Links */
  & a {
    color: #93c5fd;
    text-decoration: underline;
  }

  /* Blockquote */
  & blockquote {
    border-left: 3px solid #4b5563;
    margin: 12px 0;
    padding-left: 10px;
    color: #9ca3af;
    font-style: italic;
  }

  /* Horizontal rule */
  & hr {
    border: none;
    border-top: 1px solid #374151;
    margin: 14px 0;
  }

  /* Inline code */
  & code {
    background: #020617;
    padding: 2px 4px;
    border-radius: 4px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      "Liberation Mono", "Courier New", monospace;
    font-size: 0.9em;
  }

  /* Code blocks */
  & pre {
    background: #171717;
    padding: 10px 12px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 12px 0;
    font-size: 0.92em;
  }
  & pre code {
    background: transparent;
    padding: 0;
  }

  /* Tables */
  & table {
    border-collapse: collapse;
    width: 100%;
    font-size: 0.95em;
    margin: 12px 0;
  }
  & th,
  & td {
    border: 1px solid #374151;
    padding: 6px 8px;
    vertical-align: top;
  }
  & th {
    background: #111827;
    font-weight: 600;
  }
  /* Math (KaTeX) */
  & .katex-display {
    margin: 25px 0; // 25px top/bottom for display math
  }

  /* Optional: give inline math a tiny breathing room */
  & .katex {
    line-height: 1.4;
  }
`;

const ModalMarkdownWrapper = styled(MarkdownWrapper)`
  font-size: 15px;
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
  font-size: 0.8rem;
  color: #9ca3af;
  border-top: 1px solid #374151;
  padding-top: 6px;

  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
`;

const SourcesLabel = styled.span`
  font-weight: 500;
  margin-right: 4px;
`;

const SourcePills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const SourcePill = styled.button`
  border: none;
  border-radius: 999px;
  padding: 4px 8px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #111827;
  color: #e5e7eb;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background: #1f2937;
  }

  svg {
    flex-shrink: 0;
  }
`;

const SourceChunkBody = styled.div`
  margin-top: 10px;
  max-height: 360px;
  overflow-y: auto;
  font-size: 14px;
  color: #f5f5f5;
  text-align: left;

  /* key change */
  white-space: normal;

  a {
    color: #4ea3ff;
    text-decoration: underline;
  }
`;

const CitationBadge = styled.span`
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #e5e7eb;
`;

function AssistantMessageBubble({ message }) {
  const { content, sources } = message || {};
  const normalized = normalizeMarkdown(content || "");
  // jason format
  console.log(
    "Normalized assistant message content:",
    JSON.stringify(normalized, null, 2)
  );
  const [activeSource, setActiveSource] = useState(null);

  // Which citation keys are actually used in the answer text, e.g. "L1", "A1", "W1"
  const usedCitationKeys = extractCitationKeysFromMarkdown(normalized);
  const citationOrder = extractCitationKeysInOrder(normalized);
  const citationRank = new Map(citationOrder.map((k, i) => [k, i]));

  const hasExplicitCitations = usedCitationKeys.size > 0;

  const allNormalizedSources = Array.isArray(sources)
    ? sources
        .map((s, index) => normalizeSourceDescriptor(s, index))
        .filter(Boolean)
    : [];

  // Only show sources that are actually cited, if citations exist.
  // Only show sources that are actually cited.
  const normalizedSources = allNormalizedSources
    .filter((src) => {
      if (!src) return false;

      if (!hasExplicitCitations) return false;
      if (!src.citationKey) return false;

      return usedCitationKeys.has(src.citationKey);
    })
    .sort((a, b) => {
      const ra = citationRank.has(a.citationKey)
        ? citationRank.get(a.citationKey)
        : 9999;
      const rb = citationRank.has(b.citationKey)
        ? citationRank.get(b.citationKey)
        : 9999;
      return ra - rb;
    });

  const handleSourceClick = (source) => {
    if (!source) return;

    // 1) Real web link: open in new tab
    if (source.sourceType === "web" && source.url) {
      window.open(source.url, "_blank", "noopener,noreferrer");
      return;
    }

    // 2) Web digest without url, library, or attachment: show modal
    if (
      source.sourceType === "library" ||
      source.sourceType === "attachment" ||
      (source.sourceType === "web" && !source.url)
    ) {
      setActiveSource(source);
      return;
    }

    // 3) Fallback: treat as link if it has a url
    if (source.url) {
      window.open(source.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
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

      {normalizedSources.length > 0 && (
        <SourcesRow>
          <SourcesLabel>References</SourcesLabel>
          <SourcePills>
            {normalizedSources.map((src) => (
              <SourcePill
                key={src.id}
                type="button"
                onClick={() => handleSourceClick(src)}
                title={`${src.citationKey || ""} ${
                  src.sourceType === "library"
                    ? src.bookTitle
                    : src.title || src.url || src.displayLabel
                }`.trim()}
              >
                <CitationBadge>{src.citationKey}</CitationBadge>

                {src.sourceType === "web" ? (
                  <FiGlobe size={12} />
                ) : (
                  <FiFileText size={12} />
                )}

                <span>{src.displayLabel}</span>
              </SourcePill>
            ))}
          </SourcePills>
        </SourcesRow>
      )}

      {activeSource &&
        (activeSource.sourceType === "library" ||
          activeSource.sourceType === "attachment" ||
          // Also allow "web" sources without a url to show as a digest modal
          (activeSource.sourceType === "web" && !activeSource.url)) && (
          <ModalOverlay
            onClick={() => {
              setActiveSource(null);
            }}
          >
            <ModalCard
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <ModalTitle>
                {activeSource.bookTitle ||
                  activeSource.title ||
                  activeSource.site ||
                  "Reference"}
              </ModalTitle>

              {activeSource.pageNumber != null && (
                <ModalSubtitle>Page {activeSource.pageNumber}</ModalSubtitle>
              )}
              <SourceChunkBody>
                {(() => {
                  const rawText =
                    activeSource.chunkText ||
                    activeSource.text ||
                    activeSource.snippet ||
                    "No text snippet is available for this reference.";

                  const noUtm = stripOpenAIUtmParams(rawText);
                  const modalMarkdown = normalizeLooseLists(noUtm);

                  return (
                    <ModalMarkdownWrapper>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                          a: ({ node, ...props }) => (
                            <a
                              {...props}
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          ),
                        }}
                      >
                        {modalMarkdown}
                      </ReactMarkdown>
                    </ModalMarkdownWrapper>
                  );
                })()}
              </SourceChunkBody>

              <ModalActions>
                {activeSource.downloadUrl && (
                  <ModalPrimaryButton
                    type="button"
                    onClick={() =>
                      window.open(
                        activeSource.downloadUrl,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    Open PDF
                  </ModalPrimaryButton>
                )}
                <ModalSecondaryButton
                  type="button"
                  onClick={() => setActiveSource(null)}
                >
                  Close
                </ModalSecondaryButton>
              </ModalActions>
            </ModalCard>
          </ModalOverlay>
        )}
    </>
  );
}

export { AssistantMessageBubble };
