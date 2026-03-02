import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as Yup from "yup";
import { DateTime } from "luxon";
import { FiX } from "react-icons/fi";

import { auth, firestore } from "../lib/firebase";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, writeBatch, Timestamp } from "firebase/firestore";

export default function PassportEditModal({
  uid,
  petId,
  pet,
  userData,
  onClose,
}) {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Owner
  const [firstName, setFirstName] = useState(userData?.firstName || "");
  const [lastName, setLastName] = useState(userData?.lastName || "");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  // Microchip
  const [microchipNumber, setMicrochipNumber] = useState(
    pet?.microchip?.number || "",
  );
  const [microchipLocation, setMicrochipLocation] = useState(
    pet?.microchip?.location || "",
  );
  const [microchipDateIso, setMicrochipDateIso] = useState(() => {
    const d = pet?.microchip?.implantedAt?.toDate
      ? pet.microchip.implantedAt.toDate()
      : null;
    return d ? DateTime.fromJSDate(d).toISODate() : "";
  });

  const [microchipNumberError, setMicrochipNumberError] = useState("");
  const [microchipLocationError, setMicrochipLocationError] = useState("");

  // Rabies
  const [rabiesManufacturer, setRabiesManufacturer] = useState("");
  const [rabiesBatchNumber, setRabiesBatchNumber] = useState("");
  const [rabiesVaccIso, setRabiesVaccIso] = useState("");
  const [rabiesValidIso, setRabiesValidIso] = useState("");

  const [rabiesManufacturerError, setRabiesManufacturerError] = useState("");
  const [rabiesBatchNumberError, setRabiesBatchNumberError] = useState("");
  const [rabiesValidUntilError, setRabiesValidUntilError] = useState("");

  const [snapshotVaccines, setSnapshotVaccines] = useState([]);
  const [snapshotLoaded, setSnapshotLoaded] = useState(false);

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        firstName: Yup.string()
          .max(30, "Too Long!")
          .required("First name is required"),
        lastName: Yup.string()
          .max(50, "Too Long!")
          .required("Last name is required"),
        microchipNumber: Yup.string()
          .nullable()
          .test(
            "chip-length",
            "Microchip number must be 15 digits",
            (val) => !val || /^\d{15}$/.test(val),
          ),
        microchipLocation: Yup.string().max(80, "Location is too long"),
        rabiesManufacturer: Yup.string().max(80, "Manufacturer is too long"),
        rabiesBatchNumber: Yup.string().max(80, "Batch number is too long"),
      }),
    [],
  );

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Load snapshot/current vaccines when modal opens
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setSnapshotLoaded(false);
        const snapRef = doc(firestore, "pets", petId, "snapshot", "current");
        const snap = await getDoc(snapRef);
        const vaccines =
          snap.exists() && Array.isArray(snap.data()?.vaccines)
            ? snap.data().vaccines
            : [];

        if (!mounted) return;

        setSnapshotVaccines(vaccines);

        const rabies =
          vaccines.find((v) => {
            const key = (v?.key || "").toLowerCase();
            const name = (v?.name || "").toLowerCase();
            return key === "rabies" || name.includes("rabies");
          }) || null;

        if (rabies) {
          setRabiesManufacturer(rabies.manufacturer || "");
          setRabiesBatchNumber(rabies.batchNumber || "");
          setRabiesVaccIso(rabies.lastDate || "");
          setRabiesValidIso(rabies.validUntil || "");
        }
      } catch (e) {
        console.error("Failed to load snapshot/current:", e);
      } finally {
        if (mounted) setSnapshotLoaded(true);
      }
    };

    if (petId) run();

    return () => {
      mounted = false;
    };
  }, [petId]);

  const resetErrors = () => {
    setFirstNameError("");
    setLastNameError("");
    setMicrochipNumberError("");
    setMicrochipLocationError("");
    setRabiesManufacturerError("");
    setRabiesBatchNumberError("");
    setRabiesValidUntilError("");
    setSubmitError("");
  };

  const validateForm = () => {
    resetErrors();

    const values = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      microchipNumber: microchipNumber.trim() || null,
      microchipLocation: microchipLocation.trim(),
      rabiesManufacturer: rabiesManufacturer.trim(),
      rabiesBatchNumber: rabiesBatchNumber.trim(),
    };

    let ok = true;

    try {
      validationSchema.validateSync(values, { abortEarly: false });
    } catch (err) {
      ok = false;
      if (Array.isArray(err?.inner)) {
        err.inner.forEach((e) => {
          switch (e.path) {
            case "firstName":
              setFirstNameError(e.message);
              break;
            case "lastName":
              setLastNameError(e.message);
              break;
            case "microchipNumber":
              setMicrochipNumberError(e.message);
              break;
            case "microchipLocation":
              setMicrochipLocationError(e.message);
              break;
            case "rabiesManufacturer":
              setRabiesManufacturerError(e.message);
              break;
            case "rabiesBatchNumber":
              setRabiesBatchNumberError(e.message);
              break;
            default:
              break;
          }
        });
      }
    }

    if (rabiesVaccIso && rabiesValidIso) {
      const vacc = DateTime.fromISO(rabiesVaccIso);
      const valid = DateTime.fromISO(rabiesValidIso);
      if (vacc.isValid && valid.isValid && valid.toMillis() < vacc.toMillis()) {
        setRabiesValidUntilError(
          "Valid until date must be after vaccination date",
        );
        ok = false;
      }
    }

    return ok;
  };

  const handleSave = async () => {
    if (!petId) return;

    const currentUid = auth.currentUser?.uid || uid || userData?.uid;
    if (!currentUid) {
      setSubmitError("No authenticated user found.");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    setSubmitError("");

    try {
      const batch = writeBatch(firestore);

      const customerRef = doc(firestore, "customers", currentUid);
      const petRef = doc(firestore, "pets", petId);
      const snapshotRef = doc(firestore, "pets", petId, "snapshot", "current");

      const first = firstName.trim();
      const last = lastName.trim();

      // Owner name
      batch.set(
        customerRef,
        { firstName: first, lastName: last },
        { merge: true },
      );

      // Microchip (merge into existing microchip object)
      const chipNumber = microchipNumber.trim();
      const chipLoc = microchipLocation.trim();
      const chipDate = microchipDateIso
        ? DateTime.fromISO(microchipDateIso)
        : null;

      const hasMicrochipData = !!(
        chipNumber ||
        chipLoc ||
        (chipDate && chipDate.isValid) ||
        pet?.microchip
      );

      if (hasMicrochipData) {
        const nextMicrochip = {
          ...(pet?.microchip || {}),
          ...(chipNumber ? { number: chipNumber } : {}),
          ...(chipLoc ? { location: chipLoc } : {}),
          ...(chipDate && chipDate.isValid
            ? { implantedAt: Timestamp.fromDate(chipDate.toJSDate()) }
            : {}),
        };
        batch.set(petRef, { microchip: nextMicrochip }, { merge: true });
      }

      // Rabies in snapshot.vaccines
      const vaccines = Array.isArray(snapshotVaccines)
        ? [...snapshotVaccines]
        : [];
      const rabiesIndex = vaccines.findIndex((v) => {
        const key = (v?.key || "").toLowerCase();
        const name = (v?.name || "").toLowerCase();
        return key === "rabies" || name.includes("rabies");
      });

      const existingRabies = rabiesIndex >= 0 ? vaccines[rabiesIndex] : null;

      const rabiesPayload = {
        key: "rabies",
        name: "Rabies",
        manufacturer:
          rabiesManufacturer.trim() || existingRabies?.manufacturer || null,
        batchNumber:
          rabiesBatchNumber.trim() || existingRabies?.batchNumber || null,
        lastDate: rabiesVaccIso || existingRabies?.lastDate || null,
        validUntil: rabiesValidIso || existingRabies?.validUntil || null,
        source: currentUid,
        recordId: existingRabies?.recordId || null,
      };

      const hasRabiesData =
        rabiesPayload.manufacturer ||
        rabiesPayload.batchNumber ||
        rabiesPayload.lastDate ||
        rabiesPayload.validUntil;

      if (hasRabiesData) {
        if (rabiesIndex >= 0)
          vaccines[rabiesIndex] = {
            ...(existingRabies || {}),
            ...rabiesPayload,
          };
        else vaccines.push(rabiesPayload);

        batch.set(snapshotRef, { vaccines }, { merge: true });
      }

      await Promise.all([
        auth.currentUser
          ? updateProfile(auth.currentUser, {
              displayName: `${first} ${last}`.trim(),
            })
          : Promise.resolve(),
        batch.commit(),
      ]);

      onClose();
    } catch (err) {
      console.error("Error saving passport:", err);
      setSubmitError(
        "An error occurred while saving passport information. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Card onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Edit passport details</Title>
          <CloseButton type="button" onClick={onClose} aria-label="Close">
            <FiX />
          </CloseButton>
        </Header>

        <Sub>
          Update owner name, microchip details, and rabies vaccination info.
        </Sub>

        <Body>
          <SectionTitle>Owner information</SectionTitle>

          <FieldRow>
            <Label>Your legal first name</Label>
            <TextInput
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
            />
            {!!firstNameError && <ErrorText>{firstNameError}</ErrorText>}
          </FieldRow>

          <FieldRow>
            <Label>Your legal last name</Label>
            <TextInput
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
            />
            {!!lastNameError && <ErrorText>{lastNameError}</ErrorText>}
          </FieldRow>

          <FieldRow>
            <Label>Phone number</Label>
            <ReadOnlyPill>
              {userData?.phoneNumber
                ? userData.phoneNumber
                : "Add phone number in the app"}
            </ReadOnlyPill>
          </FieldRow>

          <SectionTitle>Microchip information</SectionTitle>

          <FieldRow>
            <Label>Microchip number</Label>
            <TextInput
              value={microchipNumber}
              onChange={(e) => setMicrochipNumber(e.target.value)}
              placeholder="15-digit microchip number"
              inputMode="numeric"
            />
            {!!microchipNumberError && (
              <ErrorText>{microchipNumberError}</ErrorText>
            )}
          </FieldRow>

          <FieldRow>
            <Label>Chip location (optional)</Label>
            <TextInput
              value={microchipLocation}
              onChange={(e) => setMicrochipLocation(e.target.value)}
              placeholder="Between shoulder blades, left side, etc."
            />
            {!!microchipLocationError && (
              <ErrorText>{microchipLocationError}</ErrorText>
            )}
          </FieldRow>

          <FieldRow>
            <Label>Implanted / scanned date</Label>
            <DateInput
              type="date"
              value={microchipDateIso}
              onChange={(e) => setMicrochipDateIso(e.target.value)}
            />
          </FieldRow>

          <SectionTitle>Rabies vaccination</SectionTitle>

          <FieldRow>
            <Label>Vaccination date (recommended)</Label>
            <DateInput
              type="date"
              value={rabiesVaccIso}
              onChange={(e) => setRabiesVaccIso(e.target.value)}
            />
          </FieldRow>

          <FieldRow>
            <Label>Valid until (recommended)</Label>
            <DateInput
              type="date"
              value={rabiesValidIso}
              onChange={(e) => setRabiesValidIso(e.target.value)}
            />
            {!!rabiesValidUntilError && (
              <ErrorText>{rabiesValidUntilError}</ErrorText>
            )}
          </FieldRow>

          <FieldRow>
            <Label>Manufacturer (optional)</Label>
            <TextInput
              value={rabiesManufacturer}
              onChange={(e) => setRabiesManufacturer(e.target.value)}
              placeholder="Vaccine manufacturer"
            />
            {!!rabiesManufacturerError && (
              <ErrorText>{rabiesManufacturerError}</ErrorText>
            )}
          </FieldRow>

          <FieldRow>
            <Label>Batch number (optional)</Label>
            <TextInput
              value={rabiesBatchNumber}
              onChange={(e) => setRabiesBatchNumber(e.target.value)}
              placeholder="Batch / lot number"
            />
            {!!rabiesBatchNumberError && (
              <ErrorText>{rabiesBatchNumberError}</ErrorText>
            )}
          </FieldRow>

          {!!submitError && <ErrorBanner>{submitError}</ErrorBanner>}

          <ActionsRow>
            <Secondary type="button" onClick={onClose} disabled={loading}>
              Cancel
            </Secondary>

            <Primary
              type="button"
              onClick={handleSave}
              disabled={loading || !snapshotLoaded}
              title={!snapshotLoaded ? "Loading vaccine data..." : undefined}
            >
              {loading ? "Saving..." : "Save passport"}
            </Primary>
          </ActionsRow>
        </Body>
      </Card>
    </Overlay>
  );
}

PassportEditModal.propTypes = {
  uid: PropTypes.string,
  petId: PropTypes.string.isRequired,
  pet: PropTypes.object,
  userData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

/* styles */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(15, 23, 42, 0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
  overflow: auto;
`;

const Header = styled.div`
  padding: 14px 16px 10px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 6px;
  border-radius: 999px;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f1f5f9;
  }

  svg {
    font-size: 18px;
  }
`;

const Sub = styled.div`
  padding: 10px 16px 0;
  font-size: 13px;
  color: #64748b;
`;

const Body = styled.div`
  padding: 12px 16px 16px;
`;

const SectionTitle = styled.div`
  margin-top: 6px;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 900;
  color: #0f172a;
`;

const FieldRow = styled.div`
  margin-bottom: 12px;
`;

const Label = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
`;

const TextInput = styled.input`
  width: 100%;
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: rgba(37, 99, 235, 0.55);
  }
`;

const DateInput = styled.input`
  width: 220px;
  max-width: 100%;
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: rgba(37, 99, 235, 0.55);
  }
`;

const ReadOnlyPill = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 999px;
  background: rgba(241, 245, 249, 1);
  border: 1px solid rgba(148, 163, 184, 0.22);
  font-size: 13px;
  color: #334155;
`;

const ErrorText = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: #dc2626;
`;

const ErrorBanner = styled.div`
  margin-top: 8px;
  margin-bottom: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(254, 226, 226, 1);
  border: 1px solid rgba(220, 38, 38, 0.25);
  color: #7f1d1d;
  font-size: 13px;
`;

const ActionsRow = styled.div`
  margin-top: 14px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const Primary = styled.button`
  border: none;
  background: #2563eb;
  color: #ffffff;
  border-radius: 12px;
  padding: 10px 12px;
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

const Secondary = styled.button`
  border: none;
  background: transparent;
  color: #1d4ed8;
  border-radius: 12px;
  padding: 10px 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 900;

  &:hover {
    text-decoration: underline;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
    text-decoration: none;
  }
`;
