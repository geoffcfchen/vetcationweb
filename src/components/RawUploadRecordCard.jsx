// src/components/RawUploadRecordCard.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FiFileText, FiImage, FiFile } from "react-icons/fi";
import { MdCheckCircle, MdErrorOutline, MdAutorenew } from "react-icons/md";

import { storage, firestore } from "../lib/firebase";
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";

function formatCreatedAt(ts) {
  if (!ts) return "";

  let date;
  if (typeof ts?.toDate === "function") {
    date = ts.toDate();
  } else if (ts instanceof Date) {
    date = ts;
  } else if (typeof ts === "string") {
    const parsed = new Date(ts);
    if (!Number.isNaN(parsed.getTime())) {
      date = parsed;
    }
  }

  if (!date) return "";

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getFileKind(record) {
  if (record.mode === "pdf") return "Uploaded PDF";
  if (record.mode === "image") return "Uploaded photo";
  return "Uploaded file";
}

function getFileName(record) {
  const path =
    typeof record.storagePath === "string"
      ? record.storagePath
      : record.uploadStoragePath || "";

  if (!path) return "File";
  const parts = path.split("/");
  return parts[parts.length - 1] || "File";
}

function getMime(record) {
  return (
    record.mimeType ||
    record.contentType ||
    record.mime ||
    record.fileType ||
    ""
  );
}

function getIndexStatusMeta(status) {
  switch (status) {
    case "ready":
      return {
        label: "System indexed",
        status: "ready",
        Icon: MdCheckCircle,
      };
    case "processing":
    case "pending":
      return {
        label: "System indexing",
        status: "processing",
        Icon: MdAutorenew,
      };
    case "error":
      return {
        label: "Index error",
        status: "error",
        Icon: MdErrorOutline,
      };
    default:
      return null;
  }
}

function getFileIconComponent(mode) {
  if (mode === "pdf") return FiFileText;
  if (mode === "image") return FiImage;
  return FiFile;
}

function getDisplayName(user) {
  if (!user) return "";
  return (
    user.displayName ||
    user.name ||
    user.fullName ||
    user.userName ||
    user.username ||
    (user.email ? user.email.split("@")[0] : "")
  );
}

function getInitialsFromUser(user) {
  const name = getDisplayName(user);
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
}

export default function RawUploadRecordCard({ record }) {
  const [isOpening, setIsOpening] = useState(false);
  const [uploader, setUploader] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  const createdAtLabel = formatCreatedAt(record?.createdAt);
  const fileKind = getFileKind(record);
  const fileName = getFileName(record);
  const mime = getMime(record);
  const indexMeta = getIndexStatusMeta(record?.indexStatus);
  const FileIcon = getFileIconComponent(record?.mode);

  const hasStoragePath =
    typeof record?.storagePath === "string" && record.storagePath.length > 0;

  const uploaderUid =
    record?.ownerUid ||
    record?.uploaderUid ||
    record?.createdByUid ||
    record?.user?.uid ||
    null;

  // Load uploader profile (for avatar)
  useEffect(() => {
    let isMounted = true;

    async function loadUploader() {
      if (!uploaderUid) {
        if (isMounted) setUploader(null);
        return;
      }

      try {
        const snap = await getDoc(doc(firestore, "customers", uploaderUid));
        if (isMounted) {
          if (snap.exists()) {
            setUploader({ id: snap.id, ...snap.data() });
          } else {
            setUploader(null);
          }
        }
      } catch (err) {
        console.error("Failed to load uploader profile", err);
        if (isMounted) setUploader(null);
      }
    }

    loadUploader();
    return () => {
      isMounted = false;
    };
  }, [uploaderUid]);

  const displayName = getDisplayName(uploader);

  // Preload image URL for image mode so we can show big inline image
  useEffect(() => {
    let isMounted = true;

    async function loadImageUrl() {
      if (!hasStoragePath || record.mode !== "image") return;

      try {
        const ref = storageRef(storage, record.storagePath);
        const url = await getDownloadURL(ref);
        if (isMounted) {
          setFileUrl(url);
        }
      } catch (err) {
        console.error("Failed to fetch image URL", err);
      }
    }

    loadImageUrl();
    return () => {
      isMounted = false;
    };
  }, [hasStoragePath, record.mode, record.storagePath]);

  const handleOpenFile = async () => {
    if (!hasStoragePath || isOpening) return;

    try {
      setIsOpening(true);
      let url = fileUrl;

      // If we do not have a cached URL yet (e.g. pdf), fetch it
      if (!url) {
        const ref = storageRef(storage, record.storagePath);
        url = await getDownloadURL(ref);
      }

      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Failed to open file from storage", err);
      alert("We could not open this document. Please try again.");
    } finally {
      setIsOpening(false);
    }
  };

  const isImage = record.mode === "image";

  return (
    <Card>
      {/* Header: avatar + name + date */}
      {uploader ? (
        <HeaderRow>
          <AvatarCircle>
            {uploader.photoURL ? (
              <AvatarImg
                src={uploader.photoURL}
                alt={displayName || "Uploader"}
              />
            ) : (
              <AvatarInitials>{getInitialsFromUser(uploader)}</AvatarInitials>
            )}
          </AvatarCircle>
          <HeaderTextCol>
            {displayName && <UploaderName>{displayName}</UploaderName>}
            {createdAtLabel && (
              <CreatedAtInline>{createdAtLabel}</CreatedAtInline>
            )}
          </HeaderTextCol>
        </HeaderRow>
      ) : (
        createdAtLabel && <CreatedAt>{createdAtLabel}</CreatedAt>
      )}

      <TagRow>
        <Tag>{fileKind}</Tag>
        {indexMeta && (
          <StatusPill $status={indexMeta.status}>
            <indexMeta.Icon className="status-icon" />
            <span>{indexMeta.label}</span>
          </StatusPill>
        )}
      </TagRow>

      {record.ownerNote && <OwnerNote>{record.ownerNote}</OwnerNote>}

      {/* For photos: big image block that is clickable */}
      {isImage && hasStoragePath && fileUrl && (
        <ImagePreviewWrapper onClick={handleOpenFile}>
          <ImagePreview src={fileUrl} alt={fileName} />
        </ImagePreviewWrapper>
      )}

      {/* For non image files: keep the compact file card */}
      {!isImage && (
        <FileCard
          as={hasStoragePath ? "button" : "div"}
          type={hasStoragePath ? "button" : undefined}
          onClick={hasStoragePath ? handleOpenFile : undefined}
          $clickable={hasStoragePath}
          disabled={isOpening}
        >
          <FileIconCircle>
            <FileIcon />
          </FileIconCircle>

          <FileMeta>
            <FileName title={fileName}>{fileName}</FileName>
            {mime && <FileMime>{mime}</FileMime>}
          </FileMeta>

          {isOpening && <SmallSpinner />}
        </FileCard>
      )}

      {record.summaryText && (
        <SummaryBlock>
          <SummaryLabel>Pet Sensei Summary</SummaryLabel>
          <SummaryText>{record.summaryText}</SummaryText>
        </SummaryBlock>
      )}
    </Card>
  );
}

/* styled components */

const Card = styled.article`
  max-width: 100%;
  box-sizing: border-box;

  border-radius: 12px;
  padding: 8px 10px 10px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
`;

/* Header */

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const AvatarCircle = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarInitials = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #374151;
`;

const HeaderTextCol = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const UploaderName = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #111827;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CreatedAtInline = styled.div`
  font-size: 11px;
  color: #6b7280;
`;

const CreatedAt = styled.div`
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 4px;
`;

/* Tag row */

const TagRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  flex-wrap: wrap;
  max-width: 100%;
`;

const Tag = styled.span`
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: #e0f2fe;
  color: #1e40af;
`;

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  border-width: 1px;
  border-style: solid;
  max-width: 100%;

  ${({ $status }) => {
    if ($status === "ready") {
      return `
        border-color: #16a34a;
        color: #166534;
        background: #dcfce7;
      `;
    }
    if ($status === "processing") {
      return `
        border-color: #6b7280;
        color: #374151;
        background: #f3f4f6;
      `;
    }
    if ($status === "error") {
      return `
        border-color: #dc2626;
        color: #991b1b;
        background: #fee2e2;
      `;
    }
    return `
      border-color: #e5e7eb;
      color: #374151;
      background: #f9fafb;
    `;
  }}

  .status-icon {
    font-size: 13px;
    flex-shrink: 0;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const OwnerNote = styled.p`
  margin: 0 0 8px;
  font-size: 13px;
  color: #111827;
  line-height: 1.4;
  word-break: break-word;
  overflow-wrap: anywhere;
`;

/* Big image preview for photos */

const ImagePreviewWrapper = styled.button`
  display: block;
  padding: 0;
  margin: 0 0 8px;
  border: none;
  background: transparent;
  width: 100%;
  max-width: 100%;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #0ea5e9;
    outline-offset: 2px;
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  max-width: 100%;
  height: auto;
  max-height: 260px;
  border-radius: 10px;
  object-fit: cover;
  display: block;
`;

/* File card for non-image files */

const FileCard = styled.div`
  max-width: 100%;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  padding: 8px 10px;
  background: #f3f4f6;
  margin-bottom: 8px;
  border: 1px solid #e5e7eb;

  ${({ $clickable }) =>
    $clickable
      ? `
    cursor: pointer;
    transition: background 0.12s ease, transform 0.08s ease;

    &:hover {
      background: #e5e7eb;
    }
    &:active {
      transform: translateY(1px);
    }
  `
      : `
    cursor: default;
  `}

  &:disabled {
    opacity: 0.65;
    cursor: default;
  }
`;

const FileIconCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #e5e7eb;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #0f172a;
  flex-shrink: 0;

  svg {
    font-size: 16px;
  }
`;

const FileMeta = styled.div`
  flex: 1;
  min-width: 0;
`;

const FileName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileMime = styled.div`
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SmallSpinner = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 2px solid #d1d5db;
  border-top-color: #0ea5e9;
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

/* Summary */

const SummaryBlock = styled.div`
  margin-top: 4px;
`;

const SummaryLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 2px;
`;

const SummaryText = styled.p`
  margin: 0;
  font-size: 13px;
  color: #111827;
  line-height: 1.45;
  word-break: break-word;
  overflow-wrap: anywhere;
`;
