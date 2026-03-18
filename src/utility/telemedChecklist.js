// --- helpers ---
// src/utility/telemedChecklist.js

const isEmpty = (v) => v == null || String(v).trim() === "";
const hasAny = (arr) => Array.isArray(arr) && arr.length > 0;

// Default export (your existing one)
export function getLegalItemStatus(userData = {}, role) {
  const d = userData || {};
  const display = d.role?.display;

  const requiredMissing = [];
  const recommendedMissing = [];

  // required for all
  if (isEmpty(d.firstName)) requiredMissing.push("firstName");
  if (isEmpty(d.lastName)) requiredMissing.push("lastName");
  if (isEmpty(d.phoneNumber)) requiredMissing.push("phoneNumber");
  if (isEmpty(d.address)) requiredMissing.push("address");

  // role-specific required / recommended
  if (role === "Doctor" && display !== "Professional") {
    if (!hasAny(d.licenses)) requiredMissing.push("licenses");
    if (!hasAny(d.insurances)) recommendedMissing.push("insurance");
    if (isEmpty(d.telemedicinePhotoURL))
      requiredMissing.push("telemedicinePhotoURL");
    if (isEmpty(d.signatureUrl)) recommendedMissing.push("signature");
  } else if (role === "Doctor" && display === "Professional") {
    if (!hasAny(d.professionalBusinesses)) {
      requiredMissing.push("professionalBusinesses");
    }
  } else if (role === "Client") {
    // optional: recommended items for clients
    if (isEmpty(d.homeClinicName)) recommendedMissing.push("homeClinic");
  }

  return {
    requiredMissing,
    recommendedMissing,
    isComplete: requiredMissing.length === 0,
  };
}

// NEW: Public Profile status
export function getPublicProfileStatus(userData = {}, role) {
  const d = userData || {};
  const requiredMissing = [];
  const recommendedMissing = [];

  // Mirrors your TelemedPublicEditScreen validations
  if (role === "Doctor" || role === "LicensedTech") {
    if (isEmpty(d.about)) requiredMissing.push("about");
    if (isEmpty(d.photoURL)) requiredMissing.push("photoURL"); // photo required
    if (!hasAny(d.animalsTreated)) requiredMissing.push("animalsTreated");
    if (!hasAny(d.languages)) requiredMissing.push("languages");
    if (!hasAny(d.interests)) requiredMissing.push("interests");
    // specialties are nice-to-have
    // if (!hasAny(d.specialties)) recommendedMissing.push("specialties");
  }

  return {
    requiredMissing,
    recommendedMissing,
    isComplete: requiredMissing.length === 0,
  };
}

export function getRateStatus(userData = {}, role) {
  const d = userData || {};
  const requiredMissing = [];
  const recommendedMissing = [];

  if (role !== "Doctor") {
    return { requiredMissing, recommendedMissing, isComplete: true };
  }

  // Prefer cents; fallback to legacy dollars if present
  let vetRateCents = Number.isInteger(d.rate_cents) ? d.rate_cents : null;
  if (!vetRateCents && Number.isFinite(Number(d.rate))) {
    vetRateCents = Math.round(Number(d.rate) * 100);
  }

  const vetRateDollars = vetRateCents ? vetRateCents / 100 : 0;

  if (!vetRateCents || vetRateDollars < 50 || vetRateDollars > 320) {
    // Use 'rate' as the user-facing missing key (maps to "Rate ($50–$320)")
    requiredMissing.push("rate");
  }

  // Optional: we recommend having an explicit default split saved
  const bps = d.default_split_bps || {};
  if (
    !Number.isInteger(bps.vet) ||
    !Number.isInteger(bps.platform) ||
    bps.vet + bps.platform !== 10000
  ) {
    recommendedMissing.push("default_split_bps");
  }

  return {
    requiredMissing,
    recommendedMissing,
    isComplete: requiredMissing.length === 0,
  };
}

export function getNoticeTimeStatus(userData = {}, role) {
  const d = userData || {};
  const requiredMissing = [];
  const recommendedMissing = [];

  // Only applies to Doctors
  if (role !== "Doctor") {
    return { requiredMissing, recommendedMissing, isComplete: true };
  }

  // Allowed values should mirror SetNoticeTimeScreen
  const allowed = [15, 30, 45, 60, 120, 180, 240, 300, 360, 720];

  const v = Number(d.noticeTime);
  if (!allowed.includes(v)) {
    requiredMissing.push("noticeTime");
  }

  return {
    requiredMissing,
    recommendedMissing,
    isComplete: requiredMissing.length === 0,
  };
}

export function getFollowUpFeeStatus(userData = {}, role) {
  const d = userData || {};
  const requiredMissing = [];
  const recommendedMissing = [];

  if (role !== "Doctor") {
    return { requiredMissing, recommendedMissing, isComplete: true };
  }

  // cents-first (fallback to legacy dollars if needed)
  let feeCents = Number.isInteger(d.followUpQuestionFee_cents)
    ? d.followUpQuestionFee_cents
    : null;

  if (!feeCents && Number.isFinite(Number(d.followUpQuestionFee))) {
    feeCents = Math.round(Number(d.followUpQuestionFee) * 100);
  }

  // Required: must be set (>= 0 allowed)
  if (!Number.isInteger(feeCents) || feeCents < 0) {
    requiredMissing.push("followUpQuestionFee");
  }

  // Optional recommendation: have an explicit default split saved
  const bps = d.default_split_bps || {};
  if (
    !Number.isInteger(bps.vet) ||
    !Number.isInteger(bps.platform) ||
    bps.vet + bps.platform !== 10000
  ) {
    recommendedMissing.push("default_split_bps");
  }

  return {
    requiredMissing,
    recommendedMissing,
    isComplete: requiredMissing.length === 0,
  };
}

