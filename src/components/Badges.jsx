// src/components/Badges.jsx
import React from "react";
import styled from "styled-components";
import {
  FaStethoscope,
  FaUserNurse,
  FaCheck,
  FaClinicMedical,
  FaCircle,
} from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import colors from "../config/colors";

export function GeneralPracticeBadges() {
  return (
    <Badge>
      <FaCircle size={15} color={colors.tint} />
      <FiSun size={18} color={colors.tint} style={{ position: "absolute" }} />
      <FaStethoscope
        size={8}
        color="white"
        style={{ position: "absolute", marginTop: "2px" }}
      />
    </Badge>
  );
}

export function LicensedTechBadges() {
  return (
    <Badge>
      <FaCircle size={15} color={colors.green} />
      <FiSun size={18} color={colors.green} style={{ position: "absolute" }} />
      <FaUserNurse
        size={9}
        color="white"
        style={{ position: "absolute", marginTop: "0px" }}
      />
    </Badge>
  );
}

export function TechBadges() {
  return (
    <Badge>
      <FaCircle size={15} color={colors.medium} />
      <FiSun size={18} color={colors.medium} style={{ position: "absolute" }} />
      <FaUserNurse
        size={9}
        color="white"
        style={{ position: "absolute", marginTop: "0px" }}
      />
    </Badge>
  );
}

export function PremiumBadges() {
  return (
    <Badge>
      <FaCircle size={15} color={colors.softdarkblue} />
      <FiSun
        size={18}
        color={colors.softdarkblue}
        style={{ position: "absolute" }}
      />
      <FaCheck
        size={9}
        color="white"
        style={{ position: "absolute", marginTop: "0px" }}
      />
    </Badge>
  );
}

export function PremiumTestBadges() {
  return (
    <Badge>
      <FaCircle size={15} color={colors.softdarkblue} />
      <FiSun
        size={18}
        color={colors.softdarkblue}
        style={{ position: "absolute" }}
      />
      <FaCheck
        size={9}
        color="lightgrey"
        style={{ position: "absolute", marginTop: "0px" }}
      />
    </Badge>
  );
}

const Badge = styled.div`
  position: relative;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
