// src/handouts/diabetesTextBuilders.js

export const DEFAULT_FELINE_REMISSION_NOTE =
  "Remission can occur in diabetic cats. This means that they no longer require insulin therapy. Your cat has the best chance of remission if you achieve precise blood glucose control within six months of diagnosis, carefully monitor your cat at home, stop any medications that could interfere with the insulin, and use an appropriate insulin in combination with a low-carbohydrate diet.";

export function getPetPronouns(sex) {
  if (sex === "M" || sex === "MN") {
    return { subj: "he", obj: "him", possAdj: "his" };
  }
  if (sex === "F" || sex === "FS") {
    return { subj: "she", obj: "her", possAdj: "her" };
  }
  return { subj: "they", obj: "them", possAdj: "their" };
}

export function unitLabel(unit) {
  return unit === "cans" ? "can(s)" : "cup(s)";
}

export function buildFeedingLine1(form) {
  const p = getPetPronouns(form.sex);
  const foodName = (form.prescribedFood || "").trim() || "________";
  const amount = (form.foodAmount || "").toString().trim() || "___";
  const unit = unitLabel(form.foodAmountUnit);
  const interval = (form.foodIntervalHours || "").toString().trim() || "__";
  return `Feed ${p.obj} ${foodName} ${amount} ${unit} every ${interval} hours.`;
}

export function buildFeedingLine2(form) {
  const p = getPetPronouns(form.sex);
  const pet = (form.petName || "").trim() || "your pet";
  return `Feed ${pet} BEFORE you give ${p.obj} any insulin.`;
}

export function buildFeedingLine3(form) {
  const p = getPetPronouns(form.sex);
  return `Do your best to feed ${p.obj} at the same time every day.`;
}

export function buildFeedingLine4() {
  return "Do not give additional treats, table scraps, or home-cooked meals unless you have discussed this diet with our team.";
}

export function buildFeedingLine5(form) {
  const pet = (form.petName || "").trim() || "your pet";
  return `While ${pet} is currently overweight, we are hopeful that this nutrition plan will help ${pet} slowly lose weight.`;
}

export function buildFeedingLine6(form) {
  const p = getPetPronouns(form.sex);
  return `If ${p.possAdj} appetite changes (increases or decreases), please contact our veterinary team. This may be a sign that ${p.possAdj} diabetes is uncontrolled or that another condition is developing.`;
}

