import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Feature from "./Feature";
import qrCodeImage from "../images/qrcode6.png";
import wordpress1Webp from "../images/wordpress1.webp";
import wordpress1Png from "../images/wordpress1@2x.png";
import { MdShield } from "react-icons/md";

const FeaturesContainer = styled.section`
  max-width: 1140px;
  margin: 0 auto;
  padding: 0rem 2rem;
`;

const CTAGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 equal columns on wide screens */
  gap: 10px;
  margin: 2.25rem auto 0;
  max-width: 600px;
  width: 100%;

  /* Downshift to 2 columns and stay there */
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    max-width: 480px; /* optional: adjust as you like */
  }
  /* Removed the 1-column breakpoint */
`;

const CTAButton = styled.button`
  --radius: 10px;
  --pad-y: 10px;
  --pad-x: 12px;

  appearance: none;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius);
  padding: var(--pad-y) var(--pad-x);
  background: #f7f9fc;
  color: #0f1217;
  font-weight: 600;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease,
    transform 120ms ease;

  /* Make each button fill its grid cell equally */
  width: 100%;
  justify-self: stretch;

  /* Nice centering for text + (optional) icon */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: #eef2f7;
    border-color: #cbd5e1;
    transform: translateY(-0.5px);
  }
  &:active {
    transform: translateY(0);
  }
  &:focus-visible {
    outline: 2px solid #9ec1ff;
    outline-offset: 2px;
  }
`;
const ComplianceButton = styled(CTAButton)`
  border-color: #1cd0b0;
  background: #f7fcfb; /* tiny green tint */
  &:hover {
    background: #effaf7;
    border-color: #12b89a;
  }
  &:focus-visible {
    outline: 2px solid #7be8d3; /* accessible focus ring in same family */
    outline-offset: 2px;
  }
`;

function RegisterSection() {
  const navigate = useNavigate();

  return (
    <FeaturesContainer>
      {/* Top-centered, subtle CTA row */}
      <CTAGroup aria-label="Audience quick links">
        <CTAButton
          onClick={() => navigate("/telemedicine-info/home/introToVetcation")}
          aria-label="For Vets"
        >
          For Vets
        </CTAButton>

        <CTAButton
          onClick={() =>
            navigate("/telemedicine-info/clinics/clinicIntroToVetcation")
          }
          aria-label="For Hospitals"
        >
          For Hospitals
        </CTAButton>

        <CTAButton
          onClick={() =>
            navigate("/telemedicine-info/corporations/corpIntroToVetcation")
          }
          aria-label="For Corporations"
        >
          For Corporations
        </CTAButton>
        <ComplianceButton
          onClick={() => navigate("/telemedicine-info/home/Bill1399")}
          aria-label="Compliance"
        >
          <MdShield style={{ marginRight: 6 }} aria-hidden="true" />
          Compliance
        </ComplianceButton>
      </CTAGroup>

      {/* Hero/content below */}
      <Feature
        heading="Vetcation"
        text="The professional community where veterinarians and pet owners connect and build lasting relationships."
        // to="/telemedicine-info"
        qrCodeLink={qrCodeImage}
        image={{
          webp: wordpress1Webp,
          webp2x: wordpress1Webp,
          png: wordpress1Png,
          png2x: wordpress1Png,
        }}
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/IMG_7383_compressed.png?alt=media&token=4f4cc1eb-073b-4a46-acba-1dedd89943ad"
      />
    </FeaturesContainer>
  );
}

export default RegisterSection;
