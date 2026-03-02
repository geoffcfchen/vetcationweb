// src/components/PetSummaryShareModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  FiX,
  FiCopy,
  FiShare2,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

function copyToClipboardFallback(text) {
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    return true;
  } catch {
    return false;
  }
}

async function copyToClipboard(text) {
  if (!text) return false;

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through
    }
  }

  return copyToClipboardFallback(text);
}

export default function PetSummaryShareModal({
  open,
  onClose,
  isCreating,
  shareUrl,
  petName,
  error,
  onCreateLink,
}) {
  const [copyLabel, setCopyLabel] = useState("Copy link");

  useEffect(() => {
    if (!open) setCopyLabel("Copy link");
  }, [open]);

  const message = useMemo(() => {
    const name = petName || "my pet";
    return `Hi doctor, here is a secure link to view ${name}'s vet-ready summary: ${shareUrl}`;
  }, [petName, shareUrl]);

  if (!open) return null;

  const handleCopy = async () => {
    if (!shareUrl) return;
    const ok = await copyToClipboard(shareUrl);
    setCopyLabel(ok ? "Copied" : "Copy failed");
    setTimeout(() => setCopyLabel("Copy link"), 1200);
  };

  const handleNativeShare = async () => {
    if (!shareUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Vet-ready summary",
          text: message,
          url: shareUrl,
        });
        return;
      } catch {
        // share cancelled or blocked
      }
    }

    // Fallback: copy the message (not just the link)
    const ok = await copyToClipboard(message);
    setCopyLabel(ok ? "Copied message" : "Copy failed");
    setTimeout(() => setCopyLabel("Copy link"), 1200);
  };

  return (
    <Backdrop onMouseDown={onClose}>
      <ModalCard onMouseDown={(e) => e.stopPropagation()}>
        <HeaderRow>
          <HeaderLeft>
            <HeaderTitle>Share summary link</HeaderTitle>
            <HeaderSub>
              Send a secure view link to your vet or pet sitter.
            </HeaderSub>
          </HeaderLeft>

          <CloseButton type="button" onClick={onClose} aria-label="Close">
            <FiX />
          </CloseButton>
        </HeaderRow>

        <Body>
          {!shareUrl ? (
            <>
              <Notice>
                <FiShare2 />
                <NoticeText>
                  {isCreating
                    ? "Creating a secure share link..."
                    : "Create a link you can share with your vet."}
                </NoticeText>
              </Notice>

              {error ? (
                <ErrorRow>
                  <FiAlertCircle />
                  <span>{error}</span>
                </ErrorRow>
              ) : null}

              <PrimaryButton
                type="button"
                onClick={onCreateLink}
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create share link"}
              </PrimaryButton>
            </>
          ) : (
            <>
              <UrlBox>
                <UrlLabel>Share link</UrlLabel>
                <UrlRow>
                  <UrlText title={shareUrl}>{shareUrl}</UrlText>
                  <SmallButton type="button" onClick={handleCopy}>
                    <FiCopy />
                    {copyLabel}
                  </SmallButton>
                </UrlRow>

                <Hint>
                  This link is view-only. You can paste it into SMS, email, or
                  chat.
                </Hint>
              </UrlBox>

              <ActionsRow>
                <PrimaryButton type="button" onClick={handleNativeShare}>
                  <FiShare2 />
                  Share
                </PrimaryButton>

                <SecondaryButton type="button" onClick={handleCopy}>
                  <FiCheckCircle />
                  Copy link
                </SecondaryButton>
              </ActionsRow>

              <MessageBox>
                <MessageLabel>Suggested message</MessageLabel>
                <MessageText>{message}</MessageText>
                <TinyHint>
                  If Share is not available, we copy this message for you.
                </TinyHint>
              </MessageBox>
            </>
          )}
        </Body>
      </ModalCard>
    </Backdrop>
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 80;
  background: rgba(15, 23, 42, 0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 640px;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
  overflow: hidden;
`;

const HeaderRow = styled.div`
  padding: 14px 16px 10px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

const HeaderLeft = styled.div`
  min-width: 0;
`;

const HeaderTitle = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
`;

const HeaderSub = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: #6b7280;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 6px;
  border-radius: 999px;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f1f5f9;
  }

  svg {
    font-size: 18px;
  }
`;

const Body = styled.div`
  padding: 14px 16px 16px;
`;

const Notice = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(239, 246, 255, 0.75);
  border: 1px solid rgba(148, 163, 184, 0.22);
  color: #0f172a;

  svg {
    color: #2563eb;
    flex-shrink: 0;
  }
`;

const NoticeText = styled.div`
  font-size: 13px;
  font-weight: 700;
`;

const ErrorRow = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 8px;
  align-items: center;
  color: #b91c1c;
  font-size: 13px;

  svg {
    flex-shrink: 0;
  }
`;

const UrlBox = styled.div`
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: #ffffff;
  padding: 12px;
`;

const UrlLabel = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: #0f172a;
`;

const UrlRow = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UrlText = styled.div`
  flex: 1;
  min-width: 0;
  font-size: 12px;
  color: #1d4ed8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Hint = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #6b7280;
`;

const ActionsRow = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  border: none;
  background: #2563eb;
  color: #ffffff;
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #1d4ed8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const SecondaryButton = styled.button`
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: #ffffff;
  color: #0f172a;
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f8fafc;
  }
`;

const SmallButton = styled.button`
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: #ffffff;
  color: #0f172a;
  border-radius: 12px;
  padding: 8px 10px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  &:hover {
    background: #f8fafc;
  }
`;

const MessageBox = styled.div`
  margin-top: 12px;
  border-radius: 14px;
  background: rgba(239, 246, 255, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.22);
  padding: 12px;
`;

const MessageLabel = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: #0f172a;
`;

const MessageText = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: #0f172a;
  line-height: 1.45;
  white-space: pre-wrap;
`;

const TinyHint = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
`;
