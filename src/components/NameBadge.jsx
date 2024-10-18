// src/components/NameBadge.jsx
import React from "react";
import styled from "styled-components";
import {
  FaClinicMedical,
  FaUserNurse,
  FaCheck,
  FaStethoscope,
  FaCircle,
} from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import checkUserBRole from "../utility/checkUserBRole";
import TruncateText from "../utility/TruncateText";
import colors from "../config/colors";
import {
  GeneralPracticeBadges,
  LicensedTechBadges,
  PremiumBadges,
  PremiumTestBadges,
  TechBadges,
} from "./Badges";

export default function NameBadge({
  userBData,
  style,
  nameFontSize = "14px",
  withName = true,
  maxLength = 18,
}) {
  const userBRole = checkUserBRole(userBData);

  //   console.log("userBData", userBData.displayName, userBData.badge);
  //   console.log("userBRole", userBRole);

  return (
    <BadgeContainer style={style}>
      {withName && (
        <TruncateText
          text={userBData?.displayName}
          maxLength={maxLength}
          style={{ fontSize: nameFontSize }}
        />
      )}

      <BadgeIconContainer>
        {userBRole === "Doctor" && <GeneralPracticeBadges />}
        {userBRole === "Clinic" && (
          <FaClinicMedical size={14} color={colors.green} />
        )}
        {userBRole === "LicensedTech" && <LicensedTechBadges />}
        {userBRole === "Tech" && <TechBadges />}
        {userBRole === "Client" && userBData.badge === "Premium" && (
          <PremiumBadges />
        )}
        {userBData?.email?.startsWith("client") &&
          (!userBData.badge || userBData.badge === undefined) && (
            <PremiumTestBadges />
          )}
      </BadgeIconContainer>
    </BadgeContainer>
  );
}

const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
`;

const BadgeIconContainer = styled.div`
  margin-left: 5px;
`;
