// src/pages/app/VetReadySummaryPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styled from "styled-components";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { FiFileText, FiShare2 } from "react-icons/fi";

import VetSummaryCard from "../../components/VetSummaryCard";
import PetSummaryShareModal from "../../components/PetSummaryShareModal";

const FUNCTIONS_BASE_URL = (
  import.meta.env.VITE_FUNCTIONS_BASE_URL ||
  "https://us-central1-vetcationapp.cloudfunctions.net"
).replace(/\/+$/, "");

const normalizeCachedSummary = (s) => {
  if (!s || typeof s !== "object") return s;

  const sb = s.sourcesBySection;
  if (!sb || typeof sb !== "object") return s;

  const converted = {};
  Object.keys(sb).forEach((key) => {
    const list = sb[key];

    if (
      Array.isArray(list) &&
      list.length > 0 &&
      list[0] &&
      typeof list[0] === "object" &&
      Array.isArray(list[0].labels)
    ) {
      converted[key] = list.map((row) =>
        Array.isArray(row.labels) ? row.labels : [],
      );
      return;
    }

    converted[key] = list;
  });

  return { ...s, sourcesBySection: converted };
};

const getLoadingMessage = (phase) => {
  if (phase === 1) return "Reading uploaded records...";
  if (phase === 2) return "Building a one page summary...";
  if (phase === 3) return "Generating the final report...";
  if (phase > 3) {
    return "This is taking longer than expected. Thanks for your patience.";
  }
  return "Preparing a one page summary from uploaded records...";
};

