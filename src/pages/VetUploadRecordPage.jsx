// src/pages/VetUploadRecordPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  FiUploadCloud,
  FiFileText,
  FiAlertTriangle,
  FiCheckCircle,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
  min-width: 0;
`;

const FileName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  min-height: 72px;
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

  @media (max-width: 520px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  flex: ${(p) => (p.$full ? "1" : "0")};
  min-width: ${(p) => (p.$full ? "0" : "120px")};
  padding: 10px 16px;
  border-radius: 999px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: ${(p) => (p.disabled || p.$loading ? "not-allowed" : "pointer")};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: ${(p) => (p.disabled && !p.$loading ? 0.55 : 1)};
  background: ${(p) => (p.$variant === "primary" ? "#2563eb" : "#e5e7eb")};
  color: ${(p) => (p.$variant === "primary" ? "#ffffff" : "#111827")};

  &:hover {
    filter: ${(p) => (p.disabled || p.$loading ? "none" : "brightness(0.97)")};
  }
`;

const ButtonSpinner = styled.span`
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.45);
  border-top-color: #ffffff;
  border-radius: 999px;
  display: inline-block;
  animation: buttonSpin 0.75s linear infinite;

  @keyframes buttonSpin {
    to {
      transform: rotate(360deg);
    }
  }
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

const FileRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FileRowCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 14px;
  background: #ffffff;
`;

const FileRowTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
`;

const FileRowTitle = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: #111827;
`;

const IconButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #6b7280;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  opacity: ${(p) => (p.disabled ? 0.45 : 1)};

  &:hover {
    background: ${(p) => (p.disabled ? "#ffffff" : "#f9fafb")};
    color: ${(p) => (p.disabled ? "#6b7280" : "#b91c1c")};
  }
`;

const AddFileButton = styled.button`
  margin-top: 12px;
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 999px;
  padding: 9px 14px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #dbeafe;
  }
`;

const SuccessBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: rgba(15, 23, 42, 0.58);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const SuccessModalCard = styled.div`
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border-radius: 20px;
  padding: 26px;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.3);
  text-align: center;
`;

const SuccessIconWrap = styled.div`
  width: 58px;
  height: 58px;
  border-radius: 999px;
  background: #dcfce7;
  color: #15803d;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
`;

const SuccessTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 900;
  color: #111827;
`;

const SuccessText = styled.p`
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.55;
  color: #4b5563;
`;

const SuccessButtonRow = styled.div`
  margin-top: 22px;
  display: flex;
  justify-content: center;
`;

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

function makeFileRow() {
  return {
    id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
    file: null,
    note: "",
  };
}

