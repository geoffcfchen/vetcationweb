// src/pages/onboarding/ProfileOnboardingPage.jsx
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { FiMapPin } from "react-icons/fi";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { DateTime } from "luxon";
import { FiArrowLeft, FiCamera, FiPlus, FiX } from "react-icons/fi";

import GlobalContext from "../../context/GlobalContext";
import { auth, firestore, storage } from "../../lib/firebase";

const US_STATES = [
  { name: "Alabama", abbreviation: "AL" },
  { name: "Alaska", abbreviation: "AK" },
  { name: "Arizona", abbreviation: "AZ" },
  { name: "Arkansas", abbreviation: "AR" },
  { name: "California", abbreviation: "CA" },
  { name: "Colorado", abbreviation: "CO" },
  { name: "Connecticut", abbreviation: "CT" },
  { name: "Delaware", abbreviation: "DE" },
  { name: "Florida", abbreviation: "FL" },
  { name: "Georgia", abbreviation: "GA" },
  { name: "Hawaii", abbreviation: "HI" },
  { name: "Idaho", abbreviation: "ID" },
  { name: "Illinois", abbreviation: "IL" },
  { name: "Indiana", abbreviation: "IN" },
  { name: "Iowa", abbreviation: "IA" },
  { name: "Kansas", abbreviation: "KS" },
  { name: "Kentucky", abbreviation: "KY" },
  { name: "Louisiana", abbreviation: "LA" },
  { name: "Maine", abbreviation: "ME" },
  { name: "Maryland", abbreviation: "MD" },
  { name: "Massachusetts", abbreviation: "MA" },
  { name: "Michigan", abbreviation: "MI" },
  { name: "Minnesota", abbreviation: "MN" },
  { name: "Mississippi", abbreviation: "MS" },
  { name: "Missouri", abbreviation: "MO" },
  { name: "Montana", abbreviation: "MT" },
  { name: "Nebraska", abbreviation: "NE" },
  { name: "Nevada", abbreviation: "NV" },
  { name: "New Hampshire", abbreviation: "NH" },
  { name: "New Jersey", abbreviation: "NJ" },
  { name: "New Mexico", abbreviation: "NM" },
  { name: "New York", abbreviation: "NY" },
  { name: "North Carolina", abbreviation: "NC" },
  { name: "North Dakota", abbreviation: "ND" },
  { name: "Ohio", abbreviation: "OH" },
  { name: "Oklahoma", abbreviation: "OK" },
  { name: "Oregon", abbreviation: "OR" },
  { name: "Pennsylvania", abbreviation: "PA" },
  { name: "Rhode Island", abbreviation: "RI" },
  { name: "South Carolina", abbreviation: "SC" },
  { name: "South Dakota", abbreviation: "SD" },
  { name: "Tennessee", abbreviation: "TN" },
  { name: "Texas", abbreviation: "TX" },
  { name: "Utah", abbreviation: "UT" },
  { name: "Vermont", abbreviation: "VT" },
  { name: "Virginia", abbreviation: "VA" },
  { name: "Washington", abbreviation: "WA" },
  { name: "West Virginia", abbreviation: "WV" },
  { name: "Wisconsin", abbreviation: "WI" },
  { name: "Wyoming", abbreviation: "WY" },
];

const profileSchema = Yup.object().shape({
  name: Yup.string().max(50, "Too Long!").required("name is required"),
  userName: Yup.string()
    .min(1, "Too Short!")
    .max(15, "Too Long!")
    .matches(
      /^[a-zA-Z0-9_.]*$/,
      "username can only contain letters, numbers, underscores (_), or dots (.)",
    )
    .required("username is required"),
  photoURL: Yup.string().required("Profile Image is required"),
});

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return crypto.randomUUID();
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

async function uploadImageFileToStorage({ file, path }) {
  const r = storageRef(storage, path);
  await uploadBytes(r, file, { contentType: file.type || "image/jpeg" });
  const url = await getDownloadURL(r);
  return url;
}

async function isUsernameTaken({ uid, fullUserName }) {
  const q = query(
    collection(firestore, "customers"),
    where("userName", "==", fullUserName),
  );
  const snap = await getDocs(q);

  let taken = false;
  snap.forEach((d) => {
    if (d.id !== uid) taken = true;
  });
  return taken;
}

