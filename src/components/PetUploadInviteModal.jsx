import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  FiX,
  FiCopy,
  FiShare2,
  FiRefreshCw,
  FiExternalLink,
} from "react-icons/fi";

const FUNCTIONS_BASE_URL = (
  import.meta.env.VITE_FUNCTIONS_BASE_URL || ""
).replace(/\/+$/, "");
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

  const shareMessage = useMemo(() => {
    const name = petName || "my pet";
    return inviteLink
      ? `Hi doctor, here is a secure link to upload ${name}'s records to MyPet Health: ${inviteLink}`
      : "";
  }, [inviteLink, petName]);

  const createInvite = async () => {
    if (!petId || !ownerUid) {
      setError(
        "Missing pet info. Please reopen this page from your pet profile.",
      );
      return;
    }
    if (!FUNCTIONS_BASE_URL) {
      setError(
        "Missing REACT_APP_FUNCTIONS_BASE_URL. Please set it so the website can call createPetUploadInvite.",
      );
      return;
    }

    setLoading(true);
    setError("");
    setInviteLink("");

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

      let data = {};
      try {
        data = await resp.json();
      } catch {
        data = {};
      }

      if (!resp.ok || !data.ok) {
        throw new Error(
          data.error || "Could not create link. Please try again.",
        );
      }

      setInviteLink(data.shareUrl || "");
    } catch (e) {
      console.warn("createPetUploadInvite error:", e);
      setError(e?.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    // auto-create on open
    createInvite();
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
    try {
      await navigator.clipboard.writeText(inviteLink);
    } catch (e) {
      console.warn("Clipboard failed:", e);
    }
  };

  const handleCopyMessage = async () => {
    if (!shareMessage) return;
    try {
      await navigator.clipboard.writeText(shareMessage);
    } catch (e) {
      console.warn("Clipboard failed:", e);
    }
  };

  const handleShare = async () => {
    if (!inviteLink) return;

    // Prefer native share if available
    if (navigator.share) {
      try {
        await navigator.share({
          text: shareMessage,
          url: inviteLink,
        });
        return;
      } catch (e) {
        // user cancelled, or share failed
        console.log("Share cancelled or failed:", e);
      }
    }

    // Fallback: copy message
    await handleCopyMessage();
  };

  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <Card onClick={(e) => e.stopPropagation()}>
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
            <ErrorBox>{error}</ErrorBox>
          ) : inviteLink ? (
            <>
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
                Tip: paste this into SMS or email. The message is ready too.
              </Hint>

              <ActionsRow>
                <Secondary
                  type="button"
                  onClick={createInvite}
                  disabled={loading}
                >
                  <FiRefreshCw />
                  Regenerate
                </Secondary>

                <Secondary
                  type="button"
                  onClick={handleCopyMessage}
                  disabled={!shareMessage}
                >
                  <FiCopy />
                  Copy message
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

const Hint = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #94a3b8;
`;

const Muted = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: #64748b;
`;

const ErrorBox = styled.div`
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(254, 226, 226, 1);
  border: 1px solid rgba(220, 38, 38, 0.25);
  color: #7f1d1d;
  font-size: 13px;
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
