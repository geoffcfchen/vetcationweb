// components/ComplianceVettedBanner.jsx
import React from "react";
import styled from "styled-components";
import { FaShieldAlt, FaCheckCircle } from "react-icons/fa";

const Banner = styled.section`
  --bg: #101315;
  --border: #1f2a35;
  --text: #e6f0f3;
  --muted: #9fb3c8;

  display: grid;
  grid-template-columns: auto 1fr;
  gap: 14px;
  align-items: center;

  background: linear-gradient(180deg, #0c0f12, #0e1317);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px 16px;
  color: var(--text);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.02) inset,
    0 10px 24px rgba(10, 15, 20, 0.35);
`;

const Badge = styled.div`
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: radial-gradient(100% 100% at 0% 0%, #123, #0a1822);
  border: 1px solid #1f2a35;

  svg {
    width: 22px;
    height: 22px;
    color: #4d9fec; /* modern blue accent */
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 15px;
`;

const CheckIcon = styled(FaCheckCircle)`
  width: 16px;
  height: 16px;
  color: #46d49f; /* subtle green for “verified” */
`;

const Sub = styled.p`
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.4;
`;

export default function ComplianceVettedBanner() {
  return (
    <Banner aria-label="Compliance review verification">
      <Badge>
        <FaShieldAlt aria-hidden />
      </Badge>
      <div>
        <TitleRow>
          <span>Compliance vetted</span>
          <CheckIcon aria-hidden />
        </TitleRow>
        <Sub>
          By <strong>Bonnie L. Lutz</strong> — defended 500+ veterinarians
          before the Veterinary Medical Board; general counsel to numerous
          humane societies across California.
        </Sub>
      </div>
    </Banner>
  );
}