function isDoctorRole(userData) {
  const label = userData?.role?.label || "";
  const display = userData?.role?.display || "";
  return label === "Doctor" && display !== "Professional";
}

function LicenseModal({
  open,
  onClose,
  uid,
  userData,
  setUserData,
  editIndex,
  initialLicense,
}) {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUploadURL, setImageUploadURL] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setError("");
    setLicenseNumber(initialLicense?.licenseNumber || "");
    setSelectedState(initialLicense?.state || "");
    setExpirationDate(
      initialLicense?.expirationDate
        ? DateTime.fromISO(initialLicense.expirationDate).toFormat("yyyy-LL-dd")
        : "",
    );
    setImageUploadURL(initialLicense?.licenseImageURL || "");
    setImageFile(null);
  }, [open, initialLicense]);

  const expirationError = useMemo(() => {
    if (!expirationDate) return "";
    const picked = DateTime.fromFormat(expirationDate, "yyyy-LL-dd").startOf(
      "day",
    );
    const today = DateTime.now().setZone("America/Los_Angeles").startOf("day");
    if (picked < today) return "Expiration Date cannot be in the past";
    return "";
  }, [expirationDate]);

  async function handlePickFile(e) {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    setError("");
    setUploading(true);
    setImageFile(file);

    try {
      const path = `licenseImages/${uid}/${makeId()}`;
      const url = await uploadImageFileToStorage({ file, path });
      setImageUploadURL(url);
    } catch (err) {
      console.error(err);
      setError("Failed to upload image. Please try again.");
      setImageUploadURL("");
    } finally {
      setUploading(false);
    }
  }

  async function handleVerifyAndSave() {
    setError("");

    if (
      !licenseNumber ||
      !selectedState ||
      !imageUploadURL ||
      !expirationDate
    ) {
      setError("Please complete all fields correctly.");
      return;
    }
    if (expirationError) {
      setError(expirationError);
      return;
    }

    const expIso = DateTime.fromFormat(expirationDate, "yyyy-LL-dd").toISO();

    const newLicense = {
      licenseNumber: licenseNumber.trim(),
      state: selectedState,
      abbreviation:
        US_STATES.find((s) => s.name === selectedState)?.abbreviation || "",
      expirationDate: expIso,
      licenseImageURL: imageUploadURL,
    };

    setIsVerifying(true);
    try {
      const response = await fetch(
        "https://verifylicensedetails-dr6lirynsq-uc.a.run.app",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            licenseNumber: newLicense.licenseNumber,
            state: newLicense.state,
            expirationDate: newLicense.expirationDate,
            imageUrl: newLicense.licenseImageURL,
          }),
        },
      );

      const resultText = await response.text();

      if (!response.ok) {
        setError(resultText || "Verification failed.");
        setIsVerifying(false);
        return;
      }

      if (String(resultText).trim() !== "Verified") {
        setError(resultText || "Verification failed.");
        setIsVerifying(false);
        return;
      }

      const updatedLicenses = [...(userData?.licenses || [])];
      if (typeof editIndex === "number") {
        updatedLicenses[editIndex] = newLicense;
      } else {
        updatedLicenses.push(newLicense);
      }

      await updateDoc(doc(firestore, "customers", uid), {
        licenses: updatedLicenses,
      });

      setUserData((prev) => ({ ...(prev || {}), licenses: updatedLicenses }));
      onClose();
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  }

  if (!open) return null;

  return (
    <ModalBackdrop onMouseDown={onClose}>
      <ModalCard onMouseDown={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>State license</ModalTitle>
          <ModalClose type="button" onClick={onClose} aria-label="Close">
            <FiX />
          </ModalClose>
        </ModalHeader>

        <ModalBody>
          <Field>
            <Label>License No.</Label>
            <Input
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder="License number"
            />
          </Field>

          <Field>
            <Label>License State</Label>
            <Select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">Select a State</option>
              {US_STATES.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <Label>Expiration Date</Label>
            <Input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </Field>

          <Field>
            <Label>Upload license photo</Label>
            <UploadRow>
              <UploadInput
                type="file"
                accept="image/*"
                onChange={handlePickFile}
              />
              {uploading ? <SmallMuted>Uploading...</SmallMuted> : null}
            </UploadRow>

            {imageUploadURL ? (
              <Preview>
                <PreviewImg src={imageUploadURL} alt="license preview" />
              </Preview>
            ) : (
              <SmallMuted>Upload is required to verify.</SmallMuted>
            )}
          </Field>

          {error ? <ErrorBanner>{error}</ErrorBanner> : null}

          <ModalFooter>
            <SecondaryBtn type="button" onClick={onClose}>
              Cancel
            </SecondaryBtn>
            <PrimaryBtn
              type="button"
              onClick={handleVerifyAndSave}
              disabled={
                isVerifying ||
                uploading ||
                !licenseNumber ||
                !selectedState ||
                !expirationDate ||
                !imageUploadURL
              }
            >
              {isVerifying ? "Verifying..." : "Submit"}
            </PrimaryBtn>
          </ModalFooter>
        </ModalBody>
      </ModalCard>
    </ModalBackdrop>
  );
}

function LocationModal({ open, onClose, uid, onSaved }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: ["places"],
  });

  const [auto, setAuto] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [cityInfo, setCityInfo] = useState({
    city: "",
    state: "",
    country: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setInputValue("");
    setSelectedAddress("");
    setCityInfo({ city: "", state: "", country: "" });
    setError("");
  }, [open]);

  const parsePlace = (place) => {
    const comps = place?.address_components || [];

    let city = "";
    let state = "";
    let country = "";

    comps.forEach((c) => {
      if (c.types?.includes("locality")) city = c.long_name;
      if (c.types?.includes("administrative_area_level_1"))
        state = c.short_name;
      if (c.types?.includes("country")) country = c.short_name;
    });

    // fallback: sometimes city shows up as admin_area_level_2
    if (!city) {
      comps.forEach((c) => {
        if (c.types?.includes("administrative_area_level_2"))
          city = c.long_name;
      });
    }

    return { city, state, country };
  };

  const onPlaceChanged = () => {
    try {
      const place = auto?.getPlace?.();
      if (!place) return;

      const formatted = place.formatted_address || place.name || inputValue;
      setInputValue(formatted);
      setSelectedAddress(formatted);
      setCityInfo(parsePlace(place));
      setError("");
    } catch (e) {
      console.error(e);
      setError("Unable to read the selected place. Please try again.");
    }
  };

  const handleSelect = async () => {
    setError("");

    if (!uid) {
      setError("Missing user session. Please refresh and try again.");
      return;
    }

    if (!cityInfo.city) {
      setError("Please select a city from the dropdown suggestions.");
      return;
    }

    try {
      await onSaved(cityInfo);
      onClose();
    } catch (e) {
      console.error(e);
      setError("Failed to save location. Please try again.");
    }
  };

  if (!open) return null;

  const hasKey = !!import.meta.env.VITE_GOOGLE_MAPS_KEY;

  return (
    <ModalBackdrop onMouseDown={onClose}>
      <ModalCard onMouseDown={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Where do you live?</ModalTitle>
          <ModalClose type="button" onClick={onClose} aria-label="Close">
            <FiX />
          </ModalClose>
        </ModalHeader>

        <ModalBody>
          {!hasKey ? (
            <ErrorBanner>
              Missing VITE_GOOGLE_MAPS_KEY. Add it to your environment
              variables.
            </ErrorBanner>
          ) : !isLoaded ? (
            <SmallMuted>Loading location search...</SmallMuted>
          ) : (
            <>
              <Field>
                <Label>Search for your city</Label>
                <Autocomplete
                  onLoad={(a) => setAuto(a)}
                  onPlaceChanged={onPlaceChanged}
                  options={{ types: ["(cities)"] }}
                >
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Start typing your city"
                  />
                </Autocomplete>
              </Field>

              <Field>
                <Label>Selected</Label>
                <SmallMuted>
                  {selectedAddress
                    ? selectedAddress
                    : "Pick a city from the suggestions above."}
                </SmallMuted>

                {cityInfo.city ? (
                  <SmallMuted>
                    Saved as: {cityInfo.city}
                    {cityInfo.state ? `, ${cityInfo.state}` : ""}
                    {cityInfo.country ? `, ${cityInfo.country}` : ""}
                  </SmallMuted>
                ) : null}
              </Field>

              {error ? <ErrorBanner>{error}</ErrorBanner> : null}

              <ModalFooter>
                <SecondaryBtn type="button" onClick={onClose}>
                  Cancel
                </SecondaryBtn>
                <PrimaryBtn
                  type="button"
                  onClick={handleSelect}
                  disabled={!cityInfo.city}
                >
                  Select Location
                </PrimaryBtn>
              </ModalFooter>
            </>
          )}
        </ModalBody>
      </ModalCard>
    </ModalBackdrop>
  );
}

