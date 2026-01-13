// src/handouts/diabetesFormModel.js
import {
  DEFAULT_FELINE_REMISSION_NOTE,
  buildCatMealInsulinNote,
  buildCatCannedDietNote,
  buildFeedingLine2,
  buildFeedingLine3,
  buildFeedingLine4,
  buildFeedingLine5,
  buildFeedingLine6,
  buildFeedingLine7,
  buildHomeEncouragement1,
  buildHomeEncouragement2,
  buildDefaultHopeNote,
  buildFeedingLine1,
} from "./diabetesTextBuilders";

export const EMPTY_DIABETES_FORM = {
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

export function buildFormFromDoc(data) {
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
  if (merged.feedingInclude1 && !merged.feeding1Text.trim()) {
    merged.feeding1Text = buildFeedingLine1(merged);
  }
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

export function validateDiabetesForm(form) {
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

export function formToFirestore(form) {
  // For now we just store the flat structure as formData
  return { ...form };
}

export function deriveHandoutTitle(form) {
  const pet = form.petName.trim();
  if (pet) {
    return `${pet} - diabetes discharge`;
  }
  return "Diabetes discharge handout";
}
