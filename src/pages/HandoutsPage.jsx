// src/pages/HandoutsPage.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { auth, firestore, storage } from "../lib/firebase";
import { ref, uploadBytes } from "firebase/storage";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import {
  FiFileText,
  FiPlus,
  FiArrowLeft,
  FiPrinter,
  FiSettings,
  FiX,
} from "react-icons/fi";

import DiabetesHandoutPreview from "../handouts/DiabetesHandoutPreview";
import DiabetesHandoutEditor from "../handouts/DiabetesHandoutEditor";

const EMPTY_HOSPITAL_DEFAULTS = {
  hospitalName: "",
  hospitalAddress: "",
  hospitalPhone: "",
  erHospitalName: "",
  erHospitalPhone: "",
  attendingVetName: "", // NEW
};

function pickHospitalDefaultsFromSettingsDoc(data) {
  const d = data?.handoutDefaults?.diabetes_discharge || {};
  return {
    hospitalName: d.hospitalName || "",
    hospitalAddress: d.hospitalAddress || "",
    hospitalPhone: d.hospitalPhone || "",
    erHospitalName: d.erHospitalName || "",
    erHospitalPhone: d.erHospitalPhone || "",
    attendingVetName: d.attendingVetName || "",
  };
}

function hospitalDefaultsToFormData(hospitalDefaults) {
  return {
    hospitalName: hospitalDefaults.hospitalName || "",
    hospitalAddress: hospitalDefaults.hospitalAddress || "",
    hospitalPhone: hospitalDefaults.hospitalPhone || "",
    erHospitalName: hospitalDefaults.erHospitalName || "",
    erHospitalPhone: hospitalDefaults.erHospitalPhone || "",
    attendingVetName: hospitalDefaults.attendingVetName || "",
  };
}

