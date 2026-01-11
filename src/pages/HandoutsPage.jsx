// src/pages/HandoutsPage.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { auth, firestore, storage } from "../lib/firebase";
import { ref, uploadBytes } from "firebase/storage";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import {
  FiFileText,
  FiPlus,
  FiArrowLeft,
  FiPrinter,
  FiSettings,
  FiX,
} from "react-icons/fi";

const EMPTY_DIABETES_FORM = {
  // 1. Hospital info
  hospitalName: "",
  hospitalAddress: "",
  hospitalPhone: "",
  erHospitalName: "",
  erHospitalPhone: "",

  // 2. Patient info
  petName: "",
  species: "feline", // "canine" or "feline"
  sex: "FS", // "M" | "MN" | "F" | "FS"

  // 3. Recheck interval
  recheckValue: "",
  recheckUnit: "weeks", // "days" | "weeks" | "months"

  // 3.5 Feline remission notes
  includeRemissionNote: true,
  includeHopeNote: true,
  remissionNote: "",
  hopeNote: "",

  // 4. Insulin
  insulinPrescribed: "", // one of preset options or "Other"
  insulinOtherName: "",
  syringeType: "", // "U-40" | "U-100" | "pen" | "other"
  syringeOther: "",
  insulinHandling: "roll", // "roll" | "shake"
  insulinUnits: "",
  insulinFrequency: "", // "q12h" | "am" | "pm" | "q8h" | "q24h" | "other"
  insulinFrequencyOther: "",

  // 5. Feeding
  prescribedFood: "",
  foodAmount: "",
  foodAmountUnit: "cups",
  foodIntervalHours: "12",

  // Feline-only cat feeding instructions
  includeCatFeedingMealInsulinNote: true,
  catFeedingMealInsulinNote: "",
  includeCatCannedDietNote: true,
  catCannedDietNote: "",

  // Feeding instructions checklist
  feedingInclude1: true,
  feeding1Text: "",
  feedingInclude2: true,
  feeding2Text: "",
  feedingInclude3: true,
  feeding3Text: "",
  feedingInclude4: true,
  feeding4Text: "",
  feedingInclude5: true,
  feeding5Text: "",
  feedingInclude6: true,
  feeding6Text: "",
  feedingInclude7: true,
  feeding7Text: "",

  // NEW: behavior options for instruction 7
  feeding7Mode: "withhold", // "withhold" | "half_dose" | "bg_adjust"
  feeding7BgThreshold: "",
  feeding7NewUnits: "",

  // 6. Home monitoring
  homeEncouragementInclude1: true,
  homeEncouragement1Text: "",
  homeEncouragementInclude2: true,
  homeEncouragement2Text: "",
  measureFoodWaterFrequency: "twice_daily", // "twice_daily" | "once_daily" | "other"
  measureFoodWaterOther: "",
  advancedBgInclude: false,
  advancedBgEveryHours: "4", // "2" | "4" | "6" | "8" | "other"
  advancedBgEveryHoursOther: "",
  advancedBgLowThreshold: "40", // "40" | "60" | "80" | "other"
  advancedBgLowThresholdOther: "",
  advancedBgHighThreshold: "300", // "300" | "400" | "500" | "other"
  advancedBgHighThresholdOther: "",
  advancedUrineInclude: false,
  advancedUrineMode: "glucose", // "glucose" | "glucose_ketones"
  advancedUrineEveryHours: "24", // "8" | "12" | "24" | "48" | "other"
  advancedUrineEveryHoursOther: "",
  additionalInstructions: "",

  // 7. Emergency criteria
  emergencyHasSeizure: true,
  emergencyTremoring: true,
  emergencyWeak: true,
  emergencyHiding: true,
  emergencyRefusesFoodWater: true,
  emergencyDiarrhea: true,
  emergencyVomiting: true,
  emergencyBumpingIntoObjects: true,
  emergencyDifficultyWalking: true,
  emergencyMissedInsulinDoses: true,
  emergencyIncorrectDose: true,
  emergencyOther: "",
};

function getPetPronouns(sex) {
  if (sex === "M" || sex === "MN") {
    return { subj: "he", obj: "him", possAdj: "his" };
  }
  if (sex === "F" || sex === "FS") {
    return { subj: "she", obj: "her", possAdj: "her" };
  }
  return { subj: "they", obj: "them", possAdj: "their" };
}

function unitLabel(unit) {
  return unit === "cans" ? "can(s)" : "cup(s)";
}

function buildFeedingLine1(form) {
  const p = getPetPronouns(form.sex);
  const foodName = (form.prescribedFood || "").trim() || "________";
  const amount = (form.foodAmount || "").toString().trim() || "___";
  const unit = unitLabel(form.foodAmountUnit);
  const interval = (form.foodIntervalHours || "").toString().trim() || "__";
  return `Feed ${p.obj} ${foodName} ${amount} ${unit} every ${interval} hours.`;
}

function buildFeedingLine2(form) {
  const p = getPetPronouns(form.sex);
  const pet = (form.petName || "").trim() || "your pet";
  return `Feed ${pet} BEFORE you give ${p.obj} any insulin.`;
}

function buildFeedingLine3(form) {
  const p = getPetPronouns(form.sex);
  return `Do your best to feed ${p.obj} at the same time every day.`;
}

function buildFeedingLine4() {
  return "Do not give additional treats, table scraps, or home-cooked meals unless you have discussed this diet with our team.";
}

function buildFeedingLine5(form) {
  const pet = (form.petName || "").trim() || "your pet";
  return `While ${pet} is currently overweight, we are hopeful that this nutrition plan will help ${pet} slowly lose weight.`;
}

function buildFeedingLine6(form) {
  const p = getPetPronouns(form.sex);
  return `If ${p.possAdj} appetite changes (increases or decreases), please contact our veterinary team. This may be a sign that ${p.possAdj} diabetes is uncontrolled or that another condition is developing.`;
}

function buildFeedingLine7(form) {
  const p = getPetPronouns(form.sex);
  const baseClause = `If ${p.subj} vomits soon after eating or refuses to eat one meal`;

  const mode = form.feeding7Mode || "withhold";

  if (mode === "withhold") {
    // 1. withhold insulin and call us
    return `${baseClause} withhold insulin and call us.`;
  }

  if (mode === "half_dose") {
    // 2. administer half the amount of insulin and resume regimen
    return (
      `${baseClause} administer half the amount of insulin ` +
      `and resume your normal insulin regimen if ${p.subj} eats at the next meal.`
    );
  }

  // 3. BG-based plan
  const bg =
    (form.feeding7BgThreshold || "").toString().trim() ||
    "[BLOOD GLUCOSE LEVEL]";
  const newUnits =
    (form.feeding7NewUnits || "").toString().trim() || "[NUMBER OF NEW UNITS]";

  return (
    `${baseClause} take a blood glucose sample. ` +
    `If it is greater than ${bg}, administer ${newUnits} units and call us.`
  );
}

function buildCatMealInsulinNote(form) {
  const p = getPetPronouns(form.sex);
  return `It’s best for cats to eat twice a day and receive insulin after each meal. However, if meal feeding isn’t feasible for you, allow ${p.obj} to nibble on food throughout the day.`;
}

function buildCatCannedDietNote(form) {
  const p = getPetPronouns(form.sex);
  return `Ideally, ${p.subj} should eat canned food since diabetic cats are more successfully treated with high-protein, low-carbohydrate canned diets instead of dry food.`;
}

function buildHomeEncouragement1(form) {
  const name = (form.petName || "").trim() || "____";
  const p = getPetPronouns(form.sex);
  return `Initially, home monitoring can be intimidating, but over time, you and ${name} will fall into a sustainable routine. Please reach out if ever you feel overwhelmed by ${p.possAdj} diabetes management.`;
}

function buildHomeEncouragement2(form) {
  const name = (form.petName || "").trim() || "____";
  return `You have been doing a great job monitoring ${name} at home!`;
}

function buildMeasureIntakeText(form) {
  const name = (form.petName || "").trim() || "your pet";
  if (form.measureFoodWaterFrequency === "twice_daily") {
    return `Please measure how much ${name} eats and drinks twice daily.`;
  }
  if (form.measureFoodWaterFrequency === "once_daily") {
    return `Please measure how much ${name} eats and drinks once daily.`;
  }
  if (form.measureFoodWaterFrequency === "other") {
    const other = (form.measureFoodWaterOther || "").trim();
    if (other) {
      return `Please measure how much ${name} eats and drinks ${other}.`;
    }
  }
  return "";
}

function resolveChoice(main, other, fallback) {
  if (main === "other") {
    const trimmed = (other || "").trim();
    return trimmed || fallback;
  }
  const trimmed = (main || "").trim();
  return trimmed || fallback;
}
// UPDATED: main bullet + sub bullets for BG
function buildAdvancedBgInstruction(form) {
  const name = (form.petName || "").trim() || "____";
  const p = getPetPronouns(form.sex);
  const hours = resolveChoice(
    form.advancedBgEveryHours,
    form.advancedBgEveryHoursOther,
    "4"
  );
  const low = resolveChoice(
    form.advancedBgLowThreshold,
    form.advancedBgLowThresholdOther,
    "40"
  );
  const high = resolveChoice(
    form.advancedBgHighThreshold,
    form.advancedBgHighThresholdOther,
    "300"
  );

  const mainLine = `Please test ${name}'s blood glucose levels every ${hours} hours. Please call us or a local emergency hospital if ${p.possAdj} blood glucose level is less than ${low} or greater than ${high}.`;

  const samplingLine = `Pick a sampling site that ${p.subj} tolerates best, but be sure to vary them so each site does not get sore.`;
  const rewardLine = `Be sure to reward ${name} with lots of love and attention after you obtain a blood sample.`;
  const videoLine = `If you have not already watched the videos on the AAHA Diabetes Management Guidelines website (www.aaha.org/diabetes), please do as they are designed for pet owners like you!`;

  return (
    <div>
      <div>{mainLine}</div>
      <ul>
        <li>{samplingLine}</li>
        <li>{rewardLine}</li>
        <li>{videoLine}</li>
      </ul>
    </div>
  );
}

// UPDATED: main bullet + sub bullets for urine
function buildAdvancedUrineInstruction(form) {
  const name = (form.petName || "").trim() || "____";
  const p = getPetPronouns(form.sex);
  const hours = resolveChoice(
    form.advancedUrineEveryHours,
    form.advancedUrineEveryHoursOther,
    "24"
  );

  if (form.advancedUrineMode === "glucose_ketones") {
    const mainLine = `Please test ${name}'s urine for glucose and ketones every ${hours} hours.`;

    const lowLine = `If ${p.possAdj} urine is negative for glucose for more than a few days, please contact us as this may mean the blood glucose levels are too low.`;
    const ketoneLine = `If ${p.possAdj} urine is positive for ketones, please contact us right away, as this means diabetic ketoacidosis may occur. This can be a very serious complication of diabetes.`;

    return (
      <div>
        <div>{mainLine}</div>
        <ul>
          <li>{lowLine}</li>
          <li>{ketoneLine}</li>
        </ul>
      </div>
    );
  }

  const mainLine = `Please test ${name}'s urine for glucose every ${hours} hours.`;
  const lowLine = `If ${p.possAdj} urine is negative for glucose for more than a few days, please contact us as this may mean the blood glucose levels are too low.`;

  return (
    <div>
      <div>{mainLine}</div>
      <ul>
        <li>{lowLine}</li>
      </ul>
    </div>
  );
}

const DEFAULT_FELINE_REMISSION_NOTE =
  "Remission can occur in diabetic cats. This means that they no longer require insulin therapy. Your cat has the best chance of remission if you achieve precise blood glucose control within six months of diagnosis, carefully monitor your cat at home, stop any medications that could interfere with the insulin, and use an appropriate insulin in combination with a low-carbohydrate diet.";

function buildDefaultHopeNote(petName, sex) {
  const name = (petName || "").trim() || "____";
  const p = getPetPronouns(sex);
  return `There is still hope that ${name} will experience remission. Continue to carefully monitor ${p.obj} at home, give insulin as directed, and feed a high-protein, low-carbohydrate diet.`;
}

