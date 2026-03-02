// src/pages/app/VaccinePage.jsx
import React, { useMemo } from "react";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { DateTime } from "luxon";
import { FiActivity, FiAlertCircle, FiUpload } from "react-icons/fi";

import usePetSnapshot from "../../hooks/usePetSnapshot";

export default function VaccinePage() {
  const { pet } = useOutletContext() || {};
  const navigate = useNavigate();
  const { petId: routePetId } = useParams();
  const petId = routePetId || pet?.id || null;

  const {
    snapshotData,
    loading: snapshotLoading,
    error: snapshotError,
  } = usePetSnapshot(petId);

  const vaccinesDisplay = useMemo(() => {
    const vaccines = Array.isArray(snapshotData?.vaccines)
      ? snapshotData.vaccines
      : [];

    const today = DateTime.now().startOf("day");

    return vaccines
      .map((v, index) => {
        if (!v) return null;

        const name = v.name || v.key || "Vaccine";

        const lastDt = v.lastDate ? DateTime.fromISO(v.lastDate) : null;
        const validDt = v.validUntil ? DateTime.fromISO(v.validUntil) : null;

        const lastDateStr =
          lastDt && lastDt.isValid ? lastDt.toFormat("LLL d, yyyy") : null;

        const validUntilStr =
          validDt && validDt.isValid ? validDt.toFormat("LLL d, yyyy") : null;

        let status = "Unknown";
        let statusTone = "default";

        if (validDt && validDt.isValid) {
          if (validDt < today) {
            status = "Expired";
            statusTone = "expired";
          } else {
            status = "Up to date";
            statusTone = "ok";
          }
        }

        let sourceLabel = null;
        if (v.source === "ai") {
          sourceLabel = "Based on AI summary";
        } else if (typeof v.source === "string" && v.source.length > 0) {
          sourceLabel = "From record or manual entry";
        }

        return {
          id: v.key || v.name || v.recordId || `v-${index}`,
          name,
          lastDateStr,
          validUntilStr,
          manufacturer: v.manufacturer || null,
          batchNumber: v.batchNumber || null,
          status,
          statusTone,
          sourceLabel,
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        if (aName === "rabies" && bName !== "rabies") return -1;
        if (bName === "rabies" && aName !== "rabies") return 1;
        if (aName < bName) return -1;
        if (aName > bName) return 1;
        return 0;
      });
  }, [snapshotData]);

  const handleUploadFiles = () => {
    const id = petId || pet?.id;
    if (!id) return;
    navigate(`/app/pets/${id}/upload`);
  };

  if (!pet) {
    return (
      <Card>
        <HeaderRow>
          <HeaderLeft>
            <IconCircle>
              <FiActivity />
            </IconCircle>
            <HeaderTextStack>
              <Title>Vaccine cards</Title>
              <Subtitle>Unable to load this pet.</Subtitle>
            </HeaderTextStack>
          </HeaderLeft>
        </HeaderRow>
        <InfoText>
          This pet may have been removed or you do not have access.
        </InfoText>
      </Card>
    );
  }

  return (
    <Card>
      <HeaderRow>
        <HeaderLeft>
          <IconCircle>
            <FiActivity />
          </IconCircle>
          <HeaderTextStack>
            <Title>Vaccine cards</Title>
            <Subtitle>
              Overview of vaccines from {pet.displayName || "your pet"}’s
              records.
            </Subtitle>
            {snapshotLoading && (
              <TinyStatus>Syncing from latest records...</TinyStatus>
            )}
            {snapshotError && (
              <TinyError>
                <FiAlertCircle />
                <span>
                  Could not load all vaccine data. Some fields may be missing.
                </span>
              </TinyError>
            )}
          </HeaderTextStack>
        </HeaderLeft>

        {vaccinesDisplay.length > 0 && (
          <CountPill>
            {vaccinesDisplay.length} vaccine
            {vaccinesDisplay.length > 1 ? "s" : ""}
          </CountPill>
        )}
      </HeaderRow>

      {vaccinesDisplay.length === 0 ? (
        <EmptyBlock>
          <EmptyText>
            We have not detected any vaccines in this pet’s snapshot yet. When
            you upload records that contain vaccines or a vet enters them
            manually, they will appear here.
          </EmptyText>

          <ActionsRow>
            <PrimaryButton type="button" onClick={handleUploadFiles}>
              <FiUpload />
              <span>Upload files</span>
            </PrimaryButton>
          </ActionsRow>
        </EmptyBlock>
      ) : (
        <>
          <VaccineList>
            {vaccinesDisplay.map((v) => (
              <VaccineCard key={v.id}>
                <VaccineHeaderRow>
                  <VaccineName>{v.name}</VaccineName>
                  <StatusChip $tone={v.statusTone}>{v.status}</StatusChip>
                </VaccineHeaderRow>

                <DetailRow>
                  <DetailLabel>Last vaccination</DetailLabel>
                  <DetailValue>{v.lastDateStr || "Unknown"}</DetailValue>
                </DetailRow>

                <DetailRow>
                  <DetailLabel>Valid until</DetailLabel>
                  <DetailValue>{v.validUntilStr || "Unknown"}</DetailValue>
                </DetailRow>

                {v.manufacturer && (
                  <DetailRow>
                    <DetailLabel>Manufacturer</DetailLabel>
                    <DetailValue>{v.manufacturer}</DetailValue>
                  </DetailRow>
                )}

                {v.batchNumber && (
                  <DetailRow>
                    <DetailLabel>Batch / lot</DetailLabel>
                    <DetailValue>{v.batchNumber}</DetailValue>
                  </DetailRow>
                )}

                {v.sourceLabel && <SourceText>{v.sourceLabel}</SourceText>}
              </VaccineCard>
            ))}
          </VaccineList>

          <ActionsRow>
            <SecondaryButton type="button" onClick={handleUploadFiles}>
              <FiUpload />
              <span>Upload files</span>
            </SecondaryButton>
          </ActionsRow>
        </>
      )}
    </Card>
  );
}

// Styles

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
`;

const HeaderLeft = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
`;

const IconCircle = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: #ecfdf3;
  color: #16a34a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const HeaderTextStack = styled.div`
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

const TinyStatus = styled.div`
  margin-top: 4px;
  font-size: 11px;
  color: #64748b;
`;

const TinyError = styled.div`
  margin-top: 4px;
  font-size: 11px;
  color: #b91c1c;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  svg {
    font-size: 12px;
  }
`;

const CountPill = styled.div`
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 999px;
  background: #eef2ff;
  color: #3730a3;
  font-size: 11px;
  font-weight: 600;
`;

const InfoText = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: #4b5563;
  line-height: 1.5;
`;

const EmptyBlock = styled.div`
  margin-top: 4px;
`;

const EmptyText = styled.div`
  font-size: 13px;
  color: #4b5563;
  line-height: 1.5;
`;

const VaccineList = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const VaccineCard = styled.div`
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 10px 12px;
  background: #ffffff;
`;

const VaccineHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  gap: 8px;
`;

const VaccineName = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #111827;
`;

const StatusChip = styled.div`
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${(p) =>
    p.$tone === "ok"
      ? "#DCFCE7"
      : p.$tone === "expired"
        ? "#FEE2E2"
        : "#E5E7EB"};
  color: ${(p) =>
    p.$tone === "ok"
      ? "#166534"
      : p.$tone === "expired"
        ? "#B91C1C"
        : "#374151"};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  gap: 12px;
`;

const DetailLabel = styled.div`
  font-size: 11px;
  color: #6b7280;
`;

const DetailValue = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #111827;
`;

const SourceText = styled.div`
  margin-top: 8px;
  font-size: 11px;
  color: #6b7280;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

const BaseButton = styled.button`
  border-radius: 999px;
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  border: 1px solid transparent;
  background: transparent;
  color: inherit;

  svg {
    font-size: 14px;
  }
`;

const PrimaryButton = styled(BaseButton)`
  background: #2563eb;
  color: #f9fafb;
  border-color: #2563eb;

  &:hover {
    background: #1d4ed8;
    border-color: #1d4ed8;
  }
`;

const SecondaryButton = styled(BaseButton)`
  background: #f9fafb;
  color: #111827;
  border-color: #e5e7eb;

  &:hover {
    background: #e5e7eb;
  }
`;
