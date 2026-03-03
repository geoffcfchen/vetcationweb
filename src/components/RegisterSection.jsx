import React, { useState } from "react";
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

// NEW
const SectionHeader = styled.div`
  padding: 3.25rem 0 1.25rem;
`;

const Eyebrow = styled.div`
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6b7280;
`;

const Headline = styled.h2`
  margin: 10px 0 8px;
  font-size: clamp(28px, 3.6vw, 45px);
  line-height: 1.2;
  font-weight: 800;
  color: #0f172a;
`;

const Subhead = styled.p`
  margin: 0;
  max-width: 820px;
  font-size: 18px;
  line-height: 1.55;
  color: #334155;
`;

const CTAGroup = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const TogglePill = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* equal width */
  gap: 6px;
  padding: 6px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.06);
  border: 1px solid rgba(15, 23, 42, 0.08);
  min-width: 260px; /* ensures nice width */
`;

const CTAButton = styled.button`
  appearance: none;
  border: 1px solid ${(p) => (p.$active ? "#0f172a" : "transparent")};
  border-radius: 999px;
  padding: 10px 0; /* remove horizontal padding */
  background: ${(p) => (p.$active ? "#0f172a" : "transparent")};
  color: ${(p) => (p.$active ? "#ffffff" : "#0f1217")};
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 120ms ease;

  width: 100%; /* fill grid column */
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(p) => (p.$active ? "#0b1220" : "rgba(15,23,42,0.08)")};
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

const SectionIntro = styled.div`
  padding: 3.5rem 0 0;
`;

const SectionKicker = styled.div`
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6b7280;
  font-weight: 700;
`;