export default function VetReadySummaryPage() {
  const { pet, uid } = useOutletContext() || {};

  const [summary, setSummary] = useState(null);
  const [summaryUpdatedAt, setSummaryUpdatedAt] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(null);
  const [records, setRecords] = useState([]);

  const [loadingPhase, setLoadingPhase] = useState(0);
  const refreshStartRef = useRef(null);
  const [refreshTick, setRefreshTick] = useState(0);

  // NEW: share link state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [isCreatingShare, setIsCreatingShare] = useState(false);
  const [shareError, setShareError] = useState(null);

  const petId = pet?.id || null;
  const petName = pet?.displayName || "my pet";

  // Phase based loading text
  useEffect(() => {
    if (!summaryLoading || summary) {
      setLoadingPhase(0);
      return;
    }

    setLoadingPhase(1);

    const t1 = setTimeout(() => {
      setLoadingPhase((prev) => (prev === 1 ? 2 : prev));
    }, 7000);

    const t2 = setTimeout(() => {
      setLoadingPhase((prev) => (prev === 2 ? 3 : prev));
    }, 14000);

    const t3 = setTimeout(() => {
      setLoadingPhase((prev) => (prev === 3 ? 4 : prev));
    }, 21000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [summaryLoading, summary]);

  // Refresh timer for the Updating pill
  useEffect(() => {
    if (!summaryLoading || !summary) {
      refreshStartRef.current = null;
      return;
    }

    if (!refreshStartRef.current) {
      refreshStartRef.current = Date.now();
    }

    const id = setInterval(() => {
      setRefreshTick((t) => t + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [summaryLoading, summary]);

  const refreshElapsedSec = refreshStartRef.current
    ? Math.floor((Date.now() - refreshStartRef.current) / 1000)
    : 0;

  const loadingMessage = getLoadingMessage(loadingPhase);

  // Load cached summary and then refresh via Cloud Function
  useEffect(() => {
    const db = getFirestore();

    const loadSummary = async () => {
      if (!petId || !uid) {
        setSummaryError("We could not load this summary. Please try again.");
        setSummaryLoading(false);
        return;
      }

      setSummaryLoading(true);
      setSummaryError(null);

      try {
        // Load cached summary if available
        const summaryRef = doc(db, "pets", petId, "aiVetSummaries", "vetView");
        const snap = await getDoc(summaryRef);

        if (snap.exists()) {
          const data = snap.data() || {};
          if (data.summary) {
            setSummary(normalizeCachedSummary(data.summary));
          }
          if (data.updatedAt && typeof data.updatedAt.toDate === "function") {
            setSummaryUpdatedAt(data.updatedAt.toDate());
          }
        }

        // Load recent medical records so source links can show original files
        const recordsCol = collection(db, "pets", petId, "records");
        const recordsSnap = await getDocs(
          query(recordsCol, orderBy("createdAt", "desc"), limit(50)),
        );
        setRecords(
          recordsSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })),
        );
      } catch (err) {
        console.error("Error loading cached summary in app view", err);
      }

      try {
        const resp = await fetch(`${FUNCTIONS_BASE_URL}/petVetSummaryView`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            petId,
            ownerUid: uid,
          }),
        });

        const respData = await resp.json().catch(() => null);

        if (!resp.ok || !respData || !respData.ok || !respData.summary) {
          const msg =
            (respData && respData.error) ||
            "The summary could not be generated right now.";
          setSummaryError(msg);
        } else {
          setSummary(normalizeCachedSummary(respData.summary));
          setSummaryUpdatedAt(new Date());
          setSummaryError(null);
        }
      } catch (err) {
        console.error("Error refreshing summary in app view", err);
        setSummaryError("The summary could not be generated right now.");
      } finally {
        setSummaryLoading(false);
      }
    };

    loadSummary();
  }, [petId, uid]);

  const handleOpenShareModal = async () => {
    if (!petId || !uid) {
      window.alert("Missing info. Please reopen this pet from your profile.");
      return;
    }

    // If already created, just open modal
    if (shareLink) {
      setShareError("");
      setShareModalOpen(true);
      return;
    }

    try {
      setIsCreatingShare(true);
      setShareError("");

      const resp = await fetch(`${FUNCTIONS_BASE_URL}/createPetSummaryShare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petId, ownerUid: uid, petName }),
      });

      const data = await resp.json().catch(() => null);

      if (!resp.ok || !data || !data.ok || !data.shareUrl) {
        setShareError(
          (data && data.error) || "Could not create link. Try again.",
        );
        setShareModalOpen(true);
        return;
      }

      setShareLink(data.shareUrl);
      setShareModalOpen(true);
    } catch (err) {
      console.warn("createPetSummaryShare error", err);
      setShareError("Network error. Please try again.");
      setShareModalOpen(true);
    } finally {
      setIsCreatingShare(false);
    }
  };

  if (!pet) {
    return (
      <Card>
        <HeaderRow>
          <HeaderLeft>
            <IconCircle>
              <FiFileText />
            </IconCircle>
            <HeaderStack>
              <Title>Vet ready summary</Title>
              <Subtitle>Unable to load this pet.</Subtitle>
            </HeaderStack>
          </HeaderLeft>
        </HeaderRow>
        <BodyText>
          This pet may have been removed or you do not have access.
        </BodyText>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <HeaderRow>
          <HeaderLeft>
            <IconCircle>
              <FiFileText />
            </IconCircle>
            <HeaderStack>
              <Title>Vet ready summary</Title>
              <Subtitle>
                One page clinical summary you can share with vets and pet
                sitters.
              </Subtitle>
            </HeaderStack>
          </HeaderLeft>
          <HeaderRight>
            <ShareButton
              type="button"
              onClick={handleOpenShareModal}
              disabled={!petId || !uid || isCreatingShare}
              title={
                !petId || !uid ? "Missing pet info" : "Create a share link"
              }
            >
              <FiShare2 />
              {isCreatingShare ? "Creating..." : "Share summary link"}
            </ShareButton>
          </HeaderRight>
        </HeaderRow>

        <VetSummaryCard
          summary={summary}
          summaryLoading={summaryLoading}
          summaryError={summaryError}
          summaryUpdatedAt={summaryUpdatedAt}
          loadingMessage={loadingMessage}
          refreshElapsedSec={refreshElapsedSec}
          records={records}
        />
      </Card>
      <PetSummaryShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        isCreating={isCreatingShare}
        shareUrl={shareLink}
        petName={petName}
        error={shareError}
        onCreateLink={handleOpenShareModal}
      />
    </>
  );
}

// Styles for the app level wrapper

const Card = styled.div`
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 18px;
  padding: 18px 18px 20px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  flex-wrap: wrap;
`;

const HeaderLeft = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  min-width: 220px;
`;

const HeaderRight = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const ShareButton = styled.button`
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
  white-space: nowrap;

  &:hover {
    background: #1d4ed8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const IconCircle = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const HeaderStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
`;

const Subtitle = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const BodyText = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: #4b5563;
  line-height: 1.5;
`;

const PrimaryButton = styled.button`
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
  white-space: nowrap;

  &:hover {
    background: #1d4ed8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;