function HandoutsList({ currentUser }) {
  const [handouts, setHandouts] = useState([]);
  const navigate = useNavigate();

  const [defaultsOpen, setDefaultsOpen] = useState(false);
  const [defaultsLoading, setDefaultsLoading] = useState(false);
  const [defaultsSaving, setDefaultsSaving] = useState(false);
  const [defaultsError, setDefaultsError] = useState(null);
  const [hospitalDefaults, setHospitalDefaults] = useState(
    EMPTY_HOSPITAL_DEFAULTS
  );

  const handleGoBack = () => {
    // "Back" behavior with a safe fallback
    if (window.history.length > 1) {
      navigate("/ai/library");
      return;
    }
    navigate("/ai/library"); // change this fallback route if your parent page is different
  };

  useEffect(() => {
    if (!currentUser) {
      setHandouts([]);
      return;
    }

    const q = query(
      collection(firestore, "vetHandouts"),
      where("vetUid", "==", currentUser.uid),
      orderBy("updatedAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = [];
        snap.forEach((d) => rows.push({ id: d.id, ...d.data() }));
        setHandouts(rows);
      },
      (err) => {
        console.error("Error loading handouts:", err);
      }
    );

    return () => unsub();
  }, [currentUser]);

  const loadDefaults = async () => {
    if (!currentUser) return;
    setDefaultsError(null);
    setDefaultsLoading(true);

    try {
      const defaultsRef = doc(firestore, "vetSettings", currentUser.uid);
      const snap = await getDoc(defaultsRef);

      if (snap.exists()) {
        setHospitalDefaults(pickHospitalDefaultsFromSettingsDoc(snap.data()));
      } else {
        setHospitalDefaults(EMPTY_HOSPITAL_DEFAULTS);
      }
    } catch (err) {
      console.error("Failed to load defaults:", err);
      setDefaultsError(err.message || String(err));
    } finally {
      setDefaultsLoading(false);
    }
  };

  const openDefaultsModal = async () => {
    setDefaultsOpen(true);
    await loadDefaults();
  };

  const closeDefaultsModal = () => {
    setDefaultsOpen(false);
    setDefaultsError(null);
  };

  const updateDefaultField = (field, value) => {
    setHospitalDefaults((prev) => ({ ...prev, [field]: value }));
  };

  const saveDefaults = async () => {
    if (!currentUser) return;

    setDefaultsSaving(true);
    setDefaultsError(null);

    try {
      const defaultsRef = doc(firestore, "vetSettings", currentUser.uid);

      await setDoc(
        defaultsRef,
        {
          handoutDefaults: {
            diabetes_discharge: {
              ...hospitalDefaults,
              updatedAt: serverTimestamp(),
            },
          },
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setDefaultsOpen(false);
    } catch (err) {
      console.error("Failed to save defaults:", err);
      setDefaultsError(err.message || String(err));
    } finally {
      setDefaultsSaving(false);
    }
  };

  const handleNewDiabetesHandout = async () => {
    if (!currentUser) return;

    try {
      const defaultsRef = doc(firestore, "vetSettings", currentUser.uid);
      const defaultsSnap = await getDoc(defaultsRef);

      const defaults = defaultsSnap.exists()
        ? pickHospitalDefaultsFromSettingsDoc(defaultsSnap.data())
        : EMPTY_HOSPITAL_DEFAULTS;

      const refDoc = await addDoc(collection(firestore, "vetHandouts"), {
        vetUid: currentUser.uid,
        orgId: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),

        type: "diabetes_discharge",
        templateVersion: 1,
        title: "New diabetes discharge handout",

        status: "draft",
        errorMessage: null,

        links: {
          caseId: null,
          chatId: null,
          personalChatId: null,
          createdFrom: "standalone",
        },

        patient: {
          petName: "",
          species: null,
          sex: null,
        },

        // Prefill Section 1 using defaults
        formData: hospitalDefaultsToFormData(defaults),

        validation: {
          state: "unknown",
          missing: [],
          warnings: [],
          lastValidatedAt: null,
        },
        autofill: {
          enabled: true,
          sources: [],
          fields: {},
          updatedAt: null,
        },
        latestExport: {
          exportId: null,
          pdfUrl: null,
          createdAt: null,
        },
      });

      navigate(`/ai/handouts/${refDoc.id}`);
    } catch (err) {
      console.error("Failed to create handout:", err);
      alert("Could not create handout. Please try again.");
    }
  };

  return (
    <HandoutsPageShell>
      <HandoutsHeaderRow>
        <HandoutsHeaderLeft>
          {/* Reuse the same BackButton you already use in DiabetesHandoutEditor */}
          <BackButton type="button" onClick={handleGoBack}>
            <FiArrowLeft size={14} />
            <span>Back</span>
          </BackButton>

          <HandoutsTitle>Handouts</HandoutsTitle>
        </HandoutsHeaderLeft>

        <HeaderActions>
          <HandoutsNewButton
            type="button"
            onClick={openDefaultsModal}
            disabled={!currentUser}
            title="Set defaults for diabetes discharge handouts"
          >
            <FiSettings size={14} />
            <span>Defaults</span>
          </HandoutsNewButton>

          <HandoutsNewButton
            type="button"
            onClick={handleNewDiabetesHandout}
            disabled={!currentUser}
          >
            <FiPlus size={14} />
            <span>New diabetes handout</span>
          </HandoutsNewButton>
        </HeaderActions>
      </HandoutsHeaderRow>

      <HandoutsSubtitle>
        Create and manage printable client handouts here. For now this focuses
        on diabetic discharge instructions.
      </HandoutsSubtitle>

      <HandoutsListContainer>
        {currentUser && handouts.length === 0 && (
          <EmptyStateCard>
            <EmptyStateTitle>No handouts yet</EmptyStateTitle>
            <EmptyStateText>
              Start by creating a diabetes discharge handout.
            </EmptyStateText>
            <HandoutsNewButton type="button" onClick={handleNewDiabetesHandout}>
              <FiPlus size={14} />
              <span>New diabetes handout</span>
            </HandoutsNewButton>
          </EmptyStateCard>
        )}

        {!currentUser && (
          <EmptyStateCard>
            <EmptyStateTitle>Sign in to manage handouts</EmptyStateTitle>
            <EmptyStateText>
              Once signed in, you can create and save handouts for your cases.
            </EmptyStateText>
          </EmptyStateCard>
        )}

        {currentUser &&
          handouts.length > 0 &&
          handouts.map((h) => (
            <HandoutRow
              key={h.id}
              type="button"
              onClick={() => navigate(`/ai/handouts/${h.id}`)}
            >
              <FiFileText size={16} />
              <HandoutRowTexts>
                <HandoutRowTitle>
                  {h.title || "Untitled handout"}
                </HandoutRowTitle>
                <HandoutRowMeta>
                  {h.type === "diabetes_discharge"
                    ? "Diabetes discharge"
                    : h.type || "Unknown type"}
                  {h.updatedAt && h.updatedAt.toDate && (
                    <>
                      {" "}
                      •{" "}
                      {h.updatedAt.toDate().toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </>
                  )}
                </HandoutRowMeta>
              </HandoutRowTexts>
            </HandoutRow>
          ))}
      </HandoutsListContainer>

      {defaultsOpen && (
        <ModalOverlay
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeDefaultsModal();
          }}
        >
          <ModalCard>
            <ModalHeader>
              <ModalTitle>Defaults for diabetes discharge handouts</ModalTitle>
              <IconCloseButton type="button" onClick={closeDefaultsModal}>
                <FiX size={16} />
              </IconCloseButton>
            </ModalHeader>

            <ModalSubtext>
              These values will be used to prefill Section 1 for new diabetes
              discharge handouts.
            </ModalSubtext>

            {defaultsLoading ? (
              <ModalSubtext>Loading defaults...</ModalSubtext>
            ) : (
              <>
                <SectionCard>
                  <SectionTitle>Hospital information</SectionTitle>

                  <FieldRow>
                    <FieldLabel>Hospital name</FieldLabel>
                    <FieldInput
                      value={hospitalDefaults.hospitalName}
                      onChange={(e) =>
                        updateDefaultField("hospitalName", e.target.value)
                      }
                      placeholder="Hospital name"
                    />
                  </FieldRow>

                  <FieldRow>
                    <FieldLabel>Hospital address</FieldLabel>
                    <FieldInput
                      value={hospitalDefaults.hospitalAddress}
                      onChange={(e) =>
                        updateDefaultField("hospitalAddress", e.target.value)
                      }
                      placeholder="Street, city, state, ZIP"
                    />
                  </FieldRow>

                  <FieldRow>
                    <FieldLabel>Hospital phone number</FieldLabel>
                    <FieldInput
                      value={hospitalDefaults.hospitalPhone}
                      onChange={(e) =>
                        updateDefaultField("hospitalPhone", e.target.value)
                      }
                      placeholder="000-000-0000"
                    />
                  </FieldRow>

                  {/* NEW: default veterinarian name */}
                  <FieldRow>
                    <FieldLabel>Default veterinarian name</FieldLabel>
                    <FieldInput
                      value={hospitalDefaults.attendingVetName || ""}
                      onChange={(e) =>
                        updateDefaultField("attendingVetName", e.target.value)
                      }
                      placeholder="For example: Smith"
                    />
                  </FieldRow>

                  <FieldRow>
                    <FieldLabel>Emergency hospital name</FieldLabel>
                    <FieldInput
                      value={hospitalDefaults.erHospitalName}
                      onChange={(e) =>
                        updateDefaultField("erHospitalName", e.target.value)
                      }
                      placeholder="After-hours or ER hospital"
                    />
                  </FieldRow>

                  <FieldRow style={{ marginBottom: 0 }}>
                    <FieldLabel>Emergency hospital phone</FieldLabel>
                    <FieldInput
                      value={hospitalDefaults.erHospitalPhone}
                      onChange={(e) =>
                        updateDefaultField("erHospitalPhone", e.target.value)
                      }
                      placeholder="000-000-0000"
                    />
                  </FieldRow>
                </SectionCard>

                {defaultsError && (
                  <ModalErrorText>Save failed: {defaultsError}</ModalErrorText>
                )}

                <ModalActions>
                  <TopBarButton type="button" onClick={closeDefaultsModal}>
                    Cancel
                  </TopBarButton>
                  <TopBarButton
                    type="button"
                    onClick={saveDefaults}
                    disabled={defaultsSaving}
                  >
                    {defaultsSaving ? "Saving..." : "Save defaults"}
                  </TopBarButton>
                </ModalActions>
              </>
            )}
          </ModalCard>
        </ModalOverlay>
      )}
    </HandoutsPageShell>
  );
}

