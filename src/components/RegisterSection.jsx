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
  padding: 0rem 2rem;
`;

const CTAGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 2.25rem 0 0rem;
  flex-wrap: wrap;
`;

const CTAButton = styled.button`
  /* light, subtle, unobtrusive */
  --radius: 10px;
  --pad-y: 8px;
  --pad-x: 12px;

  appearance: none;
  border: 1px solid #e2e8f0; /* light border */
  border-radius: var(--radius);
  padding: var(--pad-y) var(--pad-x);
  background: #f7f9fc; /* soft neutral */
  color: #0f1217;
  font-weight: 600;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  white-space: nowrap;
  transition: background 120ms ease, border-color 120ms ease,
    transform 120ms ease;

  min-width: 132px;
  text-align: center;

  &:hover {
    background: #eef2f7; /* slightly darker on hover */
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
