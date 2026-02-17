// src/pages/PetSummarySharePage.jsx

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
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
import { FiAlertCircle, FiActivity, FiFileText } from "react-icons/fi";
import RawUploadRecordCard from "../components/RawUploadRecordCard";

const FUNCTIONS_BASE_URL =
  "https://us-central1-vetcationapp.cloudfunctions.net";

function PetSummarySharePage() {
  const { shareId } = useParams();

  // base page load (link validation, pet, records, pets wall)
  const [baseLoading, setBaseLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  // AI summary load
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(null);

  const [shareMeta, setShareMeta] = useState(null);
  const [pet, setPet] = useState(null);
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [petsList, setPetsList] = useState([]);

  useEffect(() => {
    const db = getFirestore();

    const load = async () => {
      if (!shareId) {
        setPageError("This link is not valid.");
        setBaseLoading(false);
        setSummaryLoading(false);
        return;
      }

      try {
        // 1) Look up share metadata from petSummaryShareInvites
        const shareRef = doc(db, "petSummaryShareInvites", shareId);
        const shareSnap = await getDoc(shareRef);

        if (!shareSnap.exists()) {
          setPageError("This summary link could not be found.");
          setBaseLoading(false);
          setSummaryLoading(false);
          return;
        }

        const shareData = shareSnap.data();
        setShareMeta(shareData);

        // Expiration check
        let expiresAtMs = null;
        const rawExpires = shareData.expiresAt;
        if (rawExpires) {
          if (typeof rawExpires.toDate === "function") {
            expiresAtMs = rawExpires.toDate().getTime();
          } else if (typeof rawExpires.toMillis === "function") {
            expiresAtMs = rawExpires.toMillis();
          } else {
            const parsed = new Date(rawExpires);
            if (!Number.isNaN(parsed.getTime())) {
              expiresAtMs = parsed.getTime();
            }
          }
        }

        if (expiresAtMs && expiresAtMs < Date.now()) {
          setPageError("This summary link has expired.");
          setBaseLoading(false);
          setSummaryLoading(false);
          return;
        }

        if (shareData.status && shareData.status !== "active") {
          setPageError("This summary link is no longer active.");
          setBaseLoading(false);
          setSummaryLoading(false);
          return;
        }

        const { petId, ownerUid } = shareData;

        if (!petId || !ownerUid) {
          setPageError("This summary link is missing pet information.");
          setBaseLoading(false);
          setSummaryLoading(false);
          return;
        }

        // 2) Load Firestore data in parallel:
        //    - pet header
        //    - original medical history (records)
        //    - other pets for blurred wall
        const petRef = doc(db, "pets", petId);
        const recordsCol = collection(db, "pets", petId, "records");
        const petsCol = collection(db, "pets");

        const [petSnap, recordsSnap, petsSnap] = await Promise.all([
          getDoc(petRef),
          getDocs(query(recordsCol, orderBy("createdAt", "desc"), limit(50))),
          getDocs(query(petsCol, limit(40))),
        ]);

        if (petSnap.exists()) {
          setPet({ id: petSnap.id, ...petSnap.data() });
        }

        setRecords(
          recordsSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );

        setPetsList(
          petsSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );

        // Firestore data is ready: show header, original history, other pets
        setBaseLoading(false);

        // 3) Separately fetch the AI clinical summary
        setSummaryLoading(true);
        setSummaryError(null);

        try {
          const resp = await fetch(`${FUNCTIONS_BASE_URL}/petVetSummaryView`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              petId,
              ownerUid,
            }),
          });

          const respData = await resp.json().catch(() => null);

          if (!resp.ok || !respData || !respData.ok || !respData.summary) {
            const msg =
              (respData && respData.error) ||
              "The summary could not be generated right now.";
            setSummaryError(msg);
            setSummary(null);
          } else {
            setSummary(respData.summary);
          }
        } catch (summaryErr) {
          console.error("Error fetching summary in shared page", summaryErr);
          setSummaryError("The summary could not be generated right now.");
          setSummary(null);
        } finally {
          setSummaryLoading(false);
        }
      } catch (err) {
        console.error("Error loading shared summary", err);
        setPageError("There was a problem loading this summary.");
        setBaseLoading(false);
        setSummaryLoading(false);
      }
    };

    load();
  }, [shareId]);

  const hasAnyContent = useMemo(() => {
    if (!summary) return false;
    const keys = [
      "allergies",
      "currentMedications",
      "chronicProblems",
      "surgeriesAndProcedures",
      "recentLabsOrImaging",
      "recentVisitsAndEvents",
      "redFlagsForVetToDoubleCheck",
      "missingOrUnclearInformation",
      "overallImpression",
    ];
    return keys.some((key) => {
      const val = summary[key];
      if (Array.isArray(val)) return val.length > 0;
      if (typeof val === "string") return val.trim().length > 0;
      return false;
    });
  }, [summary]);

  const petDisplayName = pet?.displayName || shareMeta?.petName || "This pet";
  const species = pet?.type || pet?.species || "Pet";
  const currentPetId = shareMeta?.petId || pet?.id || "";

  const dobDate =
    pet?.dob && typeof pet.dob.toDate === "function"
      ? pet.dob.toDate()
      : pet?.dob instanceof Date
      ? pet.dob
      : null;

  const dobLabel = dobDate
    ? dobDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown";

  let ageLabel = "";
  if (dobDate) {
    const now = new Date();
    const diffMs = now.getTime() - dobDate.getTime();
    const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
    if (diffYears >= 2) {
      ageLabel = `${Math.floor(diffYears)} years old`;
    } else {
      const diffMonths = diffMs / (1000 * 60 * 60 * 24 * 30.4);
      if (diffMonths >= 2) {
        ageLabel = `${Math.floor(diffMonths)} months old`;
      } else {
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        ageLabel = `${Math.max(0, Math.floor(diffDays))} days old`;
      }
    }
  }

  const renderListSection = (title, items, muted) => {
    if (!items || !items.length) return null;
    return (
      <Section>
        <SectionHeader>
          <SectionIcon>
            <FiFileText />
          </SectionIcon>
          <SectionTitle>{title}</SectionTitle>
        </SectionHeader>
        <BulletList>
          {items.map((item, idx) => (
            <BulletItem key={`${title}-${idx}`} $muted={muted}>
              {item}
            </BulletItem>
          ))}
        </BulletList>
      </Section>
    );
  };

  const renderVisits = () => {
    const events = summary?.recentVisitsAndEvents;
    if (!events || !events.length) return null;
    return (
      <Section>
        <SectionHeader>
          <SectionIcon>
            <FiActivity />
          </SectionIcon>
          <SectionTitle>Recent visits and events</SectionTitle>
        </SectionHeader>
        <Timeline>
          {events.map((ev, idx) => (
            <TimelineItem key={`visit-${idx}`}>
              <TimelineDot />
              <TimelineContent>
                <TimelineDate>{ev.date || "Date unknown"}</TimelineDate>
                <TimelineTitle>{ev.title || "Visit"}</TimelineTitle>
                {ev.details && <TimelineDetails>{ev.details}</TimelineDetails>}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Section>
    );
  };

  const formatRecordDate = (rec) => {
    const ts = rec.createdAt;
    let date;
    if (ts && typeof ts.toDate === "function") {
      date = ts.toDate();
    } else if (ts instanceof Date) {
      date = ts;
    } else if (typeof ts === "string") {
      const parsed = new Date(ts);
      if (!Number.isNaN(parsed.getTime())) {
        date = parsed;
      }
    }
    if (!date) return "Unknown date";
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRecordTitle = (rec) =>
    rec.title ||
    rec.noteTitle ||
    rec.reason ||
    rec.visitTitle ||
    rec.type ||
    rec.recordType ||
    "Record";

  const getRecordSubtitle = (rec) =>
    rec.clinicName || rec.location || rec.source || rec.category || "";

  const getRecordSnippet = (rec) => {
    const textField =
      rec.summary ||
      rec.note ||
      rec.content ||
      rec.description ||
      rec.details ||
      "";
    if (!textField) return "";
    if (textField.length <= 120) return textField;
    return textField.slice(0, 117) + "...";
  };

  const renderMedicalTimeline = () => {
    if (!records || records.length === 0) {
      return (
        <TimelineCard>
          <TimelineCardTitle>Original medical history</TimelineCardTitle>
          <TimelineEmpty>
            No medical records were found for this pet in the shared view.
          </TimelineEmpty>
        </TimelineCard>
      );
    }

    return (
      <TimelineCard>
        <TimelineCardTitle>Original medical history</TimelineCardTitle>
        <TimelineList>
          {records.map((rec) => {
            const isRawUpload = rec.type === "raw_upload";

            return (
              <TimelineRecordItem key={rec.id}>
                <TimelineDotSmall />
                <RecordContent>
                  {isRawUpload ? (
                    <RawUploadRecordCard record={rec} />
                  ) : (
                    <>
                      <RecordDate>{formatRecordDate(rec)}</RecordDate>
                      <RecordTitle>{getRecordTitle(rec)}</RecordTitle>
                      {getRecordSubtitle(rec) ? (
                        <RecordSubtitle>
                          {getRecordSubtitle(rec)}
                        </RecordSubtitle>
                      ) : null}
                      {getRecordSnippet(rec) ? (
                        <RecordSnippet>{getRecordSnippet(rec)}</RecordSnippet>
                      ) : null}
                    </>
                  )}
                </RecordContent>
              </TimelineRecordItem>
            );
          })}
        </TimelineList>
        <TimelineHint>
          For full details, please review the complete records inside your
          practice or with the pet owner.
        </TimelineHint>
      </TimelineCard>
    );
  };

  const getPetInitials = (p) => {
    const name = p.displayName || p.name || p.petName || "";
    if (!name) return "?";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  const getPetLabel = (p) => p.displayName || p.name || p.petName || "Pet";

  const getPetMeta = (p) => {
    const species = p.type || p.species || "";
    const sex = p.petSex || p.sex || "";
    if (species && sex) return `${species} · ${sex}`;
    if (species) return species;
    if (sex) return sex;
    return "";
  };

  const renderPetsWall = () => {
    if (!petsList || petsList.length === 0) return null;

    // Reorder so that the current pet appears as the third row
    let orderedPets = petsList;
    const idx = petsList.findIndex((p) => p.id === currentPetId);

    if (idx !== -1) {
      const activePet = petsList[idx];

      // All other pets except the active one
      const others = [...petsList.slice(0, idx), ...petsList.slice(idx + 1)];

      const firstTwo = others.slice(0, 2);
      const rest = others.slice(2);

      // If there are at least two "other" pets, active pet will be row 3
      // Otherwise it will still be near the top
      orderedPets = [...firstTwo, activePet, ...rest];
    } else {
      // No match for current pet id, keep original order
      orderedPets = petsList;
    }

    return (
      <PetsWallCard>
        <PetsWallTitle>Other pets in Vetcation</PetsWallTitle>
        <PetsWallSubtitle>
          You are viewing one pet in a shared medical memory. Other pet
          identifiers are blurred for privacy.
        </PetsWallSubtitle>
        <PetsScroll>
          {orderedPets.map((p) => {
            const isActive = p.id === currentPetId;
            return (
              <PetRow key={p.id} $isActive={isActive}>
                <PetBubble $isActive={isActive}>{getPetInitials(p)}</PetBubble>
                <PetNameText $isActive={isActive}>{getPetLabel(p)}</PetNameText>
                {getPetMeta(p) ? (
                  <PetMetaText $isActive={isActive}>
                    {getPetMeta(p)}
                  </PetMetaText>
                ) : null}
              </PetRow>
            );
          })}
        </PetsScroll>
      </PetsWallCard>
    );
  };

  return (
    <PageWrapper>
      <CenteredCard>
        {baseLoading && (
          <StateBlock>
            <Spinner />
            <StateText>Loading shared medical record...</StateText>
          </StateBlock>
        )}

        {!baseLoading && pageError && (
          <StateBlock>
            <StateIconError>
              <FiAlertCircle />
            </StateIconError>
            <StateTitle>We could not open this link</StateTitle>
            <StateText>{pageError}</StateText>
          </StateBlock>
        )}

        {!baseLoading && !pageError && (
          <>
            <TopBanner>
              <Badge>For veterinary use</Badge>
              <BannerText>
                This page shows a structured summary based on the records
                uploaded for this pet. Final decisions always belong to the
                attending veterinarian.
              </BannerText>
            </TopBanner>

            <HeaderRow>
              <PetAvatar>
                {pet?.photoURL ? (
                  <PetImage src={pet.photoURL} alt={petDisplayName} />
                ) : (
                  <AvatarFallback>
                    {petDisplayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </PetAvatar>
              <HeaderInfo>
                <PetName>{petDisplayName}</PetName>
                <PetMeta>
                  {species}
                  {ageLabel ? ` · ${ageLabel}` : ""}
                </PetMeta>
                <PetMetaSmall>Date of birth: {dobLabel}</PetMetaSmall>
              </HeaderInfo>
            </HeaderRow>

            <LayoutGrid>
              {/* Left column: clinical summary card */}
              <ColumnLeft>
                {summaryLoading && !summary && (
                  <SummaryShell>
                    <SummaryTitle>Vet ready clinical summary</SummaryTitle>
                    <SummaryLoadingRow>
                      <Spinner />
                      <SummaryLoadingText>
                        Creating a one page summary from uploaded records...
                      </SummaryLoadingText>
                    </SummaryLoadingRow>
                  </SummaryShell>
                )}

                {!summaryLoading && summaryError && !summary && (
                  <SummaryShell>
                    <SummaryTitle>Summary not available</SummaryTitle>
                    <SummaryErrorText>{summaryError}</SummaryErrorText>
                  </SummaryShell>
                )}

                {!summaryLoading && summary && (
                  <SummaryShell>
                    <SummaryTitle>Vet ready clinical summary</SummaryTitle>

                    {!hasAnyContent ? (
                      <SummaryErrorText>
                        A structured summary could not be generated from the
                        available records yet.
                      </SummaryErrorText>
                    ) : (
                      <>
                        {renderListSection(
                          "Allergies",
                          summary.allergies || []
                        )}
                        {renderListSection(
                          "Current medications",
                          summary.currentMedications || []
                        )}
                        {renderListSection(
                          "Chronic or active problems",
                          summary.chronicProblems || []
                        )}
                        {renderListSection(
                          "Surgeries and procedures",
                          summary.surgeriesAndProcedures || []
                        )}
                        {renderListSection(
                          "Recent labs or imaging",
                          summary.recentLabsOrImaging || [],
                          true
                        )}

                        {renderVisits()}

                        {summary.redFlagsForVetToDoubleCheck &&
                          summary.redFlagsForVetToDoubleCheck.length > 0 && (
                            <AlertSection>
                              <AlertHeader>
                                <FiAlertCircle />
                                <AlertTitle>
                                  Red flags to double check
                                </AlertTitle>
                              </AlertHeader>
                              <BulletList>
                                {summary.redFlagsForVetToDoubleCheck.map(
                                  (item, idx) => (
                                    <BulletItem key={`rf-${idx}`}>
                                      {item}
                                    </BulletItem>
                                  )
                                )}
                              </BulletList>
                            </AlertSection>
                          )}

                        {summary.overallImpression &&
                          summary.overallImpression.trim().length > 0 && (
                            <Section>
                              <SectionHeader>
                                <SectionIcon>
                                  <FiFileText />
                                </SectionIcon>
                                <SectionTitle>Overall impression</SectionTitle>
                              </SectionHeader>
                              <OverallText>
                                {summary.overallImpression.trim()}
                              </OverallText>
                            </Section>
                          )}

                        {summary.missingOrUnclearInformation &&
                          summary.missingOrUnclearInformation.length > 0 && (
                            <Section>
                              <SectionHeader>
                                <SectionIcon>
                                  <FiFileText />
                                </SectionIcon>
                                <SectionTitle>
                                  Missing or unclear information
                                </SectionTitle>
                              </SectionHeader>
                              <BulletList>
                                {summary.missingOrUnclearInformation.map(
                                  (item, idx) => (
                                    <BulletItem key={`mi-${idx}`} $muted>
                                      {item}
                                    </BulletItem>
                                  )
                                )}
                              </BulletList>
                            </Section>
                          )}

                        <FooterNote>
                          This summary is provided to help you orient quickly.
                          It is not a substitute for your own clinical judgment,
                          physical examination, or review of full records.
                        </FooterNote>
                      </>
                    )}
                  </SummaryShell>
                )}
              </ColumnLeft>

              {/* Right column: Original medical history + Other pets cards */}
              <ColumnRight>
                {renderMedicalTimeline()}
                {renderPetsWall()}
              </ColumnRight>
            </LayoutGrid>
          </>
        )}
      </CenteredCard>
    </PageWrapper>
  );
}

export default PetSummarySharePage;

/* styled components */

const PageWrapper = styled.main`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 16px;
  background: radial-gradient(
    circle at top,
    #e0f2fe 0,
    #f9fafb 48%,
    #eef2ff 100%
  );
`;

const CenteredCard = styled.section`
  width: 100%;
  max-width: 980px;
  border-radius: 24px;
  padding: 24px 24px 28px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08),
    0 0 0 1px rgba(148, 163, 184, 0.15);
`;

const TopBanner = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  font-size: 13px;
  color: #4b5563;
  margin-bottom: 16px;
`;

const Badge = styled.span`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 4px 10px;
  border-radius: 999px;
  background: #dcfce7;
  color: #166534;
  flex-shrink: 0;
`;

const BannerText = styled.p`
  margin: 0;
  line-height: 1.4;
`;

const HeaderRow = styled.header`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  align-items: center;
`;

const PetAvatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 20px;
  overflow: hidden;
  background: #e5e7eb;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PetImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarFallback = styled.span`
  font-size: 32px;
  font-weight: 700;
  color: #6b7280;
`;

const HeaderInfo = styled.div`
  flex: 1;
`;

const PetName = styled.h1`
  font-size: 24px;
  line-height: 1.25;
  margin: 0 0 4px;
`;

const PetMeta = styled.p`
  margin: 0;
  font-size: 14px;
  color: #4b5563;
`;

const PetMetaSmall = styled.p`
  margin: 2px 0 0;
  font-size: 12px;
  color: #6b7280;
`;

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2.1fr) minmax(0, 1.4fr);
  gap: 20px;
  align-items: flex-start;

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const ColumnLeft = styled.div``;

const ColumnRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* Summary shell */

const SummaryShell = styled.section`
  border-radius: 16px;
  padding: 12px 12px 14px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
`;

const SummaryTitle = styled.h2`
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 700;
  color: #111827;
`;

const SummaryLoadingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const SummaryLoadingText = styled.p`
  margin: 0;
  font-size: 13px;
  color: #6b7280;
`;

const SummaryErrorText = styled.p`
  margin: 6px 0 0;
  font-size: 13px;
  color: #b91c1c;
`;

/* Common sections */

const Section = styled.section`
  margin-top: 18px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
`;

const SectionIcon = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #6b7280;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #111827;
`;

const BulletList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const BulletItem = styled.li`
  position: relative;
  padding-left: 16px;
  margin-bottom: 4px;
  font-size: 13px;
  color: ${(props) => (props.$muted ? "#6b7280" : "#111827")};

  &::before {
    content: "";
    position: absolute;
    left: 5px;
    top: 0.7em;
    width: 4px;
    height: 4px;
    border-radius: 999px;
    background: ${(props) => (props.$muted ? "#9ca3af" : "#6b7280")};
    transform: translateY(-50%);
  }
`;

const Timeline = styled.ul`
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
`;

const TimelineItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  position: relative;
  padding-bottom: 12px;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    left: 7px;
    top: 12px;
    bottom: 0;
    width: 2px;
    background: #e5e7eb;
  }
`;

const TimelineDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 999px;
  border: 2px solid #0ea5e9;
  background: #f9fafb;
  flex-shrink: 0;
  margin-top: 2px;
`;

const TimelineContent = styled.div`
  flex: 1;
`;

const TimelineDate = styled.div`
  font-size: 11px;
  color: #6b7280;
`;

const TimelineTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  margin-top: 2px;
`;

const TimelineDetails = styled.div`
  font-size: 12px;
  color: #111827;
  margin-top: 2px;
`;

const AlertSection = styled.section`
  margin-top: 18px;
  border-radius: 14px;
  padding: 12px 12px 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
`;

const AlertHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 700;
  color: #b91c1c;

  svg {
    font-size: 16px;
  }
`;

const AlertTitle = styled.span``;

const OverallText = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: #111827;
  line-height: 1.5;
`;

const FooterNote = styled.p`
  margin: 24px 0 4px;
  font-size: 11px;
  color: #6b7280;
  text-align: left;
`;

/* Page level state */

const StateBlock = styled.div`
  padding: 32px 8px;
  text-align: center;
`;

const StateText = styled.p`
  margin: 10px 0 0;
  font-size: 13px;
  color: #6b7280;
`;

const StateTitle = styled.h2`
  margin: 10px 0 4px;
  font-size: 16px;
`;

const StateIconError = styled.div`
  font-size: 28px;
  color: #b91c1c;
`;

const Spinner = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 2px solid #e5e7eb;
  border-top-color: #0ea5e9;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

/* Right column timeline card */

const TimelineCard = styled.section`
  border-radius: 16px;
  padding: 12px 12px 10px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
`;

const TimelineCardTitle = styled.h2`
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 700;
  color: #111827;
`;

const TimelineList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
  max-height: 280px;
  overflow: auto;
`;

const TimelineRecordItem = styled.li`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding-bottom: 8px;
  position: relative;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    left: 5px;
    top: 12px;
    bottom: 0;
    width: 2px;
    background: #e5e7eb;
  }
`;

const TimelineDotSmall = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: 2px solid #0ea5e9;
  background: #f9fafb;
  flex-shrink: 0;
  margin-top: 2px;
`;

const RecordContent = styled.div`
  flex: 1;
`;

const RecordDate = styled.div`
  font-size: 11px;
  color: #6b7280;
`;

const RecordTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  margin-top: 1px;
`;

const RecordSubtitle = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: 1px;
`;

const RecordSnippet = styled.div`
  font-size: 12px;
  color: #111827;
  margin-top: 2px;
`;

const TimelineEmpty = styled.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: #6b7280;
`;

const TimelineHint = styled.p`
  margin: 8px 0 0;
  font-size: 11px;
  color: #9ca3af;
`;

/* Blurred pets wall */

const PetsWallCard = styled.section`
  border-radius: 16px;
  padding: 12px 12px 10px;
  background: #ffffff;
  border: 1px dashed #d1d5db;
`;

const PetsWallTitle = styled.h2`
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #111827;
`;

const PetsWallSubtitle = styled.p`
  margin: 4px 0 8px;
  font-size: 11px;
  color: #6b7280;
`;

const PetsScroll = styled.div`
  max-height: 220px;
  overflow: auto;
  padding-right: 4px;
`;

const PetRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 6px;
  border-radius: 999px;
  background: ${(props) => (props.$isActive ? "#eff6ff" : "transparent")};
  margin-bottom: 4px;
`;

const PetBubble = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: ${(props) => (props.$isActive ? "#2563eb" : "#e5e7eb")};
  color: ${(props) => (props.$isActive ? "#ffffff" : "#4b5563")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
`;

const PetNameText = styled.span`
  font-size: 12px;
  color: #111827;
  filter: ${(props) => (props.$isActive ? "none" : "blur(3px)")};
  opacity: ${(props) => (props.$isActive ? 1 : 0.65)};
`;

const PetMetaText = styled.span`
  font-size: 11px;
  color: #6b7280;
  margin-left: auto;
  filter: ${(props) => (props.$isActive ? "none" : "blur(2px)")};
  opacity: ${(props) => (props.$isActive ? 1 : 0.6)};
`;
