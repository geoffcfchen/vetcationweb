import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Feature from "./Feature";
import qrCodeImage from "../images/qrcode6.png";
import wordpress1Webp from "../images/wordpress1.webp";
import wordpress1Png from "../images/wordpress1@2x.png";
import { IoShieldCheckmarkSharp } from "react-icons/io5";

const FeaturesContainer = styled.section`
  max-width: 1140px;
  margin: 0 auto;
  padding: 0rem 2rem;
`;

const CTAGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 equal columns on wide screens */
  gap: 10px;
  margin: 2.25rem auto 0;
  max-width: 800px;
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
  border-color: #4d9fec;
  background: #f5f9ff; /* subtle cool blue tint */

  &:hover {
    background: #eaf3ff; /* slightly deeper tint on hover */
    border-color: #3c91e6; /* darker hover border */
  }

  &:focus-visible {
    outline: 2px solid #a9d0ff; /* soft accessible focus ring */
    outline-offset: 2px;
  }
`;

function RegisterSection() {
  const navigate = useNavigate();

  const PRODUCT_NAME = "MyPet Health";
  const BRAND_FULL = "MyPet Health by Vetcation";

  return (
    <FeaturesContainer>
      {/* Top-centered, subtle CTA row */}
      <CTAGroup aria-label="Audience quick links">
        <CTAButton
          onClick={() =>
            navigate("/telemedicine-info/clients/clientIntroToVetcation/")
          }
          aria-label="For Pet Owners"
        >
          For Pet Owners
        </CTAButton>
        <CTAButton
          onClick={() => navigate("/telemedicine-info/home/introToVetcation/")}
          aria-label="For Vets"
        >
          For Vets
        </CTAButton>

        <CTAButton
          onClick={() =>
            navigate("/telemedicine-info/clinics/clinicIntroToVetcation/")
          }
          aria-label="For Hospitals"
        >
          For Hospitals
        </CTAButton>

        <CTAButton
          onClick={() =>
            navigate("/telemedicine-info/corporations/corpIntroToVetcation/")
          }
          aria-label="For Corporations"
        >
          For Corporations
        </CTAButton>
        <ComplianceButton
          onClick={() => navigate("/telemedicine-info/compliance/Bill1399/")}
          aria-label="Compliance"
        >
          <IoShieldCheckmarkSharp
            style={{ marginRight: 6, color: "#4d9fec" }}
            aria-hidden="true"
          />
          Compliance
        </ComplianceButton>
      </CTAGroup>

      {/* Hero/content below */}
      <Feature
        heading="Universal pet medical records"
        text={
          <>
            <a href="/mypet-health/">MyPet Health</a> pulls your pet’s scattered
            records from any clinic into one secure place and turns them into a
            clear, vet-ready timeline. Share it in one click.
          </>
        }
        linkText={"learn more"}
        linkHref={/universal-pet-medical-records/}
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_1533.webp?alt=media&token=b40a6669-3cfc-48e7-9d89-ba0c779ed6ff"
        headerFontSize={50}
      />

      <Feature
        heading="Message your vet"
        text={`Message your vet when you need help, and keep everything in one place so they can quickly understand your pet’s history and what other vets have already tried.`}
        // to="/telemedicine-info"
        // qrCodeLink={qrCodeImage}
        // image={{
        //   webp: wordpress1Webp,
        //   webp2x: wordpress1Webp,
        //   png: wordpress1Png,
        //   png2x: wordpress1Png,
        // }}
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_1615.webp?alt=media&token=808eb96e-b65b-48bc-9a04-a501bb04d35a"
        headerFontSize={45}
      />

      <Feature
        heading="Get medications"
        text="Start with messaging so your vet can understand what’s going on. When treatment makes sense, you can schedule a video visit and get medications or refills delivered, where allowed."
        // to="/telemedicine-info"
        // qrCodeLink={qrCodeImage}
        // image={{
        //   webp: wordpress1Webp,
        //   webp2x: wordpress1Webp,
        //   png: wordpress1Png,
        //   png2x: wordpress1Png,
        // }}
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8432-min.PNG?alt=media&token=b2e4620a-d057-48d1-95e5-1286039fd5ee"
        headerFontSize={45}
      />
      <Feature
        heading="The professional community"
        text="Connect with pet owners and veterinary professionals, share experiences, and learn from real-world questions and answers in a supportive, education-focused community."
        // to="/telemedicine-info"
        // qrCodeLink={qrCodeImage}
        // image={{
        //   webp: wordpress1Webp,
        //   webp2x: wordpress1Webp,
        //   png: wordpress1Png,
        //   png2x: wordpress1Png,
        // }}
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/IMG_7383_compressed.png?alt=media&token=4f4cc1eb-073b-4a46-acba-1dedd89943ad"
        headerFontSize={45}
      />
      <Feature
        heading="The Radar"
        text="Explore transparent, anonymous clinic insights. Compare real prices, see what pet owners experienced, and understand whether a clinic is privately owned or corporate-owned. Radar helps you choose the right clinic with confidence, not guesswork."
        // to="/radar"
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_1514.webp?alt=media&token=3f9f3f91-e706-4931-9d84-b28f0b7d1823"
        headerFontSize={45}
      />
      {/* <Feature
        heading="Vetcation"
        text="Protect your pet. Pull their medical records into one place. Share in 1 click"
        // to="/telemedicine-info"
        // qrCodeLink={qrCodeImage}
        linkText={"learn more"}
        image={{
          webp: wordpress1Webp,
          webp2x: wordpress1Webp,
          png: wordpress1Png,
          png2x: wordpress1Png,
        }}
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_1491.webp?alt=media&token=3ec63a73-7b12-4f0c-9c4a-fe74644257b5"
      /> */}
    </FeaturesContainer>
  );
}

export default RegisterSection;