function buildFormFromDoc(data) {
  const fd = (data && data.formData) || {};
  const merged = {
    ...EMPTY_DIABETES_FORM,
    ...fd,
  };

  // Prefill feline remission text if enabled and still empty
  const isFeline = merged.species === "feline";

  if (isFeline && merged.includeRemissionNote && !merged.remissionNote.trim()) {
    merged.remissionNote = DEFAULT_FELINE_REMISSION_NOTE;
  }

  if (isFeline && merged.includeHopeNote && !merged.hopeNote.trim()) {
    merged.hopeNote = buildDefaultHopeNote(merged.petName, merged.sex);
  }

  // Feline-only defaults
  if (
    isFeline &&
    merged.includeCatFeedingMealInsulinNote &&
    !merged.catFeedingMealInsulinNote.trim()
  ) {
    merged.catFeedingMealInsulinNote = buildCatMealInsulinNote(merged);
  }

  if (
    isFeline &&
    merged.includeCatCannedDietNote &&
    !merged.catCannedDietNote.trim()
  ) {
    merged.catCannedDietNote = buildCatCannedDietNote(merged);
  }

  // Feeding checklist defaults (gender-aware and depends on top inputs)
  // if (merged.feedingInclude1 && !merged.feeding1Text.trim()) {
  //   merged.feeding1Text = buildFeedingLine1(merged);
  // }
  if (merged.feedingInclude2 && !merged.feeding2Text.trim()) {
    merged.feeding2Text = buildFeedingLine2(merged);
  }
  if (merged.feedingInclude3 && !merged.feeding3Text.trim()) {
    merged.feeding3Text = buildFeedingLine3(merged);
  }
  if (merged.feedingInclude4 && !merged.feeding4Text.trim()) {
    merged.feeding4Text = buildFeedingLine4();
  }
  if (merged.feedingInclude5 && !merged.feeding5Text.trim()) {
    merged.feeding5Text = buildFeedingLine5(merged);
  }
  if (merged.feedingInclude6 && !merged.feeding6Text.trim()) {
    merged.feeding6Text = buildFeedingLine6(merged);
  }
  if (merged.feedingInclude7 && !merged.feeding7Text.trim()) {
    merged.feeding7Text = buildFeedingLine7(merged);
  }

  // Home monitoring encouragement defaults
  if (
    merged.homeEncouragementInclude1 &&
    !(merged.homeEncouragement1Text || "").trim()
  ) {
    merged.homeEncouragement1Text = buildHomeEncouragement1(merged);
  }

  if (
    merged.homeEncouragementInclude2 &&
    !(merged.homeEncouragement2Text || "").trim()
  ) {
    merged.homeEncouragement2Text = buildHomeEncouragement2(merged);
  }

  // Optional: migrate old single encouragement field if it exists
  if (
    merged.homeMonitoringEncouragement &&
    !(merged.homeEncouragement1Text || "").trim() &&
    !(merged.homeEncouragement2Text || "").trim()
  ) {
    merged.homeEncouragementInclude1 = true;
    merged.homeEncouragement1Text = merged.homeMonitoringEncouragement;
  }

  return merged;
}

function validateDiabetesForm(form) {
  const missing = [];
  const missingMap = {};
  const warnings = [];

  const markMissing = (fieldKey, label) => {
    missing.push(label);
    missingMap[fieldKey] = true;
  };

  if (!form.hospitalName.trim()) {
    markMissing("hospitalName", "Hospital name");
  }
  if (!form.hospitalPhone.trim()) {
    markMissing("hospitalPhone", "Hospital phone number");
  }

  if (!form.petName.trim()) {
    markMissing("petName", "Pet name");
  }
  if (!form.species) {
    markMissing("species", "Species");
  }
  if (!form.sex) {
    markMissing("sex", "Gender");
  }

  if (!form.recheckValue.toString().trim()) {
    markMissing("recheckValue", "Recheck interval value");
  }
  if (!form.recheckUnit) {
    markMissing("recheckUnit", "Recheck interval unit");
  }

  if (!form.insulinPrescribed.trim() && !form.insulinOtherName.trim()) {
    markMissing("insulinPrescribed", "Prescribed insulin");
  }

  if (!form.insulinUnits.toString().trim()) {
    markMissing("insulinUnits", "Insulin units per dose");
  }

  if (!form.insulinFrequency && !form.insulinFrequencyOther.trim()) {
    markMissing("insulinFrequency", "Insulin frequency");
  }

  // Require syringe type / pen name
  if (!form.syringeType) {
    markMissing("syringeType", "Type of syringe or pen");
  } else if (
    form.syringeType === "other" &&
    !form.syringeOther.toString().trim()
  ) {
    markMissing("syringeOther", "Insulin pen name");
  }

  if (!form.prescribedFood.trim()) {
    markMissing("prescribedFood", "Prescribed food");
  }
  if (!form.foodAmount.toString().trim()) {
    markMissing("foodAmount", "Food amount");
  }

  return {
    missing,
    missingMap,
    warnings,
    isValid: missing.length === 0,
  };
}

function formToFirestore(form) {
  // For now we just store the flat structure as formData
  return { ...form };
}

function deriveHandoutTitle(form) {
  const pet = form.petName.trim();
  if (pet) {
    return `${pet} - diabetes discharge`;
  }
  return "Diabetes discharge handout";
}

const EMPTY_HOSPITAL_DEFAULTS = {
  hospitalName: "",
  hospitalAddress: "",
  hospitalPhone: "",
  erHospitalName: "",
  erHospitalPhone: "",
  attendingVetName: "", // NEW
};

function pickHospitalDefaultsFromSettingsDoc(data) {
  const d = data?.handoutDefaults?.diabetes_discharge || {};
  return {
    hospitalName: d.hospitalName || "",
    hospitalAddress: d.hospitalAddress || "",
    hospitalPhone: d.hospitalPhone || "",
    erHospitalName: d.erHospitalName || "",
    erHospitalPhone: d.erHospitalPhone || "",
    attendingVetName: d.attendingVetName || "",
  };
}

function hospitalDefaultsToFormData(hospitalDefaults) {
  return {
    hospitalName: hospitalDefaults.hospitalName || "",
    hospitalAddress: hospitalDefaults.hospitalAddress || "",
    hospitalPhone: hospitalDefaults.hospitalPhone || "",
    erHospitalName: hospitalDefaults.erHospitalName || "",
    erHospitalPhone: hospitalDefaults.erHospitalPhone || "",
    attendingVetName: hospitalDefaults.attendingVetName || "",
  };
}

function HandoutsList({ currentUser }) {
  const [handouts, setHandouts] = useState([]);
  const navigate = useNavigate();

  const [defaultsOpen, setDefaultsOpen] = useState(false);
  const [defaultsLoading, setDefaultsLoading] = useState(false);
  const [defaultsSaving, setDefaultsSaving] = useState(false);
  const [defaultsError, setDefaultsError] = useState(null);
  const [hospitalDefaults, setHospitalDefaults] = useState(
    EMPTY_HOSPITAL_DEFAULTS
  );

  useEffect(() => {
    if (!currentUser) {
      setHandouts([]);
      return;
    }

    const q = query(
      collection(firestore, "vetHandouts"),
      where("vetUid", "==", currentUser.uid),
      orderBy("updatedAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = [];
        snap.forEach((d) => rows.push({ id: d.id, ...d.data() }));
        setHandouts(rows);
      },
      (err) => {
        console.error("Error loading handouts:", err);
      }
    );

    return () => unsub();
  }, [currentUser]);

  const loadDefaults = async () => {
    if (!currentUser) return;
    setDefaultsError(null);
    setDefaultsLoading(true);

    try {
      const defaultsRef = doc(firestore, "vetSettings", currentUser.uid);
      const snap = await getDoc(defaultsRef);

      if (snap.exists()) {
        setHospitalDefaults(pickHospitalDefaultsFromSettingsDoc(snap.data()));
      } else {
        setHospitalDefaults(EMPTY_HOSPITAL_DEFAULTS);
      }
    } catch (err) {
      console.error("Failed to load defaults:", err);
      setDefaultsError(err.message || String(err));
    } finally {
      setDefaultsLoading(false);
    }
  };

  const openDefaultsModal = async () => {
    setDefaultsOpen(true);
    await loadDefaults();
  };

  const closeDefaultsModal = () => {
    setDefaultsOpen(false);
    setDefaultsError(null);
  };

  const updateDefaultField = (field, value) => {
    setHospitalDefaults((prev) => ({ ...prev, [field]: value }));
  };

  const saveDefaults = async () => {
    if (!currentUser) return;

    setDefaultsSaving(true);
    setDefaultsError(null);

    try {
      const defaultsRef = doc(firestore, "vetSettings", currentUser.uid);

      await setDoc(
        defaultsRef,
        {
          handoutDefaults: {
            diabetes_discharge: {
              ...hospitalDefaults,
              updatedAt: serverTimestamp(),
            },
          },
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setDefaultsOpen(false);
    } catch (err) {
      console.error("Failed to save defaults:", err);
      setDefaultsError(err.message || String(err));
    } finally {
      setDefaultsSaving(false);
    }
  };

  const handleNewDiabetesHandout = async () => {
    if (!currentUser) return;

    try {
      const defaultsRef = doc(firestore, "vetSettings", currentUser.uid);
      const defaultsSnap = await getDoc(defaultsRef);

      const defaults = defaultsSnap.exists()
        ? pickHospitalDefaultsFromSettingsDoc(defaultsSnap.data())
        : EMPTY_HOSPITAL_DEFAULTS;

      const refDoc = await addDoc(collection(firestore, "vetHandouts"), {
        vetUid: currentUser.uid,
        orgId: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),

        type: "diabetes_discharge",
        templateVersion: 1,
        title: "New diabetes discharge handout",

        status: "draft",
        errorMessage: null,

        links: {
          caseId: null,
          chatId: null,
          personalChatId: null,
          createdFrom: "standalone",
        },

        patient: {
          petName: "",
          species: null,
          sex: null,
        },

        // Prefill Section 1 using defaults
        formData: hospitalDefaultsToFormData(defaults),

        validation: {
          state: "unknown",
          missing: [],
          warnings: [],
          lastValidatedAt: null,
        },
        autofill: {
          enabled: true,
          sources: [],
          fields: {},
          updatedAt: null,
        },
        latestExport: {
          exportId: null,
          pdfUrl: null,
          createdAt: null,
        },
      });

      navigate(`/ai/handouts/${refDoc.id}`);
    } catch (err) {
      console.error("Failed to create handout:", err);
      alert("Could not create handout. Please try again.");
    }
  };

  return (
    <HandoutsPageShell>
      <HandoutsHeaderRow>
        <HandoutsTitle>Handouts</HandoutsTitle>

        <HeaderActions>
          <HandoutsNewButton
            type="button"
            onClick={openDefaultsModal}
            disabled={!currentUser}
            title="Set defaults for diabetes discharge handouts"
          >
            <FiSettings size={14} />
            <span>Defaults</span>
          </HandoutsNewButton>

          <HandoutsNewButton
            type="button"
            onClick={handleNewDiabetesHandout}
            disabled={!currentUser}
          >
            <FiPlus size={14} />
            <span>New diabetes handout</span>
          </HandoutsNewButton>
        </HeaderActions>
      </HandoutsHeaderRow>

      <HandoutsSubtitle>
        Create and manage printable client handouts here. For now this focuses
        on diabetic discharge instructions.
      </HandoutsSubtitle>

      <HandoutsListContainer>
        {currentUser && handouts.length === 0 && (
          <EmptyStateCard>
            <EmptyStateTitle>No handouts yet</EmptyStateTitle>
            <EmptyStateText>
              Start by creating a diabetes discharge handout.
            </EmptyStateText>
            <HandoutsNewButton type="button" onClick={handleNewDiabetesHandout}>
              <FiPlus size={14} />
              <span>New diabetes handout</span>
            </HandoutsNewButton>
          </EmptyStateCard>
        )}

        {!currentUser && (
          <EmptyStateCard>
            <EmptyStateTitle>Sign in to manage handouts</EmptyStateTitle>
            <EmptyStateText>
              Once signed in, you can create and save handouts for your cases.
            </EmptyStateText>
          </EmptyStateCard>
        )}

        {currentUser &&
          handouts.length > 0 &&
          handouts.map((h) => (
            <HandoutRow
              key={h.id}
              type="button"
              onClick={() => navigate(`/ai/handouts/${h.id}`)}
            >
              <FiFileText size={16} />
              <HandoutRowTexts>
                <HandoutRowTitle>
                  {h.title || "Untitled handout"}
                </HandoutRowTitle>
                <HandoutRowMeta>
                  {h.type === "diabetes_discharge"
                    ? "Diabetes discharge"
                    : h.type || "Unknown type"}
                  {h.updatedAt && h.updatedAt.toDate && (
                    <>
                      {" "}
                      •{" "}
                      {h.updatedAt.toDate().toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </>
                  )}
                </HandoutRowMeta>
              </HandoutRowTexts>
            </HandoutRow>
          ))}
      </HandoutsListContainer>

      {defaultsOpen && (
        <ModalOverlay
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeDefaultsModal();
          }}
        >
          <ModalCard>
            <ModalHeader>
              <ModalTitle>Defaults for diabetes discharge handouts</ModalTitle>
              <IconCloseButton type="button" onClick={closeDefaultsModal}>
                <FiX size={16} />
              </IconCloseButton>
            </ModalHeader>

            <ModalSubtext>
              These values will be used to prefill Section 1 for new diabetes
              discharge handouts.
            </ModalSubtext>

            {defaultsLoading ? (
              <ModalSubtext>Loading defaults...</ModalSubtext>
            ) : (
              <>
                <SectionCard>
                  <SectionTitle>Hospital information</SectionTitle>

                  <FieldRow>
                    <FieldLabel>Hospital name</FieldLabel>
                    <FieldInput
                      value={hospitalDefaults.hospitalName}
                      onChange={(e) =>
                        updateField("hospitalName", e.target.value)
                      }
                      placeholder="Hospital name"
                    />
                  </FieldRow>

                  <FieldRow>
                    <FieldLabel>Hospital address</FieldLabel>
                    <FieldInput
                      value={hospitalDefaults.hospitalAddress}
                      onChange={(e) =>
                        updateDefaultField("hospitalAddress", e.target.value)
                      }
                      placeholder="Street, city, state, ZIP"
                    />
                  </FieldRow>

                  <FieldRow>
                    <FieldLabel>Hospital phone number</FieldLabel>
                    <FieldInput
                      value={hospitalDefaults.hospitalPhone}
                      onChange={(e) =>
                        updateDefaultField("hospitalPhone", e.target.value)
                      }
                      placeholder="000-000-0000"
                    />
                  </FieldRow>

                  {/* NEW: default veterinarian name */}
                  <FieldRow>
                    <FieldLabel>Default veterinarian name</FieldLabel>
                    <FieldInput
                      value={hospitalDefaults.attendingVetName || ""}
                      onChange={(e) =>
                        updateDefaultField("attendingVetName", e.target.value)
                      }
                      placeholder="For example: Smith"
                    />
                  </FieldRow>

                  <FieldRow>
                    <FieldLabel>Emergency hospital name</FieldLabel>
                    <FieldInput
                      value={hospitalDefaults.erHospitalName}
                      onChange={(e) =>
                        updateDefaultField("erHospitalName", e.target.value)
                      }
                      placeholder="After-hours or ER hospital"
                    />
                  </FieldRow>

                  <FieldRow style={{ marginBottom: 0 }}>
                    <FieldLabel>Emergency hospital phone</FieldLabel>
                    <FieldInput
                      value={hospitalDefaults.erHospitalPhone}
                      onChange={(e) =>
                        updateDefaultField("erHospitalPhone", e.target.value)
                      }
                      placeholder="000-000-0000"
                    />
                  </FieldRow>
                </SectionCard>

                {defaultsError && (
                  <ModalErrorText>Save failed: {defaultsError}</ModalErrorText>
                )}

                <ModalActions>
                  <TopBarButton type="button" onClick={closeDefaultsModal}>
                    Cancel
                  </TopBarButton>
                  <TopBarButton
                    type="button"
                    onClick={saveDefaults}
                    disabled={defaultsSaving}
                  >
                    {defaultsSaving ? "Saving..." : "Save defaults"}
                  </TopBarButton>
                </ModalActions>
              </>
            )}
          </ModalCard>
        </ModalOverlay>
      )}
    </HandoutsPageShell>
  );
}

