// src/pages/VetUploadRecordPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  FiUploadCloud,
  FiFileText,
  FiAlertTriangle,
  FiCheckCircle,
} from "react-icons/fi";
import { doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { auth, firestore, storage } from "../lib/firebase";

const FUNCTIONS_BASE_URL =
  "https://us-central1-vetcationapp.cloudfunctions.net";

/* ----------------------------- UI pieces ----------------------------- */

const PageShell = styled.div`
  min-height: 100vh;
  background: #f3f4f6;
  padding: 32px 16px;
  display: flex;
  justify-content: center;
`;

const Card = styled.div`
  width: 100%;
  max-width: 840px;
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
  background: ${(p) => p.$bg || "#eff6ff"};
  color: ${(p) => p.$color || "#1d4ed8"};
`;

const FieldLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  margin-top: 16px;
  margin-bottom: 4px;
`;

const BodyText = styled.p`
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
  flex: ${(p) => (p.$full ? "1" : "0")};
  min-width: ${(p) => (p.$full ? "0" : "120px")};
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
  background: ${(p) => (p.$variant === "primary" ? "#2563eb" : "#e5e7eb")};
  color: ${(p) => (p.$variant === "primary" ? "#ffffff" : "#111827")};

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
  margin-top: 6px;
`;

const InlineLinkButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  font-size: 12px;
  color: #2563eb;
  cursor: pointer;
  text-decoration: underline;
`;

/* ------------------------- Header layout (two cards) ------------------------- */

const HeaderContainer = styled.div`
  display: flex;
  gap: 14px;
  align-items: stretch;
  margin: 12px 0 10px;

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

const HeaderCardBase = styled.div`
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  padding: 14px;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
`;

const PetCard = styled(HeaderCardBase)`
  flex: 1;
  min-width: 0;
`;

const OwnerCard = styled(HeaderCardBase)`
  width: 290px;

  @media (max-width: 720px) {
    width: 100%;
  }
`;

const PetHeaderRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const AvatarWrap = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 42px;
  overflow: hidden;
  background: #f3f4f6;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: #111827;
  background: #eef2ff;
  font-size: 20px;
`;

const PetInfoBlock = styled.div`
  flex: 1;
  min-width: 0;
`;

const NameRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

const PetName = styled.div`
  font-size: 18px;
  font-weight: 900;
  color: #111827;
  line-height: 1.1;
  min-width: 0;
`;

const ChipRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 800;
  background: ${(p) => p.$bg || "#f3f4f6"};
  color: #111827;
  border: 1px solid #e5e7eb;
  white-space: nowrap;
`;

const DetailGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 12px -4px 0;
`;

const DetailPill = styled.div`
  width: 50%;
  padding: 0 4px;
  margin-bottom: 8px;

  @media (max-width: 520px) {
    width: 100%;
  }
`;

const DetailLabel = styled.div`
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 2px;
`;

const DetailValue = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: #111827;
`;

const FixedRow = styled.div`
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #4b5563;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: ${(p) => p.$bg || "#d1d5db"};
`;

const OwnerTitle = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: #111827;
  margin-bottom: 10px;
`;

const OwnerRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
`;

const OwnerLabel = styled.div`
  font-size: 11px;
  color: #6b7280;
  white-space: nowrap;
`;

const OwnerValue = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #111827;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OwnerLink = styled.a`
  color: #2563eb;
  text-decoration: underline;
`;

/* ----------------------------- helpers ----------------------------- */

async function postJson(url, body) {
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });

  const data = await resp.json().catch(() => ({}));
  return { resp, data };
}

function formatDob(ts) {
  try {
    if (!ts) return null;
    const d =
      typeof ts?.toDate === "function"
        ? ts.toDate()
        : ts?.seconds
          ? new Date(ts.seconds * 1000)
          : new Date(ts);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

function initialsFromName(name) {
  const n = String(name || "").trim();
  if (!n) return "P";
  const parts = n.split(/\s+/).filter(Boolean);
  const a = (parts[0] || "").slice(0, 1).toUpperCase();
  const b = (parts[1] || "").slice(0, 1).toUpperCase();
  return a + b || "P";
}

/* ------------------------------ Page ------------------------------ */

function VetUploadRecordPage() {
  const { inviteId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = auth.currentUser;

  const [inviteState, setInviteState] = useState({
    status: "loading", // loading | not-found | expired | ok
    invite: null,
    error: null,
  });

  const [file, setFile] = useState(null);
  const [ownerNote, setOwnerNote] = useState("");
  const [aiPreview, setAiPreview] = useState(null);
  const [uploadMeta, setUploadMeta] = useState(null); // kept for your future AI flow

  const [isSendingToAI, setIsSendingToAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);

  const hasTrackedClickRef = useRef(false);

  const [contextLoading, setContextLoading] = useState(false);
  const [petProfile, setPetProfile] = useState(null);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [clinicProfile, setClinicProfile] = useState(null);

  const canUpload = !!file && inviteState.status === "ok" && !isUploading;

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

    hasTrackedClickRef.current = false;
    loadInvite();
  }, [inviteId]);

  // Track clinic clicking the link (once per page load for a valid invite)
  useEffect(() => {
    async function trackClick() {
      if (inviteState.status !== "ok") return;
      if (!inviteState.invite?.id) return;
      if (hasTrackedClickRef.current) return;

      hasTrackedClickRef.current = true;

      const params = new URLSearchParams(location.search || "");
      const src = String(params.get("src") || "unknown").toLowerCase();

      try {
        await postJson(`${FUNCTIONS_BASE_URL}/trackPetUploadInviteClick`, {
          inviteId: inviteState.invite.id,
          src,
        });
      } catch (e) {
        console.warn("trackPetUploadInviteClick failed", e);
      }
    }

    trackClick();
  }, [inviteState.status, inviteState.invite?.id, location.search]);

  // Load header context data (pet + owner + clinic)
  useEffect(() => {
    async function loadContext() {
      if (inviteState.status !== "ok") return;
      const inv = inviteState.invite || {};
      if (!inv?.petId || !inv?.ownerUid) return;

      setContextLoading(true);

      try {
        const petRef = doc(firestore, "pets", String(inv.petId));
        const ownerRef = doc(firestore, "customers", String(inv.ownerUid));
        const clinicRef = inv.clinicId
          ? doc(firestore, "clinics", String(inv.clinicId))
          : null;

        const snaps = await Promise.all([
          getDoc(petRef),
          getDoc(ownerRef),
          clinicRef ? getDoc(clinicRef) : Promise.resolve(null),
        ]);

        const petSnap = snaps[0];
        const ownerSnap = snaps[1];
        const clinicSnap = snaps[2];

        setPetProfile(
          petSnap?.exists() ? { id: petSnap.id, ...petSnap.data() } : null,
        );
        setOwnerProfile(
          ownerSnap?.exists()
            ? { id: ownerSnap.id, ...ownerSnap.data() }
            : null,
        );
        setClinicProfile(
          clinicSnap?.exists?.()
            ? { id: clinicSnap.id, ...clinicSnap.data() }
            : null,
        );
      } catch (e) {
        console.warn("Failed to load header context", e);
        setPetProfile(null);
        setOwnerProfile(null);
        setClinicProfile(null);
      } finally {
        setContextLoading(false);
      }
    }

    loadContext();
  }, [inviteState.status, inviteState.invite]);

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

  async function handleUploadToTimeline() {
    if (!canUpload || !file || inviteState.status !== "ok") return;

    try {
      setIsUploading(true);
      setUploadDone(false);

      const invite = inviteState.invite;
      const petIdLocal = invite.petId;

      const mimeType = file.type || "application/octet-stream";
      const fileNameSafe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `petRecords/${petIdLocal}/${Date.now()}_${fileNameSafe}`;

      // 1) Upload file to Storage
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);

      // 1b) If image, store download URL for UI
      let imageUrls = null;
      if (mimeType && mimeType.startsWith("image/")) {
        try {
          const downloadUrl = await getDownloadURL(storageRef);
          imageUrls = [downloadUrl];
        } catch (urlErr) {
          console.error("Failed to get download URL for image", urlErr);
        }
      }

      // 2) Create timeline record on server
      const { resp, data } = await postJson(
        `${FUNCTIONS_BASE_URL}/createPetRecordPendingFromInvite`,
        {
          inviteId: invite.id,
          storagePath,
          mimeType,
          ownerNote,
          fallbackEventDateIso: new Date().toISOString(),
          imageUrls: imageUrls || null,
          uploadedByUid: auth.currentUser?.uid || null,
        },
      );

      if (!resp.ok || !data?.ok) {
        console.warn("createPetRecordPendingFromInvite error", data);
        alert(data?.error || "Unable to upload. Please try again.");
        return;
      }

      // 3) Mark "uploaded" for this invite
      try {
        await postJson(`${FUNCTIONS_BASE_URL}/markPetUploadInviteUploaded`, {
          inviteId: invite.id,
          fileCount: 1,
        });
      } catch (e) {
        console.warn("markPetUploadInviteUploaded failed", e);
      }

      setUploadDone(true);
      alert(
        "Uploaded. The system is processing this record in the background.",
      );
      navigate("/", { replace: true });
    } catch (err) {
      console.error("handleUploadToTimeline error", err);
      alert("There was a problem uploading this record. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  const handleSignInClick = () => {
    const fullPath =
      location.pathname + (location.search || "") + (location.hash || "");
    sessionStorage.setItem("postAuthRedirectPath", fullPath);
    navigate("/login");
  };

  const { status, invite, error } = inviteState;

  // Derived display values (UI only)
  const petName = petProfile?.displayName || invite?.petName || "Pet";
  const petPhotoUrl = petProfile?.photoURL || null;
  const petBreed = petProfile?.categoryBreed?.label || null;
  const petColor = petProfile?.categoryColor?.label || null;
  const petSex = petProfile?.petSex || null;
  const petDob = formatDob(petProfile?.dob) || null;
  const isFixed =
    typeof petProfile?.isFixed === "boolean" ? petProfile.isFixed : null;
  const petType = petProfile?.type ? String(petProfile.type) : null;

  const initials = useMemo(() => initialsFromName(petName), [petName]);

  const ownerFirst = String(ownerProfile?.firstName || "").trim();
  const ownerLast = String(ownerProfile?.lastName || "").trim();
  const ownerName =
    ownerFirst || ownerLast
      ? `${ownerFirst} ${ownerLast}`.trim()
      : ownerProfile?.displayName || "Pet owner";

  const ownerEmail =
    ownerProfile?.email && String(ownerProfile.email).trim()
      ? String(ownerProfile.email).trim()
      : null;

  const ownerPhone =
    ownerProfile?.phoneNumber && String(ownerProfile.phoneNumber).trim()
      ? String(ownerProfile.phoneNumber).trim()
      : null;

  const clinicName = clinicProfile?.name || invite?.clinicName || null;
  const clinicEmail =
    clinicProfile?.email ||
    (invite?.clinicEmail ? String(invite.clinicEmail).trim() : null);

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

        {status === "loading" && (
          <BodyText>Loading invitation details...</BodyText>
        )}

        {status === "not-found" && (
          <>
            <StatusBadge $bg="#fef2f2" $color="#b91c1c">
              <FiAlertTriangle />
              Invalid link
            </StatusBadge>
            <BodyText>{error || "This upload link is not valid."}</BodyText>
          </>
        )}

        {status === "expired" && (
          <>
            <StatusBadge $bg="#fef2f2" $color="#b91c1c">
              <FiAlertTriangle />
              Link expired
            </StatusBadge>
            <BodyText>
              This upload link has expired. The pet owner can generate a new
              link from their app if needed.
            </BodyText>
          </>
        )}

        {status === "ok" && invite && (
          <>
            <StatusBadge>
              <FiCheckCircle />
              Linked to pet medical memory
            </StatusBadge>

            {currentUser ? (
              <Small>
                Signed in as {currentUser.email || "your account"}. Uploads will
                be linked to your profile.
              </Small>
            ) : (
              <Small>
                You can upload without an account. If you already use MyPet
                Health,{" "}
                <InlineLinkButton type="button" onClick={handleSignInClick}>
                  sign in
                </InlineLinkButton>{" "}
                so this upload is linked to your clinic.
              </Small>
            )}

            {/* Two-card header */}
            <HeaderContainer>
              <PetCard>
                <OwnerTitle>Pet</OwnerTitle>

                <PetHeaderRow>
                  <AvatarWrap>
                    {petPhotoUrl ? (
                      <AvatarImg src={petPhotoUrl} alt={petName} />
                    ) : (
                      <AvatarFallback>{initials}</AvatarFallback>
                    )}
                  </AvatarWrap>

                  <PetInfoBlock>
                    <NameRow>
                      <PetName>{petName}</PetName>

                      <ChipRow>
                        {petType ? <Chip $bg="#EEF2FF">{petType}</Chip> : null}
                        {invite?.petId ? (
                          <Chip $bg="#F3F4F6">
                            ID {String(invite.petId).slice(0, 6)}
                          </Chip>
                        ) : null}
                      </ChipRow>
                    </NameRow>

                    {isFixed !== null ? (
                      <FixedRow>
                        <Dot $bg={isFixed ? "#16A34A" : "#D1D5DB"} />
                        {isFixed ? "Spayed / neutered" : "Not marked fixed"}
                      </FixedRow>
                    ) : (
                      <FixedRow>
                        <Dot $bg="#D1D5DB" />
                        Not marked fixed
                      </FixedRow>
                    )}
                  </PetInfoBlock>
                </PetHeaderRow>

                <DetailGrid>
                  <DetailPill>
                    <DetailLabel>Breed</DetailLabel>
                    <DetailValue>{petBreed || "Unknown"}</DetailValue>
                  </DetailPill>

                  <DetailPill>
                    <DetailLabel>Color</DetailLabel>
                    <DetailValue>{petColor || "Unknown"}</DetailValue>
                  </DetailPill>

                  <DetailPill>
                    <DetailLabel>Sex</DetailLabel>
                    <DetailValue>{petSex || "Unknown"}</DetailValue>
                  </DetailPill>

                  <DetailPill>
                    <DetailLabel>DOB</DetailLabel>
                    <DetailValue>{petDob || "Unknown"}</DetailValue>
                  </DetailPill>
                </DetailGrid>
              </PetCard>

              <OwnerCard>
                <OwnerTitle>Owner contact</OwnerTitle>

                <OwnerRow>
                  <OwnerLabel>Name</OwnerLabel>
                  <OwnerValue>{ownerName || "Pet owner"}</OwnerValue>
                </OwnerRow>

                <OwnerRow>
                  <OwnerLabel>Email</OwnerLabel>
                  <OwnerValue>
                    {ownerEmail ? (
                      <OwnerLink href={`mailto:${ownerEmail}`}>
                        {ownerEmail}
                      </OwnerLink>
                    ) : (
                      "Not available"
                    )}
                  </OwnerValue>
                </OwnerRow>

                <OwnerRow>
                  <OwnerLabel>Phone</OwnerLabel>
                  <OwnerValue>
                    {ownerPhone ? (
                      <OwnerLink href={`tel:${ownerPhone}`}>
                        {ownerPhone}
                      </OwnerLink>
                    ) : (
                      "Not available"
                    )}
                  </OwnerValue>
                </OwnerRow>

                {(clinicName || clinicEmail) && (
                  <>
                    <div style={{ height: 10 }} />
                    <OwnerTitle>Clinic</OwnerTitle>

                    {clinicName && (
                      <OwnerRow>
                        <OwnerLabel>Name</OwnerLabel>
                        <OwnerValue>{clinicName}</OwnerValue>
                      </OwnerRow>
                    )}

                    {clinicEmail && (
                      <OwnerRow>
                        <OwnerLabel>Email</OwnerLabel>
                        <OwnerValue>{clinicEmail}</OwnerValue>
                      </OwnerRow>
                    )}
                  </>
                )}

                <Small>
                  {contextLoading
                    ? "Loading details..."
                    : "If anything looks wrong, please confirm with the pet owner before uploading."}
                </Small>
              </OwnerCard>
            </HeaderContainer>

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

            {aiPreview && (
              <PreviewBox>
                <PreviewTitle>System preview ready</PreviewTitle>

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
              <Button
                $variant="primary"
                $full
                disabled={!canUpload}
                onClick={handleUploadToTimeline}
              >
                {isUploading
                  ? "Uploading..."
                  : `Upload to ${petName}'s medical profile`}
              </Button>
            </ButtonRow>

            <Small>
              After upload, the system will generate the summary and index the
              document in the background. You can close this page.
            </Small>
          </>
        )}
      </Card>
    </PageShell>
  );
}

export default VetUploadRecordPage;
