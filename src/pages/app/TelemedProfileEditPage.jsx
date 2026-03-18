// src/pages/app/TelemedProfileEditPage.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPlus,
  FiSave,
  FiTrash2,
  FiUploadCloud,
  FiX,
  FiEdit2,
} from "react-icons/fi";

import GlobalContext from "../../context/GlobalContext";
import checkRole from "../../utility/checkRole";

import { auth, firestore, storage } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

function normalizeStr(v) {
  return String(v || "").trim();
}

function safePathPart(v) {
  return String(v || "")
    .replaceAll("/", "_")
    .replaceAll("\\", "_");
}

function makeId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
}

async function uploadFileToStorage({ file, path }) {
  const r = storageRef(storage, path);
  await uploadBytes(r, file, {
    contentType: file.type || "application/octet-stream",
  });
  return await getDownloadURL(r);
}

export default function TelemedProfileEditPage() {
  const navigate = useNavigate();
  const { userData } = useContext(GlobalContext);
  const role = checkRole();

  const uid = auth.currentUser?.uid || null;
  const email = auth.currentUser?.email || "";

  const display = userData?.role?.display;
  const isDoctor = role === "Doctor";
  const isProfessionalDoctor = isDoctor && display === "Professional";
  const isDoctorNonProfessional = isDoctor && display !== "Professional";
  const isClient = role === "Client";
  const isOrganization = role === "Organization";

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // base fields required for all roles (per checklist)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  // Doctor sections
  const [licenses, setLicenses] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const [professionalBusinesses, setProfessionalBusinesses] = useState([]);

  // Client recommended
  const [homeClinicName, setHomeClinicName] = useState("");
  const [homeClinicAddress, setHomeClinicAddress] = useState("");

  // uploads
  const [telemedPhotoFile, setTelemedPhotoFile] = useState(null);
  const [telemedPhotoPreview, setTelemedPhotoPreview] = useState("");

  const [signatureFile, setSignatureFile] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState("");

  const existingTelemedPhotoURL = userData?.telemedicinePhotoURL || "";
  const existingSignatureUrl = userData?.signatureUrl || "";

  // hydrate from Firestore userData
  useEffect(() => {
    setFirstName(userData?.firstName || "");
    setLastName(userData?.lastName || "");
    setPhoneNumber(userData?.phoneNumber || "");
    setAddress(userData?.address || "");

    setLicenses(Array.isArray(userData?.licenses) ? userData.licenses : []);
    setInsurances(
      Array.isArray(userData?.insurances) ? userData.insurances : [],
    );
    setProfessionalBusinesses(
      Array.isArray(userData?.professionalBusinesses)
        ? userData.professionalBusinesses
        : [],
    );

    setHomeClinicName(userData?.homeClinicName || "");
    setHomeClinicAddress(userData?.homeClinicAddress || "");

    setTelemedPhotoPreview(existingTelemedPhotoURL || "");
    setSignaturePreview(existingSignatureUrl || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.uid]);

  // clean up object URLs
  useEffect(() => {
    return () => {
      if (telemedPhotoPreview?.startsWith("blob:"))
        URL.revokeObjectURL(telemedPhotoPreview);
      if (signaturePreview?.startsWith("blob:"))
        URL.revokeObjectURL(signaturePreview);
    };
  }, [telemedPhotoPreview, signaturePreview]);

  const helperText = useMemo(() => {
    if (isDoctor && display !== "Professional") {
      return "Enter your legal and compliance details required for providing telemedicine services.";
    }
    if (isDoctor && display === "Professional") {
      return "Enter your legal and compliance details required for providing professional services.";
    }
    if (isClient) {
      return "Enter your legal and compliance details required for telemedicine.";
    }
    if (isOrganization) {
      return "As the authorized manager/owner, enter your legal name, phone number, and work address to meet compliance and activate services.";
    }
    return "Update your legal and compliance details.";
  }, [isDoctor, isClient, isOrganization, display]);

  const onPickTelemedPhoto = (e) => {
    const f = e.target.files?.[0] || null;
    if (!f) return;

    setTelemedPhotoFile(f);
    if (telemedPhotoPreview?.startsWith("blob:"))
      URL.revokeObjectURL(telemedPhotoPreview);
    setTelemedPhotoPreview(URL.createObjectURL(f));
  };

  const onPickSignature = (e) => {
    const f = e.target.files?.[0] || null;
    if (!f) return;

    setSignatureFile(f);
    if (signaturePreview?.startsWith("blob:"))
      URL.revokeObjectURL(signaturePreview);
    setSignaturePreview(URL.createObjectURL(f));
  };

  const validate = () => {
    if (!normalizeStr(firstName)) return "First name is required.";
    if (!normalizeStr(lastName)) return "Last name is required.";
    if (!normalizeStr(phoneNumber)) return "Phone number is required.";
    if (!normalizeStr(address)) return "Address is required.";

    // Match checklist requirements for Doctor non-Professional
    if (isDoctorNonProfessional) {
      const hasTelemedPhoto = !!telemedPhotoFile || !!existingTelemedPhotoURL;
      if (!hasTelemedPhoto) {
        return "Please upload a telemedicine photo (must show your face clearly for telemedicine consultations).";
      }
      if (!Array.isArray(licenses) || licenses.length === 0) {
        return "Please add at least one license.";
      }
    }

    // Match checklist requirements for Doctor Professional
    if (isProfessionalDoctor) {
      if (
        !Array.isArray(professionalBusinesses) ||
        professionalBusinesses.length === 0
      ) {
        return "Please add at least one professional business.";
      }
    }

    return "";
  };

  const onSave = async () => {
    if (!uid) return;

    setError("");
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setSaving(true);
    try {
      const fn = normalizeStr(firstName);
      const ln = normalizeStr(lastName);

      // Upload telemedicine photo if changed (shown for all doctors, required only for non-professional)
      let telemedicinePhotoURL = existingTelemedPhotoURL;
      if (telemedPhotoFile) {
        const key = `${safePathPart(email || "noemail")}_${uid}`;
        telemedicinePhotoURL = await uploadFileToStorage({
          file: telemedPhotoFile,
          path: `images/telemedicinePhotos/${key}`,
        });
      }

      // Upload signature if changed (only shown for Doctor non-Professional in RN)
      let signatureUrl = existingSignatureUrl;
      if (signatureFile) {
        const key = `${safePathPart(email || "noemail")}_${uid}`;
        signatureUrl = await uploadFileToStorage({
          file: signatureFile,
          path: `images/signatures/${key}`,
        });
      }

      // Always patch base required fields for all roles
      const patch = {
        firstName: fn,
        lastName: ln,
        phoneNumber: normalizeStr(phoneNumber),
        address: normalizeStr(address),
      };

      // Client recommended home clinic
      if (isClient) {
        if (normalizeStr(homeClinicName))
          patch.homeClinicName = normalizeStr(homeClinicName);
        if (normalizeStr(homeClinicAddress))
          patch.homeClinicAddress = normalizeStr(homeClinicAddress);
      }

      // Doctor sections
      if (isDoctor) {
        // keep telemedicinePhotoURL updated if they upload one
        if (telemedicinePhotoURL)
          patch.telemedicinePhotoURL = telemedicinePhotoURL;

        if (isDoctorNonProfessional) {
          patch.licenses = Array.isArray(licenses) ? licenses : [];
          patch.insurances = Array.isArray(insurances) ? insurances : [];
          if (signatureUrl) patch.signatureUrl = signatureUrl; // recommended in checklist
        }

        if (isProfessionalDoctor) {
          patch.professionalBusinesses = Array.isArray(professionalBusinesses)
            ? professionalBusinesses
            : [];
        }
      }

      // customers/{uid}
      await setDoc(doc(firestore, "customers", uid), patch, { merge: true });

      // Auth profile convenience only
      try {
        await updateProfile(auth.currentUser, {
          displayName: `${fn} ${ln}`.trim(),
          photoURL:
            telemedicinePhotoURL || auth.currentUser?.photoURL || undefined,
        });
      } catch {
        // ignore
      }

      // Keep clinics/{uid} in sync for Doctor (same behavior as RN)
      if (isDoctor) {
        await setDoc(
          doc(firestore, "clinics", uid),
          {
            firstName: fn,
            lastName: ln,
            name: `${fn} ${ln}`.trim(),
            isIndependentVet: true,
            place_id: uid,
            telemedicinePhotoURL: telemedicinePhotoURL || "",
          },
          { merge: true },
        );
      }

      navigate("/app/telehealth/settings", { replace: true });
    } catch (e) {
      console.error(e);
      setError(e?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  // Licenses modal (Doctor non-Professional only)
  const [licenseModalOpen, setLicenseModalOpen] = useState(false);
  const [editingLicenseIndex, setEditingLicenseIndex] = useState(-1);
  const [licState, setLicState] = useState("");
  const [licAbbrev, setLicAbbrev] = useState("");
  const [licExpirationDate, setLicExpirationDate] = useState("");
  const [licNumber, setLicNumber] = useState("");

  const openAddLicense = () => {
    setEditingLicenseIndex(-1);
    setLicState("");
    setLicAbbrev("");
    setLicExpirationDate("");
    setLicNumber("");
    setLicenseModalOpen(true);
  };

  const openEditLicense = (idx) => {
    const lic = licenses?.[idx] || {};
    setEditingLicenseIndex(idx);
    setLicState(lic?.state || "");
    setLicAbbrev(lic?.abbreviation || "");
    setLicNumber(lic?.licenseNumber || "");
    setLicExpirationDate(String(lic?.expirationDate || "").slice(0, 10));
    setLicenseModalOpen(true);
  };

  const saveLicenseFromModal = () => {
    const next = [...(Array.isArray(licenses) ? licenses : [])];

    const state = normalizeStr(licState);
    const abbreviation = normalizeStr(licAbbrev).toUpperCase();
    const licenseNumber = normalizeStr(licNumber);
    const expirationDate = normalizeStr(licExpirationDate);

    if (!state || !abbreviation) {
      setError("License state and abbreviation are required.");
      return;
    }

    const payload = {
      state,
      abbreviation,
      ...(licenseNumber ? { licenseNumber } : {}),
      ...(expirationDate ? { expirationDate } : {}),
    };

    if (editingLicenseIndex >= 0) next[editingLicenseIndex] = payload;
    else next.push(payload);

    setLicenses(next);
    setLicenseModalOpen(false);
  };

  const removeLicense = (idx) => {
    const next = [...(Array.isArray(licenses) ? licenses : [])];
    next.splice(idx, 1);
    setLicenses(next);
  };

  // Insurance modal (Doctor non-Professional only, recommended)
  const [insModalOpen, setInsModalOpen] = useState(false);
  const [insCarrier, setInsCarrier] = useState("");
  const [insPolicyNumber, setInsPolicyNumber] = useState("");
  const [insExp, setInsExp] = useState("");

  const openAddInsurance = () => {
    setInsCarrier("");
    setInsPolicyNumber("");
    setInsExp("");
    setInsModalOpen(true);
  };

  const saveInsuranceFromModal = () => {
    const carrier = normalizeStr(insCarrier);
    const policyNumber = normalizeStr(insPolicyNumber);
    const expirationDate = normalizeStr(insExp);

    if (!carrier) {
      setError("Insurance carrier is required.");
      return;
    }

    const next = [...(Array.isArray(insurances) ? insurances : [])];
    next.push({
      carrier,
      ...(policyNumber ? { policyNumber } : {}),
      ...(expirationDate ? { expirationDate } : {}),
    });

    setInsurances(next);
    setInsModalOpen(false);
  };

  const removeInsurance = (idx) => {
    const next = [...(Array.isArray(insurances) ? insurances : [])];
    next.splice(idx, 1);
    setInsurances(next);
  };

  // Professional businesses (Doctor Professional only)
  const [bizModalOpen, setBizModalOpen] = useState(false);
  const [bizName, setBizName] = useState("");
  const [bizWebsite, setBizWebsite] = useState("");

  const openAddBusiness = () => {
    setBizName("");
    setBizWebsite("");
    setBizModalOpen(true);
  };

  const saveBusinessFromModal = () => {
    const name = normalizeStr(bizName);
    const website = normalizeStr(bizWebsite);
    if (!name) {
      setError("Business name is required.");
      return;
    }

    const next = [
      ...(Array.isArray(professionalBusinesses) ? professionalBusinesses : []),
    ];
    next.push({
      id: makeId(),
      status: "pending",
      name,
      ...(website ? { proofs: [{ type: "website", url: website }] } : {}),
    });

    setProfessionalBusinesses(next);
    setBizModalOpen(false);
  };

  const removeBusiness = (idx) => {
    const next = [
      ...(Array.isArray(professionalBusinesses) ? professionalBusinesses : []),
    ];
    next.splice(idx, 1);
    setProfessionalBusinesses(next);
  };

  return (
    <Wrap>
      <TopRow>
        <BackBtn type="button" onClick={() => navigate(-1)} aria-label="Back">
          <FiArrowLeft />
          Back
        </BackBtn>
      </TopRow>

      <Header>
        <Title>Update Legal Information</Title>
        <SubTitle>{helperText}</SubTitle>
      </Header>

      <Card>
        {/* Doctor: telemedicine photo shown for all doctors in RN */}
        {isDoctor && (
          <Section>
            <SectionTitle>
              Telemedicine photo
              {isDoctorNonProfessional ? " (required)" : " (optional)"}
            </SectionTitle>
            <SectionDesc>
              Must show your face clearly for telemedicine consultations.
            </SectionDesc>

            <UploadRow>
              <Preview>
                {telemedPhotoPreview ? (
                  <img src={telemedPhotoPreview} alt="Telemedicine preview" />
                ) : (
                  <PreviewEmpty>No photo yet</PreviewEmpty>
                )}
              </Preview>

              <UploadCol>
                <FileLabel>
                  <FiUploadCloud />
                  <span>
                    {telemedPhotoPreview ? "Replace photo" : "Upload photo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onPickTelemedPhoto}
                  />
                </FileLabel>
              </UploadCol>
            </UploadRow>
          </Section>
        )}

        {/* Doctor non-Professional: licenses, insurance, signature */}
        {isDoctorNonProfessional && (
          <Section>
            <SectionTitle>Licenses (required)</SectionTitle>
            <SectionDesc>Add at least one active license.</SectionDesc>

            <InlineActions>
              <SmallBtn type="button" onClick={openAddLicense}>
                <FiPlus />
                Add license
              </SmallBtn>
            </InlineActions>

            {licenses.length > 0 ? (
              <List>
                {licenses.map((lic, idx) => (
                  <ListRow key={`${lic.abbreviation || "lic"}-${idx}`}>
                    <RowMain>
                      <RowTitle>
                        {lic.state || "State"} ({lic.abbreviation || "N/A"}, US)
                      </RowTitle>
                      <RowSub>
                        {lic.expirationDate
                          ? `exp ${String(lic.expirationDate).slice(0, 10)}`
                          : "no expiration date"}
                        {lic.licenseNumber ? ` · # ${lic.licenseNumber}` : ""}
                      </RowSub>
                    </RowMain>

                    <RowActions>
                      <IconBtn
                        type="button"
                        onClick={() => openEditLicense(idx)}
                        title="Edit"
                      >
                        <FiEdit2 />
                      </IconBtn>
                      <IconBtn
                        type="button"
                        onClick={() => removeLicense(idx)}
                        title="Remove"
                      >
                        <FiTrash2 />
                      </IconBtn>
                    </RowActions>
                  </ListRow>
                ))}
              </List>
            ) : (
              <Muted>No licenses yet. Add one to complete setup.</Muted>
            )}
          </Section>
        )}

        {isDoctorNonProfessional && (
          <Section>
            <SectionTitle>
              Professional liability insurance (recommended)
            </SectionTitle>
            <SectionDesc>
              Recommended before accepting appointments.
            </SectionDesc>

            <InlineActions>
              <SmallBtn type="button" onClick={openAddInsurance}>
                <FiPlus />
                Add insurance
              </SmallBtn>
            </InlineActions>

            {insurances.length > 0 ? (
              <List>
                {insurances.map((p, idx) => (
                  <ListRow key={`${p.policyNumber || "pol"}-${idx}`}>
                    <RowMain>
                      <RowTitle>{p.carrier || "Insurance"}</RowTitle>
                      <RowSub>
                        {p.policyNumber
                          ? `•••${String(p.policyNumber).slice(-4)}`
                          : "no policy number"}
                        {p.expirationDate
                          ? ` · exp ${String(p.expirationDate).slice(0, 10)}`
                          : ""}
                      </RowSub>
                    </RowMain>
                    <RowActions>
                      <IconBtn
                        type="button"
                        onClick={() => removeInsurance(idx)}
                        title="Remove"
                      >
                        <FiTrash2 />
                      </IconBtn>
                    </RowActions>
                  </ListRow>
                ))}
              </List>
            ) : (
              <Muted>No insurance added yet.</Muted>
            )}
          </Section>
        )}

        {isDoctorNonProfessional && (
          <Section>
            <SectionTitle>
              Signature for medical reports (recommended)
            </SectionTitle>
            <SectionDesc>
              Upload an image of your signature. You can replace it anytime.
            </SectionDesc>

            <UploadRow>
              <Preview>
                {signaturePreview ? (
                  <img src={signaturePreview} alt="Signature preview" />
                ) : (
                  <PreviewEmpty>No signature yet</PreviewEmpty>
                )}
              </Preview>

              <UploadCol>
                <FileLabel>
                  <FiUploadCloud />
                  <span>
                    {signaturePreview
                      ? "Replace signature"
                      : "Upload signature"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onPickSignature}
                  />
                </FileLabel>
              </UploadCol>
            </UploadRow>
          </Section>
        )}

        {/* Doctor Professional: professionalBusinesses */}
        {isProfessionalDoctor && (
          <Section>
            <SectionTitle>Professional businesses (required)</SectionTitle>
            <SectionDesc>
              Add at least one business to complete setup.
            </SectionDesc>

            <InlineActions>
              <SmallBtn type="button" onClick={openAddBusiness}>
                <FiPlus />
                Add business
              </SmallBtn>
            </InlineActions>

            {professionalBusinesses.length > 0 ? (
              <List>
                {professionalBusinesses.map((b, idx) => (
                  <ListRow key={b.id || `${b.name || "biz"}-${idx}`}>
                    <RowMain>
                      <RowTitle>{b.name || "Business"}</RowTitle>
                      <RowSub>
                        {b?.proofs?.find((p) => p.type === "website")?.url
                          ? b.proofs.find((p) => p.type === "website").url
                          : "no website"}
                        {b.status ? ` · ${b.status}` : ""}
                      </RowSub>
                    </RowMain>
                    <RowActions>
                      <IconBtn
                        type="button"
                        onClick={() => removeBusiness(idx)}
                        title="Remove"
                      >
                        <FiTrash2 />
                      </IconBtn>
                    </RowActions>
                  </ListRow>
                ))}
              </List>
            ) : (
              <Muted>No businesses yet. Add one to complete setup.</Muted>
            )}
          </Section>
        )}

        {/* Base fields: shown for all roles */}
        <Grid>
          <Field>
            <Label>Your legal first name</Label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              autoComplete="given-name"
            />
          </Field>

          <Field>
            <Label>Your legal last name</Label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              autoComplete="family-name"
            />
          </Field>

          <Field>
            <Label>Phone number</Label>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone number"
              autoComplete="tel"
            />
          </Field>

          <Field>
            <Label>Address</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Work / billing address"
              autoComplete="street-address"
            />
          </Field>
        </Grid>

        {/* Client: home clinic recommended */}
        {isClient && (
          <Section style={{ marginTop: 12 }}>
            <SectionTitle>Home clinic (recommended)</SectionTitle>
            <SectionDesc>
              Adding a home clinic helps ensure your pet&apos;s medical history
              is shared with your clinic when booking with partnered doctors.
            </SectionDesc>

            <Grid style={{ marginTop: 10 }}>
              <Field>
                <Label>Home clinic name</Label>
                <Input
                  value={homeClinicName}
                  onChange={(e) => setHomeClinicName(e.target.value)}
                  placeholder="Clinic name"
                />
              </Field>
              <Field>
                <Label>Home clinic address (optional)</Label>
                <Input
                  value={homeClinicAddress}
                  onChange={(e) => setHomeClinicAddress(e.target.value)}
                  placeholder="Clinic address"
                />
              </Field>
            </Grid>
          </Section>
        )}

        {error ? <ErrorBox>{error}</ErrorBox> : null}

        <FooterRow>
          <SaveBtn type="button" onClick={onSave} disabled={saving}>
            <FiSave />
            {saving ? "Saving..." : "Save Changes"}
          </SaveBtn>
        </FooterRow>
      </Card>

      {/* License modal */}
      {licenseModalOpen && (
        <ModalBackdrop onClick={() => setLicenseModalOpen(false)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editingLicenseIndex >= 0 ? "Edit license" : "Add license"}
              </ModalTitle>
              <ModalClose
                type="button"
                onClick={() => setLicenseModalOpen(false)}
                aria-label="Close"
              >
                <FiX />
              </ModalClose>
            </ModalHeader>

            <ModalBody>
              <ModalGrid>
                <Field>
                  <Label>State</Label>
                  <Input
                    value={licState}
                    onChange={(e) => setLicState(e.target.value)}
                    placeholder="California"
                  />
                </Field>
                <Field>
                  <Label>Abbreviation</Label>
                  <Input
                    value={licAbbrev}
                    onChange={(e) => setLicAbbrev(e.target.value)}
                    placeholder="CA"
                  />
                </Field>
                <Field>
                  <Label>License number (optional)</Label>
                  <Input
                    value={licNumber}
                    onChange={(e) => setLicNumber(e.target.value)}
                    placeholder="12345"
                  />
                </Field>
                <Field>
                  <Label>Expiration date (optional)</Label>
                  <Input
                    type="date"
                    value={licExpirationDate}
                    onChange={(e) => setLicExpirationDate(e.target.value)}
                  />
                </Field>
              </ModalGrid>

              <ModalFooter>
                <SecondaryBtn
                  type="button"
                  onClick={() => setLicenseModalOpen(false)}
                >
                  Cancel
                </SecondaryBtn>
                <PrimaryBtn type="button" onClick={saveLicenseFromModal}>
                  Save
                </PrimaryBtn>
              </ModalFooter>
            </ModalBody>
          </ModalCard>
        </ModalBackdrop>
      )}

      {/* Insurance modal */}
      {insModalOpen && (
        <ModalBackdrop onClick={() => setInsModalOpen(false)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Add insurance</ModalTitle>
              <ModalClose
                type="button"
                onClick={() => setInsModalOpen(false)}
                aria-label="Close"
              >
                <FiX />
              </ModalClose>
            </ModalHeader>

            <ModalBody>
              <ModalGrid>
                <Field>
                  <Label>Carrier</Label>
                  <Input
                    value={insCarrier}
                    onChange={(e) => setInsCarrier(e.target.value)}
                    placeholder="Carrier name"
                  />
                </Field>
                <Field>
                  <Label>Policy number (optional)</Label>
                  <Input
                    value={insPolicyNumber}
                    onChange={(e) => setInsPolicyNumber(e.target.value)}
                    placeholder="Policy number"
                  />
                </Field>
                <Field>
                  <Label>Expiration date (optional)</Label>
                  <Input
                    type="date"
                    value={insExp}
                    onChange={(e) => setInsExp(e.target.value)}
                  />
                </Field>
              </ModalGrid>

              <ModalFooter>
                <SecondaryBtn
                  type="button"
                  onClick={() => setInsModalOpen(false)}
                >
                  Cancel
                </SecondaryBtn>
                <PrimaryBtn type="button" onClick={saveInsuranceFromModal}>
                  Save
                </PrimaryBtn>
              </ModalFooter>
            </ModalBody>
          </ModalCard>
        </ModalBackdrop>
      )}

      {/* Business modal */}
      {bizModalOpen && (
        <ModalBackdrop onClick={() => setBizModalOpen(false)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Add business</ModalTitle>
              <ModalClose
                type="button"
                onClick={() => setBizModalOpen(false)}
                aria-label="Close"
              >
                <FiX />
              </ModalClose>
            </ModalHeader>

            <ModalBody>
              <ModalGrid>
                <Field>
                  <Label>Business name</Label>
                  <Input
                    value={bizName}
                    onChange={(e) => setBizName(e.target.value)}
                    placeholder="Business name"
                  />
                </Field>
                <Field>
                  <Label>Website (optional)</Label>
                  <Input
                    value={bizWebsite}
                    onChange={(e) => setBizWebsite(e.target.value)}
                    placeholder="https://..."
                  />
                </Field>
              </ModalGrid>

              <ModalFooter>
                <SecondaryBtn
                  type="button"
                  onClick={() => setBizModalOpen(false)}
                >
                  Cancel
                </SecondaryBtn>
                <PrimaryBtn type="button" onClick={saveBusinessFromModal}>
                  Save
                </PrimaryBtn>
              </ModalFooter>
            </ModalBody>
          </ModalCard>
        </ModalBackdrop>
      )}
    </Wrap>
  );
}

/* styles */

const Wrap = styled.div`
  max-width: 980px;
  margin: 0 auto;
  padding: 6px 2px 22px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 8px 2px 6px;
`;

const BackBtn = styled.button`
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(255, 255, 255, 0.92);
  color: #0f172a;
  border-radius: 12px;
  padding: 8px 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
  }
`;

const Header = styled.div`
  padding: 6px 2px 12px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 900;
  color: #0f172a;
`;

const SubTitle = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 18px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
  overflow: hidden;
  padding: 14px;
`;

const Section = styled.div`
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 12px;
  background: #fbfdff;
`;

const SectionTitle = styled.div`
  font-weight: 900;
  color: #0f172a;
`;

const SectionDesc = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: #475569;
  line-height: 1.45;
`;

const UploadRow = styled.div`
  margin-top: 10px;
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 12px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Preview = styled.div`
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
  height: 120px;
  display: grid;
  place-items: center;

  img {
    width: 100%;
    height: 120px;
    object-fit: cover;
  }
`;

const PreviewEmpty = styled.div`
  font-size: 12px;
  color: #64748b;
`;

const UploadCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
`;

const FileLabel = styled.label`
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: #fff;
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: fit-content;

  &:hover {
    background: #f8fafc;
  }

  input {
    display: none;
  }

  span {
    font-size: 13px;
    font-weight: 800;
    color: #0f172a;
  }
`;

const InlineActions = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const SmallBtn = styled.button`
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: #fff;
  color: #0f172a;
  border-radius: 12px;
  padding: 8px 10px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f8fafc;
  }
`;

const List = styled.div`
  margin-top: 10px;
  display: grid;
  gap: 10px;
`;

const ListRow = styled.div`
  border: 1px solid rgba(226, 232, 240, 0.9);
  background: #fff;
  border-radius: 14px;
  padding: 10px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const RowMain = styled.div`
  min-width: 0;
`;

const RowTitle = styled.div`
  font-weight: 900;
  color: #0f172a;
`;

const RowSub = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: #475569;
`;

const RowActions = styled.div`
  flex: 0 0 auto;
  display: inline-flex;
  gap: 6px;
  align-items: center;
`;

const IconBtn = styled.button`
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: #fff;
  color: #0f172a;
  border-radius: 12px;
  padding: 8px 8px;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
  }

  svg {
    font-size: 16px;
  }
`;

const Muted = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #64748b;
`;

const Grid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: grid;
  gap: 6px;
`;

const Label = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: #0f172a;
`;

const Input = styled.input`
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: rgba(37, 99, 235, 0.55);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
  }
`;

const ErrorBox = styled.div`
  margin-top: 12px;
  border: 1px solid rgba(220, 38, 38, 0.22);
  background: rgba(254, 242, 242, 0.9);
  color: #991b1b;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 13px;
  white-space: pre-wrap;
`;

const FooterRow = styled.div`
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
`;

const SaveBtn = styled.button`
  border: none;
  background: #2563eb;
  color: #fff;
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
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

/* modal */

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 80;
  background: rgba(15, 23, 42, 0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 560px;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
  overflow: hidden;
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

const ModalGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const ModalFooter = styled.div`
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const SecondaryBtn = styled.button`
  border: 1px solid rgba(148, 163, 184, 0.28);
  background: #fff;
  color: #0f172a;
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 900;

  &:hover {
    background: #f8fafc;
  }
`;

const PrimaryBtn = styled.button`
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
`;