function applySexDependentDefaults(prev, next) {
  // If neither sex nor pet name changed, do nothing
  if (prev.sex === next.sex && prev.petName === next.petName) return next;

  const updated = { ...next };

  const syncLine = (field, builder) => {
    const prevCurrent = (prev[field] || "").trim();
    const prevTemplate = builder(prev).trim();

    // Only auto-update if the old value looked like the default
    if (!prevCurrent || prevCurrent === prevTemplate) {
      updated[field] = builder(updated);
    }
  };

  // Feeding lines that depend on name or pronouns
  if (updated.feedingInclude1) syncLine("feeding1Text", buildFeedingLine1);
  if (updated.feedingInclude2) syncLine("feeding2Text", buildFeedingLine2);
  if (updated.feedingInclude3) syncLine("feeding3Text", buildFeedingLine3);
  if (updated.feedingInclude5) syncLine("feeding5Text", buildFeedingLine5);
  if (updated.feedingInclude6) syncLine("feeding6Text", buildFeedingLine6);
  if (updated.feedingInclude7) syncLine("feeding7Text", buildFeedingLine7);

  // Feline specific notes (meal + canned diet)
  const prevCatMeal = buildCatMealInsulinNote(prev);
  if (
    (!prev.catFeedingMealInsulinNote ||
      prev.catFeedingMealInsulinNote.trim() === prevCatMeal.trim()) &&
    updated.includeCatFeedingMealInsulinNote
  ) {
    updated.catFeedingMealInsulinNote = buildCatMealInsulinNote(updated);
  }

  const prevCatCanned = buildCatCannedDietNote(prev);
  if (
    (!prev.catCannedDietNote ||
      prev.catCannedDietNote.trim() === prevCatCanned.trim()) &&
    updated.includeCatCannedDietNote
  ) {
    updated.catCannedDietNote = buildCatCannedDietNote(updated);
  }

  // Home monitoring encouragement 1
  const prevHome1 = buildHomeEncouragement1(prev);
  if (
    (!prev.homeEncouragement1Text ||
      prev.homeEncouragement1Text.trim() === prevHome1.trim()) &&
    updated.homeEncouragementInclude1
  ) {
    updated.homeEncouragement1Text = buildHomeEncouragement1(updated);
  }

  // Home monitoring encouragement 2 (also uses pet name)
  const prevHome2 = buildHomeEncouragement2(prev);
  if (
    (!prev.homeEncouragement2Text ||
      prev.homeEncouragement2Text.trim() === prevHome2.trim()) &&
    updated.homeEncouragementInclude2
  ) {
    updated.homeEncouragement2Text = buildHomeEncouragement2(updated);
  }

  // Hope note (feline only) - only if it still looks like the default
  const prevHope = buildDefaultHopeNote(prev.petName, prev.sex);
  if (
    (!prev.hopeNote || prev.hopeNote.trim() === prevHope.trim()) &&
    updated.includeHopeNote &&
    updated.species === "feline"
  ) {
    updated.hopeNote = buildDefaultHopeNote(updated.petName, updated.sex);
  }

  return updated;
}

