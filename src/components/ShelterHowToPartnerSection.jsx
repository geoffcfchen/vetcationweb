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
          Three simple steps to offer post-adoption telehealth support
        </Headline>
        <Subhead>
          MyPet Health makes it easy for shelters to offer post-adoption
          telehealth support. Claim your organization, partner with remote
          veterinarians, and help adopters connect to your organization at
          adoption.
        </Subhead>
      </SectionHeader>

      <Feature
        heading="Step 1: Claim your organization during onboarding"
        text={
          <>
            When creating your organization account, your team can search the
            map and claim the correct shelter, rescue, or adoption center. This
            connects your account to the right organization and sets up
            post-adoption support under your brand.
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
        heading="Step 3: Help adopters connect to your organization"
        text={
          <>
            At adoption, your team can help adopters connect their account to
            your shelter or rescue in MyPet Health. This allows them to see your
            shelter-partnered veterinarian and makes post-adoption follow-up
            support easier to access after they go home.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_2103.webp?alt=media&token=b7bfd108-967d-4544-9192-86dd6b048b39"
        headerFontSize={36}
      />
      <Feature
        heading="What support adopters actually get"
        text={
          <>
            Once connected to your organization, adopters are matched with a
            shelter-partnered veterinarian they can message for follow-up
            support or book for virtual appointments. This gives adopters a
            trusted path to post-adoption telehealth care. When appropriate,
            they can also have medications sent directly to their home.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_2105.webp?alt=media&token=6b39bd55-1fd5-4d40-a208-fdfd8e11c68d"
        headerFontSize={36}
      />
      <Feature
        heading="Create a recurring support stream for shelters"
        text={
          <>
            MyPet Health helps shelters stay connected to adopted pets even
            after they go to their new homes. When adopters use paid
            consultations, they can choose to allocate part of the consultation
            to the shelter that helped their pet, with no additional charge.
            This creates ongoing support for shelters as adopters continue using
            the platform for follow-up questions and care.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_1794.webp?alt=media&token=3aab35be-5c80-4e95-80bd-1dfcfcfb2450"
        headerFontSize={36}
      />
    </FeaturesContainer>
  );
}

export default ShelterHowToPartnerSection;
