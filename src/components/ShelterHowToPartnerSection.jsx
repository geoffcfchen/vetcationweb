// src/components/ShelterHowToPartnerSection.jsx
import React from "react";
import styled from "styled-components";
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

function ShelterHowToPartnerSection() {
  return (
    <FeaturesContainer>
      <SectionHeader>
        <Eyebrow>How telehealth partnerships work</Eyebrow>
        <Headline>
          Two simple steps to offer post-adoption telehealth support
        </Headline>
        <Subhead>
          MyPet Health makes it easy for shelters to offer post-adoption
          telehealth support. Claim your organization, then partner with remote
          veterinarians who are excited to support your adopters.
        </Subhead>
      </SectionHeader>

      <Feature
        heading="Step 1: Claim your organization"
        text={
          <>
            Search for your shelter, rescue, or adoption center on the map and
            select the correct organization. Once claimed, your team can manage
            your profile and start setting up post-adoption support under your
            brand.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreenshot%202026-03-30%20at%209.35.57%E2%80%AFPM.webp?alt=media&token=05834873-b587-4771-9e37-8f08d5209ef0"
        headerFontSize={26}
        mediaVariant="desktop"
        variant="process"
        spacing="compact"
      />

      <Feature
        heading="Step 2: Partner with remote veterinarians"
        text={
          <>
            Open your Partnership Hub to discover veterinarians who want to work
            with shelters. You can review open partners, choose who fits your
            organization, and start building a trusted post-adoption telehealth
            network for adopters.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreenshot%202026-03-30%20at%209.43.33%E2%80%AFPM.webp?alt=media&token=0386e537-9a99-4449-88b2-1dbc9e5205e6"
        headerFontSize={26}
        mediaVariant="desktop"
        variant="process"
        spacing="compact"
      />
      <Feature
        heading="What adopters do next"
        text={
          <>
            After adoption, adopters can add your shelter or rescue as their
            adoption organization in MyPet Health. This helps them see which
            veterinarians are partnered with your organization and makes it
            easier to get follow-up support after they go home.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_2103.webp?alt=media&token=b7bfd108-967d-4544-9192-86dd6b048b39"
        headerFontSize={36}
      />
      <Feature
        heading="How adopters get support"
        text={
          <>
            Once connected to your organization, adopters can view your
            shelter-partnered veterinarians, message them for follow-up support,
            book virtual appointments, and get trusted post-adoption telehealth
            care. When appropriate, they can also have medications sent directly
            to their home.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_2101.webp?alt=media&token=62da48d7-5053-4070-aaff-198bec1e6264"
        headerFontSize={36}
      />
    </FeaturesContainer>
  );
}

export default ShelterHowToPartnerSection;