export default function HandoutsPage() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setCurrentUser(u || null);
    });
    return () => unsub();
  }, []);

  return (
    <HandoutsPageOuter>
      <Routes>
        <Route path="/" element={<HandoutsList currentUser={currentUser} />} />
        <Route
          path=":handoutId"
          element={<DiabetesHandoutEditor currentUser={currentUser} />}
        />
        <Route
          path=":handoutId/preview"
          element={<DiabetesHandoutPreview currentUser={currentUser} />}
        />
      </Routes>
    </HandoutsPageOuter>
  );
}

// 2) (Optional) a small wrapper so the back button + title align nicely
const HandoutsHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

const HeaderActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  z-index: 9999;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 560px;
  border-radius: 14px;
  border: 1px solid #1f2937;
  background: #020617;
  padding: 14px;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
`;

const ModalTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #f9fafb;
`;

const IconCloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid #374151;
  background: #020617;
  color: #e5e7eb;
  cursor: pointer;

  &:hover {
    background: #111827;
    border-color: #6b7280;
  }
`;

const ModalSubtext = styled.p`
  margin: 0 0 10px;
  font-size: 12px;
  color: #9ca3af;
`;

const ModalActions = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const ModalErrorText = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #fca5a5;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #4b5563;
  background: #020617;
  color: #e5e7eb;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.12s ease, border-color 0.12s ease;

  &:hover {
    background: #111827;
    border-color: #6b7280;
  }
`;

const TopBarButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #4b5563;
  background: #020617;
  color: #e5e7eb;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.12s ease, border-color 0.12s ease;

  &:hover:not(:disabled) {
    background: #111827;
    border-color: #6b7280;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const SectionCard = styled.div`
  border-radius: 12px;
  border: 1px solid #1f2937;
  background: #020617;
  padding: 12px 12px 10px;
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #f9fafb;
  margin-bottom: 8px;
`;

const FieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
`;

const InlineFieldRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 8px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const InlineField = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FieldLabel = styled.label`
  font-size: 12px;
  color: #9ca3af;
`;

const FieldInput = styled.input`
  height: 32px;
  border-radius: 8px;
  border: 1px solid
    ${(p) => (p.$error ? "#b91c1c" : p.$aiFilled ? "#1d4ed8" : "#374151")};
  background: #020617;
  color: ${(p) => (p.$aiFilled ? "#bfdbfe" : "#e5e7eb")};
  padding: 0 8px;
  font-size: 13px;

  &::placeholder {
    color: #6b7280;
  }

  &:focus {
    outline: none;
    border-color: ${(p) => (p.$error ? "#fca5a5" : "#6b7280")};
  }
`;

/* Styled components */

const HandoutsPageOuter = styled.div`
  min-height: 100vh;
  background: #020617;
  color: #e5e7eb;
  padding: 24px;
`;

const HandoutsPageShell = styled.div`
  max-width: 960px;
  margin: 0 auto;
`;

const HandoutsHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
`;

const HandoutsTitle = styled.h1`
  font-size: 22px;
  font-weight: 600;
  color: #f9fafb;
  margin: 0;
`;

const HandoutsSubtitle = styled.p`
  margin: 4px 0 16px;
  font-size: 14px;
  color: #9ca3af;
`;

const HandoutsNewButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #4b5563;
  background: #020617;
  color: #e5e7eb;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease;

  &:hover {
    background: #111827;
    border-color: #6b7280;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const HandoutsListContainer = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HandoutRow = styled.button`
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #020617;
  border: 1px solid #111827;
  cursor: pointer;
  transition: background 0.12s ease, border-color 0.12s ease;

  &:hover {
    background: #030712;
    border-color: #1f2937;
  }
`;

const HandoutRowTexts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const HandoutRowTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #f9fafb;
`;

const HandoutRowMeta = styled.div`
  font-size: 12px;
  color: #9ca3af;
`;

const EmptyStateCard = styled.div`
  margin-top: 24px;
  border-radius: 14px;
  border: 1px dashed #374151;
  padding: 16px 16px 14px;
  background: #020617;
`;

const EmptyStateTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #e5e7eb;
  margin-bottom: 4px;
`;

const EmptyStateText = styled.p`
  font-size: 13px;
  color: #9ca3af;
  margin: 0 0 8px;
`;

const PreviewTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
`;

const PetOwnerPreviewFrame = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const PetOwnerPreviewPaper = styled.div`
  width: 100%;
  max-width: 820px; /* print-like */
  background: #ffffff;
  color: #111827;
  border-radius: 12px;
  padding: 28px 28px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);

  /* Markdown typography */
  font-size: 16px;
  line-height: 1.65;

  h1 {
    font-size: 28px;
    line-height: 1.2;
    margin: 0 0 12px 0;
    letter-spacing: -0.02em;
  }

  h2 {
    font-size: 18px;
    margin: 22px 0 10px 0;
    padding-top: 14px;
    border-top: 1px solid #e5e7eb;
  }

  h3 {
    font-size: 16px;
    margin: 14px 0 8px 0;
  }

  p {
    margin: 10px 0;
  }

  ul,
  ol {
    margin: 10px 0 10px 20px;
  }

  li {
    margin: 6px 0;
  }

  blockquote {
    margin: 12px 0;
    padding: 10px 14px;
    background: #f9fafb;
    border-left: 4px solid #d1d5db;
    border-radius: 8px;
  }

  strong {
    font-weight: 700;
  }
`;

/* Print rules */
const PrintStyles = styled.div`
  @media print {
    body {
      background: white !important;
    }

    .no-print {
      display: none !important;
    }

    /* Remove shadows and force paper width */
    ${PetOwnerPreviewPaper} {
      box-shadow: none !important;
      border-radius: 0 !important;
      max-width: 820px !important;
      padding: 0 !important;
    }
  }
`;