function DiabetesHandoutEditor({ currentUser }) {
  const { handoutId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [labStatus, setLabStatus] = useState("idle");
  // "idle" | "uploading" | "processing" | "error"
  const [labError, setLabError] = useState(null);

  const [suggestedForm, setSuggestedForm] = useState(null);

  const [form, setForm] = useState(EMPTY_DIABETES_FORM);
  const [validation, setValidation] = useState({
    missing: [],
    missingMap: {},
    warnings: [],
    isValid: false,
  });

  const isFieldMissing = (fieldKey) =>
    !!(validation && validation.missingMap && validation.missingMap[fieldKey]);

  const isAiSuggested = (fieldKey) => {
    if (!suggestedForm) return false;

    const suggestedValue = suggestedForm[fieldKey];

    // Only treat as AI suggestion if the model actually provided a value
    if (
      suggestedValue === null ||
      typeof suggestedValue === "undefined" ||
      suggestedValue === ""
    ) {
      return false;
    }

    const currentValue = form[fieldKey];

    // Loose equality handles string vs number cases from JSON
    return currentValue == suggestedValue;
  };

  useEffect(() => {
    if (!handoutId) return;
    const ref = doc(firestore, "vetHandouts", handoutId);

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        const data = snap.data();
        const nextForm = buildFormFromDoc(data);
        setForm(nextForm);

        const v = validateDiabetesForm(nextForm);
        setValidation(v);

        // NEW: capture suggestions and autofill status
        setSuggestedForm(data.suggestedFormData || null);
        // you can also read data.autoFillLab if you want to show backend status

        setNotFound(false);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading handout:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [handoutId]);

  function normalizeInsulinFields(form) {
    let insulinPrescribed = (form.insulinPrescribed || "").trim();
    let insulinOtherName = (form.insulinOtherName || "").trim();

    const raw = (insulinPrescribed || insulinOtherName || "").toLowerCase();

    let mapped = "";

    if (raw.includes("vetsulin")) {
      mapped = "Vetsulin";
    } else if (raw.includes("prozinc") || raw.includes("pzi")) {
      mapped = "PZI (Prozinc)";
    } else if (
      raw.includes("nph") ||
      raw.includes("humulin n") ||
      raw.includes("novolin n")
    ) {
      mapped = "NPH";
    } else if (raw.includes("glargine") || raw.includes("lantus")) {
      mapped = "Glargine (Lantus)";
    } else if (raw.includes("detemir") || raw.includes("levemir")) {
      mapped = "Detemir (Levemir)";
    }

    let next = { ...form };

    if (mapped) {
      // Map raw text to a canonical insulin name
      next.insulinPrescribed = mapped;
      next.insulinOtherName = "";
    } else {
      const knownOptions = new Set([
        "",
        "Vetsulin",
        "PZI (Prozinc)",
        "NPH",
        "Glargine (Lantus)",
        "Detemir (Levemir)",
        "Other",
      ]);

      if (insulinPrescribed && !knownOptions.has(insulinPrescribed)) {
        // Unknown typed name in "prescribed", treat as "Other"
        next.insulinPrescribed = "Other";
        next.insulinOtherName = insulinPrescribed;
      } else if (!insulinPrescribed && insulinOtherName) {
        // Only "other" name present
        next.insulinPrescribed = "Other";
        next.insulinOtherName = insulinOtherName;
      }
      // else keep whatever was there
    }

    // Always set default handling based on the final insulin choice
    if (next.insulinPrescribed === "Vetsulin") {
      next.insulinHandling = "shake";
    } else if (
      next.insulinPrescribed === "PZI (Prozinc)" ||
      next.insulinPrescribed === "NPH" ||
      next.insulinPrescribed === "Glargine (Lantus)" ||
      next.insulinPrescribed === "Detemir (Levemir)"
    ) {
      next.insulinHandling = "roll";
    }
    // For "Other" or empty, leave whatever handling is there,
    // so the vet must explicitly choose.

    return next;
  }

  const handleInsulinPrescribedChange = (value) => {
    setForm((prev) => {
      const next = normalizeInsulinFields({
        ...prev,
        insulinPrescribed: value,
      });
      const v = validateDiabetesForm(next);
      setValidation(v);
      return next;
    });
  };

  const handleApplyAllSuggestions = () => {
    if (!suggestedForm) return;

    const blockedKeys = new Set([
      "remissionNote",
      "hopeNote",
      "includeRemissionNote",
      "includeHopeNote",
    ]);

    setForm((prev) => {
      const cleaned = {};

      Object.keys(suggestedForm).forEach((key) => {
        if (blockedKeys.has(key)) return;

        const value = suggestedForm[key];
        if (value !== null && value !== undefined) {
          cleaned[key] = value;
        }
      });

      // Look at the current instruction 1 text before merging
      const currentInstr1 = (prev.feeding1Text || "").trim();
      const prevTemplate = buildFeedingLine1(prev).trim();
      const instr1LooksDefault =
        !currentInstr1 || currentInstr1 === prevTemplate;

      // If lab suggestions are changing diet fields AND instruction 1
      // still matches the auto template, clear feeding1Text so it can
      // resync to the new template.
      if (
        instr1LooksDefault &&
        ("prescribedFood" in cleaned ||
          "foodAmount" in cleaned ||
          "foodAmountUnit" in cleaned ||
          "foodIntervalHours" in cleaned)
      ) {
        cleaned.feeding1Text = "";
      }

      const merged = { ...prev, ...cleaned };

      // Normalize insulin fields
      const withInsulin = normalizeInsulinFields(merged);

      // NEW: adjust gendered default text if sex changed
      const next = applySexDependentDefaults(prev, withInsulin);

      const v = validateDiabetesForm(next);
      setValidation(v);
      return next;
    });
  };

  const handleLabFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser || !handoutId) return;

    setLabError(null);
    setLabStatus("uploading");

    const storagePath = `handoutLabs/${
      currentUser.uid
    }/${handoutId}/${Date.now()}_${file.name}`;

    try {
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);

      const handoutRef = doc(firestore, "vetHandouts", handoutId);

      await updateDoc(handoutRef, {
        "source.labStoragePath": storagePath,
        autoFillLab: {
          status: "queued",
          lastRunAt: serverTimestamp(),
          errorMessage: null,
          storagePath,
        },
        updatedAt: serverTimestamp(),
      });

      setLabStatus("processing");

      const resp = await fetch(
        "https://us-central1-vetcationapp.cloudfunctions.net/autoFillDiabetesHandout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            handoutId,
            storagePath,
          }),
        }
      );

      const json = await resp.json();

      if (!resp.ok || !json.ok) {
        throw new Error(json.error || "Failed to process lab PDF");
      }

      // The suggestions will arrive through onSnapshot
      setLabStatus("idle");
    } catch (err) {
      console.error("Failed to upload or process lab:", err);
      setLabError(err.message || String(err));
      setLabStatus("error");
    } finally {
      // allow reselecting the same file later
      event.target.value = "";
    }
  };

  // const updateField = (field, value) => {
  //   setForm((prev) => {
  //     let next = { ...prev, [field]: value };

  //     // Special handling when sex / gender changes:
  //     if (field === "sex") {
  //       // 1) Feeding line 1
  //       const prevFeed1 = buildFeedingLine1(prev);
  //       if (
  //         !prev.feeding1Text ||
  //         prev.feeding1Text.trim() === prevFeed1.trim()
  //       ) {
  //         next.feeding1Text = buildFeedingLine1(next);
  //       }

  //       // 2) Feeding line 2
  //       const prevFeed2 = buildFeedingLine2(prev);
  //       if (
  //         !prev.feeding2Text ||
  //         prev.feeding2Text.trim() === prevFeed2.trim()
  //       ) {
  //         next.feeding2Text = buildFeedingLine2(next);
  //       }

  //       // 3) Feeding line 3
  //       const prevFeed3 = buildFeedingLine3(prev);
  //       if (
  //         !prev.feeding3Text ||
  //         prev.feeding3Text.trim() === prevFeed3.trim()
  //       ) {
  //         next.feeding3Text = buildFeedingLine3(next);
  //       }

  //       // 4) Feeding line 5
  //       const prevFeed5 = buildFeedingLine5(prev);
  //       if (
  //         !prev.feeding5Text ||
  //         prev.feeding5Text.trim() === prevFeed5.trim()
  //       ) {
  //         next.feeding5Text = buildFeedingLine5(next);
  //       }

  //       // 5) Feeding line 6
  //       const prevFeed6 = buildFeedingLine6(prev);
  //       if (
  //         !prev.feeding6Text ||
  //         prev.feeding6Text.trim() === prevFeed6.trim()
  //       ) {
  //         next.feeding6Text = buildFeedingLine6(next);
  //       }

  //       // 6) Feeding line 7 (vomits/refuses meal)
  //       const prevFeed7 = buildFeedingLine7(prev);
  //       if (
  //         !prev.feeding7Text ||
  //         prev.feeding7Text.trim() === prevFeed7.trim()
  //       ) {
  //         next.feeding7Text = buildFeedingLine7(next);
  //       }

  //       // 7) Feline-specific feeding notes (if they exist and look default)
  //       if (prev.species === "feline" || next.species === "feline") {
  //         const prevCatMeal = buildCatMealInsulinNote(prev);
  //         if (
  //           (!prev.catFeedingMealInsulinNote ||
  //             prev.catFeedingMealInsulinNote.trim() === prevCatMeal.trim()) &&
  //           next.includeCatFeedingMealInsulinNote
  //         ) {
  //           next.catFeedingMealInsulinNote = buildCatMealInsulinNote(next);
  //         }

  //         const prevCatCanned = buildCatCannedDietNote(prev);
  //         if (
  //           (!prev.catCannedDietNote ||
  //             prev.catCannedDietNote.trim() === prevCatCanned.trim()) &&
  //           next.includeCatCannedDietNote
  //         ) {
  //           next.catCannedDietNote = buildCatCannedDietNote(next);
  //         }
  //       }

  //       // 8) Home monitoring encouragement 1
  //       const prevHome1 = buildHomeEncouragement1(prev);
  //       if (
  //         (!prev.homeEncouragement1Text ||
  //           prev.homeEncouragement1Text.trim() === prevHome1.trim()) &&
  //         next.homeEncouragementInclude1
  //       ) {
  //         next.homeEncouragement1Text = buildHomeEncouragement1(next);
  //       }

  //       // 9) Hope note (for felines, default template only)
  //       const prevHope = buildDefaultHopeNote(prev.petName, prev.sex);
  //       if (
  //         (!prev.hopeNote || prev.hopeNote.trim() === prevHope.trim()) &&
  //         next.includeHopeNote &&
  //         next.species === "feline"
  //       ) {
  //         next.hopeNote = buildDefaultHopeNote(next.petName, next.sex);
  //       }
  //     }

  //     const v = validateDiabetesForm(next);
  //     setValidation(v);
  //     return next;
  //   });
  // };

  const updateField = (field, value) => {
    setForm((prev) => {
      let next = { ...prev, [field]: value };

      // When sex or pet name changes, resync template-like fields
      if (field === "sex" || field === "petName") {
        next = applySexDependentDefaults(prev, next);
      }

      const v = validateDiabetesForm(next);
      setValidation(v);
      return next;
    });
  };

  const handleSave = async () => {
    if (!currentUser || !handoutId) return;

    const v = validateDiabetesForm(form);
    setValidation(v);

    try {
      setSaving(true);
      const ref = doc(firestore, "vetHandouts", handoutId);

      const newFormData = formToFirestore(form);
      const title = deriveHandoutTitle(form);

      await updateDoc(ref, {
        formData: newFormData,
        patient: {
          petName: form.petName.trim() || "",
          species: form.species || null,
          sex: form.sex || null,
        },
        title,
        status: v.isValid ? "ready" : "draft",
        validation: {
          state: v.isValid ? "valid" : "missing_required",
          missing: v.missing,
          warnings: v.warnings,
          lastValidatedAt: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to save handout:", err);
      alert("Could not save handout. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    // For now, just use browser print.
    // Later we can move the preview into a dedicated printable container.
    window.print();
  };

  if (loading) {
    return (
      <HandoutsPageShell>
        <HandoutsHeaderRow>
          <HandoutsTitle>Diabetes handout editor</HandoutsTitle>
        </HandoutsHeaderRow>
        <EmptyStateText>Loading handout...</EmptyStateText>
      </HandoutsPageShell>
    );
  }

  if (notFound) {
    return (
      <HandoutsPageShell>
        <HandoutsHeaderRow>
          <HandoutsTitle>Handout not found</HandoutsTitle>
        </HandoutsHeaderRow>
        <EmptyStateText>
          This handout does not exist or you do not have access to it.
        </EmptyStateText>
      </HandoutsPageShell>
    );
  }

  const isFeline = form.species === "feline";
  const measureIntakeLine = buildMeasureIntakeText(form);

  const hasHomeMonitoringContent =
    (form.homeEncouragementInclude1 && form.homeEncouragement1Text) ||
    (form.homeEncouragementInclude2 && form.homeEncouragement2Text) ||
    measureIntakeLine ||
    (form.advancedBgInclude && buildAdvancedBgInstruction(form)) ||
    (form.advancedUrineInclude && buildAdvancedUrineInstruction(form)) ||
    form.additionalInstructions;

  const today = new Date();
  const todayStr = `${String(today.getMonth() + 1).padStart(2, "0")}/${String(
    today.getDate()
  ).padStart(2, "0")}/${today.getFullYear()}`;

  const petName = form.petName || "____";
  const clinicName = form.hospitalName || "our veterinary clinic";
  const vetName = (form.attendingVetName || "").trim();

  const insulinName =
    form.insulinPrescribed === "Other"
      ? form.insulinOtherName || "insulin"
      : form.insulinPrescribed || "insulin";

  const unitsDisplay = form.insulinUnits || "___";

  // Human-readable frequency
  let insulinFrequencyLabel = "";
  if (form.insulinFrequency === "q12h") {
    insulinFrequencyLabel = "in the morning and evening";
  } else if (form.insulinFrequency === "am") {
    insulinFrequencyLabel = "in the morning";
  } else if (form.insulinFrequency === "pm") {
    insulinFrequencyLabel = "in the evening";
  } else if (form.insulinFrequency === "q8h") {
    insulinFrequencyLabel = "every 8 hours";
  } else if (form.insulinFrequency === "q24h") {
    insulinFrequencyLabel = "every 24 hours";
  } else if (form.insulinFrequency === "other") {
    insulinFrequencyLabel = form.insulinFrequencyOther || "";
  }

  // Syringe line
  let syringeLine = null;
  if (form.syringeType === "U-40") {
    syringeLine = "Use U-40 syringes only.";
  } else if (form.syringeType === "U-100") {
    syringeLine = "Use U-100 syringes only.";
  } else if (form.syringeType === "other") {
    const penDesc = form.syringeOther || "the prescribed insulin pen";
    syringeLine = `Use ${penDesc} only.`;
  }

  // Handling + storage
  let handlingLine =
    "Store it in the refrigerator. Call us if the insulin changes color or becomes cloudy.";

  if (form.insulinHandling === "shake") {
    handlingLine = `When handling ${insulinName}, be sure to shake it vigorously before administering it to ${petName}. Store it in the refrigerator. Call us if the insulin changes color or becomes cloudy.`;
  } else if (form.insulinHandling === "roll") {
    handlingLine = `When handling ${insulinName}, be sure to roll it gently between your hands before administering it to ${petName}. Store it in the refrigerator. Call us if the insulin changes color or becomes cloudy.`;
  }

  return (
    <HandoutsPageShell>
      <EditorTopRow>
        <BackButton type="button" onClick={() => navigate("/ai/handouts")}>
          <FiArrowLeft size={14} />
          <span>Back to handouts</span>
        </BackButton>

        <EditorTopRight>
          <StatusPill $ready={validation.isValid}>
            {validation.isValid ? "Ready" : "Draft"}
          </StatusPill>

          <TopBarButton type="button" onClick={handlePrint}>
            <FiPrinter size={14} />
            <span>Print</span>
          </TopBarButton>

          <TopBarButton type="button" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </TopBarButton>
        </EditorTopRight>
      </EditorTopRow>

      {suggestedForm && (
        <SuggestionCard>
          <SuggestionTitle>Suggestions from lab report</SuggestionTitle>
          <SuggestionText>
            These values were generated automatically from the lab PDF. You can
            apply them and then review the handout before saving.
          </SuggestionText>
          <SuggestionActionsRow>
            <TopBarButton type="button" onClick={handleApplyAllSuggestions}>
              Apply all suggestions
            </TopBarButton>
            <SuggestionSmallText>
              The fields will fill in, and you can still edit anything.
            </SuggestionSmallText>
          </SuggestionActionsRow>
        </SuggestionCard>
      )}

      {validation.missing.length > 0 && (
        <ValidationCard>
          <ValidationTitle>Missing required information</ValidationTitle>
          <ValidationList>
            {validation.missing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ValidationList>
        </ValidationCard>
      )}

      <EditorLayout>
        {/* Left: form */}
        <EditorFormColumn>
          <SectionCard>
            <SectionTitle>Lab results (optional)</SectionTitle>
            <FieldDescription>
              Upload a PDF lab report to generate suggested text for this
              handout. The AI will only suggest fields. You stay in control of
              the final plan.
            </FieldDescription>

            <FieldRow>
              <FieldLabel>Lab PDF</FieldLabel>
              <FieldInput
                type="file"
                accept="application/pdf"
                onChange={handleLabFileChange}
              />
            </FieldRow>

            <FieldDescription>
              {labStatus === "idle" && "No lab uploaded yet."}
              {labStatus === "uploading" && "Uploading lab report..."}
              {labStatus === "processing" &&
                "Processing lab and generating suggestions..."}
              {labStatus === "error" && (
                <span style={{ color: "#fca5a5" }}>
                  Error: {labError || "Could not process lab PDF."}
                </span>
              )}
            </FieldDescription>
          </SectionCard>
          {/* Section 1: Hospital info */}
          <SectionCard>
            <SectionTitle>1. Hospital information</SectionTitle>
            <FieldRow>
              <FieldLabel>Hospital name</FieldLabel>
              <FieldInput
                value={form.hospitalName}
                onChange={(e) => updateField("hospitalName", e.target.value)}
                placeholder="Hospital name"
                $error={isFieldMissing("hospitalName")}
                $aiFilled={isAiSuggested("hospitalName")}
              />
            </FieldRow>

            <FieldRow>
              <FieldLabel>Hospital address</FieldLabel>
              <FieldInput
                value={form.hospitalAddress}
                onChange={(e) => updateField("hospitalAddress", e.target.value)}
                placeholder="Street, city, state, ZIP"
                $error={isFieldMissing("hospitalAddress")}
                $aiFilled={isAiSuggested("hospitalAddress")}
              />
            </FieldRow>

            <FieldRow>
              <FieldLabel>Hospital phone number</FieldLabel>
              <FieldInput
                value={form.hospitalPhone}
                onChange={(e) => updateField("hospitalPhone", e.target.value)}
                placeholder="000-000-0000"
                $error={isFieldMissing("hospitalPhone")}
                $aiFilled={isAiSuggested("hospitalPhone")}
              />
            </FieldRow>

            <FieldRow>
              <FieldLabel>Emergency hospital name</FieldLabel>
              <FieldInput
                value={form.erHospitalName}
                onChange={(e) => updateField("erHospitalName", e.target.value)}
                placeholder="After-hours or ER hospital"
                $error={isFieldMissing("erHospitalName")}
                $aiFilled={isAiSuggested("erHospitalName")}
              />
            </FieldRow>

            <FieldRow>
              <FieldLabel>Emergency hospital phone</FieldLabel>
              <FieldInput
                value={form.erHospitalPhone}
                onChange={(e) => updateField("erHospitalPhone", e.target.value)}
                placeholder="000-000-0000"
                $error={isFieldMissing("erHospitalPhone")}
                $aiFilled={isAiSuggested("erHospitalPhone")}
              />
            </FieldRow>
          </SectionCard>

          {/* Section 2: Patient info */}
          <SectionCard>
            <SectionTitle>2. Patient information</SectionTitle>

            <FieldRow>
              <FieldLabel>Pet name</FieldLabel>
              <FieldInput
                value={form.petName}
                onChange={(e) => updateField("petName", e.target.value)}
                placeholder="Pet name"
                $error={isFieldMissing("petName")}
                $aiFilled={isAiSuggested("petName")}
              />
            </FieldRow>
            {/* NEW: veterinarian name */}
            <FieldRow>
              <FieldLabel>Veterinarian name</FieldLabel>
              <FieldInput
                value={form.attendingVetName || ""}
                onChange={(e) =>
                  updateField("attendingVetName", e.target.value)
                }
                placeholder="Dr. Smith"
              />
            </FieldRow>

            <InlineFieldRow>
              <InlineField>
                <FieldLabel>Species</FieldLabel>
                <ButtonToggleGroup>
                  <ToggleButton
                    type="button"
                    $active={form.species === "canine"}
                    $aiFilled={
                      isAiSuggested("species") && form.species === "canine"
                    }
                    $error={isFieldMissing("species")}
                    onClick={() => updateField("species", "canine")}
                  >
                    Canine
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $active={form.species === "feline"}
                    $aiFilled={
                      isAiSuggested("species") && form.species === "feline"
                    }
                    $error={isFieldMissing("species")}
                    onClick={() => updateField("species", "feline")}
                  >
                    Feline
                  </ToggleButton>
                </ButtonToggleGroup>
              </InlineField>

              <InlineField>
                <FieldLabel>Gender</FieldLabel>
                <ButtonToggleGroup>
                  <ToggleButton
                    type="button"
                    $active={form.sex === "M"}
                    $aiFilled={isAiSuggested("sex") && form.sex === "M"}
                    $error={isFieldMissing("sex")}
                    onClick={() => updateField("sex", "M")}
                  >
                    M
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $active={form.sex === "MN"}
                    $aiFilled={isAiSuggested("sex") && form.sex === "MN"}
                    $error={isFieldMissing("sex")}
                    onClick={() => updateField("sex", "MN")}
                  >
                    MN
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $active={form.sex === "F"}
                    $aiFilled={isAiSuggested("sex") && form.sex === "F"}
                    $error={isFieldMissing("sex")}
                    onClick={() => updateField("sex", "F")}
                  >
                    F
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $active={form.sex === "FS"}
                    $aiFilled={isAiSuggested("sex") && form.sex === "FS"}
                    $error={isFieldMissing("sex")}
                    onClick={() => updateField("sex", "FS")}
                  >
                    FS
                  </ToggleButton>
                </ButtonToggleGroup>
              </InlineField>
            </InlineFieldRow>
          </SectionCard>

          {/* Section 3: Recheck interval */}
          <SectionCard>
            <SectionTitle>3. Recheck appointment</SectionTitle>
            <InlineFieldRow>
              <InlineField>
                <FieldLabel>Recheck in</FieldLabel>
                <FieldInput
                  type="number"
                  min="0"
                  value={form.recheckValue}
                  onChange={(e) => updateField("recheckValue", e.target.value)}
                  placeholder="#"
                  $error={isFieldMissing("recheckValue")}
                  $aiFilled={isAiSuggested("recheckValue")}
                />
              </InlineField>
              <InlineField>
                <FieldLabel>Unit</FieldLabel>
                <FieldSelect
                  value={form.recheckUnit}
                  onChange={(e) => updateField("recheckUnit", e.target.value)}
                  $error={isFieldMissing("recheckUnit")}
                  $aiFilled={isAiSuggested("recheckUnit")}
                >
                  <option value="days">days</option>
                  <option value="weeks">weeks</option>
                  <option value="months">months</option>
                </FieldSelect>
              </InlineField>
            </InlineFieldRow>
          </SectionCard>

          {/* Section 3.5: Feline remission */}
          {isFeline && (
            <SectionCard>
              <SectionTitle>3.5 Feline remission notes</SectionTitle>
              <FieldDescription>
                Choose whether to include these messages. You can always edit
                the text.
              </FieldDescription>

              <CheckboxRow>
                <CheckboxInput
                  type="checkbox"
                  checked={!!form.includeRemissionNote}
                  onChange={(e) =>
                    updateField("includeRemissionNote", e.target.checked)
                  }
                />
                <CheckboxLabel>Include remission explanation</CheckboxLabel>
              </CheckboxRow>

              <FieldRow>
                <FieldLabel>Remission explanation</FieldLabel>

                <FieldTextarea
                  rows={4}
                  value={form.remissionNote}
                  onChange={(e) => updateField("remissionNote", e.target.value)}
                  placeholder={DEFAULT_FELINE_REMISSION_NOTE}
                  $aiFilled={isAiSuggested("remissionNote")}
                />
              </FieldRow>
              <CheckboxRow>
                <CheckboxInput
                  type="checkbox"
                  checked={!!form.includeHopeNote}
                  onChange={(e) =>
                    updateField("includeHopeNote", e.target.checked)
                  }
                />
                <CheckboxLabel>Include encouraging message</CheckboxLabel>
              </CheckboxRow>

              <FieldRow style={{ marginBottom: 0 }}>
                <FieldLabel>Encouraging message</FieldLabel>
                <FieldTextarea
                  rows={4}
                  value={form.hopeNote}
                  onChange={(e) => updateField("hopeNote", e.target.value)}
                  placeholder={buildDefaultHopeNote(form.petName)}
                  $aiFilled={isAiSuggested("hopeNote")}
                />
              </FieldRow>
            </SectionCard>
          )}

          {/* Section 4: Insulin */}
          <SectionCard>
            <SectionTitle>4. Insulin</SectionTitle>

            <FieldRow>
              <FieldLabel>Prescribed insulin</FieldLabel>
              <FieldSelect
                value={form.insulinPrescribed}
                onChange={(e) => handleInsulinPrescribedChange(e.target.value)}
                $error={isFieldMissing("insulinPrescribed")}
                $aiFilled={isAiSuggested("insulinPrescribed")}
              >
                <option value="">Select insulin</option>
                <option value="Vetsulin">Vetsulin</option>
                <option value="PZI (Prozinc)">PZI (Prozinc)</option>
                <option value="NPH">NPH (Humulin N / Novolin N)</option>
                <option value="Glargine (Lantus)">Glargine (Lantus)</option>
                <option value="Detemir (Levemir)">Detemir (Levemir)</option>
                <option value="Other">Other</option>
              </FieldSelect>
            </FieldRow>

            {form.insulinPrescribed === "Other" && (
              <FieldRow>
                <FieldLabel>Other insulin name</FieldLabel>
                <FieldInput
                  value={form.insulinOtherName}
                  onChange={(e) =>
                    updateField("insulinOtherName", e.target.value)
                  }
                  placeholder="Insulin name"
                  $aiFilled={isAiSuggested("insulinOtherName")}
                />
              </FieldRow>
            )}

            <FieldRow>
              <FieldLabel>Type of syringe or pen</FieldLabel>
              <FieldSelect
                value={form.syringeType}
                onChange={(e) => updateField("syringeType", e.target.value)}
                $error={isFieldMissing("syringeType")}
                $aiFilled={isAiSuggested("syringeType")}
              >
                <option value="">Select type</option>
                <option value="U-40">U-40 syringes</option>
                <option value="U-100">U-100 syringes</option>
                <option value="other">Specific insulin pen</option>
              </FieldSelect>
            </FieldRow>

            {form.syringeType === "other" && (
              <FieldRow>
                <FieldLabel>Insulin Pen</FieldLabel>
                <FieldInput
                  value={form.syringeOther}
                  onChange={(e) => updateField("syringeOther", e.target.value)}
                  placeholder="Insulin Pen"
                  $error={isFieldMissing("syringeOther")}
                  $aiFilled={isAiSuggested("syringeOther")}
                />
              </FieldRow>
            )}

            <FieldRow>
              <FieldLabel>Insulin handling</FieldLabel>
              <ButtonToggleGroup>
                <ToggleButton
                  type="button"
                  $active={form.insulinHandling === "shake"}
                  onClick={() => updateField("insulinHandling", "shake")}
                >
                  Shake vigorously
                </ToggleButton>
                <ToggleButton
                  type="button"
                  $active={form.insulinHandling === "roll"}
                  onClick={() => updateField("insulinHandling", "roll")}
                >
                  roll it gently between your hands
                </ToggleButton>
              </ButtonToggleGroup>
            </FieldRow>

            <InlineFieldRow>
              <InlineField>
                <FieldLabel>Number of units per dose</FieldLabel>
                <FieldInput
                  type="number"
                  min="0"
                  value={form.insulinUnits}
                  onChange={(e) => updateField("insulinUnits", e.target.value)}
                  placeholder="Units"
                  $error={isFieldMissing("insulinUnits")}
                  $aiFilled={isAiSuggested("insulinUnits")}
                />
              </InlineField>

              <InlineField>
                <FieldLabel>Frequency</FieldLabel>
                <FieldSelect
                  value={form.insulinFrequency}
                  onChange={(e) =>
                    updateField("insulinFrequency", e.target.value)
                  }
                  $error={isFieldMissing("insulinFrequency")}
                  $aiFilled={isAiSuggested("insulinFrequency")}
                >
                  <option value="">Select frequency</option>
                  <option value="q12h">in the morning and evening</option>
                  <option value="am">in the morning</option>
                  <option value="pm">in the evening</option>
                  <option value="q8h">Every 8 hours</option>
                  <option value="q24h">Every 24 hours</option>
                  <option value="other">Other</option>
                </FieldSelect>
              </InlineField>
            </InlineFieldRow>

            {form.insulinFrequency === "other" && (
              <FieldRow>
                <FieldLabel>Other frequency</FieldLabel>
                <FieldInput
                  value={form.insulinFrequencyOther}
                  onChange={(e) =>
                    updateField("insulinFrequencyOther", e.target.value)
                  }
                  placeholder="Describe dosing schedule"
                />
              </FieldRow>
            )}
          </SectionCard>

          {/* Section 5: Feeding */}
          <SectionCard>
            <SectionTitle>5. Feeding</SectionTitle>

            <FieldRow>
              <FieldLabel>Prescribed diet</FieldLabel>
              <FieldInput
                value={form.prescribedFood}
                onChange={(e) => {
                  const nextFood = e.target.value;
                  updateField("prescribedFood", nextFood);

                  // Keep line 1 synced only if vet has not customized it away from the template
                  const current = (form.feeding1Text || "").trim();
                  const templateNow = buildFeedingLine1({
                    ...form,
                    prescribedFood: nextFood,
                  }).trim();
                  const templatePrev = buildFeedingLine1(form).trim();

                  if (!current || current === templatePrev) {
                    updateField("feeding1Text", templateNow);
                  }
                }}
                placeholder="Diet name (brand, type)"
                $error={isFieldMissing("prescribedFood")}
                $aiFilled={isAiSuggested("prescribedFood")}
              />
            </FieldRow>

            <InlineFieldRow>
              <InlineField>
                <FieldLabel>Amount per meal</FieldLabel>
                <FieldInput
                  type="number"
                  min="0"
                  value={form.foodAmount}
                  onChange={(e) => {
                    const nextAmount = e.target.value;
                    updateField("foodAmount", nextAmount);

                    const current = (form.feeding1Text || "").trim();
                    const templateNow = buildFeedingLine1({
                      ...form,
                      foodAmount: nextAmount,
                    }).trim();
                    const templatePrev = buildFeedingLine1(form).trim();

                    if (!current || current === templatePrev) {
                      updateField("feeding1Text", templateNow);
                    }
                  }}
                  placeholder="Amount"
                  $error={isFieldMissing("foodAmount")}
                  $aiFilled={isAiSuggested("foodAmount")}
                />
              </InlineField>
              <InlineField>
                <FieldLabel>Unit</FieldLabel>
                <FieldSelect
                  value={form.foodAmountUnit}
                  onChange={(e) => {
                    const nextUnit = e.target.value;
                    updateField("foodAmountUnit", nextUnit);

                    const current = (form.feeding1Text || "").trim();
                    const templateNow = buildFeedingLine1({
                      ...form,
                      foodAmountUnit: nextUnit,
                    }).trim();
                    const templatePrev = buildFeedingLine1(form).trim();

                    if (!current || current === templatePrev) {
                      updateField("feeding1Text", templateNow);
                    }
                  }}
                  $aiFilled={isAiSuggested("foodAmountUnit")}
                >
                  <option value="cups">cup(s)</option>
                  <option value="cans">can(s)</option>
                </FieldSelect>
              </InlineField>
            </InlineFieldRow>

            <FieldRow>
              <FieldLabel>Feed every</FieldLabel>
              <FieldSelect
                value={form.foodIntervalHours}
                onChange={(e) => {
                  const nextInterval = e.target.value;
                  updateField("foodIntervalHours", nextInterval);

                  const current = (form.feeding1Text || "").trim();
                  const templateNow = buildFeedingLine1({
                    ...form,
                    foodIntervalHours: nextInterval,
                  }).trim();
                  const templatePrev = buildFeedingLine1(form).trim();

                  if (!current || current === templatePrev) {
                    updateField("feeding1Text", templateNow);
                  }
                }}
                $aiFilled={isAiSuggested("foodIntervalHours")}
              >
                <option value="8">8 hours</option>
                <option value="12">12 hours</option>
                <option value="24">24 hours</option>
              </FieldSelect>
            </FieldRow>

            {/* Feline only: Cat Feeding Instructions */}
            {isFeline && (
              <SectionCard style={{ marginTop: 10 }}>
                <SectionTitle>Cat Feeding Instructions</SectionTitle>

                <CheckboxRow>
                  <CheckboxInput
                    type="checkbox"
                    checked={!!form.includeCatFeedingMealInsulinNote}
                    onChange={(e) =>
                      updateField(
                        "includeCatFeedingMealInsulinNote",
                        e.target.checked
                      )
                    }
                  />
                  <CheckboxLabel>
                    Include meal feeding and insulin note
                  </CheckboxLabel>
                </CheckboxRow>

                {form.includeCatFeedingMealInsulinNote && (
                  <FieldRow>
                    <FieldLabel>Meal feeding note</FieldLabel>
                    <FieldTextarea
                      rows={4}
                      value={form.catFeedingMealInsulinNote}
                      onChange={(e) =>
                        updateField("catFeedingMealInsulinNote", e.target.value)
                      }
                      placeholder={buildCatMealInsulinNote(form)}
                    />
                  </FieldRow>
                )}

                <CheckboxRow>
                  <CheckboxInput
                    type="checkbox"
                    checked={!!form.includeCatCannedDietNote}
                    onChange={(e) =>
                      updateField("includeCatCannedDietNote", e.target.checked)
                    }
                  />
                  <CheckboxLabel>Include canned diet note</CheckboxLabel>
                </CheckboxRow>

                {form.includeCatCannedDietNote && (
                  <FieldRow style={{ marginBottom: 0 }}>
                    <FieldLabel>Canned diet note</FieldLabel>
                    <FieldTextarea
                      rows={3}
                      value={form.catCannedDietNote}
                      onChange={(e) =>
                        updateField("catCannedDietNote", e.target.value)
                      }
                      placeholder={buildCatCannedDietNote(form)}
                    />
                  </FieldRow>
                )}
              </SectionCard>
            )}

            {/* Feeding instructions checklist */}
            <SectionCard style={{ marginTop: 10 }}>
              <SectionTitle>
                Feeding Instructions (check all that apply)
              </SectionTitle>

              <CheckboxRow>
                <CheckboxInput
                  type="checkbox"
                  checked={!!form.feedingInclude1}
                  onChange={(e) =>
                    updateField("feedingInclude1", e.target.checked)
                  }
                />
                <CheckboxLabel>Include instruction 1</CheckboxLabel>
              </CheckboxRow>

              <FieldRow>
                <FieldTextarea
                  rows={2}
                  value={form.feeding1Text}
                  onChange={(e) => updateField("feeding1Text", e.target.value)}
                  placeholder={buildFeedingLine1(form)}
                />
              </FieldRow>

              <CheckboxRow>
                <CheckboxInput
                  type="checkbox"
                  checked={!!form.feedingInclude2}
                  onChange={(e) =>
                    updateField("feedingInclude2", e.target.checked)
                  }
                />
                <CheckboxLabel>Include instruction 2</CheckboxLabel>
              </CheckboxRow>

              <FieldRow>
                <FieldTextarea
                  rows={2}
                  value={form.feeding2Text}
                  onChange={(e) => updateField("feeding2Text", e.target.value)}
                  placeholder={buildFeedingLine2(form)}
                />
              </FieldRow>

              <CheckboxRow>
                <CheckboxInput
                  type="checkbox"
                  checked={!!form.feedingInclude3}
                  onChange={(e) =>
                    updateField("feedingInclude3", e.target.checked)
                  }
                />
                <CheckboxLabel>Include instruction 3</CheckboxLabel>
              </CheckboxRow>

              <FieldRow>
                <FieldTextarea
                  rows={2}
                  value={form.feeding3Text}
                  onChange={(e) => updateField("feeding3Text", e.target.value)}
                  placeholder={buildFeedingLine3(form)}
                />
              </FieldRow>

              <CheckboxRow>
                <CheckboxInput
                  type="checkbox"
                  checked={!!form.feedingInclude4}
                  onChange={(e) =>
                    updateField("feedingInclude4", e.target.checked)
                  }
                />
                <CheckboxLabel>Include instruction 4</CheckboxLabel>
              </CheckboxRow>

              <FieldRow>
                <FieldTextarea
                  rows={3}
                  value={form.feeding4Text}
                  onChange={(e) => updateField("feeding4Text", e.target.value)}
                  placeholder={buildFeedingLine4()}
                />
              </FieldRow>

              <CheckboxRow>
                <CheckboxInput
                  type="checkbox"
                  checked={!!form.feedingInclude5}
                  onChange={(e) =>
                    updateField("feedingInclude5", e.target.checked)
                  }
                />
                <CheckboxLabel>Include instruction 5</CheckboxLabel>
              </CheckboxRow>

              <FieldRow>
                <FieldTextarea
                  rows={2}
                  value={form.feeding5Text}
                  onChange={(e) => updateField("feeding5Text", e.target.value)}
                  placeholder={buildFeedingLine5(form)}
                />
              </FieldRow>

              <CheckboxRow>
                <CheckboxInput
                  type="checkbox"
                  checked={!!form.feedingInclude6}
                  onChange={(e) =>
                    updateField("feedingInclude6", e.target.checked)
                  }
                />
                <CheckboxLabel>Include instruction 6</CheckboxLabel>
              </CheckboxRow>

              <FieldRow>
                <FieldTextarea
                  rows={3}
                  value={form.feeding6Text}
                  onChange={(e) => updateField("feeding6Text", e.target.value)}
                  placeholder={buildFeedingLine6(form)}
                />
              </FieldRow>

              <CheckboxRow>
                <CheckboxInput
                  type="checkbox"
                  checked={!!form.feedingInclude7}
                  onChange={(e) =>
                    updateField("feedingInclude7", e.target.checked)
                  }
                />
                <CheckboxLabel>Include instruction 7</CheckboxLabel>
              </CheckboxRow>

              {form.feedingInclude7 && (
                <>
                  <FieldRow>
                    <FieldLabel>
                      Action if {form.petName || "your pet"} vomits or refuses
                      one meal
                    </FieldLabel>
                    <ButtonToggleGroup>
                      <ToggleButton
                        type="button"
                        $active={form.feeding7Mode === "withhold"}
                        onClick={() => {
                          const nextMode = "withhold";
                          const template = buildFeedingLine7({
                            ...form,
                            feeding7Mode: nextMode,
                          });
                          updateField("feeding7Mode", nextMode);
                          updateField("feeding7Text", template);
                        }}
                      >
                        Withhold insulin and call us
                      </ToggleButton>

                      <ToggleButton
                        type="button"
                        $active={form.feeding7Mode === "half_dose"}
                        onClick={() => {
                          const nextMode = "half_dose";
                          const template = buildFeedingLine7({
                            ...form,
                            feeding7Mode: nextMode,
                          });
                          updateField("feeding7Mode", nextMode);
                          updateField("feeding7Text", template);
                        }}
                      >
                        Give half dose and resume
                      </ToggleButton>

                      <ToggleButton
                        type="button"
                        $active={form.feeding7Mode === "bg_adjust"}
                        onClick={() => {
                          const nextMode = "bg_adjust";
                          const template = buildFeedingLine7({
                            ...form,
                            feeding7Mode: nextMode,
                          });
                          updateField("feeding7Mode", nextMode);
                          updateField("feeding7Text", template);
                        }}
                      >
                        Blood glucose based plan
                      </ToggleButton>
                    </ButtonToggleGroup>
                  </FieldRow>

                  {form.feeding7Mode === "bg_adjust" && (
                    <InlineFieldRow>
                      <InlineField>
                        <FieldLabel>Blood glucose threshold</FieldLabel>
                        <FieldInput
                          type="number"
                          min="0"
                          value={form.feeding7BgThreshold}
                          onChange={(e) => {
                            const val = e.target.value;
                            const template = buildFeedingLine7({
                              ...form,
                              feeding7Mode: "bg_adjust",
                              feeding7BgThreshold: val,
                            });
                            updateField("feeding7BgThreshold", val);
                            updateField("feeding7Text", template);
                          }}
                          placeholder="e.g. 250"
                        />
                      </InlineField>

                      <InlineField>
                        <FieldLabel>New insulin dose (units)</FieldLabel>
                        <FieldInput
                          type="number"
                          min="0"
                          value={form.feeding7NewUnits}
                          onChange={(e) => {
                            const val = e.target.value;
                            const template = buildFeedingLine7({
                              ...form,
                              feeding7Mode: "bg_adjust",
                              feeding7NewUnits: val,
                            });
                            updateField("feeding7NewUnits", val);
                            updateField("feeding7Text", template);
                          }}
                          placeholder="e.g. 1"
                        />
                      </InlineField>
                    </InlineFieldRow>
                  )}
                </>
              )}

              <FieldRow style={{ marginBottom: 0 }}>
                <FieldTextarea
                  rows={3}
                  value={form.feeding7Text}
                  onChange={(e) => updateField("feeding7Text", e.target.value)}
                  placeholder={buildFeedingLine7(form)}
                />
              </FieldRow>
            </SectionCard>
          </SectionCard>

          {/* Section 6: Home monitoring */}
          <SectionCard>
            <SectionTitle>6. Home monitoring</SectionTitle>

            {/* 6.1 Home monitoring encouragement */}
            <FieldLabel>Home monitoring encouragement</FieldLabel>
            <FieldDescription>
              Check the messages you would like to include. You can still edit
              the wording.
            </FieldDescription>

            <CheckboxRow>
              <CheckboxInput
                type="checkbox"
                checked={!!form.homeEncouragementInclude1}
                onChange={(e) =>
                  updateField("homeEncouragementInclude1", e.target.checked)
                }
              />
              <CheckboxLabel>
                Include initial encouragement message
              </CheckboxLabel>
            </CheckboxRow>
            <FieldRow>
              <FieldTextarea
                rows={3}
                value={form.homeEncouragement1Text}
                onChange={(e) =>
                  updateField("homeEncouragement1Text", e.target.value)
                }
                placeholder={buildHomeEncouragement1(form)}
                style={
                  !form.homeEncouragementInclude1 ? { opacity: 0.5 } : undefined
                }
              />
            </FieldRow>

            <CheckboxRow>
              <CheckboxInput
                type="checkbox"
                checked={!!form.homeEncouragementInclude2}
                onChange={(e) =>
                  updateField("homeEncouragementInclude2", e.target.checked)
                }
              />
              <CheckboxLabel>
                Include positive reinforcement message
              </CheckboxLabel>
            </CheckboxRow>
            <FieldRow>
              <FieldTextarea
                rows={2}
                value={form.homeEncouragement2Text}
                onChange={(e) =>
                  updateField("homeEncouragement2Text", e.target.value)
                }
                placeholder={buildHomeEncouragement2(form)}
                style={
                  !form.homeEncouragementInclude2 ? { opacity: 0.5 } : undefined
                }
              />
            </FieldRow>

            {/* 6.2 Measure food and water intake */}
            <FieldRow>
              <FieldLabel>Measure food and water intake</FieldLabel>
              <ButtonToggleGroup>
                <ToggleButton
                  type="button"
                  $active={form.measureFoodWaterFrequency === "twice_daily"}
                  onClick={() =>
                    updateField("measureFoodWaterFrequency", "twice_daily")
                  }
                >
                  Twice daily
                </ToggleButton>
                <ToggleButton
                  type="button"
                  $active={form.measureFoodWaterFrequency === "once_daily"}
                  onClick={() =>
                    updateField("measureFoodWaterFrequency", "once_daily")
                  }
                >
                  Once daily
                </ToggleButton>
                <ToggleButton
                  type="button"
                  $active={form.measureFoodWaterFrequency === "other"}
                  onClick={() =>
                    updateField("measureFoodWaterFrequency", "other")
                  }
                >
                  Other
                </ToggleButton>
              </ButtonToggleGroup>
            </FieldRow>

            {form.measureFoodWaterFrequency === "other" && (
              <FieldRow>
                <FieldLabel>Other frequency</FieldLabel>
                <FieldInput
                  value={form.measureFoodWaterOther}
                  onChange={(e) =>
                    updateField("measureFoodWaterOther", e.target.value)
                  }
                  placeholder="For example: every evening"
                />
              </FieldRow>
            )}

            {/* 6.3 Advanced home monitoring (if applicable) */}
            <FieldRow>
              <FieldLabel>Advanced home monitoring (if applicable)</FieldLabel>
            </FieldRow>

            {/* Blood glucose monitoring */}
            <CheckboxRow>
              <CheckboxInput
                type="checkbox"
                checked={!!form.advancedBgInclude}
                onChange={(e) =>
                  updateField("advancedBgInclude", e.target.checked)
                }
              />
              <CheckboxLabel>
                Include blood glucose monitoring instructions
              </CheckboxLabel>
            </CheckboxRow>

            {form.advancedBgInclude && (
              <>
                <InlineFieldRow>
                  <InlineField>
                    <FieldLabel>Test every</FieldLabel>
                    <FieldSelect
                      value={form.advancedBgEveryHours}
                      onChange={(e) =>
                        updateField("advancedBgEveryHours", e.target.value)
                      }
                    >
                      <option value="2">2 hours</option>
                      <option value="4">4 hours</option>
                      <option value="8">8 hours</option>
                      <option value="12">12 hours</option>
                      <option value="other">Other</option>
                    </FieldSelect>
                  </InlineField>
                  {form.advancedBgEveryHours === "other" && (
                    <InlineField>
                      <FieldLabel>Other interval</FieldLabel>
                      <FieldInput
                        value={form.advancedBgEveryHoursOther}
                        onChange={(e) =>
                          updateField(
                            "advancedBgEveryHoursOther",
                            e.target.value
                          )
                        }
                        placeholder="Number of hours"
                      />
                    </InlineField>
                  )}
                </InlineFieldRow>

                <InlineFieldRow>
                  <InlineField>
                    <FieldLabel>Call if blood glucose is less than</FieldLabel>
                    <FieldSelect
                      value={form.advancedBgLowThreshold}
                      onChange={(e) =>
                        updateField("advancedBgLowThreshold", e.target.value)
                      }
                    >
                      <option value="40">40</option>
                      <option value="60">60</option>
                      <option value="80">80</option>
                      <option value="other">Other</option>
                    </FieldSelect>
                  </InlineField>
                  {form.advancedBgLowThreshold === "other" && (
                    <InlineField>
                      <FieldLabel>Other low threshold</FieldLabel>
                      <FieldInput
                        value={form.advancedBgLowThresholdOther}
                        onChange={(e) =>
                          updateField(
                            "advancedBgLowThresholdOther",
                            e.target.value
                          )
                        }
                        placeholder="Value"
                      />
                    </InlineField>
                  )}
                </InlineFieldRow>

                <InlineFieldRow>
                  <InlineField>
                    <FieldLabel>
                      Call if blood glucose is greater than
                    </FieldLabel>
                    <FieldSelect
                      value={form.advancedBgHighThreshold}
                      onChange={(e) =>
                        updateField("advancedBgHighThreshold", e.target.value)
                      }
                    >
                      <option value="300">300</option>
                      <option value="400">400</option>
                      <option value="500">500</option>
                      <option value="other">Other</option>
                    </FieldSelect>
                  </InlineField>
                  {form.advancedBgHighThreshold === "other" && (
                    <InlineField>
                      <FieldLabel>Other high threshold</FieldLabel>
                      <FieldInput
                        value={form.advancedBgHighThresholdOther}
                        onChange={(e) =>
                          updateField(
                            "advancedBgHighThresholdOther",
                            e.target.value
                          )
                        }
                        placeholder="Value"
                      />
                    </InlineField>
                  )}
                </InlineFieldRow>

                <FieldDescription>This will appear as:</FieldDescription>
                <PreviewText>{buildAdvancedBgInstruction(form)}</PreviewText>
              </>
            )}

            {/* Urine monitoring */}
            <CheckboxRow style={{ marginTop: 8 }}>
              <CheckboxInput
                type="checkbox"
                checked={!!form.advancedUrineInclude}
                onChange={(e) =>
                  updateField("advancedUrineInclude", e.target.checked)
                }
              />
              <CheckboxLabel>
                Include urine monitoring instructions
              </CheckboxLabel>
            </CheckboxRow>

            {form.advancedUrineInclude && (
              <>
                <FieldRow>
                  <FieldLabel>Type of urine monitoring</FieldLabel>
                  <ButtonToggleGroup>
                    <ToggleButton
                      type="button"
                      $active={form.advancedUrineMode === "glucose"}
                      onClick={() =>
                        updateField("advancedUrineMode", "glucose")
                      }
                    >
                      Glucose only
                    </ToggleButton>
                    <ToggleButton
                      type="button"
                      $active={form.advancedUrineMode === "glucose_ketones"}
                      onClick={() =>
                        updateField("advancedUrineMode", "glucose_ketones")
                      }
                    >
                      Glucose and ketones
                    </ToggleButton>
                  </ButtonToggleGroup>
                </FieldRow>

                <InlineFieldRow>
                  <InlineField>
                    <FieldLabel>Test every</FieldLabel>
                    <FieldSelect
                      value={form.advancedUrineEveryHours}
                      onChange={(e) =>
                        updateField("advancedUrineEveryHours", e.target.value)
                      }
                    >
                      <option value="8">8 hours</option>
                      <option value="12">12 hours</option>
                      <option value="24">24 hours</option>
                      <option value="48">48 hours</option>
                      <option value="other">Other</option>
                    </FieldSelect>
                  </InlineField>
                  {form.advancedUrineEveryHours === "other" && (
                    <InlineField>
                      <FieldLabel>Other interval</FieldLabel>
                      <FieldInput
                        value={form.advancedUrineEveryHoursOther}
                        onChange={(e) =>
                          updateField(
                            "advancedUrineEveryHoursOther",
                            e.target.value
                          )
                        }
                        placeholder="Number of hours"
                      />
                    </InlineField>
                  )}
                </InlineFieldRow>

                <FieldDescription>This will appear as:</FieldDescription>
                <PreviewText>{buildAdvancedUrineInstruction(form)}</PreviewText>
              </>
            )}

            {/* 6.4 Additional instructions */}
            <FieldRow style={{ marginTop: 8 }}>
              <FieldLabel>Additional instructions</FieldLabel>
              <FieldTextarea
                rows={3}
                value={form.additionalInstructions}
                onChange={(e) =>
                  updateField("additionalInstructions", e.target.value)
                }
                placeholder="Any additional individualized instructions."
              />
            </FieldRow>
          </SectionCard>

          {/* Section 7: Emergency criteria */}
          <SectionCard>
            <SectionTitle>7. Emergency criteria</SectionTitle>

            <FieldDescription>
              Uncheck items that you do not want to include for this patient,
              and add custom criteria if needed.
            </FieldDescription>

            <CheckboxRow>
              <CheckboxInput
                type="checkbox"
                checked={form.emergencyHasSeizure}
                onChange={(e) =>
                  updateField("emergencyHasSeizure", e.target.checked)
                }
              />
              <CheckboxLabel>Has a seizure</CheckboxLabel>
            </CheckboxRow>

            <CheckboxRow>
              <CheckboxInput
                type="checkbox"
                checked={form.emergencyTremoring}
                onChange={(e) =>
                  updateField("emergencyTremoring", e.target.checked)
                }
              />
              <CheckboxLabel>Tremoring or twitching</CheckboxLabel>
            </CheckboxRow>

            <CheckboxRow>
              <CheckboxInput
                type="checkbox"
                checked={form.emergencyWeak}
                onChange={(e) => updateField("emergencyWeak", e.target.checked)}
              />
              <CheckboxLabel>Seems weak, spacey, or overly tired</CheckboxLabel>
            </CheckboxRow>

            <CheckboxRow>
              <CheckboxInput
                type="checkbox"
                checked={form.emergencyHiding}
                onChange={(e) =>
                  updateField("emergencyHiding", e.target.checked)
                }
              />
              <CheckboxLabel>Hiding for more than 12 hours</CheckboxLabel>
            </CheckboxRow>

            <CheckboxRow>
              <CheckboxInput
                type="checkbox"
                checked={form.emergencyRefusesFoodWater}
                onChange={(e) =>
                  updateField("emergencyRefusesFoodWater", e.target.checked)
                }
              />
              <CheckboxLabel>
                Refuses to eat or drink for more than 12 hours
              </CheckboxLabel>
            </CheckboxRow>

            <CheckboxRow>
              <CheckboxInput
                type="checkbox"
                checked={form.emergencyDiarrhea}
                onChange={(e) =>
                  updateField("emergencyDiarrhea", e.target.checked)
                }
              />
              <CheckboxLabel>Diarrhea for more than 12 hours</CheckboxLabel>
            </CheckboxRow>

            <CheckboxRow>
              <CheckboxInput
                type="checkbox"
                checked={form.emergencyVomiting}
                onChange={(e) =>
                  updateField("emergencyVomiting", e.target.checked)
                }
              />
              <CheckboxLabel>
                Vomits more than three times in 12 hours
              </CheckboxLabel>
            </CheckboxRow>

            <CheckboxRow>
              <CheckboxInput
                type="checkbox"
                checked={form.emergencyBumpingIntoObjects}
                onChange={(e) =>
                  updateField("emergencyBumpingIntoObjects", e.target.checked)
                }
              />
              <CheckboxLabel>Bumping into objects</CheckboxLabel>
            </CheckboxRow>

            <CheckboxRow>
              <CheckboxInput
                type="checkbox"
                checked={form.emergencyDifficultyWalking}
                onChange={(e) =>
                  updateField("emergencyDifficultyWalking", e.target.checked)
                }
              />
              <CheckboxLabel>Difficulty walking or jumping</CheckboxLabel>
            </CheckboxRow>

            <CheckboxRow>
              <CheckboxInput
                type="checkbox"
                checked={form.emergencyMissedInsulinDoses}
                onChange={(e) =>
                  updateField("emergencyMissedInsulinDoses", e.target.checked)
                }
              />
              <CheckboxLabel>
                Missed more than two doses of insulin
              </CheckboxLabel>
            </CheckboxRow>

            <CheckboxRow>
              <CheckboxInput
                type="checkbox"
                checked={form.emergencyIncorrectDose}
                onChange={(e) =>
                  updateField("emergencyIncorrectDose", e.target.checked)
                }
              />
              <CheckboxLabel>Received an incorrect insulin dose</CheckboxLabel>
            </CheckboxRow>

            <FieldRow>
              <FieldLabel>Other emergency criteria</FieldLabel>
              <FieldTextarea
                rows={2}
                value={form.emergencyOther}
                onChange={(e) => updateField("emergencyOther", e.target.value)}
                placeholder="Any extra reasons to contact the clinic or ER."
              />
            </FieldRow>
          </SectionCard>
        </EditorFormColumn>

        {/* Right: simple preview */}
        <PreviewColumn>
          <PreviewCard>
            <PreviewTitle>
              Diabetes discharge instructions for {form.petName || "your pet"}
            </PreviewTitle>

            <PreviewSectionTitle>Hospital</PreviewSectionTitle>
            <PreviewText>
              {form.hospitalName && <div>{form.hospitalName}</div>}
              {form.hospitalAddress && <div>{form.hospitalAddress}</div>}
              {form.hospitalPhone && <div>Phone: {form.hospitalPhone}</div>}
              {/* {form.erHospitalName && (
                <div>Emergency hospital: {form.erHospitalName}</div>
              )}
              {form.erHospitalPhone && (
                <div>Emergency phone: {form.erHospitalPhone}</div>
              )} */}
            </PreviewText>

            <PreviewSectionTitle></PreviewSectionTitle>
            <PreviewText>
              <div>{todayStr}</div>
              <br />
              <div>To {petName}&apos;s caregivers,</div>
              <br />
              <div>
                You&apos;re doing a great job caring for {petName}. Your
                veterinary team at {clinicName} will continue to support you as
                you manage {petName}
                &apos;s diabetes.{" "}
                {vetName ? (
                  <>
                    Dr. {vetName} would like you to follow these directions
                    until your next recheck appointment in{" "}
                    {form.recheckValue || "___"} {form.recheckUnit || "____"}.
                  </>
                ) : (
                  <>
                    Dr. __________________ would like you to follow these
                    directions until your next recheck appointment in{" "}
                    {form.recheckValue || "___"} {form.recheckUnit || "____"}.
                  </>
                )}
              </div>
            </PreviewText>

            {isFeline &&
              ((form.includeRemissionNote && form.remissionNote) ||
                (form.includeHopeNote && form.hopeNote)) && (
                <>
                  {form.includeRemissionNote && form.remissionNote && (
                    <PreviewText>{form.remissionNote}</PreviewText>
                  )}
                  {form.includeHopeNote && form.hopeNote && (
                    <PreviewText>{form.hopeNote}</PreviewText>
                  )}
                </>
              )}

            <PreviewSectionTitle>Insulin directions</PreviewSectionTitle>
            <PreviewText>
              <div>
                Please give {petName} {unitsDisplay} units of {insulinName}{" "}
                {insulinFrequencyLabel || "_______"}.
              </div>

              {syringeLine && <div>{syringeLine}</div>}

              <div>{handlingLine}</div>

              <div>
                Do not change this regimen unless you have spoken with a member
                of our veterinary team.
              </div>
            </PreviewText>

            <PreviewSectionTitle>Feeding</PreviewSectionTitle>

            {isFeline && (
              <>
                {(form.includeCatFeedingMealInsulinNote ||
                  form.includeCatCannedDietNote) && (
                  <>
                    {form.includeCatFeedingMealInsulinNote &&
                      form.catFeedingMealInsulinNote && (
                        <PreviewText>
                          {form.catFeedingMealInsulinNote}
                        </PreviewText>
                      )}
                    {form.includeCatCannedDietNote &&
                      form.catCannedDietNote && (
                        <PreviewText>{form.catCannedDietNote}</PreviewText>
                      )}
                  </>
                )}
              </>
            )}

            <PreviewSectionTitle>Feeding Instructions</PreviewSectionTitle>
            <PreviewText as="ul">
              {form.feedingInclude1 && (
                <li>
                  {(form.feeding1Text || "").trim() || buildFeedingLine1(form)}
                </li>
              )}
              {form.feedingInclude2 && form.feeding2Text && (
                <li>{form.feeding2Text}</li>
              )}
              {form.feedingInclude3 && form.feeding3Text && (
                <li>{form.feeding3Text}</li>
              )}
              {form.feedingInclude4 && form.feeding4Text && (
                <li>{form.feeding4Text}</li>
              )}
              {form.feedingInclude5 && form.feeding5Text && (
                <li>{form.feeding5Text}</li>
              )}
              {form.feedingInclude6 && form.feeding6Text && (
                <li>{form.feeding6Text}</li>
              )}
              {form.feedingInclude7 && form.feeding7Text && (
                <li>{form.feeding7Text}</li>
              )}
            </PreviewText>

            {hasHomeMonitoringContent && (
              <>
                <PreviewSectionTitle>Home monitoring</PreviewSectionTitle>

                {/* Intro paragraph + encouragement messages */}
                <PreviewText>
                  <div>
                    Home monitoring is key when caring for a diabetic animal.
                    You are acting as an extension of your veterinary team by
                    taking on these important tasks.
                  </div>

                  {form.homeEncouragementInclude1 &&
                    form.homeEncouragement1Text && (
                      <div>{form.homeEncouragement1Text}</div>
                    )}

                  {form.homeEncouragementInclude2 &&
                    form.homeEncouragement2Text && (
                      <div>{form.homeEncouragement2Text}</div>
                    )}
                </PreviewText>

                {/* Bullet list of concrete tasks */}
                <PreviewText as="ul">
                  {measureIntakeLine && <li>{measureIntakeLine}</li>}

                  {form.advancedBgInclude && (
                    <li>{buildAdvancedBgInstruction(form)}</li>
                  )}

                  {form.advancedUrineInclude && (
                    <li>{buildAdvancedUrineInstruction(form)}</li>
                  )}

                  {form.additionalInstructions && (
                    <li>{form.additionalInstructions}</li>
                  )}
                </PreviewText>
              </>
            )}

            <PreviewSectionTitle>Emergency criteria</PreviewSectionTitle>
            <PreviewText as="ul">
              {form.emergencyHasSeizure && <li>Has a seizure.</li>}
              {form.emergencyTremoring && <li>Tremoring or twitching.</li>}
              {form.emergencyWeak && (
                <li>Seems weak, spacey, or unusually tired.</li>
              )}
              {form.emergencyHiding && <li>Hiding for more than 12 hours.</li>}
              {form.emergencyRefusesFoodWater && (
                <li>Refuses to eat or drink for more than 12 hours.</li>
              )}
              {form.emergencyDiarrhea && (
                <li>Diarrhea for more than 12 hours.</li>
              )}
              {form.emergencyVomiting && (
                <li>Vomits more than three times in 12 hours.</li>
              )}
              {form.emergencyBumpingIntoObjects && (
                <li>Bumping into objects.</li>
              )}
              {form.emergencyDifficultyWalking && (
                <li>Difficulty walking or jumping.</li>
              )}
              {form.emergencyMissedInsulinDoses && (
                <li>Missed more than two doses of insulin.</li>
              )}
              {form.emergencyIncorrectDose && (
                <li>Received an incorrect insulin dose.</li>
              )}
              {form.emergencyOther && <li>{form.emergencyOther}</li>}
            </PreviewText>
          </PreviewCard>
        </PreviewColumn>
      </EditorLayout>
    </HandoutsPageShell>
  );
}

export default function HandoutsPage() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setCurrentUser(u || null);
    });
    return () => unsub();
  }, []);

  return (
    <HandoutsPageOuter>
      <Routes>
        <Route path="/" element={<HandoutsList currentUser={currentUser} />} />
        <Route
          path=":handoutId"
          element={<DiabetesHandoutEditor currentUser={currentUser} />}
        />
      </Routes>
    </HandoutsPageOuter>
  );
}

const HeaderActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  z-index: 9999;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 560px;
  border-radius: 14px;
  border: 1px solid #1f2937;
  background: #020617;
  padding: 14px;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
`;

const ModalTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #f9fafb;
`;

const IconCloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid #374151;
  background: #020617;
  color: #e5e7eb;
  cursor: pointer;

  &:hover {
    background: #111827;
    border-color: #6b7280;
  }
`;

const ModalSubtext = styled.p`
  margin: 0 0 10px;
  font-size: 12px;
  color: #9ca3af;
`;

const ModalActions = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const ModalErrorText = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #fca5a5;
`;

const SuggestionCard = styled.div`
  margin-bottom: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #1d4ed8;
  background: #020617;
`;

const SuggestionTitle = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #bfdbfe;
  margin-bottom: 4px;
`;

const SuggestionText = styled.p`
  margin: 0;
  font-size: 12px;
  color: #9ca3af;
`;

const SuggestionActionsRow = styled.div`
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SuggestionSmallText = styled.span`
  font-size: 11px;
  color: #6b7280;
`;

const EditorTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #4b5563;
  background: #020617;
  color: #e5e7eb;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.12s ease, border-color 0.12s ease;

  &:hover {
    background: #111827;
    border-color: #6b7280;
  }
`;

const EditorTopRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TopBarButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #4b5563;
  background: #020617;
  color: #e5e7eb;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.12s ease, border-color 0.12s ease;

  &:hover:not(:disabled) {
    background: #111827;
    border-color: #6b7280;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  background: ${(p) => (p.$ready ? "#065f46" : "#312e81")};
  color: #e5e7eb;
`;

