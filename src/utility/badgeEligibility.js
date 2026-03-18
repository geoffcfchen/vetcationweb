// src/utility/badgeEligibility.js

const arr = (v) => (Array.isArray(v) ? v : []);

const emailStartsWith = (user, prefix) =>
  typeof user?.email === "string" &&
  user.email.toLowerCase().startsWith(prefix.toLowerCase());

export function getLicenseStatus(user) {
  const licenses = arr(user?.licenses);

  const hasAnyLicense = licenses.length > 0;

  const hasActiveLicense = licenses.some((lic) => {
    const raw = lic?.expirationDate;

    if (!raw) return false;

    const exp = new Date(raw).getTime();
    return Number.isFinite(exp) && exp > Date.now();
  });

  return {
    licenses,
    hasAnyLicense,
    hasActiveLicense,
  };
}

export function getSpecialistStatus(user) {
  const specialtyCerts = arr(user?.specialtyCerts);

  const hasAnySpecialist = specialtyCerts.length > 0;

  const hasActiveVerifiedSpecialist = specialtyCerts.some((cert) => {
    const raw = cert?.expirationDate;
    const exp = raw ? new Date(raw).getTime() : null;
    const notExpired = exp ? exp > Date.now() : true;

    return cert?.status === "verified" && notExpired;
  });

  return {
    specialtyCerts,
    hasAnySpecialist,
    hasActiveVerifiedSpecialist,
  };
}

export function isProfessionalVerified(user) {
  const professionalBusinesses = arr(user?.professionalBusinesses);

  return professionalBusinesses.some(
    (biz) =>
      biz?.status === "verified" &&
      Array.isArray(biz?.credentials) &&
      biz.credentials.length > 0,
  );
}

export function getBadgeEligibility(
  user,
  { userBRole, strictSpecialist = false } = {},
) {
  const roleDisplay = user?.role?.display;

  const { hasAnyLicense, hasActiveLicense } = getLicenseStatus(user);
  const { hasAnySpecialist, hasActiveVerifiedSpecialist } =
    getSpecialistStatus(user);

  const proVerified = isProfessionalVerified(user);

  const doctorEmailHint = emailStartsWith(user, "doctor");
  const techEmailHint = emailStartsWith(user, "tech");

  const showDoctorBadge =
    userBRole === "Doctor" &&
    roleDisplay !== "Professional" &&
    (hasActiveLicense || doctorEmailHint);

  const useStrict = strictSpecialist
    ? hasActiveVerifiedSpecialist
    : hasAnySpecialist;

  const showSpecialistBadge =
    userBRole === "Doctor" &&
    roleDisplay !== "Professional" &&
    useStrict &&
    (hasActiveLicense || doctorEmailHint);

  const showTechBadge =
    userBRole === "LicensedTech" && (hasActiveLicense || techEmailHint);

  const showProfessionalBadge =
    userBRole === "Doctor" && roleDisplay === "Professional" && proVerified;

  return {
    hasAnyLicense,
    hasActiveLicense,
    hasAnySpecialist,
    hasActiveVerifiedSpecialist,
    proVerified,
    showDoctorBadge,
    showSpecialistBadge,
    showTechBadge,
    showProfessionalBadge,
  };
}
