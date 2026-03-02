import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  FiX,
  FiCopy,
  FiShare2,
  FiRefreshCw,
  FiExternalLink,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

const FUNCTIONS_BASE_URL = (
  import.meta.env.VITE_FUNCTIONS_BASE_URL || ""
).replace(/\/+$/, "");

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

export default function PetUploadInviteModal({
  open,
  onClose,
  petId,
  petName,
  ownerUid,
}) {
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [error, setError] = useState("");

  const [copyLinkLabel, setCopyLinkLabel] = useState("Copy link");
  const [copyMsgLabel, setCopyMsgLabel] = useState("Copy message");

  const lastKeyRef = useRef("");

  const shareMessage = useMemo(() => {
    const name = petName || "my pet";
    return inviteLink
      ? `Hi doctor, here is a secure link to upload ${name}'s records to MyPet Health: ${inviteLink}`
      : "";
  }, [inviteLink, petName]);

  const createInvite = async ({ force } = { force: false }) => {
    if (!petId || !ownerUid) {
      setError(
        "Missing pet info. Please reopen this page from your pet profile.",
      );
      return;
    }
    if (!FUNCTIONS_BASE_URL) {
      setError(
        "Missing VITE_FUNCTIONS_BASE_URL. Please set it so the website can call createPetUploadInvite.",
      );
      return;
    }

    const key = `${petId}__${ownerUid}`;

    // If we already have a link for this pet+owner and not forcing, do nothing.
    if (!force && inviteLink && lastKeyRef.current === key) {
      return;
    }

    setLoading(true);
    setError("");
    setCopyLinkLabel("Copy link");
    setCopyMsgLabel("Copy message");

    try {
      const resp = await fetch(`${FUNCTIONS_BASE_URL}/createPetUploadInvite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petId,
          petName: petName || "",
          ownerUid,
        }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok || !data.ok) {
        throw new Error(
          data.error || "Could not create link. Please try again.",
        );
      }

      lastKeyRef.current = key;
      setInviteLink(data.shareUrl || "");
    } catch (e) {
      console.warn("createPetUploadInvite error:", e);
      setInviteLink("");
      setError(e?.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    // reset per open
    setError("");
    setCopyLinkLabel("Copy link");
    setCopyMsgLabel("Copy message");

    // auto-create on open (but won't regenerate if we already have one for same pet)
    createInvite({ force: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, petId, ownerUid]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const handleCopyLink = async () => {
    if (!inviteLink) return;
    const ok = await copyToClipboard(inviteLink);
    setCopyLinkLabel(ok ? "Copied" : "Copy failed");
    setTimeout(() => setCopyLinkLabel("Copy link"), 1200);
  };

  const handleCopyMessage = async () => {
    if (!shareMessage) return;
    const ok = await copyToClipboard(shareMessage);
    setCopyMsgLabel(ok ? "Copied" : "Copy failed");
    setTimeout(() => setCopyMsgLabel("Copy message"), 1200);
  };

  const handleShare = async () => {
    if (!inviteLink) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Upload records",
          text: shareMessage,
          url: inviteLink,
        });
        return;
      } catch {
        // cancelled or blocked, fall back
      }
    }

    await handleCopyMessage();
  };

  if (!open) return null;

  return (
    <Overlay onMouseDown={onClose}>
      <Card onMouseDown={(e) => e.stopPropagation()}>
        <Header>
          <Title>Share upload link</Title>
          <CloseButton type="button" onClick={onClose} aria-label="Close">
            <FiX />
          </CloseButton>
        </Header>

        <Sub>
          Create a secure link you can send to your vet or clinic to upload
          records for <b>{petName || "this pet"}</b>.
        </Sub>

        <Body>
          {loading ? (
            <LoadingBox>
              <Spinner />
              <span>Creating link...</span>
            </LoadingBox>
          ) : error ? (
            <ErrorRow>
              <FiAlertCircle />
              <span>{error}</span>
            </ErrorRow>
          ) : inviteLink ? (
            <>
              <UrlBox>
                <UrlLabel>Share link</UrlLabel>
                <LinkRow>
                  <LinkBox title={inviteLink}>{inviteLink}</LinkBox>

                  <SmallIconButton
                    type="button"
                    onClick={handleCopyLink}
                    title="Copy link"
                  >
                    <FiCopy />
                  </SmallIconButton>

                  <SmallIconButton
                    type="button"
                    onClick={() =>
                      window.open(inviteLink, "_blank", "noopener,noreferrer")
                    }
                    title="Open link"
                  >
                    <FiExternalLink />
                  </SmallIconButton>
                </LinkRow>

                <Hint>
                  View-only link for upload. You can paste it into SMS, email,
                  or chat.
                </Hint>
              </UrlBox>

              <MessageBox>
                <MessageTopRow>
                  <MessageLabel>Suggested message</MessageLabel>
                  <SmallButton
                    type="button"
                    onClick={handleCopyMessage}
                    disabled={!shareMessage}
                  >
                    <FiCheckCircle />
                    {copyMsgLabel}
                  </SmallButton>
                </MessageTopRow>

                <MessageText>{shareMessage}</MessageText>

                <TinyHint>
                  If Share is not available, we copy this message for you.
                </TinyHint>
              </MessageBox>

              <ActionsRow>
                <Secondary
                  type="button"
                  onClick={() => createInvite({ force: true })}
                  disabled={loading}
                >
                  <FiRefreshCw />
                  Regenerate
                </Secondary>

                <Primary
                  type="button"
                  onClick={handleShare}
                  disabled={!inviteLink}
                >
                  <FiShare2 />
                  Share
                </Primary>
              </ActionsRow>
            </>
          ) : (
            <Muted>No link yet.</Muted>
          )}
        </Body>
      </Card>
    </Overlay>
  );
}

PetUploadInviteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  petId: PropTypes.string,
  petName: PropTypes.string,
  ownerUid: PropTypes.string,
};

/* styles */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 80;
  background: rgba(15, 23, 42, 0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
  overflow: auto;
`;

const Header = styled.div`
  padding: 14px 16px 10px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
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

const Sub = styled.div`
  padding: 10px 16px 0;
  font-size: 13px;
  color: #64748b;
  line-height: 1.45;
`;

const Body = styled.div`
  padding: 12px 16px 16px;
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

const LinkRow = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px;
  align-items: center;
`;

const LinkBox = styled.div`
  flex: 1;
  min-width: 0;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(241, 245, 249, 1);
  font-size: 13px;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SmallIconButton = styled.button`
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: #ffffff;
  border-radius: 12px;
  padding: 10px 10px;
  cursor: pointer;
  color: #0f172a;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f8fafc;
  }
`;

const Hint = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #6b7280;
`;

const MessageBox = styled.div`
  margin-top: 12px;
  border-radius: 14px;
  background: rgba(239, 246, 255, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.22);
  padding: 12px;
`;

const MessageTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
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

const ActionsRow = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const Primary = styled.button`
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

const Secondary = styled.button`
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

  &:disabled {
    opacity: 0.6;
    cursor: default;
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

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const Muted = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: #64748b;
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

const LoadingBox = styled.div`
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(241, 245, 249, 1);
  border: 1px solid rgba(148, 163, 184, 0.22);
  color: #334155;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 2px solid #cbd5e1;
  border-top-color: #2563eb;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
