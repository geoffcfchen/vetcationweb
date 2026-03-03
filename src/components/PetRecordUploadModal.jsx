import React, { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { FiFileText, FiUploadCloud, FiX } from "react-icons/fi";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { auth, storage } from "../lib/firebase";

const FUNCTIONS_BASE_URL =
  "https://us-central1-vetcationapp.cloudfunctions.net";

export default function PetRecordUploadModal({
  open,
  onClose,
  petId,
  petName,
  ownerUid,
  mode = "owner_upload",
  title = "Upload record",
  subtitle = "Upload a PDF or photo. You will preview it with AI before saving.",
}) {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [ownerNote, setOwnerNote] = useState("");
  const [aiPreview, setAiPreview] = useState(null);
  const [uploadMeta, setUploadMeta] = useState(null); // { storagePath, mimeType, mode, imageUrls }

  const [isSendingToAI, setIsSendingToAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const canSendToAI = !!file && !isSendingToAI && !aiPreview && !!petId;
  const canSave = !!aiPreview && !!uploadMeta && !isSaving;

  const safePetName = petName || "this pet";

  const resetAll = () => {
    setFile(null);
    setOwnerNote("");
    setAiPreview(null);
    setUploadMeta(null);
    setIsSendingToAI(false);
    setIsSaving(false);
  };

  const handleClose = () => {
    resetAll();
    onClose?.();
  };

  const handlePickFile = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setAiPreview(null);
    setUploadMeta(null);
  };

  const fileLabel = useMemo(() => {
    if (!file) return "Click to choose a PDF or image";
    return file.name;
  }, [file]);

  async function handleSendToAI() {
    if (!canSendToAI || !file || !petId) return;

    try {
      setIsSendingToAI(true);

      const mimeType = file.type || "application/octet-stream";
      const fileNameSafe = (file.name || "record")
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .slice(0, 140);

      const storagePath = `petRecords/${petId}/${Date.now()}_${fileNameSafe}`;

      // 1) Upload to Storage
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);

      // 1b) For images, include download URL so timeline can render quickly
      let imageUrls = null;
      if (mimeType.startsWith("image/")) {
        try {
          const downloadUrl = await getDownloadURL(storageRef);
          imageUrls = [downloadUrl];
        } catch (err) {
          console.warn("Failed to get image download URL:", err);
        }
      }

      // 2) Preview with AI
      const fallbackEventDateIso = new Date().toISOString();

      const resp = await fetch(
        `${FUNCTIONS_BASE_URL}/previewPetRecordSummary`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            petId,
            petName: safePetName,
            storagePath,
            mimeType,
            ownerNote,
            fallbackEventDateIso,
          }),
        },
      );

      const data = await resp.json();

      if (!resp.ok || !data.ok) {
        alert(data.error || "Unable to get AI preview. Please try again.");
        return;
      }

      const preview = data.preview || {};
      setAiPreview({
        summaryText: preview.summaryText,
        eventDateIso: preview.eventDateIso,
        recordType: preview.recordType,
        eventDateSource: preview.eventDateSource,
        rawTextForEmbedding: preview.rawTextForEmbedding,
      });

      setUploadMeta({
        storagePath,
        mimeType,
        mode: data.mode || mode,
        imageUrls,
      });
    } catch (err) {
      console.error("Send to AI error:", err);
      alert("There was a problem sending this file to AI. Please try again.");
    } finally {
      setIsSendingToAI(false);
    }
  }

  async function handleSaveToTimeline() {
    if (!canSave || !petId) return;

    try {
      setIsSaving(true);

      const uploadedByUid = auth.currentUser?.uid || null;
      const fallbackEventDateIso = new Date().toISOString();

      const resp = await fetch(
        `${FUNCTIONS_BASE_URL}/savePetRecordToTimeline`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ownerUid: ownerUid || null,
            petId,
            petName: safePetName,
            storagePath: uploadMeta.storagePath,
            mimeType: uploadMeta.mimeType,
            mode: uploadMeta.mode,
            ownerNote,
            fallbackEventDateIso,
            aiPreview,
            uploadedByUid,
            imageUrls: uploadMeta.imageUrls || null,
          }),
        },
      );

      const data = await resp.json();

      if (!resp.ok || !data.ok) {
        alert(data.error || "Unable to save this record. Please try again.");
        return;
      }

      alert("Record saved.");
      handleClose();
    } catch (err) {
      console.error("SaveToTimeline error:", err);
      alert("There was a problem saving this record. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!open) return null;

  return createPortal(
    <Backdrop onClick={handleClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderLeft>
            <FiUploadCloud />
            <div>
              <ModalTitle>{title}</ModalTitle>
              <ModalSub>{subtitle}</ModalSub>
            </div>
          </HeaderLeft>

          <CloseButton type="button" onClick={handleClose} aria-label="Close">
            <FiX />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <SectionLabel>1. Select a file</SectionLabel>

          <FileBox type="button" onClick={handlePickFile}>
            <FiFileText size={18} />
            <FileInfo>
              <FileName title={fileLabel}>{fileLabel}</FileName>
              <FileHint>Supported: PDF, JPEG, PNG, other images</FileHint>
            </FileInfo>
          </FileBox>

          <HiddenFileInput
            ref={fileInputRef}
            type="file"
            accept=".pdf,image/*"
            onChange={handleFileChange}
          />

          <SectionLabel>2. Brief note (optional)</SectionLabel>
          <TextArea
            value={ownerNote}
            onChange={(e) => setOwnerNote(e.target.value)}
            placeholder="Example: CBC and chemistry from ER visit on Jan 28"
          />

          {aiPreview && (
            <PreviewBox>
              <PreviewTitle>System preview ready</PreviewTitle>

              <PreviewLabel>Detected type</PreviewLabel>
              <PreviewValue>{aiPreview.recordType || "Unknown"}</PreviewValue>

              <PreviewLabel>Summary</PreviewLabel>
              <PreviewValue>{aiPreview.summaryText}</PreviewValue>
            </PreviewBox>
          )}

          <ButtonRow>
            {!aiPreview ? (
              <PrimaryButton
                type="button"
                disabled={!canSendToAI}
                onClick={handleSendToAI}
              >
                {isSendingToAI ? "Sending to System..." : "Send to System"}
              </PrimaryButton>
            ) : (
              <PrimaryButton
                type="button"
                disabled={!canSave}
                onClick={handleSaveToTimeline}
              >
                {isSaving ? "Saving..." : "Save to timeline"}
              </PrimaryButton>
            )}

            <SecondaryButton type="button" onClick={handleClose}>
              Cancel
            </SecondaryButton>
          </ButtonRow>

          <Footnote>
            Nothing is saved until you click “Save to timeline”.
          </Footnote>
        </ModalBody>
      </ModalCard>
    </Backdrop>,
    document.body,
  );
}

/* styles */

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
  max-width: 720px;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const HeaderLeft = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;

  svg {
    margin-top: 2px;
    color: #2563eb;
  }
`;

const ModalTitle = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
`;

const ModalSub = styled.div`
  margin-top: 4px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.35;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 6px;
  border-radius: 999px;
  color: #64748b;

  &:hover {
    background: #f1f5f9;
  }

  svg {
    font-size: 18px;
  }
`;

const ModalBody = styled.div`
  padding: 14px 16px 16px;
`;

const SectionLabel = styled.div`
  font-size: 13px;
  font-weight: 800;
  margin-top: 10px;
  margin-bottom: 6px;
  color: #0f172a;
`;

const FileBox = styled.button`
  width: 100%;
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  gap: 12px;
  align-items: center;
  cursor: pointer;
  background: #fafafa;
  text-align: left;

  &:hover {
    border-color: #6b7280;
    background: #f9fafb;
  }
`;

const FileInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const FileName = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileHint = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 84px;
  font-size: 13px;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  resize: vertical;
  outline: none;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb33;
  }
`;

const PreviewBox = styled.div`
  margin-top: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
`;

const PreviewTitle = styled.div`
  font-size: 13px;
  font-weight: 900;
  margin-bottom: 8px;
`;

const PreviewLabel = styled.div`
  font-size: 12px;
  font-weight: 800;
  color: #6b7280;
  margin-top: 6px;
`;

const PreviewValue = styled.div`
  font-size: 13px;
  color: #111827;
  margin-top: 2px;
  line-height: 1.45;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 14px;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  border: none;
  background: #2563eb;
  color: #ffffff;
  border-radius: 999px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
  opacity: ${(p) => (p.disabled ? 0.55 : 1)};

  &:hover {
    filter: ${(p) => (p.disabled ? "none" : "brightness(0.97)")};
  }
`;

const SecondaryButton = styled.button`
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #111827;
  border-radius: 999px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;

  &:hover {
    background: #f9fafb;
  }
`;

const Footnote = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #94a3b8;
`;