const ValidationCard = styled.div`
  margin-bottom: 16px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #7f1d1d;
  background: #111827;
`;

const ValidationTitle = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #fecaca;
  margin-bottom: 4px;
`;

const ValidationList = styled.ul`
  margin: 0;
  padding-left: 18px;
  font-size: 12px;
  color: #fecaca;
`;

const EditorLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 16px;
  align-items: flex-start;

  @media (max-width: 960px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const EditorFormColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PreviewColumn = styled.div`
  position: sticky;
  top: 16px;
  align-self: flex-start;

  @media (max-width: 960px) {
    position: static;
  }
`;

const SectionCard = styled.div`
  border-radius: 12px;
  border: 1px solid #1f2937;
  background: #020617;
  padding: 12px 12px 10px;
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #f9fafb;
  margin-bottom: 8px;
`;

const FieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
`;

const InlineFieldRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 8px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const InlineField = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FieldLabel = styled.label`
  font-size: 12px;
  color: #9ca3af;
`;

const FieldDescription = styled.p`
  font-size: 12px;
  color: #9ca3af;
  margin: 0 0 8px;
`;

const FieldInput = styled.input`
  height: 32px;
  border-radius: 8px;
  border: 1px solid
    ${(p) => (p.$error ? "#b91c1c" : p.$aiFilled ? "#1d4ed8" : "#374151")};
  background: #020617;
  color: ${(p) => (p.$aiFilled ? "#bfdbfe" : "#e5e7eb")};
  padding: 0 8px;
  font-size: 13px;

  &::placeholder {
    color: #6b7280;
  }

  &:focus {
    outline: none;
    border-color: ${(p) => (p.$error ? "#fca5a5" : "#6b7280")};
  }
`;

