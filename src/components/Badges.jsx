// src/components/Badges.jsx
import React from "react";
import styled from "styled-components";
import { MdVerified } from "react-icons/md";
import colors from "../config/colors";

function BadgeIcon({ color }) {
  return (
    <BadgeWrap>
      <MdVerified size={16} color={color} />
    </BadgeWrap>
  );
}

export function ProfessionalBadges() {
  return <BadgeIcon color={colors.softgreen} />;
}

export function SpecialistBadges() {
  return <BadgeIcon color={colors.lighterPurple} />;
}

export function GeneralPracticeBadges() {
  return <BadgeIcon color={colors.tint} />;
}

export function PremiumBadges() {
  return <BadgeIcon color={colors.softdarkblue} />;
}

export function OrgBadges() {
  return <BadgeIcon color={colors.grey} />;
}

export function LicensedTechBadges() {
  return <BadgeIcon color={colors.green} />;
}

export function ClinicBadges() {
  return <BadgeIcon color={colors.grey} />;
}

export function TechBadges() {
  return <BadgeIcon color={colors.medium} />;
}

export function BasicBadges() {
  return <BadgeIcon color="grey" />;
}

export function PremiumTestBadges() {
  return <BadgeIcon color={colors.softdarkblue} />;
}

export function ClientBadges() {
  return <BadgeIcon color="blue" />;
}

const BadgeWrap = styled.div`
  border-radius: 15px;
  width: 20px;
  height: 20px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;
