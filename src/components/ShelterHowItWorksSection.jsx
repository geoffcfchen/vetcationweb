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
  font-size: clamp(28px, 3.6vw, 40px);
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
          Send adopters home with a record, not a stack of paper
        </Headline>
        <Subhead>
          Use MyPet Health to turn intake history, vaccines, spay or neuter
          notes, and follow-up instructions into the first chapter of a pet’s
          universal medical record. Every adopter leaves with a record that is
          easy to keep, share, and build on with their own vet.
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
        heading="Step 2: Upload or attach records at discharge"
        text={
          <>
            At adoption, staff upload PDFs or photos, or attach files from your
            existing system. Each pet leaves with a unified digital record
            instead of loose sheets that get lost in the car.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreenshot%202026-03-03%20at%204.02.08%E2%80%AFPM.webp?alt=media&token=7c4c8451-5b1e-49d9-b482-f70f31cf5d73"
        headerFontSize={30}
        mediaVariant="desktop"
      />

      <Feature
        heading="Step 3: Share with adopters in one link"
        text={
          <>
            The adopter receives a secure link to their pet&apos;s{" "}
            <BrandLink to="/mypet-health/">MyPet Health</BrandLink> record. They
            can add their own vet, upload future records, and share the history
            with clinics, ERs, or specialists.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreenshot%202026-03-03%20at%204.05.30%E2%80%AFPM.webp?alt=media&token=a0c276c0-fc6b-47a9-b722-600238bbbabb"
        headerFontSize={30}
        mediaVariant="desktop"
      />
      <Feature
        key={`step4-4`}
        heading="Vets get a clear summary with source documents attached"
        text={
          <>
            When the adopter shares the pet&apos;s record with a vet, they see a
            clear summary of the pet&apos;s history with references to the
            original records.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreenshot%202026-03-04%20at%2012.43.58%E2%80%AFAM.webp?alt=media&token=8a15b0c3-3062-4567-9e0b-4916b70b16c1"
        headerFontSize={30}
        linkText={"See details of the vet summary"}
        to="/pet-health-record/"
        mediaVariant="desktop"
        clickTarget="cta"
      />

      <Feature
        heading="Extend support beyond the adoption day"
        text={
          <>
            adopters stay connected with shelter-partnered vets after they bring
            their pet home. Every interaction is documented in the pet’s medical
            record so any veterinarian can see the full picture. This creates
            better continuity of care and strengthens the bond between the pet,
            pet parent, and veterinary team.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_1615.webp?alt=media&token=808eb96e-b65b-48bc-9a04-a501bb04d35a"
        headerFontSize={36}
      />
      <Feature
        heading="Create a recurring support stream for shelters"
        text={
          <>
            MyPet Health helps shelter stay connected to adopted pets even after
            they go to their new homes. When adopters use paid consultations
            with partnered vets, they can choose to direct part of the platform
            fee to the shelter that helped their pet, at no additional cost.
            This creates ongoing support for shelter while giving adopters
            trusted follow-up care.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_1794.webp?alt=media&token=3aab35be-5c80-4e95-80bd-1dfcfcfb2450"
        headerFontSize={36}
      />
    </FeaturesContainer>
  );
}

export default ShelterHowItWorksSection;
