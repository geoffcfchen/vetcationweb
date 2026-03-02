// src/pages/app/PetPassportPage.jsx
import React, { useContext, useMemo } from "react";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { DateTime } from "luxon";
import { FiFileText, FiInfo, FiShare2, FiEdit2 } from "react-icons/fi";

import GlobalContext from "../../context/GlobalContext";
import usePetSnapshot from "../../hooks/usePetSnapshot";

export default function PetPassportPage() {
  const { pet, onOpenPassportEdit } = useOutletContext();
  const { userData } = useContext(GlobalContext);
  const navigate = useNavigate();
  const { petId: routePetId } = useParams();

  const petId = routePetId || pet?.id || null;

  // If something went wrong with context
  if (!pet) {
    return (
      <Card>
        <TitleRow>
          <TitleLeft>
            <IconCircle>
              <FiFileText />
            </IconCircle>
            <TitleStack>
              <Title>Pet Passport</Title>
              <Subtitle>Unable to load this pet passport.</Subtitle>
            </TitleStack>
          </TitleLeft>
        </TitleRow>
        <InfoText>
          This pet may have been removed or you do not have access.
        </InfoText>
      </Card>
    );
  }

  // Live snapshot from Firestore: pets/{petId}/snapshot/current
  const {
    snapshotData,
    loading: snapshotLoading,
    error: snapshotError,
  } = usePetSnapshot(petId);

  const {
    ownerFullName,
    ownerContact,
    dobStr,
    microchipNumber,
    microchipLocation,
    microchipImplantedStr,
    rabiesManufacturer,
    rabiesBatchNumber,
    rabiesLastDateStr,
    rabiesValidUntilStr,
    lastSummaryText,
    passportMissing,
    passportCompletePct,
  } = useMemo(() => {
    // Owner info
    const fullName =
      userData?.fullName ||
      [userData?.firstName, userData?.lastName].filter(Boolean).join(" ") ||
      null;

    const phone = userData?.phoneNumber || null;
    const email = userData?.email || userData?.emailAddress || null;
    const contactParts = [];
    if (phone) contactParts.push(`Phone: ${phone}`);
    if (email) contactParts.push(`Email: ${email}`);
    const contact = contactParts.length > 0 ? contactParts.join("  •  ") : null;

    // DOB from pet.dob (Firestore Timestamp)
    const dobDate =
      pet?.dob && typeof pet.dob.toDate === "function"
        ? pet.dob.toDate()
        : null;
    const dobDisplay = dobDate
      ? DateTime.fromJSDate(dobDate).toFormat("LLL d, yyyy")
      : null;

    // Microchip from pet.microchip
    const chipNumber = pet?.microchip?.number || null;
    const chipLocation = pet?.microchip?.location || null;
    const chipImplantedDate =
      pet?.microchip?.implantedAt &&
      typeof pet.microchip.implantedAt.toDate === "function"
        ? pet.microchip.implantedAt.toDate()
        : null;
    const chipImplantedStr = chipImplantedDate
      ? DateTime.fromJSDate(chipImplantedDate).toFormat("LLL d, yyyy")
      : null;

    // Rabies from snapshot vaccines
    const vaccines = snapshotData?.vaccines || [];
    const rabies =
      vaccines.find((v) => {
        const key = (v.key || "").toLowerCase();
        const name = (v.name || "").toLowerCase();
        return key === "rabies" || name.includes("rabies");
      }) || null;

    const rabiesLast = rabies?.lastDate
      ? DateTime.fromISO(rabies.lastDate).toFormat("LLL d, yyyy")
      : null;
    const rabiesValidUntil = rabies?.validUntil
      ? DateTime.fromISO(rabies.validUntil).toFormat("LLL d, yyyy")
      : null;
    const rabiesMfg = rabies?.manufacturer || null;
    const rabiesBatch = rabies?.batchNumber || null;

    // Latest medical summary
    let lastSummaryTxt = null;
    const lastSummary = snapshotData?.lastSummary || null;
    if (lastSummary) {
      if (typeof lastSummary === "string") {
        lastSummaryTxt = lastSummary;
      } else if (typeof lastSummary.summaryText === "string") {
        lastSummaryTxt = lastSummary.summaryText;
      }
    }

    // Missing fields for completeness
    const missingFlags = {
      ownerName: !fullName,
      ownerContact: !contact,
      petName: !pet?.displayName,
      species: !pet?.type,
      breed: !pet?.categoryBreed?.label,
      sex: !pet?.petSex,
      dob: !dobDisplay,
      color: !pet?.categoryColor?.label,
      microchipNumber: !chipNumber,
      microchipDate: !chipImplantedStr,
      rabiesDates: !rabiesLast || !rabiesValidUntil,
    };

    const totalFields = Object.keys(missingFlags).length;
    const missingCount = Object.values(missingFlags).filter(Boolean).length;
    const completePct =
      totalFields === 0
        ? 100
        : Math.max(
            0,
            Math.round(((totalFields - missingCount) / totalFields) * 100),
          );

    return {
      ownerFullName: fullName,
      ownerContact: contact,
      dobStr: dobDisplay,
      microchipNumber: chipNumber,
      microchipLocation: chipLocation,
      microchipImplantedStr: chipImplantedStr,
      rabiesManufacturer: rabiesMfg,
      rabiesBatchNumber: rabiesBatch,
      rabiesLastDateStr: rabiesLast,
      rabiesValidUntilStr: rabiesValidUntil,
      lastSummaryText: lastSummaryTxt,
      passportMissing: missingFlags,
      passportCompletePct: completePct,
    };
  }, [pet, userData, snapshotData]);

  const handleEditPassport = () => {
    const id = petId || pet.id;
    if (id) {
      navigate(`/app/pets/${id}/settings`);
    }
  };

  const handleShare = () => {
    const id = petId || pet.id;
    if (id) {
      navigate(`/app/pets/${id}/share`);
    }
  };

  const PassportRow = ({ label, value, missing }) => (
    <Row>
      <RowText>
        <RowLabel>{label}</RowLabel>
        {value ? (
          <RowValue>{value}</RowValue>
        ) : (
          <MissingPill>Missing</MissingPill>
        )}
      </RowText>
      {missing && (
        <InlineHint>
          <FiInfo />
          <span>Fill in from Settings</span>
        </InlineHint>
      )}
    </Row>
  );

  return (
    <Card>
      <TitleRow>
        <TitleLeft>
          <IconCircle>
            <FiFileText />
          </IconCircle>
          <TitleStack>
            <Title>Pet Passport</Title>
            <Subtitle>
              Official health identity for your pet, designed for clinics and
              travel.
            </Subtitle>
            {snapshotLoading && (
              <TinyStatus>Syncing from latest records...</TinyStatus>
            )}
            {snapshotError && (
              <TinyError>
                Could not load all passport data. Some fields may be missing.
              </TinyError>
            )}
          </TitleStack>
        </TitleLeft>
        <CompletenessPill>{passportCompletePct}% complete</CompletenessPill>
      </TitleRow>

      <Section>
        <SectionTitle>Owner information</SectionTitle>
        <PassportRow
          label="Full name"
          value={ownerFullName}
          missing={passportMissing.ownerName}
        />
        <PassportRow
          label="Contact"
          value={ownerContact}
          missing={passportMissing.ownerContact}
        />
      </Section>

      <Section>
        <SectionTitle>Animal description</SectionTitle>
        <PassportRow
          label="Name"
          value={pet.displayName || null}
          missing={passportMissing.petName}
        />
        <PassportRow
          label="Species"
          value={pet.type || pet.species || null}
          missing={passportMissing.species}
        />
        <PassportRow
          label="Breed"
          value={pet.categoryBreed?.label || null}
          missing={passportMissing.breed}
        />
        <PassportRow
          label="Sex"
          value={pet.petSex || null}
          missing={passportMissing.sex}
        />
        <PassportRow
          label="Date of birth"
          value={dobStr}
          missing={passportMissing.dob}
        />
        <PassportRow
          label="Color / markings"
          value={pet.categoryColor?.label || null}
          missing={passportMissing.color}
        />
      </Section>

      <Section>
        <SectionTitle>Microchip information</SectionTitle>
        <PassportRow
          label="Microchip number"
          value={microchipNumber}
          missing={passportMissing.microchipNumber}
        />
        <PassportRow
          label="Implanted / scanned date"
          value={microchipImplantedStr}
          missing={passportMissing.microchipDate}
        />
        {microchipLocation && (
          <PassportRow
            label="Chip location"
            value={microchipLocation}
            missing={false}
          />
        )}
      </Section>

      <Section>
        <SectionTitle>Rabies vaccination</SectionTitle>
        <PassportRow
          label="Vaccination date"
          value={rabiesLastDateStr}
          missing={passportMissing.rabiesDates}
        />
        <PassportRow
          label="Valid until"
          value={rabiesValidUntilStr}
          missing={passportMissing.rabiesDates}
        />
        {rabiesManufacturer && (
          <PassportRow
            label="Manufacturer"
            value={rabiesManufacturer}
            missing={false}
          />
        )}
        {rabiesBatchNumber && (
          <PassportRow
            label="Batch number"
            value={rabiesBatchNumber}
            missing={false}
          />
        )}
      </Section>

      {lastSummaryText && (
        <Section>
          <SectionTitle>Latest medical summary</SectionTitle>
          <SummaryText>{lastSummaryText}</SummaryText>
        </Section>
      )}

      <ActionsRow>
        <SecondaryButton type="button" onClick={() => onOpenPassportEdit(pet)}>
          <FiEdit2 />
          <span>Edit details</span>
        </SecondaryButton>
        {/* <PrimaryButton type="button" onClick={handleShare}>
          <FiShare2 />
          <span>Share with vet</span>
        </PrimaryButton> */}
      </ActionsRow>
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

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
`;

const TitleLeft = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
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

const TitleStack = styled.div`
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
  font-size: 11px;
  color: #64748b;
  margin-top: 4px;
`;

const TinyError = styled.div`
  font-size: 11px;
  color: #b91c1c;
  margin-top: 4px;
`;

const CompletenessPill = styled.div`
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 999px;
  background: #eef2ff;
  color: #3730a3;
  font-size: 11px;
  font-weight: 600;
`;

const Section = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 10px;
  margin-top: 14px;
`;

const SectionTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 6px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 0;
  gap: 8px;
`;

const RowText = styled.div`
  flex: 1;
  min-width: 0;
`;

const RowLabel = styled.div`
  font-size: 11px;
  color: #6b7280;
`;

const RowValue = styled.div`
  margin-top: 2px;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  word-break: break-word;
`;

const MissingPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  background: #fef3c7;
  color: #92400e;
  font-size: 11px;
  margin-top: 4px;
`;

const InlineHint = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #6b7280;

  svg {
    font-size: 12px;
  }
`;

const InfoText = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: #4b5563;
  line-height: 1.5;
`;

const SummaryText = styled.div`
  margin-top: 4px;
  font-size: 13px;
  color: #111827;
  line-height: 1.5;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 18px;
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
