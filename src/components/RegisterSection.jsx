import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Feature from "./Feature";
import qrCodeImage from "../images/qrcode6.png";
import wordpress1Webp from "../images/wordpress1.webp";
import wordpress1Png from "../images/wordpress1@2x.png";

const FeaturesContainer = styled.section`
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 2rem;
  @media (max-width: 420px) {
    padding: 0 0.75rem;
  }
`;

// 2) Row: use a 3-column grid (no wrap)
const CTAGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 0.75rem 0 1rem;
  align-items: center;
  justify-items: stretch;
`;

// 3) Buttons: tighter, no min-width, ellipsis if space is tight
const CTAButton = styled.button`
  --radius: 10px;

  appearance: none;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius);
  padding: 6px 8px; /* tighter padding */
  background: #f7f9fc;
  color: #0f1217;
  font-weight: 600;
  font-size: clamp(11px, 2.6vw, 14px); /* scales down on small screens */
  line-height: 1.1;
  cursor: pointer;
  white-space: nowrap; /* keep on one line */
  overflow: hidden; /* prevent overflow */
  text-overflow: ellipsis; /* add … if needed */
  width: 100%; /* fill grid cell */
  min-width: 0; /* allow shrink inside grid */
  transition: background 120ms ease, border-color 120ms ease;

  &:hover {
    background: #eef2f7;
    border-color: #cbd5e1;
  }
  &:focus-visible {
    outline: 2px solid #9ec1ff;
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
          aria-label="For Clinics"
        >
          For Clinics
        </CTAButton>

        <CTAButton
          onClick={() =>
            navigate("/telemedicine-info/corporations/corpIntroToVetcation")
          }
          aria-label="For Corporations"
        >
          For Corporations
        </CTAButton>
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
