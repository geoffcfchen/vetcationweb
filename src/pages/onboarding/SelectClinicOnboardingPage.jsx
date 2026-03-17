import React, { useContext, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  writeBatch,
  setDoc,
} from "firebase/firestore";

import GlobalContext from "../../context/GlobalContext";
import { auth, firestore } from "../../lib/firebase";
import ClinicsMapSection from "../../components/ClinicsMapSection";

function isOrgOrClinicRole(userData) {
  const label = userData?.role?.label || "";
  return label === "Organization" || label === "Clinic";
}

export default function SelectClinicOnboardingPage() {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(GlobalContext);

  const uid = auth.currentUser?.uid || userData?.uid || null;
  const roleLabel = userData?.role?.label || "";

  const [selectedClinic, setSelectedClinic] = useState(null); // { place_id, name }
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [ownerConflictOpen, setOwnerConflictOpen] = useState(false);

  const isOrgClinic = useMemo(() => isOrgOrClinicRole(userData), [userData]);

  async function claimAndSaveClinic() {
    if (!uid) throw new Error("missing-uid");
    if (!selectedClinic?.place_id) throw new Error("missing-clinic");

    const clinicId = selectedClinic.place_id;
    const clinicName = selectedClinic.name || "";

    const userRef = doc(firestore, "customers", uid);
    const clinicRef = doc(firestore, "clinics", clinicId);

    // If organization or clinic, we need to check ownerUid first (like RN)
    if (isOrgClinic) {
      const clinicSnap = await getDoc(clinicRef);
      const ownerUid = clinicSnap.exists() ? clinicSnap.data()?.ownerUid : null;

      if (ownerUid && ownerUid !== uid) {
        setOwnerConflictOpen(true);
        throw new Error("owner-conflict");
      }
    }

    const batch = writeBatch(firestore);

    // Always save clinicId + clinicName to customer
    batch.set(
      userRef,
      {
        clinicId,
        clinicName,
        clinicLinkedAt: serverTimestamp(),
      },
      { merge: true },
    );

    // Mirror RN membership updates
    if (roleLabel === "Doctor") {
      batch.set(clinicRef, { veterinarians: arrayUnion(uid) }, { merge: true });
    } else if (roleLabel === "Tech") {
      batch.set(clinicRef, { techs: arrayUnion(uid) }, { merge: true });
    } else if (roleLabel === "Csr") {
      batch.set(clinicRef, { csrs: arrayUnion(uid) }, { merge: true });
    } else if (isOrgClinic) {
      batch.set(clinicRef, { ownerUid: uid }, { merge: true });
    }

    await batch.commit();

    // Update local context for immediate UI consistency
    setUserData((prev) => ({
      ...(prev || {}),
      clinicId,
      clinicName,
    }));
  }

  async function handleNext() {
    setSubmitError("");

    if (!uid) {
      navigate("/login", { replace: true });
      return;
    }

    if (!selectedClinic?.place_id) {
      setSubmitError("Please select a hospital or organization.");
      return;
    }

    setSaving(true);
    try {
      await claimAndSaveClinic();

      // RN: organizations go to Profile after selecting clinic
      navigate("/onboarding/profile", { replace: true });
    } catch (e) {
      const msg = String(e?.message || "");
      if (msg.includes("owner-conflict")) {
        // modal is shown
      } else {
        console.error(e);
        setSubmitError("An error occurred while saving. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  function handleSkip() {
    // RN behavior: organization/clinic can skip and still go to Profile
    navigate("/onboarding/profile", { replace: true });
  }

  return (
    <Page>
      <Main>
        <Card>
          <Header>
            <H1>Select your hospital or organization</H1>
            <Sub>Search the map and choose the correct location.</Sub>
          </Header>

          <MapWrap>
            <div style={{ borderRadius: 14, overflow: "hidden" }}>
              <ClinicsMapSection
                height="520px"
                mode="picker"
                source="places"
                selectedClinicId={selectedClinic?.place_id || ""}
                onPickClinic={(c) => setSelectedClinic(c)}
                closeInfoOnPick={true}
              />
            </div>
          </MapWrap>

          <SelectedRow>
            <SelectedLabel>Selected</SelectedLabel>
            <SelectedValue>
              {selectedClinic?.name ? selectedClinic.name : "None"}
            </SelectedValue>
          </SelectedRow>

          {submitError ? <ErrorBanner>{submitError}</ErrorBanner> : null}

          <BottomRow>
            <PrimaryBtn
              type="button"
              onClick={handleNext}
              disabled={saving || !selectedClinic?.place_id}
            >
              {saving ? "Saving..." : "Next"}
            </PrimaryBtn>

            <SecondaryBtn type="button" onClick={handleSkip} disabled={saving}>
              Skip
            </SecondaryBtn>
          </BottomRow>
        </Card>
      </Main>

      {ownerConflictOpen ? (
        <ModalBackdrop onMouseDown={() => setOwnerConflictOpen(false)}>
          <ConfirmCard onMouseDown={(e) => e.stopPropagation()}>
            <ConfirmTitle>Ownership claim alert</ConfirmTitle>
            <ConfirmBody>
              This clinic already has an owner. If you manage this clinic,
              please email gcfchen@vetcation.com for help.
            </ConfirmBody>
            <ConfirmRow>
              <PrimaryBtn
                type="button"
                onClick={() => setOwnerConflictOpen(false)}
              >
                OK
              </PrimaryBtn>
            </ConfirmRow>
          </ConfirmCard>
        </ModalBackdrop>
      ) : null}
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
`;

const Main = styled.div`
  width: 100%;
  max-width: 920px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 18px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
  padding: 16px;
`;

const Header = styled.div`
  padding: 6px 4px 12px;
`;

const H1 = styled.div`
  font-size: 20px;
  font-weight: 900;
  color: #0f172a;
`;

const Sub = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
`;

const MapWrap = styled.div`
  margin-top: 10px;
`;

const SelectedRow = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: baseline;
  gap: 10px;
`;

const SelectedLabel = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const SelectedValue = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
`;

const ErrorBanner = styled.div`
  margin-top: 12px;
  border-radius: 12px;
  padding: 10px 12px;
  background: rgba(254, 226, 226, 0.8);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #991b1b;
  font-size: 13px;
  font-weight: 700;
`;

const BottomRow = styled.div`
  margin-top: 14px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const PrimaryBtn = styled.button`
  border: none;
  background: #2563eb;
  color: #ffffff;
  border-radius: 999px;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 900;

  &:hover {
    background: #1d4ed8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const SecondaryBtn = styled.button`
  border: 1px solid rgba(148, 163, 184, 0.28);
  background: #ffffff;
  color: #0f172a;
  border-radius: 999px;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 900;

  &:hover {
    background: #f8fafc;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(15, 23, 42, 0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ConfirmCard = styled.div`
  width: 100%;
  max-width: 520px;
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
  padding: 16px;
`;

const ConfirmTitle = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
`;

const ConfirmBody = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
`;

const ConfirmRow = styled.div`
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
`;