const FieldSelect = styled.select`
  height: 32px;
  border-radius: 8px;
  border: 1px solid
    ${(p) => (p.$error ? "#b91c1c" : p.$aiFilled ? "#1d4ed8" : "#374151")};
  background: #020617;
  color: ${(p) => (p.$aiFilled ? "#bfdbfe" : "#e5e7eb")};
  padding: 0 8px;
  font-size: 13px;

  &:focus {
    outline: none;
    border-color: ${(p) => (p.$error ? "#fca5a5" : "#6b7280")};
  }
`;

const FieldTextarea = styled.textarea`
  border-radius: 8px;
  border: 1px solid
    ${(p) => (p.$error ? "#b91c1c" : p.$aiFilled ? "#1d4ed8" : "#374151")};
  background: #020617;
  color: ${(p) => (p.$aiFilled ? "#bfdbfe" : "#e5e7eb")};
  padding: 6px 8px;
  font-size: 13px;
  resize: vertical;
  min-height: 60px;

  &::placeholder {
    color: #6b7280;
  }

  &:focus {
    outline: none;
    border-color: ${(p) => (p.$error ? "#fca5a5" : "#6b7280")};
  }
`;

const ButtonToggleGroup = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const ToggleButton = styled.button`
  padding: 5px 10px;
  border-radius: 999px;
  border: 1px solid
    ${(p) =>
      p.$error
        ? "#b91c1c"
        : p.$aiFilled
        ? "#1d4ed8"
        : p.$active
        ? "#2563eb"
        : "#374151"};
  background: ${(p) =>
    p.$error
      ? "#111827"
      : p.$aiFilled
      ? "rgba(37, 99, 235, 0.26)"
      : p.$active
      ? "rgba(37, 99, 235, 0.18)"
      : "#020617"};
  color: ${(p) =>
    p.$error
      ? "#fecaca"
      : p.$aiFilled
      ? "#dbeafe"
      : p.$active
      ? "#dbeafe"
      : "#e5e7eb"};
  font-size: 12px;
  cursor: pointer;
  transition: background 0.12s ease, border-color 0.12s ease,
    box-shadow 0.12s ease, color 0.12s ease;

  box-shadow: ${(p) =>
    p.$error
      ? "0 0 0 1px rgba(185, 28, 28, 0.6)"
      : p.$aiFilled
      ? "0 0 0 3px rgba(37, 99, 235, 0.32)"
      : p.$active
      ? "0 0 0 3px rgba(37, 99, 235, 0.18)"
      : "none"};

  &:hover {
    background: ${(p) =>
      p.$error
        ? "#1f2937"
        : p.$aiFilled
        ? "rgba(37, 99, 235, 0.32)"
        : p.$active
        ? "rgba(37, 99, 235, 0.22)"
        : "#111827"};
    border-color: ${(p) =>
      p.$error
        ? "#fca5a5"
        : p.$aiFilled
        ? "#3b82f6"
        : p.$active
        ? "#3b82f6"
        : "#6b7280"};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${(p) =>
      p.$error
        ? "0 0 0 3px rgba(248, 113, 113, 0.5)"
        : p.$aiFilled || p.$active
        ? "0 0 0 3px rgba(59, 130, 246, 0.22)"
        : "0 0 0 3px rgba(107, 114, 128, 0.28)"};
  }
`;

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 4px 0;
`;

const CheckboxInput = styled.input`
  width: 14px;
  height: 14px;
