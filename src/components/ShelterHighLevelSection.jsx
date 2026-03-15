// src/components/ShelterHighLevelSection.jsx
import React from "react";
import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";
import Feature from "./Feature";

const SectionWrap = styled.section`
  max-width: 1140px;
  margin: 0 auto;
  padding: 3rem 2rem 1rem;
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

const placeholderImage =
  "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreenshot%202026-03-03%20at%204.05.30%E2%80%AFPM.webp?alt=media&token=a0c276c0-fc6b-47a9-b722-600238bbbabb";

function ShelterHighLevelSection() {
  return (
    <SectionWrap>
      {/* <SectionHeader>
        <Eyebrow>What MyPet Health provides</Eyebrow>
        <Headline>
          A universal record system that helps shelters protect pets long after
          adoption
        </Headline>
        <Subhead>
          MyPet Health gives shelters a practical way to launch a lifelong pet
          health record, connect adopters with trusted follow-up support, and
          create stronger continuity of care after pets go home.
        </Subhead>
      </SectionHeader> */}

      <Feature
        heading="Protect pets with a universal medical record"
        text={
          <>
            MyPet Health helps shelters start each pet with a centralized health
            record that can stay with them for life. Instead of sending adopters
            home with paperwork that gets lost, you give them a record they can
            keep, update, and share with future clinics, ER teams, and
            specialists.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FChatGPT%20Image%20Mar%2014%2C%202026%2C%2001_14_36%20AM.webp?alt=media&token=a7aab9bb-c561-4c51-abd4-b0625a1279b8"
        headerFontSize={34}
        mediaVariant="highlevel"
      />

      <Feature
        heading="Build post-adoption vet partnerships"
        text={
          <>
            <BrandLink to="/mypet-health/">MyPet Health</BrandLink> helps
            shelters partner with vets who are excited to support adopted pets
            after they go home. You get a vetted group of shelter-friendly
            providers that adopters can reach out to when questions come up.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreenshot%202026-03-15%20at%2012.06.50%E2%80%AFAM.webp?alt=media&token=94717607-3cda-41b1-9da1-ec04d9524374"
        headerFontSize={34}
        mediaVariant="highlevel"
      />

      <Feature
        heading="Extend support beyond adoption day"
        text={
          <>
            After adopters bring their pet home, they can message
            shelter-partnered vets when questions come up. Each message and
            follow-up is documented in the pet’s medical record so future
            veterinarians can see the full story.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2F26eebb48-01bf-4af9-8bd6-0c779fe989e6%20(1).webp?alt=media&token=7ed0a87b-0f75-4b3b-ac6b-11ab335a2104"
        headerFontSize={34}
        mediaVariant="highlevel"
      />

      <Feature
        heading="Create a new support stream for shelters"
        text={
          <>
            When adopters use paid consultations with shelter-partnered vets,
            they can choose to direct part of the platform fee back to the
            shelter that helped their pet, at no additional cost. This creates
            ongoing support for shelters while also giving adopters trusted
            follow-up care.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2F15847442_012925-wabc-animal-shelter-thank-you-img.webp?alt=media&token=457decb9-b965-437b-b47f-ba75e3f4b998"
        headerFontSize={34}
        mediaVariant="highlevel"
      />

      <Feature
        heading="Available on web, iPhone, and Android"
        text={
          <>
            MyPet Health is designed to be easy for both shelter staff and pet
            parents to use. Records can be viewed and shared from the web, iOS,
            and Android, which makes adoption day simpler and helps the pet’s
            medical record stay accessible wherever care happens next.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2Fdevelop-ios-android-and-web-apps.webp?alt=media&token=55e685e7-d7e8-4e5c-b14b-cb506fa7506f"
        headerFontSize={34}
        mediaVariant="highlevel"
      />
    </SectionWrap>
  );
}

export default ShelterHighLevelSection;