export function getFollowUpWindowStatus(userData = {}, role) {
  const d = userData || {};
  const requiredMissing = [];
  const recommendedMissing = [];

  if (role !== "Doctor") {
    return { requiredMissing, recommendedMissing, isComplete: true };
  }

  // Must match your UI options
  const allowed = [24, 48, 72, 96];
  const v = Number(d.freeSubmissionPeriod);

  if (!allowed.includes(v)) {
    requiredMissing.push("freeSubmissionPeriod");
  }

  return {
    requiredMissing,
    recommendedMissing,
    isComplete: requiredMissing.length === 0,
  };
}

// Require EULA for Doctors
export function getProviderEulaStatus(userData = {}, role) {
  const d = userData || {};
  const requiredMissing = [];
  const recommendedMissing = [];

  if (role !== "Doctor") {
    return { requiredMissing, recommendedMissing, isComplete: true };
  }

  // accept either a simple flag or object (forward compat)
  const accepted =
    d.providerEulaAccepted === true ||
    (d.providerEula && d.providerEula.accepted === true);

  if (!accepted) requiredMissing.push("providerEula");
  return {
    requiredMissing,
    recommendedMissing,
    isComplete: requiredMissing.length === 0,
  };
}

// Require EULA for Clients
export function getClientEulaStatus(userData = {}, role) {
  const d = userData || {};
  const requiredMissing = [];
  const recommendedMissing = [];

  if (role !== "Client") {
    return { requiredMissing, recommendedMissing, isComplete: true };
  }

  const accepted =
    d.clientEulaAccepted === true ||
    (d.clientEula && d.clientEula.accepted === true);

  if (!accepted) requiredMissing.push("clientEula");

  return {
    requiredMissing,
    recommendedMissing,
    isComplete: requiredMissing.length === 0,
  };
}

// Require EULA for Organizations (Hospitals)
export function getHospitalEulaStatus(userData = {}, role) {
  const d = userData || {};
  const requiredMissing = [];
  const recommendedMissing = [];

  if (role !== "Organization") {
    return { requiredMissing, recommendedMissing, isComplete: true };
  }

  const accepted =
    d.hospitalEulaAccepted === true ||
    (d.hospitalEula && d.hospitalEula.accepted === true);

  if (!accepted) requiredMissing.push("hospitalEula");

  return {
    requiredMissing,
    recommendedMissing,
    isComplete: requiredMissing.length === 0,
  };
}

// Put this below the other exports (so it can call them)
export function getAvailabilityPrereqsStatus(userData = {}, role) {
  // If not a Doctor, availability prereqs are considered satisfied
  if (role !== "Doctor") {
    return { requiredMissing: [], recommendedMissing: [], isComplete: true };
  }

  const checks = [
    getLegalItemStatus(userData, role),
    getPublicProfileStatus(userData, role),
    getRateStatus(userData, role),
    getNoticeTimeStatus(userData, role),
    getFollowUpFeeStatus(userData, role),
    getFollowUpWindowStatus(userData, role),
    getProviderEulaStatus(userData, role), // ← add this
  ];

  const requiredMissing = Array.from(
    new Set(checks.flatMap((s) => s.requiredMissing)),
  );
  const recommendedMissing = Array.from(
    new Set(checks.flatMap((s) => s.recommendedMissing)),
  );

  return {
    requiredMissing,
    recommendedMissing,
    isComplete: requiredMissing.length === 0,
  };
}

// Gate booking for Clients
export function getClientBookingPrereqsStatus(userData = {}, role) {
  // Non-clients are always considered OK for this gate.
  if (role !== "Client") {
    return { requiredMissing: [], recommendedMissing: [], isComplete: true };
  }

  // Reuse existing checks that matter for booking
  const checks = [
    getLegalItemStatus(userData, role), // requires: firstName, lastName, phoneNumber, address
    getClientEulaStatus(userData, role), // requires: clientEula acceptance
  ];

  const requiredMissing = Array.from(
    new Set(checks.flatMap((s) => s.requiredMissing)),
  );
  const recommendedMissing = Array.from(
    new Set(checks.flatMap((s) => s.recommendedMissing)),
  );

  return {
    requiredMissing,
    recommendedMissing,
    isComplete: requiredMissing.length === 0,
  };
}

// Gate organization features for role === "Organization"
export function getHospitalPrereqsStatus(userData = {}, role) {
  if (role !== "Organization") {
    return { requiredMissing: [], recommendedMissing: [], isComplete: true };
  }

  const email = String(userData?.email || "")
    .trim()
    .toLowerCase();
  const skipLegal = email.startsWith("clinic");

  const checks = [
    // Skip legal profile if email starts with "clinic"
    ...(skipLegal ? [] : [getLegalItemStatus(userData, role)]),
    getHospitalEulaStatus(userData, role), // requires: hospitalEula accepted
    // TODO: add more org checks here later (e.g., org profile, billing)
  ];

  const requiredMissing = Array.from(
    new Set(checks.flatMap((s) => s.requiredMissing)),
  );
  const recommendedMissing = Array.from(
    new Set(checks.flatMap((s) => s.recommendedMissing)),
  );

  return {
    requiredMissing,
    recommendedMissing,
    isComplete: requiredMissing.length === 0,
  };
}
