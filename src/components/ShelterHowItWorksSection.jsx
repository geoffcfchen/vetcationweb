// src/components/ShelterHowItWorksSection.jsx
import React from "react";
import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";
import Feature from "./Feature";

const FeaturesContainer = styled.section`
  max-width: 1140px;
  margin: 0 auto;

  padding: 3rem 2rem 4rem;
`;

const SectionHeader = styled.div`
  padding: 0 0 1.25rem;
`;

const Eyebrow = styled.div`
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6b7280;
`;

const Headline = styled.h2`
  margin: 10px 0 8px;
  font-size: clamp(24px, 3vw, 32px);
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

const BrandLink = styled(RouterLink)`
  color: #1d4ed8;
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: #1e40af;
  }

  &:focus-visible {
    outline: 2px solid #a9d0ff;
    outline-offset: 2px;
    border-radius: 6px;
  }
`;

function ShelterHowItWorksSection() {
  return (
    <FeaturesContainer>
      <SectionHeader>
        <Eyebrow>How it works for shelters</Eyebrow>
        <Headline>
          Three simple steps to share digital medical records with adopters
        </Headline>
        <Subhead>
          MyPet Health fits seamlessly into your existing workflow. Your team
          can create pet profiles, upload records in minutes, and transfer the
          pet’s profile to the adopter.
        </Subhead>
      </SectionHeader>

      <Feature
        heading="Step 1: Create pet profile from your shelter account"
        text={
          <>
            Your team creates a pet profile in MyPet Health with basic info like
            name, breed, and photo. This profile will hold all the pet&apos;s
            records and be the source of truth for adopters and vets after the
            pet goes home.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreenshot%202026-03-03%20at%2011.29.53%E2%80%AFPM.webp?alt=media&token=1f83e8f3-66cb-4329-8a1a-edcd61fbbfbc"
        headerFontSize={30}
        mediaVariant="desktop"
      />

      <Feature
        heading="Step 2: Upload records before adoption"
        text={
          <>
            Before adoption, staff upload PDFs or photos from your existing
            system. Each pet leaves with a unified digital record instead of
            loose sheets that get lost.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreenshot%202026-03-03%20at%204.02.08%E2%80%AFPM.webp?alt=media&token=7c4c8451-5b1e-49d9-b482-f70f31cf5d73"
        headerFontSize={30}
        mediaVariant="desktop"
      />

      <Feature
        heading="Step 3: Transfer the pet profile to the adopter"
        text={
          <>
            Once adopted, your team can find the adopter on{" "}
            <BrandLink to="/mypet-health/">MyPet Health</BrandLink> and transfer
            the pet&apos;s profile to them in one step. The adopter can upload
            future records and share the history with clinics, ERs, or
            specialists.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreenshot%202026-03-24%20at%201.11.07%E2%80%AFAM.webp?alt=media&token=c67f885b-a5f9-4fa5-8146-f98c046f4c74"
        headerFontSize={30}
        mediaVariant="desktop"
      />
      <Feature
        heading="What adopters get: A lifelong medical record system for their pet"
        text={
          <>
            Adopters receive a complete digital medical record for their pet in{" "}
            <BrandLink to="/mypet-health/">MyPet Health</BrandLink>. All records
            stay in one place, including original documents and clear summaries.
            They can add future visits, upload new records, and share the full
            history with any clinic, ER, or specialist.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreenshot%202026-03-03%20at%204.05.30%E2%80%AFPM.webp?alt=media&token=a0c276c0-fc6b-47a9-b722-600238bbbabb"
        headerFontSize={30}
        mediaVariant="desktop"
      />
    </FeaturesContainer>
  );
}

export default ShelterHowItWorksSection;