`;

const CheckboxLabel = styled.span`
  font-size: 13px;
  color: #e5e7eb;
`;

const PreviewCard = styled.div`
  border-radius: 12px;
  border: 1px solid #1f2937;
  background: #020617;
  padding: 12px 12px 10px;
  font-size: 13px;
  color: #e5e7eb;
`;

const PreviewTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const PreviewSectionTitle = styled.div`
  font-size: 13px;
  font-weight: 500;
  margin-top: 8px;
  margin-bottom: 4px;
  color: #f9fafb;
`;

const PreviewText = styled.div`
  font-size: 12px;
  color: #d1d5db;

  ul {
    padding-left: 18px;
    margin: 0;
  }

  li {
    margin-bottom: 2px;
  }
`;

/* Styled components */

const HandoutsPageOuter = styled.div`
  min-height: 100vh;
  background: #020617;
  color: #e5e7eb;
  padding: 24px;
`;

const HandoutsPageShell = styled.div`
  max-width: 960px;
  margin: 0 auto;
`;

const HandoutsHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
`;

const HandoutsTitle = styled.h1`
  font-size: 22px;
  font-weight: 600;
  color: #f9fafb;
  margin: 0;
`;

const HandoutsSubtitle = styled.p`
  margin: 4px 0 16px;
  font-size: 14px;
  color: #9ca3af;
`;

const HandoutsNewButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #4b5563;
  background: #020617;
  color: #e5e7eb;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease;

  &:hover {
    background: #111827;
    border-color: #6b7280;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const HandoutsListContainer = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HandoutRow = styled.button`
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #020617;
  border: 1px solid #111827;
  cursor: pointer;
  transition: background 0.12s ease, border-color 0.12s ease;

  &:hover {
    background: #030712;
    border-color: #1f2937;
  }
`;

const HandoutRowTexts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const HandoutRowTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #f9fafb;
`;

const HandoutRowMeta = styled.div`
  font-size: 12px;
  color: #9ca3af;
`;

const EmptyStateCard = styled.div`
  margin-top: 24px;
  border-radius: 14px;
  border: 1px dashed #374151;
  padding: 16px 16px 14px;
  background: #020617;
`;

const EmptyStateTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #e5e7eb;
  margin-bottom: 4px;
`;

const EmptyStateText = styled.p`
  font-size: 13px;
  color: #9ca3af;
  margin: 0 0 8px;
`;