export default function ProfileOnboardingPage() {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(GlobalContext);
  console.log("userData in ProfileOnboardingPage?", userData);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const uid = auth.currentUser?.uid || userData?.uid || null;

  const [photoURL, setPhotoURL] = useState(userData?.photoURL || "");
  const [photoUploading, setPhotoUploading] = useState(false);

  const [name, setName] = useState(userData?.displayName || "");
  const [userName, setUserName] = useState(
    userData?.userName
      ? String(userData.userName).replace(".vetcation", "")
      : "",
  );

  const [city, setCity] = useState(userData?.city || "");
  const [state, setState] = useState(userData?.state || "");
  const [country, setCountry] = useState(userData?.country || "");

  const [nameError, setNameError] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  const debounceRef = useRef(null);

  const needsDoctorLicense = useMemo(() => isDoctorRole(userData), [userData]);

  // License modal state
  const [licenseModalOpen, setLicenseModalOpen] = useState(false);
  const [licenseEditIndex, setLicenseEditIndex] = useState(null);
  const [licenseInitial, setLicenseInitial] = useState(null);

  // "Add license later?" confirm modal
  const [licenseConfirmOpen, setLicenseConfirmOpen] = useState(false);

  useEffect(() => {
    if (!uid) return;
    const creationTime = auth.currentUser?.metadata?.creationTime || null;
    if (!creationTime) return;

    // mirror RN storing creationTime
    // setDoc(
    //   doc(firestore, "customers", uid),
    //   { creationTime, creationTimeSavedAt: serverTimestamp() },
    //   { merge: true },
    // ).catch(() => {});
    updateDoc(doc(firestore, "customers", uid), {
      creationTime,
      creationTimeSavedAt: serverTimestamp(),
    }).catch(() => {});
  }, [uid]);

  // Debounced username availability check
  useEffect(() => {
    if (!uid) return;

    if (!userName) {
      setUserNameError("");
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const full = `${userName}.vetcation`;

      try {
        const taken = await isUsernameTaken({ uid, fullUserName: full });
        if (taken) {
          setUserNameError("Username is already taken");
        } else {
          setUserNameError("");
        }
      } catch (err) {
        console.error(err);
        setUserNameError("Error checking username availability");
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [uid, userName]);

  async function handlePickProfilePhoto(e) {
    const file = e.target.files?.[0] || null;
    if (!file || !uid) return;

    setPhotoError("");
    setPhotoUploading(true);

    try {
      const email = auth.currentUser?.email || userData?.email || "user";
      const path = `images/profilePhotos/${email}${uid}`;
      const url = await uploadImageFileToStorage({ file, path });

      setPhotoURL(url);
      setUserData((prev) => ({ ...(prev || {}), photoURL: url }));

      await updateDoc(doc(firestore, "customers", uid), { photoURL: url });
    } catch (err) {
      console.error(err);
      setPhotoError("Failed to upload profile photo. Please try again.");
    } finally {
      setPhotoUploading(false);
    }
  }

  function validateForm() {
    setNameError("");
    setUserNameError((prev) => prev); // keep any async taken error
    setPhotoError("");
    setSubmitError("");

    try {
      profileSchema.validateSync(
        { name, userName, photoURL },
        { abortEarly: false },
      );
    } catch (err) {
      (err.inner || []).forEach((e) => {
        if (e.path === "name") setNameError(e.message);
        if (e.path === "userName") setUserNameError(e.message);
        if (e.path === "photoURL") setPhotoError(e.message);
      });
      return false;
    }

    if (!city || !state || !country) {
      setSubmitError("Please select your location");
      return false;
    }

    return true;
  }

  function openAddLicense() {
    setLicenseEditIndex(null);
    setLicenseInitial(null);
    setLicenseModalOpen(true);
  }

  function openEditLicense(index) {
    const lic = (userData?.licenses || [])[index] || null;
    setLicenseEditIndex(index);
    setLicenseInitial(lic);
    setLicenseModalOpen(true);
  }

  async function handleSaveLocation(info) {
    // info: { city, state, country }
    setCity(info.city || "");
    setState(info.state || "");
    setCountry(info.country || "");

    setUserData((prev) => ({ ...(prev || {}), ...info }));

    if (!uid) return;

    await updateDoc(doc(firestore, "customers", uid), {
      city: info.city || "",
      state: info.state || "",
      country: info.country || "",
    });
  }
  async function submitProfileToFirestore({ allowNoLicense }) {
    if (!uid) throw new Error("missing-uid");

    const fullUserName = `${userName}.vetcation`;

    // final username check
    const taken = await isUsernameTaken({ uid, fullUserName });
    if (taken) {
      setUserNameError("Username is already taken");
      throw new Error("username-taken");
    }

    const emailLower = String(userData?.email || "")
      .trim()
      .toLowerCase();
    const isClinic3Test = emailLower === "clinic3@test.com";

    const updateData = {
      hasCompletedProfile: true,
      // ...(isClinic3Test ? {} : { hasCompletedProfile: true }), // ← key change
      userName: fullUserName,
      uid,
      platform: "web",
      displayName: name,
      photoURL: photoURL,
      city,
      state,
      country,
    };

    // Optional: if you want to enforce license in Firestore later, do it via rules or server.
    // Here we only gate in UI, like RN.
    if (!allowNoLicense && needsDoctorLicense) {
      const licenses = userData?.licenses || [];
      if (!licenses.length) {
        throw new Error("missing-license");
      }
    }

    await updateDoc(doc(firestore, "customers", uid), updateData);
    setUserData((prev) => ({ ...(prev || {}), ...updateData }));
  }

  async function handleSubmit() {
    if (!uid) {
      navigate("/login", { replace: true });
      return;
    }

    if (!validateForm()) return;

    if (userNameError) return;

    // doctor license gating, same as RN
    if (needsDoctorLicense) {
      const licenses = userData?.licenses || [];
      if (!licenses.length) {
        setLicenseConfirmOpen(true);
        return;
      }
    }

    setSaving(true);
    try {
      await submitProfileToFirestore({ allowNoLicense: false });
      navigate("/app", { replace: true });
    } catch (err) {
      if (String(err?.message || "").includes("missing-license")) {
        setLicenseConfirmOpen(true);
      } else if (String(err?.message || "").includes("username-taken")) {
        // already set
      } else {
        console.error(err);
        setSubmitError(
          "An error occurred while updating your profile. Please try again.",
        );
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmSubmitWithoutLicense() {
    setLicenseConfirmOpen(false);
    setSaving(true);

    try {
      await submitProfileToFirestore({ allowNoLicense: true });
      navigate("/app", { replace: true });
    } catch (err) {
      console.error(err);
      setSubmitError(
        "An error occurred while updating your profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Page>
      <TopBar>
        <BackBtn
          type="button"
          onClick={() => navigate("/onboarding/role", { replace: true })}
        >
          <FiArrowLeft />
          Back
        </BackBtn>
        <Brand>MyPet Health</Brand>
      </TopBar>

      <Main>
        <Card>
          <Header>
            <H1>Set up your profile</H1>
            <Sub>Complete this once. You can edit later.</Sub>
          </Header>

          {/* Photo */}
          <Section>
            <SectionTitle>Profile picture</SectionTitle>

            <PhotoRow>
              <Avatar $src={photoURL}>{!photoURL ? <FiCamera /> : null}</Avatar>

              <div>
                <UploadLabel>
                  <HiddenFile
                    type="file"
                    accept="image/*"
                    onChange={handlePickProfilePhoto}
                    disabled={photoUploading || saving}
                  />
                  {photoUploading ? "Uploading..." : "Upload photo"}
                </UploadLabel>

                {photoError ? <ErrorText>{photoError}</ErrorText> : null}
              </div>
            </PhotoRow>
          </Section>

          {/* Name */}
          <Section>
            <SectionTitle>Your display name</SectionTitle>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Preferred name"
              disabled={saving}
            />
            {nameError ? <ErrorText>{nameError}</ErrorText> : null}
          </Section>

          {/* Username */}
          <Section>
            <SectionTitle>Your @username</SectionTitle>
            <UserNameRow>
              <Prefix>@</Prefix>
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="username"
                disabled={saving}
              />
              <Suffix>.vetcation</Suffix>
            </UserNameRow>
            {userNameError ? <ErrorText>{userNameError}</ErrorText> : null}
          </Section>

          {/* Location */}
          <Section>
            <SectionTitle>Location</SectionTitle>

            <LocationButton
              type="button"
              onClick={() => setLocationModalOpen(true)}
              disabled={saving}
              title="Select your location"
            >
              <FiMapPin />
              {city && state && country
                ? `${city}, ${state}, ${country}`
                : "Tap to select your location"}
            </LocationButton>

            <SmallMuted>
              We use this to personalize your experience and compliance rules.
            </SmallMuted>
          </Section>

          {/* Licenses (Doctor only, not Professional) */}
          {needsDoctorLicense ? (
            <Section>
              <SectionTitle>Licenses</SectionTitle>
              <SmallMuted>
                A license is needed to obtain a verified doctor badge and
                practice telemedicine.
              </SmallMuted>

              <LicensesList>
                {(userData?.licenses || []).length ? (
                  (userData.licenses || []).map((lic, idx) => (
                    <LicenseRow
                      key={`${lic.state}-${lic.licenseNumber}-${idx}`}
                    >
                      <LicenseMain>
                        <LicenseTitle>
                          {lic.state} ({lic.abbreviation || ""})
                        </LicenseTitle>
                        <LicenseSub>
                          {lic.licenseNumber}
                          {lic.expirationDate
                            ? ` · exp ${DateTime.fromISO(lic.expirationDate).toFormat("MMM d, yyyy")}`
                            : ""}
                        </LicenseSub>
                      </LicenseMain>

                      <LinkBtn
                        type="button"
                        onClick={() => openEditLicense(idx)}
                        disabled={saving}
                      >
                        Edit
                      </LinkBtn>
                    </LicenseRow>
                  ))
                ) : (
                  <EmptyNote>No licenses added yet.</EmptyNote>
                )}
              </LicensesList>

              <PrimaryOutline
                type="button"
                onClick={openAddLicense}
                disabled={saving}
              >
                <FiPlus />
                Add license
              </PrimaryOutline>
            </Section>
          ) : null}

          {submitError ? <ErrorBanner>{submitError}</ErrorBanner> : null}

          <BottomRow>
            <PrimaryBtn
              type="button"
              onClick={handleSubmit}
              disabled={saving || photoUploading}
            >
              {saving ? "Saving..." : "Submit"}
            </PrimaryBtn>
          </BottomRow>
        </Card>
      </Main>

      {/* License modal */}
      <LicenseModal
        open={licenseModalOpen}
        onClose={() => setLicenseModalOpen(false)}
        uid={uid}
        userData={userData}
        setUserData={setUserData}
        editIndex={licenseEditIndex}
        initialLicense={licenseInitial}
      />
      <LocationModal
        open={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        uid={uid}
        onSaved={handleSaveLocation}
      />

      {/* "Add license later?" confirm modal */}
      {licenseConfirmOpen ? (
        <ModalBackdrop onMouseDown={() => setLicenseConfirmOpen(false)}>
          <ConfirmCard onMouseDown={(e) => e.stopPropagation()}>
            <ConfirmTitle>Add your license later?</ConfirmTitle>
            <ConfirmBody>
              A license is needed to obtain a verified doctor badge and practice
              telemedicine. Are you sure you want to add your license later?
            </ConfirmBody>

            <ConfirmRow>
              <SecondaryBtn
                type="button"
                onClick={() => setLicenseConfirmOpen(false)}
                disabled={saving}
              >
                No, go back
              </SecondaryBtn>
              <PrimaryBtn
                type="button"
                onClick={handleConfirmSubmitWithoutLicense}
                disabled={saving}
              >
                Yes, continue
              </PrimaryBtn>
            </ConfirmRow>
          </ConfirmCard>
        </ModalBackdrop>
      ) : null}
    </Page>
  );
}

/* styles */

const Page = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  color: #111827;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.header`
  padding: 14px 18px;
  border-bottom: 1px solid #eef2f7;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const BackBtn = styled.button`
  border: none;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: #0f172a;
  }
`;

const Brand = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: #0f172a;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 24px 16px 40px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 720px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
`;

const Header = styled.div`
  padding: 6px 2px 10px;
`;

const H1 = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 900;
  color: #0f172a;
`;

const Sub = styled.p`
  margin: 8px 0 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
`;

const Section = styled.section`
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #eef2f7;
`;

const SectionTitle = styled.div`
  font-size: 13px;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 8px;
`;

const PhotoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 62px;
  height: 62px;
  border-radius: 18px;
  background: ${(p) => (p.$src ? `url(${p.$src}) center/cover` : "#e5e7eb")};
  color: ${(p) => (p.$src ? "transparent" : "#475569")};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 22px;
  }
`;

const UploadLabel = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  background: #ffffff;

  &:hover {
    background: #f9fafb;
  }
`;

const HiddenFile = styled.input`
  display: none;
`;

const Input = styled.input`
  width: 100%;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #93c5fd;
  }
`;

const UserNameRow = styled.div`
  display: grid;
  grid-template-columns: 34px 1fr auto;
  gap: 8px;
  align-items: center;
`;

const Prefix = styled.div`
  font-weight: 900;
  color: #0f172a;
  text-align: center;
`;

const Suffix = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: #64748b;
  padding-right: 4px;
`;

const Grid3 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const SmallMuted = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
`;

const ErrorText = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: #b91c1c;
`;

const ErrorBanner = styled.div`
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #fee2e2;
  color: #b91c1c;
  font-size: 13px;
`;

const BottomRow = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
`;

const PrimaryBtn = styled.button`
  border: none;
  background: #111827;
  color: #ffffff;
  border-radius: 999px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: default;
  }
`;

const PrimaryOutline = styled.button`
  margin-top: 10px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #0f172a;
  border-radius: 999px;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f9fafb;
  }

  &:disabled {
    opacity: 0.65;
    cursor: default;
  }
`;

const LinkBtn = styled.button`
  border: none;
  background: transparent;
  color: #2563eb;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const LicensesList = styled.div`
  margin-top: 10px;
  display: grid;
  gap: 10px;
`;

const LicenseRow = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const LicenseMain = styled.div`
  min-width: 0;
`;

const LicenseTitle = styled.div`
  font-size: 13px;
  font-weight: 900;
  color: #0f172a;
`;

const LicenseSub = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
`;

const EmptyNote = styled.div`
  font-size: 13px;
  color: #64748b;
`;

/* Modal shared */

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

const ModalCard = styled.div`
  width: 100%;
  max-width: 620px;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 14px 16px 10px;
  border-bottom: 1px solid #eef2f7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const ModalTitle = styled.div`
  font-size: 15px;
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

  &:hover {
    background: #f1f5f9;
  }

  svg {
    font-size: 18px;
  }
`;

const ModalBody = styled.div`
  padding: 14px 16px 16px;
`;

const Field = styled.div`
  margin-top: 12px;
`;

const Label = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 6px;
`;

const Select = styled.select`
  width: 100%;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #93c5fd;
  }
`;

const UploadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const UploadInput = styled.input`
  width: 100%;
`;

const Preview = styled.div`
  margin-top: 10px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
`;

const PreviewImg = styled.img`
  width: 100%;
  display: block;
`;

const ModalFooter = styled.div`
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const SecondaryBtn = styled.button`
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #0f172a;
  border-radius: 999px;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }

  &:disabled {
    opacity: 0.65;
    cursor: default;
  }
`;

const ConfirmCard = styled.div`
  width: 100%;
  max-width: 520px;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
  padding: 18px;
`;

const ConfirmTitle = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
`;

const ConfirmBody = styled.div`
  margin-top: 10px;
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
`;

const ConfirmRow = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const LocationButton = styled.button`
  width: 100%;
  border: none;
  border-radius: 999px;
  background: rgba(239, 246, 255, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.22);
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #0f172a;
  display: inline-flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background: rgba(239, 246, 255, 1);
  }

  &:disabled {
    opacity: 0.65;
    cursor: default;
  }
`;
