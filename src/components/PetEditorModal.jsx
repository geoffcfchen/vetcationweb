// src/components/PetEditorModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  arrayUnion,
  collection,
  doc,
  Timestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { DateTime } from "luxon";
import { FiX } from "react-icons/fi";

import { firestore } from "../lib/firebase";
import {
  categoriesCatBreed,
  categoriesDogBreed,
  categoriesColor,
} from "../data/categoriesData";

function PetEditorModal({ mode, initialPet, uid, onClose, onSaved }) {
  const isEdit = mode === "edit";

  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("dog");
  const [knowsDob, setKnowsDob] = useState(true);
  const [dobInput, setDobInput] = useState("");
  const [ageYears, setAgeYears] = useState("");
  const [ageMonths, setAgeMonths] = useState("");

  const [breedInput, setBreedInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  const [petSexForm, setPetSexForm] = useState("");
  const [isFixedForm, setIsFixedForm] = useState(null);

  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formError, setFormError] = useState("");

  const todayIso = useMemo(() => DateTime.now().toISODate(), []);

  const breedOptions = useMemo(
    () => (petType === "cat" ? categoriesCatBreed : categoriesDogBreed),
    [petType],
  );

  // Prefill for edit, or reset for create
  useEffect(() => {
    if (isEdit && initialPet) {
      setPetName(initialPet.displayName || "");
      const typeVal = initialPet.type || initialPet.species || "dog";
      setPetType(typeVal);

      const dobTs = initialPet.dob;
      const dobDate =
        dobTs && typeof dobTs.toDate === "function"
          ? dobTs.toDate()
          : dobTs instanceof Date
            ? dobTs
            : null;

      if (dobDate) {
        const dt = DateTime.fromJSDate(dobDate);
        setKnowsDob(true);
        setDobInput(dt.toISODate());
        setAgeYears("");
        setAgeMonths("");
      } else {
        setKnowsDob(true);
        setDobInput("");
        setAgeYears("");
        setAgeMonths("");
      }

      setBreedInput(initialPet.categoryBreed?.label || "");
      setColorInput(initialPet.categoryColor?.label || "");
      setPetSexForm(initialPet.petSex || "unknown");
      setIsFixedForm(
        typeof initialPet.isFixed === "boolean" ? initialPet.isFixed : null,
      );
      setFormErrors({});
      setFormError("");
    } else {
      setPetName("");
      setPetType("dog");
      setKnowsDob(true);
      setDobInput("");
      setAgeYears("");
      setAgeMonths("");
      setBreedInput("");
      setColorInput("");
      setPetSexForm("");
      setIsFixedForm(null);
      setFormErrors({});
      setFormError("");
    }
  }, [isEdit, initialPet]);

  const validateForm = () => {
    const errors = {};
    let dobDate = null;

    if (!petName.trim()) {
      errors.name = "Please enter your pet's name.";
    }

    if (knowsDob) {
      if (!dobInput) {
        errors.dob = "Please choose a birth date.";
      } else {
        const dt = DateTime.fromISO(dobInput);
        if (!dt.isValid) {
          errors.dob = "Birth date is not valid.";
        } else if (dt > DateTime.now()) {
          errors.dob = "Birth date cannot be in the future.";
        } else {
          dobDate = dt.toJSDate();
        }
      }
    } else {
      const y = ageYears.trim();
      const m = ageMonths.trim();
      const yearsNum = y ? Number(y) : 0;
      const monthsNum = m ? Number(m) : 0;

      if ((y && Number.isNaN(yearsNum)) || (m && Number.isNaN(monthsNum))) {
        errors.age = "Age must be numbers.";
      } else if (yearsNum < 0 || monthsNum < 0) {
        errors.age = "Age must be positive.";
      } else if (yearsNum === 0 && monthsNum === 0) {
        errors.age = "Please enter age in years or months.";
      } else {
        const approx = DateTime.now().minus({
          years: yearsNum,
          months: monthsNum,
        });
        if (!approx.isValid) {
          errors.age = "Age values are not valid.";
        } else {
          dobDate = approx.toJSDate();
        }
      }
    }

    if (!breedInput.trim()) {
      errors.breed = 'Please enter a breed. You can type "Mixed" or "Unknown".';
    }

    if (!colorInput.trim()) {
      errors.color = "Please enter a color.";
    }

    if (!petSexForm) {
      errors.petSex = "Please choose sex.";
    }

    setFormErrors(errors);

    return {
      isValid: Object.keys(errors).length === 0,
      dobDate,
    };
  };

  const handleSubmit = async () => {
    setFormError("");
    const { isValid, dobDate } = validateForm();
    if (!isValid) return;

    if (!uid) {
      setFormError("You need to be signed in to save a pet.");
      return;
    }

    try {
      setSaving(true);

      const normalize = (s = "") => s.trim().toLowerCase();
      const breedLabel = breedInput.trim();
      const colorLabel = colorInput.trim();

      let categoryBreed = null;
      if (breedLabel) {
        const match = breedOptions.find(
          (b) => normalize(b.label) === normalize(breedLabel),
        );
        categoryBreed = {
          id: match ? match.id : 0,
          label: breedLabel,
        };
      }

      let categoryColor = null;
      if (colorLabel) {
        const match = categoriesColor.find(
          (c) => normalize(c.label) === normalize(colorLabel),
        );
        categoryColor = {
          id: match ? match.id : 0,
          label: colorLabel,
        };
      }

      if (isEdit && initialPet && initialPet.id) {
        // Update existing pet
        const petRef = doc(firestore, "pets", initialPet.id);

        const updatePayload = {
          displayName: petName.trim(),
          type: petType,
          dob: dobDate ? Timestamp.fromDate(dobDate) : null,
          categoryBreed,
          categoryColor,
          petSex: petSexForm || "unknown",
          isFixed:
            typeof isFixedForm === "boolean" ? isFixedForm : initialPet.isFixed,
        };

        await updateDoc(petRef, updatePayload);

        const savedPet = {
          ...initialPet,
          ...updatePayload,
          id: initialPet.id,
        };

        if (onSaved) onSaved(savedPet);
      } else {
        // Create new pet
        const petRef = doc(collection(firestore, "pets"));
        const petId = petRef.id;

        const petData = {
          id: petId,
          displayName: petName.trim(),
          type: petType,
          dob: dobDate ? Timestamp.fromDate(dobDate) : null,
          owner: uid,
          categoryBreed,
          categoryColor,
          petSex: petSexForm || "unknown",
          isFixed: typeof isFixedForm === "boolean" ? isFixedForm : null,
        };

        const customerRef = doc(firestore, "customers", uid);
        const batch = writeBatch(firestore);
        batch.set(petRef, petData);
        batch.set(customerRef, { pets: arrayUnion(petId) }, { merge: true });

        await batch.commit();

        if (onSaved) onSaved(petData);
      }
    } catch (err) {
      console.error("Error saving pet", err);
      setFormError("Could not save pet. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Backdrop onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{isEdit ? "Edit pet" : "Add a pet"}</ModalTitle>
          <ModalClose type="button" onClick={onClose}>
            <FiX />
          </ModalClose>
        </ModalHeader>

        <ModalBody>
          {formError && <FormError>{formError}</FormError>}

          <FieldGroup>
            <FieldLabel>Pet name</FieldLabel>
            <TextInputStyled
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="Example: Luna"
            />
            {formErrors.name && <FieldError>{formErrors.name}</FieldError>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Species</FieldLabel>
            <InlineChoiceRow>
              <ChoiceButton
                type="button"
                $active={petType === "dog"}
                onClick={() => setPetType("dog")}
              >
                Dog
              </ChoiceButton>
              <ChoiceButton
                type="button"
                $active={petType === "cat"}
                onClick={() => setPetType("cat")}
              >
                Cat
              </ChoiceButton>
            </InlineChoiceRow>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Do you know your pet's date of birth?</FieldLabel>
            <InlineChoiceRow>
              <ChoiceButton
                type="button"
                $active={knowsDob}
                onClick={() => setKnowsDob(true)}
              >
                Yes
              </ChoiceButton>
              <ChoiceButton
                type="button"
                $active={!knowsDob}
                onClick={() => setKnowsDob(false)}
              >
                No, approximate age
              </ChoiceButton>
            </InlineChoiceRow>

            {knowsDob ? (
              <>
                <FieldDescription>
                  Pick their birth date. It cannot be in the future.
                </FieldDescription>
                <TextInputStyled
                  type="date"
                  value={dobInput}
                  onChange={(e) => setDobInput(e.target.value)}
                  max={todayIso}
                />
                {formErrors.dob && <FieldError>{formErrors.dob}</FieldError>}
              </>
            ) : (
              <>
                <FieldDescription>How old are they right now?</FieldDescription>
                <SmallInlineInputs>
                  <SmallInput
                    type="number"
                    min="0"
                    value={ageYears}
                    onChange={(e) => setAgeYears(e.target.value)}
                    placeholder="Years"
                  />
                  <SmallInput
                    type="number"
                    min="0"
                    value={ageMonths}
                    onChange={(e) => setAgeMonths(e.target.value)}
                    placeholder="Months"
                  />
                </SmallInlineInputs>
                {formErrors.age && <FieldError>{formErrors.age}</FieldError>}
              </>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Breed</FieldLabel>
            <TextInputStyled
              type="text"
              list="breedOptionsList"
              value={breedInput}
              onChange={(e) => setBreedInput(e.target.value)}
              placeholder='Start typing, or choose "Mixed" / "Unknown"'
            />
            <datalist id="breedOptionsList">
              {breedOptions.map((b) => (
                <option key={b.id} value={b.label} />
              ))}
            </datalist>
            {formErrors.breed && <FieldError>{formErrors.breed}</FieldError>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Color</FieldLabel>
            <TextInputStyled
              type="text"
              list="colorOptionsList"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              placeholder="Start typing a color"
            />
            <datalist id="colorOptionsList">
              {categoriesColor.map((c) => (
                <option key={c.id} value={c.label} />
              ))}
            </datalist>
            {formErrors.color && <FieldError>{formErrors.color}</FieldError>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Sex</FieldLabel>
            <InlineChoiceRow>
              <ChoiceButton
                type="button"
                $active={petSexForm === "male"}
                onClick={() => setPetSexForm("male")}
              >
                Male
              </ChoiceButton>
              <ChoiceButton
                type="button"
                $active={petSexForm === "female"}
                onClick={() => setPetSexForm("female")}
              >
                Female
              </ChoiceButton>
              <ChoiceButton
                type="button"
                $active={petSexForm === "unknown"}
                onClick={() => setPetSexForm("unknown")}
              >
                Unknown
              </ChoiceButton>
            </InlineChoiceRow>
            {formErrors.petSex && <FieldError>{formErrors.petSex}</FieldError>}
          </FieldGroup>

          {petSexForm !== "unknown" && (
            <FieldGroup>
              <FieldLabel>Spayed / neutered status</FieldLabel>
              <InlineChoiceRow>
                <ChoiceButton
                  type="button"
                  $active={isFixedForm === true}
                  onClick={() => setIsFixedForm(true)}
                >
                  {petSexForm === "female" ? "Spayed" : "Neutered"}
                </ChoiceButton>
                <ChoiceButton
                  type="button"
                  $active={isFixedForm === false}
                  onClick={() => setIsFixedForm(false)}
                >
                  {petSexForm === "female" ? "Not spayed" : "Not neutered"}
                </ChoiceButton>
              </InlineChoiceRow>
            </FieldGroup>
          )}

          <ModalFooterRow>
            <SecondaryButton type="button" onClick={onClose} disabled={saving}>
              Cancel
            </SecondaryButton>
            <PrimaryButton
              type="button"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving
                ? isEdit
                  ? "Saving..."
                  : "Saving..."
                : isEdit
                  ? "Save changes"
                  : "Save pet"}
            </PrimaryButton>
          </ModalFooterRow>
        </ModalBody>
      </ModalCard>
    </Backdrop>
  );
}

export default PetEditorModal;

/* styled components */

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(15, 23, 42, 0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
  overflow: auto;
`;

const ModalHeader = styled.div`
  padding: 14px 16px 10px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const ModalTitle = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
`;

const ModalClose = styled.button`
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

const ModalBody = styled.div`
  padding: 12px 16px 16px;
`;

const FormError = styled.div`
  margin-bottom: 10px;
  font-size: 12px;
  color: #b91c1c;
`;

const FieldGroup = styled.div`
  margin-top: 10px;
`;

const FieldLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
`;

const FieldDescription = styled.div`
  font-size: 12px;
  color: #64748b;
  margin-bottom: 6px;
`;

const TextInputStyled = styled.input`
  width: 100%;
  font-size: 13px;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  outline: none;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb33;
  }
`;

const SmallInlineInputs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SmallInput = styled(TextInputStyled)`
  max-width: 120px;
`;

const FieldError = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: #b91c1c;
`;

const InlineChoiceRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
`;

const ChoiceButton = styled.button`
  border-radius: 999px;
  border: 1px solid
    ${(p) =>
      p.$active ? "rgba(37, 99, 235, 0.55)" : "rgba(148, 163, 184, 0.5)"};
  background: ${(p) => (p.$active ? "rgba(239, 246, 255, 1)" : "#ffffff")};
  color: ${(p) => (p.$active ? "#1d4ed8" : "#0f172a")};
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: ${(p) => (p.$active ? "rgba(239, 246, 255, 1)" : "#f8fafc")};
  }
`;

const ModalFooterRow = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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

  &:hover {
    background: #1d4ed8;
  }

  &:disabled {
    opacity: 0.75;
    cursor: default;
  }
`;

const SecondaryButton = styled.button`
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
    opacity: 0.75;
    cursor: default;
    text-decoration: none;
  }
`;
