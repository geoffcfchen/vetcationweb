// src/pages/VetUploadRecordPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  FiUploadCloud,
  FiFileText,
  FiAlertTriangle,
  FiCheckCircle,
} from "react-icons/fi";
import { doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

import { auth, firestore, storage } from "../lib/firebase";

const FUNCTIONS_BASE_URL =
  "https://us-central1-vetcationapp.cloudfunctions.net";

const PageShell = styled.div`
  min-height: 100vh;
  background: #f3f4f6;
  padding: 32px 16px;
  display: flex;
  justify-content: center;
`;

const Card = styled.div`
  width: 100%;
  max-width: 720px;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  margin: 0;
`;

const Subtitle = styled.p`
  margin: 0 0 16px;
  font-size: 14px;
  color: #6b7280;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  margin-bottom: 16px;
  background: ${(p) => p.bg || "#eff6ff"};
  color: ${(p) => p.color || "#1d4ed8"};
`;

const FieldLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  margin-top: 16px;
  margin-bottom: 4px;
`;

const Text = styled.p`
  font-size: 13px;
  color: #4b5563;
  margin: 0 0 8px;
`;

const FileBox = styled.label`
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
  cursor: pointer;
  background: #fafafa;

  &:hover {
    border-color: #6b7280;
    background: #f9fafb;
  }
`;

const FileInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const FileName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #111827;
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
  min-height: 80px;
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

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  flex: ${(p) => (p.full ? "1" : "0")};
  min-width: ${(p) => (p.full ? "0" : "120px")};
  padding: 10px 16px;
  border-radius: 999px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: ${(p) => (p.disabled ? 0.55 : 1)};
  background: ${(p) => (p.variant === "primary" ? "#2563eb" : "#e5e7eb")};
  color: ${(p) => (p.variant === "primary" ? "#ffffff" : "#111827")};

  &:hover {
    filter: ${(p) => (p.disabled ? "none" : "brightness(0.97)")};
  }
`;

const PreviewBox = styled.div`
  margin-top: 20px;
  padding: 14px 16px;
  border-radius: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
`;

const PreviewTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 6px;
`;

const PreviewLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-top: 6px;
`;

const PreviewValue = styled.div`
  font-size: 13px;
  color: #111827;
  margin-top: 2px;
`;

const Small = styled.div`
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
`;

function VetUploadRecordPage() {
  const { inviteId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [inviteState, setInviteState] = useState({
    status: "loading", // loading | not-found | expired | ok
    invite: null,
    error: null,
  });

  const [file, setFile] = useState(null);
  const [ownerNote, setOwnerNote] = useState("");
  const [aiPreview, setAiPreview] = useState(null);
  const [uploadMeta, setUploadMeta] = useState(null); // { storagePath, mimeType, mode }

  const [isSendingToAI, setIsSendingToAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Gate: if not logged in, send to login and set redirect
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      const fullPath =
        location.pathname + (location.search || "") + (location.hash || "");
      sessionStorage.setItem("postAuthRedirectPath", fullPath);
      navigate("/login", { replace: true });
    }
  }, [navigate, location]);

  // Load invite document
  useEffect(() => {
    async function loadInvite() {
      if (!inviteId) {
        setInviteState({
          status: "not-found",
          invite: null,
          error: "Missing invite id",
        });
        return;
      }

      try {
        const refDoc = doc(firestore, "petRecordUploadInvites", inviteId);
        const snap = await getDoc(refDoc);

        if (!snap.exists()) {
          setInviteState({
            status: "not-found",
            invite: null,
            error: "Invite not found",
          });
          return;
        }

        const data = snap.data() || {};
        const now = new Date();
        let expired = false;

        if (data.status && data.status !== "active") {
          expired = true;
        }

        if (data.expiresAt && data.expiresAt.toDate) {
          if (data.expiresAt.toDate() < now) {
            expired = true;
          }
        }

        if (expired) {
          setInviteState({
            status: "expired",
            invite: data,
            error: "This link has expired",
          });
        } else {
          setInviteState({
            status: "ok",
            invite: { id: inviteId, ...data },
            error: null,
          });
        }
      } catch (err) {
        console.error("Failed to load invite", err);
        setInviteState({
          status: "not-found",
          invite: null,
          error: err.message || "Failed to load invite",
        });
      }
    }

    loadInvite();
  }, [inviteId]);

  const canSendToAI =
    !!file && !isSendingToAI && !aiPreview && inviteState.status === "ok";
  const canSave = !!aiPreview && !!uploadMeta && !isSaving;

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setAiPreview(null);
    setUploadMeta(null);
  };

  async function handleSendToAI() {
    if (!canSendToAI || !file || inviteState.status !== "ok") return;

    try {
      setIsSendingToAI(true);
      const invite = inviteState.invite;
      const petId = invite.petId;
      const petName = invite.petName || "this pet";

      const mimeType = file.type || "application/octet-stream";
      const fileNameSafe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `petRecords/${petId}/${Date.now()}_${fileNameSafe}`;

      // 1) Upload file to Storage
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);

      // 2) Call previewPetRecordSummary
      const fallbackEventDateIso = new Date().toISOString();

      const resp = await fetch(
        `${FUNCTIONS_BASE_URL}/previewPetRecordSummary`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            petId,
            petName,
            storagePath,
            mimeType,
            ownerNote,
            fallbackEventDateIso,
          }),
        }
      );

      const data = await resp.json();

      if (!resp.ok || !data.ok) {
        console.warn("previewPetRecordSummary error", data);
        alert(data.error || "Unable to get AI preview. Please try again.");
        setIsSendingToAI(false);
        return;
      }

      const preview = data.preview || {};

      const nextPreview = {
        summaryText: preview.summaryText,
        eventDateIso: preview.eventDateIso,
        recordType: preview.recordType,
        eventDateSource: preview.eventDateSource,
        rawTextForEmbedding: preview.rawTextForEmbedding,
      };

      setAiPreview(nextPreview);
      setUploadMeta({
        storagePath,
        mimeType,
        mode: data.mode || "vet_upload",
      });
    } catch (err) {
      console.error("Send to AI error", err);
      alert("There was a problem sending this file to AI. Please try again.");
    } finally {
      setIsSendingToAI(false);
    }
  }

  async function handleSaveToTimeline() {
    if (!canSave || inviteState.status !== "ok") return;

    try {
      setIsSaving(true);
      const invite = inviteState.invite;
      const { storagePath, mimeType, mode } = uploadMeta;

      const resp = await fetch(
        `${FUNCTIONS_BASE_URL}/savePetRecordToTimeline`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ownerUid: invite.ownerUid || null,
            petId: invite.petId,
            petName: invite.petName || null,
            storagePath,
            mimeType,
            mode,
            ownerNote,
            fallbackEventDateIso: new Date().toISOString(),
            aiPreview,
            uploadedByUid: auth.currentUser?.uid || null,
          }),
        }
      );

      const data = await resp.json();

      if (!resp.ok || !data.ok) {
        console.warn("savePetRecordToTimeline error", data);
        alert(data.error || "Unable to save this record. Please try again.");
        setIsSaving(false);
        return;
      }

      // Optional: mark invite as used in Firestore on the client
      // or do it in Cloud Functions when you see uploadedByRole === "vet"

      alert("Record saved to the pet's medical memory.");
      navigate("/", { replace: true });
    } catch (err) {
      console.error("SaveToTimeline error", err);
      alert("There was a problem saving this record. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  const { status, invite, error } = inviteState;

  return (
    <PageShell>
      <Card>
        <TitleRow>
          <FiUploadCloud size={24} />
          <Title>Upload records into medical memory</Title>
        </TitleRow>
        <Subtitle>
          This page lets you upload a lab report or document directly into the
          pet owner account that shared this link with you.
        </Subtitle>

        {status === "loading" && <Text>Loading invitation details...</Text>}

        {status === "not-found" && (
          <>
            <StatusBadge bg="#fef2f2" color="#b91c1c">
              <FiAlertTriangle />
              Invalid link
            </StatusBadge>
            <Text>{error || "This upload link is not valid."}</Text>
          </>
        )}

        {status === "expired" && (
          <>
            <StatusBadge bg="#fef2f2" color="#b91c1c">
              <FiAlertTriangle />
              Link expired
            </StatusBadge>
            <Text>
              This upload link has expired. The pet owner can generate a new
              link from their app if needed.
            </Text>
          </>
        )}

        {status === "ok" && invite && (
          <>
            <StatusBadge>
              <FiCheckCircle />
              Linked to pet medical memory
            </StatusBadge>
            <Text>
              Records uploaded here will be attached to the medical memory for{" "}
              <strong>{invite.petName || "this pet"}</strong>.
            </Text>

            <FieldLabel>1. Select a file</FieldLabel>
            <FileBox>
              <FiFileText size={20} />
              <FileInfo>
                <FileName>
                  {file ? file.name : "Click to choose a PDF or image"}
                </FileName>
                <FileHint>Supported: PDF, JPEG, PNG, other images</FileHint>
              </FileInfo>
              <HiddenFileInput
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileChange}
              />
            </FileBox>

            <FieldLabel>2. Brief note (optional)</FieldLabel>
            <TextArea
              value={ownerNote}
              onChange={(e) => setOwnerNote(e.target.value)}
              placeholder="Example: CBC and chemistry from ER visit on Jan 28"
            />
            <Small>
              This note is stored and also helps AI interpret the record.
            </Small>

            {aiPreview && (
              <PreviewBox>
                <PreviewTitle>AI preview ready</PreviewTitle>

                <PreviewLabel>Detected type</PreviewLabel>
                <PreviewValue>{aiPreview.recordType || "Unknown"}</PreviewValue>

                <PreviewLabel>Summary</PreviewLabel>
                <PreviewValue>{aiPreview.summaryText}</PreviewValue>

                <Small>
                  You can adjust details later inside the pet medical memory.
                </Small>
              </PreviewBox>
            )}

            <ButtonRow>
              {!aiPreview ? (
                <Button
                  variant="primary"
                  full
                  disabled={!canSendToAI}
                  onClick={handleSendToAI}
                >
                  {isSendingToAI ? "Sending to AI..." : "Send to AI"}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  full
                  disabled={!canSave}
                  onClick={handleSaveToTimeline}
                >
                  {isSaving ? "Saving..." : "Save to timeline"}
                </Button>
              )}
            </ButtonRow>

            <Small>
              Nothing is saved to the pet record until you click “Save to
              timeline”.
            </Small>
          </>
        )}
      </Card>
    </PageShell>
  );
}

export default VetUploadRecordPage;
