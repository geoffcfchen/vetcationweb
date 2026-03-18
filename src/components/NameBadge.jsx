// src/components/NameBadge.jsx
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaClinicMedical } from "react-icons/fa";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

import checkUserBRole from "../utility/checkUserBRole";
import TruncateText from "../utility/TruncateText";
import colors from "../config/colors";
import { firestore } from "../lib/firebase";

import {
  GeneralPracticeBadges,
  LicensedTechBadges,
  OrgBadges,
  PremiumBadges,
  PremiumTestBadges,
  TechBadges,
  SpecialistBadges,
  ProfessionalBadges,
} from "./Badges";
import { getBadgeEligibility } from "../utility/badgeEligibility";

function buildAnonymousLabel(userLike) {
  const uid = userLike?.uid || "";

  if (!uid) return "Anonymous";

  const digitsOnly = uid.replace(/\D/g, "");
  if (digitsOnly.length >= 3) {
    return "Anonymous";
  }

  let hash = 0;
  for (let i = 0; i < uid.length; i++) {
    hash = (hash * 31 + uid.charCodeAt(i)) >>> 0;
  }

  return "Anonymous";
}

export default function NameBadge({
  userBData,
  style,
  nameFontSize = "14px",
  withName = true,
  withBadge = true,
  withOrg = true,
  maxLength = 18,
  nameMaxLines = 1,
  canNavigate = false,
  onPress,
  isAnonymous = false,
}) {
  const navigate = useNavigate();

  const [organizationPhotoURL, setOrganizationPhotoURL] = useState(null);
  const [freshUser, setFreshUser] = useState(null);

  function handlePress() {
    if (isAnonymous) return;

    if (onPress) {
      onPress(userBData);
      return;
    }

    if (!canNavigate) return;

    // navigate("/profile-info", { state: { ProfileUser: upToDateUserBData } });
  }

  useEffect(() => {
    if (!userBData?.uid || isAnonymous) {
      setFreshUser(null);
      return;
    }

    const ref = doc(firestore, "customers", userBData.uid);

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setFreshUser({ uid: snap.id, ...snap.data() });
        }
      },
      (err) => {
        console.error("NameBadge: user snapshot error", err);
        setFreshUser(null);
      },
    );

    return () => unsub();
  }, [userBData?.uid, isAnonymous]);

  const upToDateUserBData = freshUser || userBData;

  const userBRole = isAnonymous ? null : checkUserBRole(upToDateUserBData);

  let eligibility = {
    hasAnyLicense: false,
    hasActiveLicense: false,
    hasAnySpecialist: false,
    hasActiveVerifiedSpecialist: false,
    proVerified: false,
    showDoctorBadge: false,
    showSpecialistBadge: false,
    showTechBadge: false,
  };

  if (!isAnonymous) {
    eligibility = getBadgeEligibility(upToDateUserBData, {
      userBRole,
      strictSpecialist: false,
    });
  }

  const { proVerified, showDoctorBadge, showSpecialistBadge, showTechBadge } =
    eligibility;

  useEffect(() => {
    let isActive = true;

    const orgIds = isAnonymous ? [] : upToDateUserBData?.organizations || [];

    setOrganizationPhotoURL(null);

    async function fetchOrganizationPhoto() {
      if (!orgIds.length) return;

      try {
        const orgId = orgIds[0];
        const orgRef = doc(firestore, "customers", orgId);
        const orgSnap = await getDoc(orgRef);

        if (!isActive) return;

        if (orgSnap.exists()) {
          const orgData = orgSnap.data() || {};
          setOrganizationPhotoURL(orgData?.photoURL || null);
        } else {
          setOrganizationPhotoURL(null);
        }
      } catch (error) {
        console.error("Error fetching organization data:", error);
        if (isActive) setOrganizationPhotoURL(null);
      }
    }

    fetchOrganizationPhoto();

    return () => {
      isActive = false;
    };
  }, [upToDateUserBData?.uid, upToDateUserBData?.organizations, isAnonymous]);

  const anonymousLabel = useMemo(
    () => buildAnonymousLabel(userBData),
    [userBData?.uid],
  );

  const displayName = isAnonymous
    ? anonymousLabel
    : upToDateUserBData?.displayName || "";

  return (
    <BadgeRow style={style}>
      {withName && (
        <NamePressable
          type="button"
          onClick={handlePress}
          $clickable={canNavigate || !!onPress}
          disabled={isAnonymous || (!canNavigate && !onPress)}
        >
          <NameContainer>
            {nameMaxLines > 1 ? (
              <MultiLineName
                $fontSize={nameFontSize}
                $nameMaxLines={nameMaxLines}
                title={displayName}
              >
                {displayName}
              </MultiLineName>
            ) : (
              <TruncateText
                text={displayName}
                maxLength={maxLength}
                style={{ fontSize: nameFontSize, fontWeight: "bold" }}
              />
            )}
          </NameContainer>
        </NamePressable>
      )}

      {withBadge && !isAnonymous && (
        <BadgeIconWrap>
          {showSpecialistBadge ? (
            <SpecialistBadges />
          ) : (
            showDoctorBadge && <GeneralPracticeBadges />
          )}

          {userBRole === "Doctor" &&
            upToDateUserBData?.role?.display === "Professional" &&
            proVerified && <ProfessionalBadges />}

          {userBRole === "Clinic" && (
            <FaClinicMedical size={14} color={colors.green} />
          )}

          {showTechBadge && <LicensedTechBadges />}
          {userBRole === "Tech" && <TechBadges />}

          {userBRole === "Client" && upToDateUserBData?.badge === "Premium" && (
            <PremiumBadges />
          )}

          {userBRole === "Organization" && <OrgBadges />}

          {upToDateUserBData?.email?.startsWith("client") &&
            userBRole !== "Organization" &&
            (upToDateUserBData?.badge === "" ||
              upToDateUserBData?.badge === undefined) && <PremiumTestBadges />}
        </BadgeIconWrap>
      )}

      {withOrg && !isAnonymous && organizationPhotoURL && (
        <OrgImage
          src={organizationPhotoURL}
          alt="Organization"
          loading="lazy"
        />
      )}
    </BadgeRow>
  );
}

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
`;

const NamePressable = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  cursor: ${(p) => (p.$clickable ? "pointer" : "default")};
`;

const NameContainer = styled.div`
  display: flex;
  align-items: center;
`;

const MultiLineName = styled.div`
  font-weight: bold;
  font-size: ${(p) => p.$fontSize || "14px"};
  margin-right: 2px;
  color: #111827;

  display: -webkit-box;
  -webkit-line-clamp: ${(p) => p.$nameMaxLines || 1};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BadgeIconWrap = styled.div`
  margin-left: 4px;
  margin-right: 2px;
  display: flex;
  align-items: center;
`;

const OrgImage = styled.img`
  width: 18px;
  height: 18px;
  border-radius: 5px;
  margin-right: 3px;
  object-fit: cover;
  display: block;
`;