function VetUploadRecordPage() {
  const { inviteId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = auth.currentUser;

  const [inviteState, setInviteState] = useState({
    status: "loading",
    invite: null,
    error: null,
  });

  const [fileRows, setFileRows] = useState([makeFileRow()]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [successModal, setSuccessModal] = useState({
    open: false,
    fileCount: 0,
  });

  const hasTrackedClickRef = useRef(false);

  const [contextLoading, setContextLoading] = useState(false);
  const [petProfile, setPetProfile] = useState(null);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [clinicProfile, setClinicProfile] = useState(null);

  const rowsReadyForUpload = useMemo(
    () => fileRows.filter((row) => !!row.file),
    [fileRows],
  );

  const hasEmptyFileRow = fileRows.some((row) => !row.file);

  const canUpload =
    rowsReadyForUpload.length > 0 &&
    !hasEmptyFileRow &&
    inviteState.status === "ok" &&
    !isUploading;

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

  const handleFileChange = (rowId, e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFileRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, file: f } : row)),
    );
  };

  const handleNoteChange = (rowId, value) => {
    setFileRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, note: value } : row)),
    );
  };

  const handleAddFileRow = () => {
    setFileRows((prev) => [...prev, makeFileRow()]);
  };

  const handleRemoveFileRow = (rowId) => {
    setFileRows((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((row) => row.id !== rowId);
    });
  };

  async function markUploaded(inviteIdLocal, fileCount) {
    try {
      await postJson(`${FUNCTIONS_BASE_URL}/markPetUploadInviteUploaded`, {
        inviteId: inviteIdLocal,
        fileCount,
      });
    } catch (e) {
      console.warn("markPetUploadInviteUploaded failed", e);
    }
  }

  async function handleUploadToTimeline() {
    if (!canUpload || inviteState.status !== "ok") return;

    const invite = inviteState.invite;
    const petIdLocal = invite.petId;
    const rowsToUpload = rowsReadyForUpload;

    let completedCount = 0;
    const completedRowIds = [];

    try {
      setIsUploading(true);

      for (let i = 0; i < rowsToUpload.length; i += 1) {
        const item = rowsToUpload[i];
        const selectedFile = item.file;

        setUploadingIndex(i + 1);

        const mimeType = selectedFile.type || "application/octet-stream";
        const fileNameSafe = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const storagePath = `petRecords/${petIdLocal}/${Date.now()}_${
          i + 1
        }_${fileNameSafe}`;

        const fileStorageRef = ref(storage, storagePath);
        await uploadBytes(fileStorageRef, selectedFile);

        let imageUrls = null;
        if (mimeType && mimeType.startsWith("image/")) {
          try {
            const downloadUrl = await getDownloadURL(fileStorageRef);
            imageUrls = [downloadUrl];
          } catch (urlErr) {
            console.error("Failed to get download URL for image", urlErr);
          }
        }

        const { resp, data } = await postJson(
          `${FUNCTIONS_BASE_URL}/createPetRecordPendingFromInvite`,
          {
            inviteId: invite.id,
            storagePath,
            mimeType,
            ownerNote: item.note || "",
            fallbackEventDateIso: new Date().toISOString(),
            imageUrls: imageUrls || null,
            uploadedByUid: auth.currentUser?.uid || null,
          },
        );

        if (!resp.ok || !data?.ok) {
          console.warn("createPetRecordPendingFromInvite error", data);
          throw new Error(
            data?.error || `Unable to upload ${selectedFile.name}.`,
          );
        }

        completedCount += 1;
        completedRowIds.push(item.id);
      }

      // ✅ Add it here, after every file has been uploaded successfully.
      await markUploaded(invite.id, completedCount);

      setSuccessModal({
        open: true,
        fileCount: completedCount,
      });
    } catch (err) {
      console.error("handleUploadToTimeline error", err);

      if (completedCount > 0) {
        setFileRows((prev) => {
          const remaining = prev.filter(
            (row) => !completedRowIds.includes(row.id),
          );
          return remaining.length ? remaining : [makeFileRow()];
        });

        alert(
          `${completedCount} ${
            completedCount === 1 ? "file was" : "files were"
          } uploaded, but another file failed. Please review the remaining file and try again.`,
        );
      } else {
        alert(
          err.message ||
            "There was a problem uploading these records. Please try again.",
        );
      }
    } finally {
      setIsUploading(false);
      setUploadingIndex(null);
    }
  }

  const handleSignInClick = () => {
    const fullPath =
      location.pathname + (location.search || "") + (location.hash || "");
    sessionStorage.setItem("postAuthRedirectPath", fullPath);
    navigate("/login");
  };

  const handleFinishAfterUpload = () => {
    setSuccessModal({
      open: false,
      fileCount: 0,
    });

    navigate("/", { replace: true });
  };

  const { status, invite, error } = inviteState;

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
          This page lets you upload lab reports or documents directly into the
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

            <FieldLabel>1. Select files</FieldLabel>

            <FileRows>
              {fileRows.map((item, index) => (
                <FileRowCard key={item.id}>
                  <FileRowTop>
                    <FileRowTitle>Record {index + 1}</FileRowTitle>

                    <IconButton
                      type="button"
                      disabled={fileRows.length <= 1 || isUploading}
                      onClick={() => handleRemoveFileRow(item.id)}
                      aria-label="Remove this file"
                      title="Remove this file"
                    >
                      <FiTrash2 size={15} />
                    </IconButton>
                  </FileRowTop>

                  <FileBox>
                    <FiFileText size={20} />
                    <FileInfo>
                      <FileName>
                        {item.file
                          ? item.file.name
                          : "Click to choose a PDF or image"}
                      </FileName>
                      <FileHint>
                        Supported: PDF, JPEG, PNG, other images
                      </FileHint>
                    </FileInfo>
                    <HiddenFileInput
                      type="file"
                      accept=".pdf,image/*"
                      disabled={isUploading}
                      onChange={(e) => handleFileChange(item.id, e)}
                    />
                  </FileBox>

                  <FieldLabel>Brief note for this file optional</FieldLabel>
                  <TextArea
                    value={item.note}
                    disabled={isUploading}
                    onChange={(e) => handleNoteChange(item.id, e.target.value)}
                    placeholder="Example: CBC and chemistry from ER visit on Jan 28"
                  />
                </FileRowCard>
              ))}
            </FileRows>

            <AddFileButton
              type="button"
              onClick={handleAddFileRow}
              disabled={isUploading}
            >
              <FiPlus />
              Add another file
            </AddFileButton>

            {hasEmptyFileRow && rowsReadyForUpload.length > 0 ? (
              <Small>
                Please choose a file for every record row, or remove the empty
                row before uploading.
              </Small>
            ) : null}

            <ButtonRow>
              <Button
                $variant="primary"
                $full
                $loading={isUploading}
                disabled={!canUpload && !isUploading}
                onClick={isUploading ? undefined : handleUploadToTimeline}
              >
                {isUploading ? (
                  <>
                    <ButtonSpinner />
                    {`Uploading ${uploadingIndex || 1} of ${rowsReadyForUpload.length}...`}
                  </>
                ) : (
                  `Upload ${rowsReadyForUpload.length || ""} ${
                    rowsReadyForUpload.length === 1 ? "record" : "records"
                  } to ${petName}'s medical profile`
                )}
              </Button>
            </ButtonRow>

            <Small>
              After upload, the system will generate summaries and index the
              documents in the background. You can close this page after the
              upload finishes.
            </Small>
          </>
        )}
      </Card>
      {successModal.open && (
        <SuccessBackdrop>
          <SuccessModalCard role="dialog" aria-modal="true">
            <SuccessIconWrap>
              <FiCheckCircle size={30} />
            </SuccessIconWrap>

            <SuccessTitle>Upload complete</SuccessTitle>

            <SuccessText>
              {successModal.fileCount === 1
                ? "The record was uploaded successfully."
                : `${successModal.fileCount} records were uploaded successfully.`}
            </SuccessText>

            <SuccessText>
              The system is now generating summaries and indexing the documents
              in the background.
            </SuccessText>

            <SuccessButtonRow>
              <Button
                $variant="primary"
                type="button"
                onClick={handleFinishAfterUpload}
              >
                Done
              </Button>
            </SuccessButtonRow>
          </SuccessModalCard>
        </SuccessBackdrop>
      )}
    </PageShell>
  );
}

export default VetUploadRecordPage;
