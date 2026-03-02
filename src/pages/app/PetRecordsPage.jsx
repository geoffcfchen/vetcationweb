// src/pages/app/PetRecordsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import styled from "styled-components";
import { collection, limit, onSnapshot, query } from "firebase/firestore";
import { DateTime } from "luxon";
import { FiUpload } from "react-icons/fi";

import { firestore } from "../../lib/firebase";
import RawUploadRecordCard from "../../components/RawUploadRecordCard";
import PetRecordUploadModal from "../../components/PetRecordUploadModal";

export default function PetRecordsPage() {
  const { petId } = useParams();
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { pet, uid } = useOutletContext(); // comes from <Outlet context={{ pet: activePet, uid }} />
  const [uploadOpen, setUploadOpen] = useState(false);

  // Option B style: no orderBy (avoids indexes), then sort client-side
  useEffect(() => {
    if (!petId) return;

    const q = query(collection(firestore, "pets", petId, "records"), limit(80));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
        setRecords(list);
        setLoading(false);
      },
      (err) => {
        console.error("Records error:", err);
        setRecords([]);
        setLoading(false);
      },
    );

    return () => unsub();
  }, [petId]);

  const sortedRecords = useMemo(() => {
    const list = Array.isArray(records) ? [...records] : [];

    list.sort((a, b) => {
      const aMs = toMillisSafe(a?.createdAt);
      const bMs = toMillisSafe(b?.createdAt);
      return bMs - aMs;
    });

    return list;
  }, [records]);

  const handleUpload = () => {
    setUploadOpen(true);
  };

  return (
    <Shell>
      <HeaderRow>
        <TitleCol>
          <Title>Records</Title>
          <SubTitle>
            Upload PDFs, photos, labs, invoices. Everything stays in one place.
          </SubTitle>
        </TitleCol>

        <PrimaryButton type="button" onClick={handleUpload}>
          <FiUpload />
          Upload
        </PrimaryButton>
      </HeaderRow>

      <TimelineCard>
        <TimelineCardTitle>Original medical history</TimelineCardTitle>

        {loading ? (
          <Muted>Loading records...</Muted>
        ) : sortedRecords.length === 0 ? (
          <EmptyState>
            <Muted>No records yet. Upload a PDF or photo to start.</Muted>
            <PrimaryButton type="button" onClick={handleUpload}>
              <FiUpload />
              Upload your first record
            </PrimaryButton>
          </EmptyState>
        ) : (
          <>
            <TimelineList>
              {sortedRecords.map((rec) => {
                const isRawUpload = rec?.type === "raw_upload";

                return (
                  <TimelineRecordItem key={rec.id}>
                    <TimelineDotSmall />
                    <RecordContent>
                      {isRawUpload ? (
                        <RawUploadRecordCard record={rec} />
                      ) : (
                        <RecordCard>
                          <RecordDate>{formatRecordDate(rec)}</RecordDate>
                          <RecordTitle>{getRecordTitle(rec)}</RecordTitle>

                          {getRecordSubtitle(rec) ? (
                            <RecordSubtitle>
                              {getRecordSubtitle(rec)}
                            </RecordSubtitle>
                          ) : null}

                          {getRecordSnippet(rec) ? (
                            <RecordSnippet>
                              {getRecordSnippet(rec)}
                            </RecordSnippet>
                          ) : null}
                        </RecordCard>
                      )}
                    </RecordContent>
                  </TimelineRecordItem>
                );
              })}
            </TimelineList>

            <TimelineHint>
              Tip: Upload vaccine records, most recent invoice, recent labs, and
              current medications first.
            </TimelineHint>
          </>
        )}
      </TimelineCard>
      <PetRecordUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        petId={petId}
        petName={pet?.displayName || "this pet"}
        ownerUid={uid}
        mode="owner_upload"
        title="Upload to medical memory"
        subtitle="Upload a PDF or photo. Preview with AI before saving."
      />
    </Shell>
  );
}

/* helpers (same spirit as PetSummarySharePage) */

function toMillisSafe(ts) {
  if (!ts) return 0;
  if (typeof ts?.toMillis === "function") return ts.toMillis();
  if (typeof ts?.toDate === "function") return ts.toDate().getTime();
  if (ts instanceof Date) return ts.getTime();
  if (typeof ts === "string") {
    const d = new Date(ts);
    return Number.isNaN(d.getTime()) ? 0 : d.getTime();
  }
  return 0;
}

function formatRecordDate(rec) {
  const ms = toMillisSafe(rec?.createdAt);
  if (!ms) return "Unknown date";
  return DateTime.fromMillis(ms).toFormat("LLL d, yyyy");
}

function getRecordTitle(rec) {
  return (
    rec?.title ||
    rec?.noteTitle ||
    rec?.reason ||
    rec?.visitTitle ||
    rec?.type ||
    rec?.recordType ||
    "Record"
  );
}

function getRecordSubtitle(rec) {
  return rec?.clinicName || rec?.location || rec?.source || rec?.category || "";
}

function getRecordSnippet(rec) {
  const textField =
    rec?.summary ||
    rec?.note ||
    rec?.content ||
    rec?.description ||
    rec?.details ||
    "";
  if (!textField) return "";
  if (textField.length <= 140) return textField;
  return textField.slice(0, 137) + "...";
}

/* styles */

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const TitleCol = styled.div`
  min-width: 220px;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: #0f172a;
`;

const SubTitle = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
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
`;

const TimelineCard = styled.section`
  border-radius: 16px;
  padding: 12px 12px 10px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.22);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
`;

const TimelineCardTitle = styled.h2`
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
`;

const Muted = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: #64748b;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 6px 0 4px;
`;

const TimelineList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TimelineRecordItem = styled.li`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  position: relative;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    left: 5px;
    top: 12px;
    bottom: -10px;
    width: 2px;
    background: rgba(148, 163, 184, 0.22);
  }
`;

const TimelineDotSmall = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: 2px solid #0ea5e9;
  background: #f9fafb;
  flex-shrink: 0;
  margin-top: 8px;
`;

const RecordContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const RecordCard = styled.div`
  border-radius: 12px;
  padding: 10px 10px 10px;
  background: #ffffff;
  border: 1px solid rgba(148, 163, 184, 0.18);
`;

const RecordDate = styled.div`
  font-size: 11px;
  color: #6b7280;
`;

const RecordTitle = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
  margin-top: 2px;
`;

const RecordSubtitle = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
`;

const RecordSnippet = styled.div`
  font-size: 12px;
  color: #0f172a;
  margin-top: 6px;
  line-height: 1.45;
`;

const TimelineHint = styled.p`
  margin: 10px 0 0;
  font-size: 12px;
  color: #94a3b8;
`;