const SectionTitle = styled.h2`
  margin: 10px 0 0;
  font-size: 36px;
  line-height: 1.15;
  font-weight: 800;
  color: #000;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-top: 10px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

function RegisterSection() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("mobile");

  return (
    <FeaturesContainer>
      {/* Top-centered, subtle CTA row */}
      {/* <CTAGroup aria-label="Audience quick links">
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
      </CTAGroup> */}

      {/* Hero/content below */}
      <SectionHeader>
        <Eyebrow>How it works</Eyebrow>
        <Headline>Create a pet record in minutes</Headline>
        <Subhead>
          Upload PDFs, photos, or exports from any clinic, shelter, or ER. We
          organize everything into a vet-ready timeline you can share instantly,
          especially in emergencies.
        </Subhead>
        <CTAGroup aria-label="Choose interface">
          <TogglePill>
            <CTAButton
              type="button"
              $active={viewMode === "mobile"}
              onClick={() => setViewMode("mobile")}
            >
              Mobile
            </CTAButton>
            <CTAButton
              type="button"
              $active={viewMode === "desktop"}
              onClick={() => setViewMode("desktop")}
            >
              Desktop
            </CTAButton>
          </TogglePill>
        </CTAGroup>
      </SectionHeader>

      {viewMode === "mobile" ? (
        <>
          <Feature
            key={`${viewMode}-step1`}
            heading="Step 1: Create your pet"
            text={
              <>
                Start by creating your pet profile. It only takes a minute, and
                it gives you a secure home for your pet’s full medical history,
                ready to share in an emergency.
              </>
            }
            imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_1623_2.webp?alt=media&token=9a908f83-ce0d-40da-9a43-acb6a0087352"
            headerFontSize={30}
          />

          <Feature
            key={`${viewMode}-step2`}
            heading="Step 2: Upload or request records"
            text={
              <>
                Upload what you already have, or send a secure link to your
                clinic to request records. Everything flows into one place
                instead of being scattered across email and portals.
              </>
            }
            imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_1626%202.webp?alt=media&token=e6803fd3-e0cb-4913-95ea-4a568bbf3e6f"
            headerFontSize={30}
          />

          <Feature
            key={`${viewMode}-step3`}
            heading="Step 3: View the timeline"
            text={
              <>
                MyPet Health memorizes visits, diagnoses, treatments, labs, and
                imaging into a clear chronological history. Scroll through your
                pet’s entire medical story in one place instead of opening
                dozens of PDFs.
              </>
            }
            imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_1628.webp?alt=media&token=edc58db6-1252-46ad-9736-a9c0c4b9a787"
            headerFontSize={30}
          />

          <Feature
            key={`${viewMode}-step4`}
            heading="Step 4: Share a vet-ready summary"
            text={
              <>
                Instantly generate a structured summary from your timeline. When
                you visit a new clinic or face an emergency, share a concise,
                organized overview so any vet can understand the situation in
                seconds.
              </>
            }
            imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_1627.webp?alt=media&token=1f2ad88b-2351-425e-a7fc-deb6805f6edd"
            headerFontSize={30}
            linkText={"What vets see when you share"}
            to="/pet-health-record/"
          />
        </>
      ) : (
        <>
          <Feature
            key={`${viewMode}-step1`}
            heading="Step 1: Create your pet"
            text={
              <>
                Create a profile for each pet so every document, note, and lab
                stays organized in one place. Perfect if you manage multiple
                pets or ongoing conditions.
              </>
            }
            // Replace with a desktop screenshot when you have it
            imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2Fvetsummary.webp?alt=media&token=83ed2036-eeea-46a2-a692-8a2ef3c4d4d2"
            headerFontSize={30}
            mediaVariant="desktop"
          />

          <Feature
            key={`${viewMode}-step2`}
            heading="Step 2: Upload records faster on desktop"
            text={
              <>
                Drag-and-drop PDFs and exports from portals, email, or your
                computer. Keep everything centralized instead of scattered
                across folders and inboxes.
              </>
            }
            // Replace with a desktop uploader screenshot when you have it
            imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2Fvetsummary.webp?alt=media&token=83ed2036-eeea-46a2-a692-8a2ef3c4d4d2"
            headerFontSize={30}
            mediaVariant="desktop"
          />

          <Feature
            key={`${viewMode}-step3`}
            heading="Step 3: Review the full timeline"
            text={
              <>
                Get a structured timeline with attachments linked as proof. It
                is easier to compare visits, track labs, and prepare for
                referrals.
              </>
            }
            // Replace with desktop timeline screenshot when you have it
            imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2Fvetsummary.webp?alt=media&token=83ed2036-eeea-46a2-a692-8a2ef3c4d4d2"
            headerFontSize={30}
            mediaVariant="desktop"
          />

          <Feature
            key={`${viewMode}-step4`}
            heading="Step 4: Share a vet-ready summary"
            text={
              <>
                Share one link before an appointment so the clinic can review
                history ahead of time. Reduce repeated questions and help vets
                make decisions faster.
              </>
            }
            imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2Fvetsummary.webp?alt=media&token=83ed2036-eeea-46a2-a692-8a2ef3c4d4d2"
            headerFontSize={30}
            linkText={"What vets see when you share"}
            to="/pet-health-record/"
            mediaVariant="desktop"
          />
        </>
      )}
      {/* <Feature
        heading="Message your vet"
        text={`Message your vet when you need help, and keep everything in one place so they can quickly understand your pet’s history and what other vets have already tried.`}
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_1615.webp?alt=media&token=808eb96e-b65b-48bc-9a04-a501bb04d35a"
        headerFontSize={45}
      /> */}

      {/* <Feature
        heading="Get medications"
        text="Start with messaging so your vet can understand what’s going on. When treatment makes sense, you can schedule a video visit and get medications or refills delivered, where allowed."

        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8432-min.PNG?alt=media&token=b2e4620a-d057-48d1-95e5-1286039fd5ee"
        headerFontSize={45}
      /> */}
      {/* <Feature
        heading="The professional community"
        text="Connect with pet owners and veterinary professionals, share experiences, and learn from real-world questions and answers in a supportive, education-focused community."

        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/IMG_7383_compressed.png?alt=media&token=4f4cc1eb-073b-4a46-acba-1dedd89943ad"
        headerFontSize={45}
      /> */}
      {/* <Feature
        heading="The Radar"
        text="Explore transparent, anonymous clinic insights. Compare real prices, see what pet owners experienced, and understand whether a clinic is privately owned or corporate-owned. Radar helps you choose the right clinic with confidence, not guesswork."
        // to="/radar"
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_1514.webp?alt=media&token=3f9f3f91-e706-4931-9d84-b28f0b7d1823"
        headerFontSize={45}
      /> */}
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
