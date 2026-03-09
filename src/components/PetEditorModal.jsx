// src/components/PetEditorModal.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
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
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../lib/firebase";

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
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(""); // preview url or existing photoURL
  const [photoError, setPhotoError] = useState("");

  const [breedDropdownOpen, setBreedDropdownOpen] = useState(false);
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);

  const breedFieldRef = useRef(null);
  const colorFieldRef = useRef(null);

  const todayIso = useMemo(() => DateTime.now().toISODate(), []);

  const breedOptions = useMemo(
    () => (petType === "cat" ? categoriesCatBreed : categoriesDogBreed),
    [petType],
  );

  const filteredBreedOptions = useMemo(() => {
    const q = breedInput.trim().toLowerCase();
    if (!q) return breedOptions;
    return breedOptions.filter((b) => b.label.toLowerCase().includes(q));
  }, [breedInput, breedOptions]);

  const filteredColorOptions = useMemo(() => {
    const q = colorInput.trim().toLowerCase();
    if (!q) return categoriesColor;
    return categoriesColor.filter((c) => c.label.toLowerCase().includes(q));
  }, [colorInput]);

  useEffect(() => {
    return () => {
      if (photoPreview && photoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setPhotoFile(null);
      setPhotoPreview(initialPet.photoURL || "");
      setPhotoError("");
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
      setPhotoFile(null);
      setPhotoPreview("");
      setPhotoError("");
    }
  }, [isEdit, initialPet]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        breedFieldRef.current &&
        !breedFieldRef.current.contains(event.target)
      ) {
        setBreedDropdownOpen(false);
      }
      if (
        colorFieldRef.current &&
        !colorFieldRef.current.contains(event.target)
      ) {
        setColorDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const validateForm = () => {
    const errors = {};
    let dobDate = null;

    const hasExistingPhoto = Boolean(isEdit && initialPet?.photoURL);
    const hasNewPhoto = Boolean(photoFile);
    const hasAnyPhoto = hasNewPhoto || hasExistingPhoto;

    setPhotoError(errors.photo || "");

    if (!isEdit && !hasAnyPhoto) {
      errors.photo = "Please upload a pet photo.";
    }

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

        const photoURL = await uploadPetPhotoIfNeeded({ petId: initialPet.id });
        const updatePayload = {
          displayName: petName.trim(),
          photoURL: photoURL || initialPet.photoURL || "",
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
        const photoURL = await uploadPetPhotoIfNeeded({ petId });

        const petData = {
          id: petId,
          displayName: petName.trim(),
          photoURL: photoURL || "",
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

  const onPickPhoto = (file) => {
    setPhotoError("");

    if (!file) {
      setPhotoFile(null);
      setPhotoPreview(initialPet?.photoURL || "");
      return;
    }

    if (!file.type || !file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file.");
      return;
    }

    // Optional: enforce size, e.g. 8MB
    const maxBytes = 8 * 1024 * 1024;
    if (file.size > maxBytes) {
      setPhotoError("Image is too large. Please choose a smaller photo.");
      return;
    }

    setPhotoFile(file);

    const localUrl = URL.createObjectURL(file);
    setPhotoPreview(localUrl);
  };

  const uploadPetPhotoIfNeeded = async ({ petId }) => {
    // If user didn't pick a new file, keep current URL (or empty for create)
    if (!photoFile) return photoPreview || "";

    if (!storage) {
      throw new Error("Storage is not configured.");
    }

    const ext = (photoFile.name || "").split(".").pop() || "jpg";
    const path = `images/petPhotos/${uid}/${petId}/${Date.now()}.${ext}`;

    const r = storageRef(storage, path);
    await uploadBytes(r, photoFile);
    const url = await getDownloadURL(r);
    return url;
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
            <FieldLabel>Pet photo</FieldLabel>

            <PhotoRow>
              <PhotoPreview>
                {photoPreview ? (
                  <img src={photoPreview} alt="Pet preview" />
                ) : (
                  <PhotoPlaceholder>Upload</PhotoPlaceholder>
                )}
              </PhotoPreview>

              <PhotoActions>
                <HiddenFileInput
                  id="petPhotoInput"
                  type="file"
                  accept="image/*"
                  onChange={(e) => onPickPhoto(e.target.files?.[0] || null)}
                />

                <FileRow>
                  <FileButton as="label" htmlFor="petPhotoInput">
                    Choose photo
                  </FileButton>

                  <FileName
                    title={
                      photoFile?.name ||
                      (photoPreview ? "Current photo" : "No file chosen")
                    }
                  >
                    {photoFile?.name ||
                      (photoPreview ? "Current photo" : "No file chosen")}
                  </FileName>

                  {photoFile && (
                    <SmallTextButton
                      type="button"
                      onClick={() => onPickPhoto(null)}
                    >
                      Remove
                    </SmallTextButton>
                  )}
                </FileRow>

                <PhotoHint>
                  {isEdit
                    ? "Optional. Upload a new photo to replace the current one."
                    : "Required. Add a clear face photo if possible."}
                </PhotoHint>

                {photoError ? <FieldError>{photoError}</FieldError> : null}
              </PhotoActions>
            </PhotoRow>
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
                  placeholder="YYYY-MM-DD"
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
            <AutocompleteContainer ref={breedFieldRef}>
              <TextInputStyled
                type="text"
                value={breedInput}
                onFocus={() => setBreedDropdownOpen(true)}
                onChange={(e) => {
                  setBreedInput(e.target.value);
                  setBreedDropdownOpen(true);
                }}
                placeholder='Start typing, or choose "Mixed" / "Unknown"'
                autoComplete="off"
              />
              {breedDropdownOpen && filteredBreedOptions.length > 0 && (
                <SuggestionsList>
                  {filteredBreedOptions.map((b) => (
                    <SuggestionItem
                      type="button"
                      key={b.id}
                      onClick={() => {
                        setBreedInput(b.label);
                        setBreedDropdownOpen(false);
                      }}
                    >
                      {b.label}
                    </SuggestionItem>
                  ))}
                </SuggestionsList>
              )}
            </AutocompleteContainer>
            {formErrors.breed && <FieldError>{formErrors.breed}</FieldError>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Color</FieldLabel>
            <AutocompleteContainer ref={colorFieldRef}>
              <TextInputStyled
                type="text"
                value={colorInput}
                onFocus={() => setColorDropdownOpen(true)}
                onChange={(e) => {
                  setColorInput(e.target.value);
                  setColorDropdownOpen(true);
                }}
                placeholder="Start typing a color"
                autoComplete="off"
              />
              {colorDropdownOpen && filteredColorOptions.length > 0 && (
                <SuggestionsList>
                  {filteredColorOptions.map((c) => (
                    <SuggestionItem
                      type="button"
                      key={c.id}
                      onClick={() => {
                        setColorInput(c.label);
                        setColorDropdownOpen(false);
                      }}
                    >
                      {c.label}
                    </SuggestionItem>
                  ))}
                </SuggestionsList>
              )}
            </AutocompleteContainer>
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
  box-sizing: border-box;
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
  box-sizing: border-box;
  padding: 12px 16px 16px;
  max-width: 100%;
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
  display: block;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  min-width: 0;

  font-size: 13px;
  line-height: 1.2;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  outline: none;
  background: #ffffff;

  /* keep height consistent whether empty or with a date */
  height: 36px;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb33;
  }

  &[type="date"] {
    /* force native widget to respect container width */
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    -webkit-appearance: none;
    appearance: none;
    height: 36px;
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

const PhotoRow = styled.div`
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 12px;
  align-items: center;
`;

const PhotoPreview = styled.div`
  width: 88px;
  height: 88px;
  border-radius: 16px;
  overflow: hidden;
  background: #f1f5f9;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const PhotoPlaceholder = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: #64748b;
`;

const PhotoActions = styled.div`
  min-width: 0;
`;

const PhotoInput = styled.input`
  width: 100%;
  font-size: 13px;
`;

const PhotoHint = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: #64748b;
  line-height: 1.35;
`;

const SmallTextButton = styled.button`
  margin-top: 8px;
  border: none;
  background: transparent;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const HiddenFileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const FileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const FileButton = styled.button`
  border: 1px solid rgba(148, 163, 184, 0.45);
  background: #ffffff;
  color: #0f172a;
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;

  &:hover {
    background: #f8fafc;
  }

  &:focus-visible {
    outline: 2px solid rgba(37, 99, 235, 0.35);
    outline-offset: 3px;
  }
`;

const FileName = styled.div`
  flex: 1;
  min-width: 180px;
  font-size: 13px;
  color: #0f172a; /* key: darker text */
  font-weight: 700;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(241, 245, 249, 1);
  border: 1px solid rgba(148, 163, 184, 0.35);

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AutocompleteContainer = styled.div`
  position: relative;
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 220px;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
  margin: 0;
  padding: 4px 0;
  list-style: none;
  overflow-y: auto;
  z-index: 20;
`;

const SuggestionItem = styled.button`
  width: 100%;
  padding: 8px 10px;
  border: none;
  background: transparent;
  text-align: left;
  font-size: 13px;
  color: #0f172a;
  cursor: pointer;

  &:hover {
    background: #f1f5f9;
  }
`;
