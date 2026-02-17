// src/components/RawUploadRecordCard.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { FiFileText, FiImage, FiFile } from "react-icons/fi";
import { MdCheckCircle, MdErrorOutline, MdAutorenew } from "react-icons/md";

import { storage } from "../lib/firebase";
import { ref as storageRef, getDownloadURL } from "firebase/storage";

function formatCreatedAt(ts) {
  if (!ts) return "";

  let date;
  if (typeof ts.toDate === "function") {
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

export default function RawUploadRecordCard({ record }) {
  const [isOpening, setIsOpening] = useState(false);

  const createdAtLabel = formatCreatedAt(record?.createdAt);
  const fileKind = getFileKind(record);
  const fileName = getFileName(record);
  const mime = getMime(record);
  const indexMeta = getIndexStatusMeta(record?.indexStatus);
  const FileIcon = getFileIconComponent(record?.mode);

  const hasStoragePath =
    typeof record?.storagePath === "string" && record.storagePath.length > 0;

  const handleOpenFile = async () => {
    if (!hasStoragePath || isOpening) return;

    try {
      setIsOpening(true);
      const ref = storageRef(storage, record.storagePath);
      const url = await getDownloadURL(ref);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Failed to open file from storage", err);
      alert("We could not open this document. Please try again.");
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <Card>
      {createdAtLabel && <CreatedAt>{createdAtLabel}</CreatedAt>}

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

      <FileCard
        type={hasStoragePath ? "button" : "div"}
        as={hasStoragePath ? "button" : "div"}
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

      {record.summaryText && (
        <SummaryBlock>
          <SummaryLabel>Summary</SummaryLabel>
          <SummaryText>{record.summaryText}</SummaryText>
        </SummaryBlock>
      )}
    </Card>
  );
}

/* styled components */

const Card = styled.article`
  border-radius: 12px;
  padding: 8px 10px 10px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
`;

const CreatedAt = styled.div`
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 4px;
`;

const TagRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  flex-wrap: wrap;
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
  }
`;

const OwnerNote = styled.p`
  margin: 0 0 8px;
  font-size: 13px;
  color: #111827;
  line-height: 1.4;
`;

const FileCard = styled.div`
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
`;