export function buildFeedingLine7(form) {
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

export function buildDiabetesHandoutMarkdown(form) {
  const today = new Date();
  const todayStr = `${String(today.getMonth() + 1).padStart(2, "0")}/${String(
    today.getDate()
  ).padStart(2, "0")}/${today.getFullYear()}`;

  const isFeline = form.species === "feline";
  const petName = (form.petName || "").trim() || "____";
  const clinicName =
    (form.hospitalName || "").trim() || "our veterinary clinic";
  const vetName = (form.attendingVetName || "").trim();

  // Pronouns for exercise text
  let petPronounObject = "them";
  if (form.sex === "F" || form.sex === "FS") {
    petPronounObject = "her";
  } else if (form.sex === "M" || form.sex === "MN") {
    petPronounObject = "him";
  }

  const insulinName =
    form.insulinPrescribed === "Other"
      ? (form.insulinOtherName || "").trim() || "insulin"
      : (form.insulinPrescribed || "").trim() || "insulin";

  let insulinFrequencyLabel = "";
  if (form.insulinFrequency === "q12h")
    insulinFrequencyLabel = "in the morning and evening";
  else if (form.insulinFrequency === "am")
    insulinFrequencyLabel = "in the morning";
  else if (form.insulinFrequency === "pm")
    insulinFrequencyLabel = "in the evening";
  else if (form.insulinFrequency === "q8h")
    insulinFrequencyLabel = "every 8 hours";
  else if (form.insulinFrequency === "q24h")
    insulinFrequencyLabel = "every 24 hours";
  else if (form.insulinFrequency === "other")
    insulinFrequencyLabel = (form.insulinFrequencyOther || "").trim();

  let syringeLine = "";
  if (form.syringeType === "U-40") syringeLine = "Use **U-40** syringes only.";
  else if (form.syringeType === "U-100")
    syringeLine = "Use **U-100** syringes only.";
  else if (form.syringeType === "other") {
    const penDesc =
      (form.syringeOther || "").trim() || "the prescribed insulin pen";
    syringeLine = `Use **${penDesc}** only.`;
  }

  const unitsDisplay = (form.insulinUnits || "").toString().trim() || "___";

  let handlingLine =
    "Store it in the refrigerator. Call us if the insulin changes color or becomes cloudy.";
  if (form.insulinHandling === "shake") {
    handlingLine = `When handling ${insulinName}, be sure to **shake it vigorously** before administering it to ${petName}. Store it in the refrigerator. Call us if the insulin changes color or becomes cloudy.`;
  } else if (form.insulinHandling === "roll") {
    handlingLine = `When handling ${insulinName}, be sure to **roll it gently between your hands** before administering it to ${petName}. Store it in the refrigerator. Call us if the insulin changes color or becomes cloudy.`;
  }

  // NEW: use the array-based helper
  const measureIntakeLines = buildMeasureIntakeLines(form) || [];

  const emergencyHospitalName =
    (form.erHospitalName || "").trim() || "your local emergency hospital";
  const emergencyHospitalPhone =
    (form.erHospitalPhone || "").trim() || "___-___-____";

  const recheckPhrase =
    form.recheckValue && form.recheckUnit
      ? `${form.recheckValue} ${form.recheckUnit}`
      : "a short time";

  const introDoctorLine = vetName
    ? `Dr. ${vetName} would like you to follow these directions until your next recheck appointment in **${
        form.recheckValue || "___"
      } ${form.recheckUnit || "____"}**.`
    : `Dr. __________________ would like you to follow these directions until your next recheck appointment in **${
        form.recheckValue || "___"
      } ${form.recheckUnit || "____"}**.`;

  const feedingItems = [];
  if (form.feedingInclude1)
    feedingItems.push(
      ((form.feeding1Text || "").trim() || buildFeedingLine1(form)).trim()
    );
  if (form.feedingInclude2 && (form.feeding2Text || "").trim())
    feedingItems.push(form.feeding2Text.trim());
  if (form.feedingInclude3 && (form.feeding3Text || "").trim())
    feedingItems.push(form.feeding3Text.trim());
  if (form.feedingInclude4 && (form.feeding4Text || "").trim())
    feedingItems.push(form.feeding4Text.trim());
  if (form.feedingInclude5 && (form.feeding5Text || "").trim())
    feedingItems.push(form.feeding5Text.trim());
  if (form.feedingInclude6 && (form.feeding6Text || "").trim())
    feedingItems.push(form.feeding6Text.trim());
  if (form.feedingInclude7 && (form.feeding7Text || "").trim())
    feedingItems.push(form.feeding7Text.trim());

  const homeBullets = [];

  // NEW: include both monitoring bullets if present
  if (measureIntakeLines.length) {
    measureIntakeLines.forEach((line) => {
      if (line && line.trim()) {
        homeBullets.push(line.trim());
      }
    });
  }

  if (form.advancedBgInclude)
    homeBullets.push(buildAdvancedBgInstructionMarkdown(form));
  if (form.advancedUrineInclude)
    homeBullets.push(buildAdvancedUrineInstructionMarkdown(form));
  if ((form.additionalInstructions || "").trim())
    homeBullets.push((form.additionalInstructions || "").trim());

  const emergencyBullets = [];
  if (form.emergencyHasSeizure) emergencyBullets.push("Has a seizure.");
  if (form.emergencyTremoring) emergencyBullets.push("Tremoring or twitching.");
  if (form.emergencyWeak)
    emergencyBullets.push("Seems weak, spacey, or unusually tired.");
  if (form.emergencyHiding)
    emergencyBullets.push("Hiding for more than 12 hours.");
  if (form.emergencyRefusesFoodWater)
    emergencyBullets.push("Refuses to eat or drink for more than 12 hours.");
  if (form.emergencyDiarrhea)
    emergencyBullets.push("Diarrhea for more than 12 hours.");
  if (form.emergencyVomiting)
    emergencyBullets.push("Vomits more than three times in 12 hours.");
  if (form.emergencyBumpingIntoObjects)
    emergencyBullets.push("Bumping into objects.");
  if (form.emergencyDifficultyWalking)
    emergencyBullets.push("Difficulty walking or jumping.");
  if (form.emergencyMissedInsulinDoses)
    emergencyBullets.push("Missed more than two doses of insulin.");
  if (form.emergencyIncorrectDose)
    emergencyBullets.push("Received an incorrect insulin dose.");
  if ((form.emergencyOther || "").trim())
    emergencyBullets.push(form.emergencyOther.trim());

  const hospitalBlock = [
    (form.hospitalName || "").trim(),
    (form.hospitalAddress || "").trim(),
    (form.hospitalPhone || "").trim()
      ? `Phone: ${(form.hospitalPhone || "").trim()}`
      : "",
  ].filter(Boolean);

  const lines = [];

  // Title
  lines.push(`# Diabetes Discharge Instructions`);
  lines.push(``);
  lines.push(`**Date:** ${todayStr}`);
  lines.push(``);

  // Hospital header (small)
  if (hospitalBlock.length) {
    lines.push(`**${hospitalBlock[0]}**`);
    for (let i = 1; i < hospitalBlock.length; i++) lines.push(hospitalBlock[i]);
    lines.push(``);
  }

  // Greeting
  lines.push(`To ${petName}'s caregivers,`);
  lines.push(``);
  lines.push(
    `You're doing a great job caring for ${petName}. Your veterinary team at ${clinicName} will continue to support you as you manage ${petName}'s diabetes. ${introDoctorLine}`
  );
  lines.push(``);

  // Feline remission notes
  if (isFeline) {
    if (form.includeRemissionNote && (form.remissionNote || "").trim()) {
      lines.push(`> ${(form.remissionNote || "").trim()}`);
      lines.push(``);
    }
    if (form.includeHopeNote && (form.hopeNote || "").trim()) {
      lines.push(`> ${(form.hopeNote || "").trim()}`);
      lines.push(``);
    }
  }

  // Insulin
  lines.push(`## Insulin directions`);
  lines.push(
    `Please give **${petName} ${unitsDisplay} units of ${insulinName} ${
      insulinFrequencyLabel || "_______"
    }**.`
  );
  if (syringeLine) lines.push(syringeLine);
  lines.push(handlingLine);
  lines.push(
    `Do not change this regimen unless you have spoken with a member of our veterinary team.`
  );
  lines.push(``);

  // Feeding
  lines.push(`## Feeding`);
  if (isFeline) {
    if (
      form.includeCatFeedingMealInsulinNote &&
      (form.catFeedingMealInsulinNote || "").trim()
    ) {
      lines.push((form.catFeedingMealInsulinNote || "").trim());
      lines.push(``);
    }
    if (
      form.includeCatCannedDietNote &&
      (form.catCannedDietNote || "").trim()
    ) {
      lines.push((form.catCannedDietNote || "").trim());
      lines.push(``);
    }
  }
  lines.push(`### Feeding instructions`);
  if (feedingItems.length) {
    feedingItems.forEach((t) => {
      lines.push(`- ${t}`);
    });
  } else {
    lines.push(`- ______________________________`);
  }
  lines.push(``);

  // NEW: Exercise
  lines.push(`## Exercise`);
  lines.push(
    `${petName} will benefit from regular, consistent exercise as this can help ${petPronounObject} lose weight and may decrease insulin requirements.`
  );
  lines.push(``);

  // Home monitoring
  if (
    (form.homeEncouragementInclude1 &&
      (form.homeEncouragement1Text || "").trim()) ||
    (form.homeEncouragementInclude2 &&
      (form.homeEncouragement2Text || "").trim()) ||
    homeBullets.length
  ) {
    lines.push(`## Home monitoring`);
    lines.push(
      `Home monitoring is key when caring for a diabetic animal. You are acting as an extension of your veterinary team by taking on these important tasks.`
    );
    lines.push(``);
    if (
      form.homeEncouragementInclude1 &&
      (form.homeEncouragement1Text || "").trim()
    ) {
      lines.push((form.homeEncouragement1Text || "").trim());
      lines.push(``);
    }
    if (
      form.homeEncouragementInclude2 &&
      (form.homeEncouragement2Text || "").trim()
    ) {
      lines.push((form.homeEncouragement2Text || "").trim());
      lines.push(``);
    }

    if (homeBullets.length) {
      homeBullets.forEach((b) => {
        lines.push(`- ${b}`);
      });
      lines.push(``);
    }
  }

  // Emergency
  lines.push(`## Emergency criteria`);
  emergencyBullets.forEach((t) => lines.push(`- ${t}`));
  lines.push(``);
  lines.push(
    `If we are not available and you need help, please contact **${emergencyHospitalName}** at **${emergencyHospitalPhone}**.`
  );
  lines.push(``);
  lines.push(
    `${petName} should be re-evaluated by our veterinary team in **${recheckPhrase}**. If you haven't already, please schedule that appointment right away. Frequent rechecks with our team to fine tune ${petName}'s insulin, diet, and other treatments are critically important.`
  );
  lines.push(``);
  lines.push(
    `We appreciate all the hard work you are pouring into ${petName} and we're honored to be walking alongside you on this journey.`
  );
  lines.push(``);
  lines.push(
    `Please call our hospital at **${
      (form.hospitalPhone || "").trim() || "___-___-____"
    }** with any questions or concerns.`
  );

  return lines.join("\n");
}

export function buildHomeEncouragement1(form) {
  const name = (form.petName || "").trim() || "____";
  const p = getPetPronouns(form.sex);
  return `Initially, home monitoring can be intimidating, but over time, you and ${name} will fall into a sustainable routine. Please reach out if ever you feel overwhelmed by ${p.possAdj} diabetes management.`;
}

export function buildHomeEncouragement2(form) {
  const name = (form.petName || "").trim() || "____";
  return `You have been doing a great job monitoring ${name} at home!`;
}

export function buildMeasureIntakeText(form) {
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

export function buildMeasureIntakeLines(form) {
  const name = (form.petName || "").trim() || "your pet";
  const { possAdj } = getPetPronouns(form.sex);

  // Figure out how often we want them to monitor food/water
  let frequencyText = "";
  if (form.measureFoodWaterFrequency === "twice_daily") {
    frequencyText = "twice daily";
  } else if (form.measureFoodWaterFrequency === "once_daily") {
    frequencyText = "once daily";
  } else if (form.measureFoodWaterFrequency === "other") {
    const other = (form.measureFoodWaterOther || "").trim();
    if (other) {
      frequencyText = other; // e.g. "every evening", "after each meal"
    }
  }

  // If nothing is selected, do not show these bullets
  if (!frequencyText) {
    return [];
  }

  const line1 = `Please monitor ${name}'s food and water intake ${frequencyText} and record it in a diabetic monitoring journal or app. An increase in food or water intake could be a sign that ${name}'s insulin requirements are increasing.`;

  const line2 = `Please measure ${name}'s urine output every day. An increase in urine production could mean that ${possAdj} diabetes is becoming uncontrolled. This includes having accidents outside the litter box or you needing to scoop it more often than usual. This includes having accidents in the house or asking to go outside more often than normal.`;

  return [line1, line2];
}

export function buildCatMealInsulinNote(form) {
  const p = getPetPronouns(form.sex);
  return `It’s best for cats to eat twice a day and receive insulin after each meal. However, if meal feeding isn’t feasible for you, allow ${p.obj} to nibble on food throughout the day.`;
}

export function buildCatCannedDietNote(form) {
  const p = getPetPronouns(form.sex);
  return `Ideally, ${p.subj} should eat canned food since diabetic cats are more successfully treated with high-protein, low-carbohydrate canned diets instead of dry food.`;
}

function buildAdvancedBgInstructionMarkdown(form) {
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

  return [
    mainLine,
    `  - ${samplingLine}`,
    `  - ${rewardLine}`,
    `  - ${videoLine}`,
  ].join("\n");
}

function buildAdvancedUrineInstructionMarkdown(form) {
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

    return [mainLine, `  - ${lowLine}`, `  - ${ketoneLine}`].join("\n");
  }

  const mainLine = `Please test ${name}'s urine for glucose every ${hours} hours.`;
  const lowLine = `If ${p.possAdj} urine is negative for glucose for more than a few days, please contact us as this may mean the blood glucose levels are too low.`;

  return [mainLine, `  - ${lowLine}`].join("\n");
}

export function resolveChoice(main, other, fallback) {
  if (main === "other") {
    const trimmed = (other || "").trim();
    return trimmed || fallback;
  }
  const trimmed = (main || "").trim();
  return trimmed || fallback;
}

export function buildDefaultHopeNote(petName, sex) {
  const name = (petName || "").trim() || "____";
  const p = getPetPronouns(sex);
  return `There is still hope that ${name} will experience remission. Continue to carefully monitor ${p.obj} at home, give insulin as directed, and feed a high-protein, low-carbohydrate diet.`;
}

export function buildActionScheduleRows(form) {
  const rows = [];
  const petName = (form.petName || "your pet").trim();
  const insulinName =
    form.insulinPrescribed === "Other"
      ? (form.insulinOtherName || "").trim() || "insulin"
      : (form.insulinPrescribed || "").trim() || "insulin";

  // 1. Feeding row
  {
    const amount =
      form.foodAmount && form.foodAmount.toString().trim()
        ? `${form.foodAmount} ${unitLabel(form.foodAmountUnit)}`
        : "";
    const foodName = (form.prescribedFood || "").trim();
    let frequency = "As directed";

    if (form.foodIntervalHours === "24") {
      frequency = "Once a day";
    } else if (form.foodIntervalHours) {
      frequency = `Every ${form.foodIntervalHours} hours`;
    }

    if (amount || foodName || form.foodIntervalHours) {
      const detailParts = [];
      if (amount && foodName) {
        detailParts.push(`${amount} of ${foodName}`);
      } else if (amount) {
        detailParts.push(amount);
      } else if (foodName) {
        detailParts.push(foodName);
      }
      detailParts.push("Feed before insulin when possible");
      rows.push({
        task: `Feed ${petName}`,
        frequency,
        details: detailParts.join(". "),
      });
    }
  }

  // 2. Insulin row
  {
    let frequency = "As directed";
    if (form.insulinFrequency === "q12h") frequency = "Morning and evening";
    else if (form.insulinFrequency === "am") frequency = "Every morning";
    else if (form.insulinFrequency === "pm") frequency = "Every evening";
    else if (form.insulinFrequency === "q8h") frequency = "Every 8 hours";
    else if (form.insulinFrequency === "q24h") frequency = "Every 24 hours";
    else if (form.insulinFrequency === "other")
      frequency = (form.insulinFrequencyOther || "").trim() || "As directed";

    const units =
      form.insulinUnits && form.insulinUnits.toString().trim()
        ? form.insulinUnits
        : "___";

    let syringeNote = "";
    if (form.syringeType === "U-40") syringeNote = "Use U-40 syringes only";
    else if (form.syringeType === "U-100")
      syringeNote = "Use U-100 syringes only";
    else if (form.syringeType === "other") {
      const pen = (form.syringeOther || "").trim() || "the insulin pen";
      syringeNote = `Use ${pen} only`;
    }

    let handlingShort = "";
    if (form.insulinHandling === "shake") {
      handlingShort = "Shake the vial before giving insulin";
    } else if (form.insulinHandling === "roll") {
      handlingShort = "Roll the vial gently before giving insulin";
    }

    const detailsParts = [];
    detailsParts.push(`${units} units of ${insulinName}`);
    if (syringeNote) detailsParts.push(syringeNote);
    if (handlingShort) detailsParts.push(handlingShort);

    rows.push({
      task: `Give insulin to ${petName}`,
      frequency,
      details: detailsParts.join(". "),
    });
  }

  // 3. Measure food and water intake
  {
    const line = buildMeasureIntakeText(form);
    if (line) {
      let frequency = "As directed";
      if (form.measureFoodWaterFrequency === "twice_daily") {
        frequency = "Twice daily";
      } else if (form.measureFoodWaterFrequency === "once_daily") {
        frequency = "Once daily";
      } else if (form.measureFoodWaterFrequency === "other") {
        frequency = (form.measureFoodWaterOther || "").trim() || "As directed";
      }

      rows.push({
        task: `Measure food and water for ${petName}`,
        frequency,
        details: line,
      });
    }
  }

  // 4. Advanced blood glucose monitoring
  if (form.advancedBgInclude) {
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

    rows.push({
      task: "Check blood glucose",
      frequency: `Every ${hours} hours (when instructed)`,
      details: `Call the clinic or an emergency hospital if blood glucose is less than ${low} or greater than ${high}.`,
    });
  }

  // 5. Urine monitoring
  if (form.advancedUrineInclude) {
    const hours = resolveChoice(
      form.advancedUrineEveryHours,
      form.advancedUrineEveryHoursOther,
      "24"
    );
    const type =
      form.advancedUrineMode === "glucose_ketones"
        ? "glucose and ketones"
        : "glucose";

    rows.push({
      task: "Check urine",
      frequency: `Every ${hours} hours (when instructed)`,
      details: `Test urine for ${type}. Call the clinic if urine is negative for glucose for several days, or if ketones are present.`,
    });
  }

  // 6. Recheck appointment
  {
    const recheckPhrase =
      form.recheckValue && form.recheckUnit
        ? `${form.recheckValue} ${form.recheckUnit}`
        : "a short time";

    rows.push({
      task: "Recheck visit with the clinic",
      frequency: `In ${recheckPhrase}`,
      details:
        "Please schedule this appointment with the clinic as soon as possible.",
    });
  }

  return rows;
}
