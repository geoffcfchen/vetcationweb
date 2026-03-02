// src/components/VetSummaryCard.jsx
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import {
  FiAlertCircle,
  FiActivity,
  FiFileText,
  FiLink,
  FiX,
} from "react-icons/fi";
import RawUploadRecordCard from "./RawUploadRecordCard";

const MAX_LABELS_INLINE = 2;

const formatLabelBadge = (labels) => {
  if (!Array.isArray(labels) || labels.length === 0) return "";
  if (labels.length <= MAX_LABELS_INLINE) {
    return labels.join(", ");
  }
  return `${labels.slice(0, MAX_LABELS_INLINE).join(", ")}, ...`;
};

const parseDateAndText = (item) => {
  if (typeof item !== "string") {
    return { date: "Date unknown", text: "" };
  }

  const firstColon = item.indexOf(":");
  if (firstColon > -1) {
    const datePart = item.slice(0, firstColon).trim();
    const textPart = item.slice(firstColon + 1).trim();
    if (datePart.length > 0 && textPart.length > 0) {
      return { date: datePart, text: textPart };
    }
  }

  return {
    date: "Date unknown",
    text: item.trim(),
  };
};

const getRecordTitle = (rec) =>
  rec.title ||
  rec.noteTitle ||
  rec.reason ||
  rec.visitTitle ||
  rec.type ||
  rec.recordType ||
  "Record";

function VetSummaryCard({
  summary,
  summaryLoading,
  summaryError,
  summaryUpdatedAt,
  loadingMessage,
  refreshElapsedSec,
  records = [],
}) {
  const hasAnyContent = useMemo(() => {
    if (!summary) return false;
    const keys = [
      "ownerMainConcerns",
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

  const recordsById = useMemo(() => {
    const map = {};
    (records || []).forEach((rec) => {
      if (!rec || !rec.id) return;
      map[rec.id] = rec;
    });
    return map;
  }, [records]);

  const [sourcesModalOpen, setSourcesModalOpen] = useState(false);
  const [activeSourceSnippets, setActiveSourceSnippets] = useState([]);
  const [activeSourcesContext, setActiveSourcesContext] = useState({
    sectionKey: null,
    itemIndex: null,
    sectionTitle: "",
  });

  const hasSourceMetadata =
    summary && summary.sourcesBySection && summary.sourceSnippets;

  const openSourcesFor = (sectionKey, sectionTitle, itemIndex) => {
    if (!hasSourceMetadata) return;

    const labels = summary.sourcesBySection[sectionKey]?.[itemIndex] || [];
    if (!labels || labels.length === 0) return;

    const labelSet = new Set(labels);
    const snippets = summary.sourceSnippets.filter((sn) =>
      labelSet.has(sn.label),
    );

    if (!snippets.length) return;

    setActiveSourceSnippets(snippets);
    setActiveSourcesContext({ sectionKey, itemIndex, sectionTitle });
    setSourcesModalOpen(true);
  };

  const closeSourcesModal = () => {
    setSourcesModalOpen(false);
    setActiveSourceSnippets([]);
    setActiveSourcesContext({
      sectionKey: null,
      itemIndex: null,
      sectionTitle: "",
    });
  };

  const renderListSection = (sectionKey, title, items, muted) => {
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
          {items.map((item, idx) => {
            const labels =
              hasSourceMetadata && summary.sourcesBySection[sectionKey]?.[idx]
                ? summary.sourcesBySection[sectionKey][idx]
                : [];
            const hasSources =
              hasSourceMetadata && Array.isArray(labels) && labels.length > 0;

            return (
              <BulletItem key={`${sectionKey}-${idx}`} $muted={muted}>
                <BulletText>{item}</BulletText>
                {hasSources && (
                  <SourcesBadge
                    type="button"
                    onClick={() => openSourcesFor(sectionKey, title, idx)}
                  >
                    [{formatLabelBadge(labels)}]
                  </SourcesBadge>
                )}
              </BulletItem>
            );
          })}
        </BulletList>
      </Section>
    );
  };

  const renderTableSection = (sectionKey, title, items) => {
    if (!items || !items.length) return null;

    return (
      <Section>
        <SectionHeader>
          <SectionIcon>
            <FiFileText />
          </SectionIcon>
          <SectionTitle>{title}</SectionTitle>
        </SectionHeader>

        <MiniTable>
          <thead>
            <tr>
              <MiniTh>Date</MiniTh>
              <MiniTh>Details</MiniTh>
              <MiniThSources>Sources</MiniThSources>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const { date, text } = parseDateAndText(item);
              const labels =
                hasSourceMetadata && summary.sourcesBySection[sectionKey]?.[idx]
                  ? summary.sourcesBySection[sectionKey][idx]
                  : [];
              const hasSources =
                hasSourceMetadata && Array.isArray(labels) && labels.length > 0;

              return (
                <tr key={`${sectionKey}-row-${idx}`}>
                  <MiniTdDate>{date}</MiniTdDate>
                  <MiniTdText>{text}</MiniTdText>
                  <MiniTdSources>
                    {hasSources && (
                      <SourcesBadge
                        type="button"
                        onClick={() => openSourcesFor(sectionKey, title, idx)}
                      >
                        [{formatLabelBadge(labels)}]
                      </SourcesBadge>
                    )}
                  </MiniTdSources>
                </tr>
              );
            })}
          </tbody>
        </MiniTable>
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
          {events.map((ev, idx) => {
            const labels =
              hasSourceMetadata &&
              summary.sourcesBySection.recentVisitsAndEvents &&
              summary.sourcesBySection.recentVisitsAndEvents[idx]
                ? summary.sourcesBySection.recentVisitsAndEvents[idx]
                : [];
            const hasSources =
              hasSourceMetadata && Array.isArray(labels) && labels.length > 0;

            return (
              <TimelineItem key={`visit-${idx}`}>
                <TimelineDot />
                <TimelineContent>
                  <TimelineHeaderRow>
                    <TimelineDate>{ev.date || "Date unknown"}</TimelineDate>
                    {hasSources && (
                      <SourcesBadge
                        type="button"
                        onClick={() =>
                          openSourcesFor(
                            "recentVisitsAndEvents",
                            "Recent visits and events",
                            idx,
                          )
                        }
                      >
                        [{formatLabelBadge(labels)}]
                      </SourcesBadge>
                    )}
                  </TimelineHeaderRow>
                  <TimelineTitle>{ev.title || "Visit"}</TimelineTitle>
                  {ev.details && (
                    <TimelineDetails>{ev.details}</TimelineDetails>
                  )}
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </Section>
    );
  };

  const renderSourcesModal = () => {
    if (!sourcesModalOpen || !activeSourceSnippets.length) return null;

    const { sectionTitle } = activeSourcesContext;

    return (
      <SourcesModalBackdrop onClick={closeSourcesModal}>
        <SourcesModalCard onClick={(e) => e.stopPropagation()}>
          <SourcesModalHeader>
            <SourcesModalTitle>Sources from medical records</SourcesModalTitle>
            {sectionTitle ? (
              <SourcesModalSubtitle>{sectionTitle}</SourcesModalSubtitle>
            ) : null}
            <SourcesModalCloseButton type="button" onClick={closeSourcesModal}>
              <FiX />
            </SourcesModalCloseButton>
          </SourcesModalHeader>

          <SourcesModalBody>
            {activeSourceSnippets.map((snippet) => {
              const rec =
                snippet.recordId && recordsById[snippet.recordId]
                  ? recordsById[snippet.recordId]
                  : null;

              let pageLabel = "";
              if (
                typeof snippet.pageStart === "number" &&
                typeof snippet.pageEnd === "number" &&
                snippet.pageEnd !== snippet.pageStart
              ) {
                pageLabel = `Pages ${snippet.pageStart} to ${snippet.pageEnd}`;
              } else if (typeof snippet.pageStart === "number") {
                pageLabel = `Page ${snippet.pageStart}`;
              }

              return (
                <SourceSnippetBlock key={snippet.label}>
                  <SourceSnippetHeaderRow>
                    <SourceSnippetLabelChip>
                      {snippet.label}
                    </SourceSnippetLabelChip>
                    {rec ? (
                      <SourceRecordLinkRow>
                        <FiLink />
                        <SourceRecordLinkLabel>
                          {getRecordTitle(rec)}
                        </SourceRecordLinkLabel>
                      </SourceRecordLinkRow>
                    ) : snippet.sourceTitle ? (
                      <SourceRecordTitleOnly>
                        {snippet.sourceTitle}
                      </SourceRecordTitleOnly>
                    ) : null}
                  </SourceSnippetHeaderRow>
                  {(pageLabel || snippet.sourceTitle) && (
                    <SourceSnippetMetaRow>
                      {pageLabel && <span>{pageLabel}</span>}
                      {!rec && snippet.sourceTitle && !pageLabel && (
                        <span>{snippet.sourceTitle}</span>
                      )}
                    </SourceSnippetMetaRow>
                  )}
                  <SourceSnippetText>{snippet.text}</SourceSnippetText>

                  {rec && rec.type === "raw_upload" && (
                    <SourceRecordPreview>
                      <RawUploadRecordCard record={rec} />
                    </SourceRecordPreview>
                  )}
                </SourceSnippetBlock>
              );
            })}
          </SourcesModalBody>

          <SourcesModalFooter>
            <SourcesHintText>
              These snippets come from the uploaded medical records for this
              pet. Use them to verify how the summary was derived.
            </SourcesHintText>
          </SourcesModalFooter>
        </SourcesModalCard>
      </SourcesModalBackdrop>
    );
  };

  // Render states

  if (summaryLoading && !summary) {
    return (
      <Card>
        <SummaryTitle>Vet ready clinical summary</SummaryTitle>
        <SummaryLoadingRow>
          <Spinner />
          <SummaryLoadingText>{loadingMessage}</SummaryLoadingText>
          <SummaryHintText>
            You can still upload new records while this report prepares in the
            background.
          </SummaryHintText>
        </SummaryLoadingRow>
      </Card>
    );
  }

  if (!summaryLoading && summaryError && !summary) {
    return (
      <Card>
        <SummaryTitle>Vet ready clinical summary</SummaryTitle>
        <SummaryErrorText>{summaryError}</SummaryErrorText>
      </Card>
    );
  }

  return (
    <Card>
      <SummaryTitle>Vet ready clinical summary</SummaryTitle>

      <SummaryMetaRow>
        <SummaryMetaText>
          {summaryUpdatedAt
            ? `Last updated ${summaryUpdatedAt.toLocaleString()}`
            : "Last updated: unknown"}
        </SummaryMetaText>

        {summaryLoading && summary && (
          <SummaryUpdatingPill>
            <InlineSpinner />
            Updating from latest records · {refreshElapsedSec}s
          </SummaryUpdatingPill>
        )}
      </SummaryMetaRow>

      {!hasAnyContent ? (
        <SummaryErrorText>
          A structured summary could not be generated from the available records
          yet.
        </SummaryErrorText>
      ) : (
        <>
          {renderListSection(
            "ownerMainConcerns",
            "What the owner is worried about",
            summary.ownerMainConcerns || [],
          )}

          {renderVisits()}

          {renderListSection(
            "chronicProblems",
            "Chronic or active problems",
            summary.chronicProblems || [],
          )}

          {renderListSection(
            "currentMedications",
            "Current medications",
            summary.currentMedications || [],
          )}

          {renderTableSection(
            "surgeriesAndProcedures",
            "Surgeries and procedures",
            summary.surgeriesAndProcedures || [],
          )}

          {renderTableSection(
            "recentLabsOrImaging",
            "Recent labs or imaging",
            summary.recentLabsOrImaging || [],
          )}

          {renderListSection("allergies", "Allergies", summary.allergies || [])}

          {summary.redFlagsForVetToDoubleCheck &&
            summary.redFlagsForVetToDoubleCheck.length > 0 && (
              <AlertSection>
                <AlertHeader>
                  <FiAlertCircle />
                  <AlertTitle>Red flags to double check</AlertTitle>
                </AlertHeader>
                <BulletList>
                  {summary.redFlagsForVetToDoubleCheck.map((item, idx) => {
                    const labels =
                      hasSourceMetadata &&
                      summary.sourcesBySection &&
                      summary.sourcesBySection.redFlagsForVetToDoubleCheck &&
                      summary.sourcesBySection.redFlagsForVetToDoubleCheck[idx]
                        ? summary.sourcesBySection.redFlagsForVetToDoubleCheck[
                            idx
                          ]
                        : [];
                    const hasSources =
                      hasSourceMetadata &&
                      Array.isArray(labels) &&
                      labels.length > 0;
                    return (
                      <BulletItem key={`rf-${idx}`}>
                        <BulletText>{item}</BulletText>
                        {hasSources && (
                          <SourcesBadge
                            type="button"
                            onClick={() =>
                              openSourcesFor(
                                "redFlagsForVetToDoubleCheck",
                                "Red flags to double check",
                                idx,
                              )
                            }
                          >
                            [{formatLabelBadge(labels)}]
                          </SourcesBadge>
                        )}
                      </BulletItem>
                    );
                  })}
                </BulletList>
              </AlertSection>
            )}

          {summary.missingOrUnclearInformation &&
            summary.missingOrUnclearInformation.length > 0 &&
            renderListSection(
              "missingOrUnclearInformation",
              "Missing or unclear information",
              summary.missingOrUnclearInformation || [],
              true,
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
                <OverallText>{summary.overallImpression.trim()}</OverallText>
              </Section>
            )}

          <FooterNote>
            This summary is provided to help vets orient quickly. It is not a
            substitute for clinical judgment, physical examination, or review of
            full records.
          </FooterNote>
        </>
      )}

      {renderSourcesModal()}
    </Card>
  );
}

export default VetSummaryCard;

// Styles

const Card = styled.section`
  border-radius: 16px;
  padding: 12px 12px 14px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  min-height: 120px;
`;

const SummaryTitle = styled.h2`
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 700;
  color: #111827;
`;

const SummaryMetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 0 0 6px;
`;

const SummaryMetaText = styled.p`
  margin: 0;
  font-size: 11px;
  color: #6b7280;
`;

const SummaryUpdatingPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #3730a3;
  background: #eef2ff;
  border-radius: 999px;
  padding: 2px 8px;
  white-space: nowrap;
`;

const InlineSpinner = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: 2px solid rgba(55, 48, 163, 0.2);
  border-top-color: rgba(55, 48, 163, 0.9);
  animation: spin 0.8s linear infinite;
`;

const SummaryLoadingRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 8px;
  padding: 10px 4px 6px;
`;

const SummaryLoadingText = styled.p`
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  text-align: center;
`;

const SummaryHintText = styled.p`
  margin: 0;
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
`;

const SummaryErrorText = styled.p`
  margin: 6px 0 0;
  font-size: 13px;
  color: #b91c1c;
`;

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

const SectionTitle = styled.h3`
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
  display: flex;
  align-items: flex-start;
  gap: 6px;
  flex-wrap: wrap;

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

const BulletText = styled.span`
  flex: 1;
  min-width: 0;
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

const TimelineHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
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

const SourcesBadge = styled.button`
  border: none;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 999px;
  padding: 1px 6px;
  font-size: 11px;
  cursor: pointer;
  flex-shrink: 0;
  display: inline-block;

  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: top;

  &:hover {
    background: #dbeafe;
  }
`;

const SourcesModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
`;

const SourcesModalCard = styled.div`
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
  display: flex;
  flex-direction: column;
`;

const SourcesModalHeader = styled.div`
  padding: 14px 18px 10px;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
`;

const SourcesModalTitle = styled.h2`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #111827;
`;

const SourcesModalSubtitle = styled.p`
  margin: 2px 40px 0 0;
  font-size: 12px;
  color: #6b7280;
`;

const SourcesModalCloseButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 12px;
  padding: 4px;
  border-radius: 999px;
  color: #6b7280;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 18px;
  }

  &:hover {
    background: #f3f4f6;
  }
`;

const SourcesModalBody = styled.div`
  padding: 12px 18px 10px;
  overflow: auto;
`;

const SourceSnippetBlock = styled.div`
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 10px 10px 8px;
  margin-bottom: 8px;
  background: #f9fafb;
`;

const SourceSnippetHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SourceSnippetLabelChip = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 999px;
  background: #eef2ff;
  color: #3730a3;
`;

const SourceRecordLinkRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  font-size: 12px;
  color: #1d4ed8;

  svg {
    font-size: 14px;
  }
`;

const SourceRecordLinkLabel = styled.span`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const SourceRecordTitleOnly = styled.span`
  margin-left: auto;
  font-size: 12px;
  color: #4b5563;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const SourceSnippetMetaRow = styled.div`
  margin-top: 4px;
  font-size: 11px;
  color: #6b7280;
`;

const SourceSnippetText = styled.p`
  margin: 6px 0 6px;
  font-size: 12px;
  color: #111827;
  line-height: 1.45;
`;

const SourceRecordPreview = styled.div`
  margin-top: 4px;
  border-radius: 10px;
  overflow: hidden;
`;

const SourcesModalFooter = styled.div`
  padding: 8px 18px 10px;
  border-top: 1px solid #e5e7eb;
`;

const SourcesHintText = styled.p`
  margin: 0;
  font-size: 11px;
  color: #6b7280;
`;

const MiniTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 4px;
  font-size: 12px;

  thead tr {
    border-bottom: 1px solid #e5e7eb;
  }
`;

const MiniTh = styled.th`
  text-align: left;
  padding: 4px 4px;
  font-weight: 600;
  color: #4b5563;
  font-size: 11px;
`;

const MiniThSources = styled.th`
  text-align: right;
  padding: 4px 4px;
  font-weight: 500;
  color: #6b7280;
  font-size: 11px;
  width: 110px;
  max-width: 110px;
  white-space: nowrap;
`;

const MiniTdDate = styled.td`
  padding: 4px 4px;
  white-space: nowrap;
  color: #6b7280;
  vertical-align: top;
`;

const MiniTdText = styled.td`
  padding: 4px 4px;
  color: #111827;
  vertical-align: top;
`;

const MiniTdSources = styled.td`
  padding: 4px 4px;
  text-align: right;
  vertical-align: top;
  width: 110px;
  max-width: 110px;
  white-space: nowrap;
`;
