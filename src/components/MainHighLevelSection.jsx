// src/components/MainHighLevelSection.jsx
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

function MainHighLevelSection() {
  return (
    <SectionWrap>
      <Feature
        heading="Keep your pet’s records in one place"
        text={
          <>
            <BrandLink to="/mypet-health/">MyPet Health</BrandLink> helps you
            store your pet’s medical history in one centralized record. Upload
            PDFs or photos from any clinic, then build a lifelong timeline that
            is easy to update and never gets lost.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FChatGPT%20Image%20Mar%2014%2C%202026%2C%2001_14_36%20AM.webp?alt=media&token=a7aab9bb-c561-4c51-abd4-b0625a1279b8"
        headerFontSize={34}
        mediaVariant="highlevel"
      />

      <Feature
        heading="Share with any vet in one link"
        text={
          <>
            Before an appointment, you can share a secure link so your vet, ER,
            or specialist can see the same medical history and the original
            documents. No more digging through email threads or paper folders.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreenshot%202026-03-15%20at%2012.06.50%E2%80%AFAM.webp?alt=media&token=94717607-3cda-41b1-9da1-ec04d9524374"
        headerFontSize={34}
        mediaVariant="highlevel"
      />
      <Feature
        heading="Be ready when it matters most"
        text={
          <>
            In an emergency, you can quickly pull up your pet’s key history and
            share it with the care team. Having the right information fast can
            make a big difference in urgent situations.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FChatGPT%20Image%20Mar%2015%2C%202026%2C%2005_30_14%20PM.webp?alt=media&token=7de3ecab-5616-4df0-95c9-103443191632"
        headerFontSize={34}
        mediaVariant="highlevel"
      />

      <Feature
        heading="Get support from your trusted vet"
        text={
          <>
            You can build personal connections with your trusted vets and reach
            out when questions come up. Your vet can see the full history and
            help you make informed decisions about your pet’s care.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2F26eebb48-01bf-4af9-8bd6-0c779fe989e6%20(1).webp?alt=media&token=7ed0a87b-0f75-4b3b-ac6b-11ab335a2104"
        headerFontSize={34}
        mediaVariant="highlevel"
      />

      <Feature
        heading="Support your favorite shelters"
        text={
          <>
            When you use paid consultations with shelter-partnered vets, you can
            choose to direct part of the platform fee to a shelter you care
            about, at no additional cost. It’s an easy way to support shelters
            while getting trusted care.
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
            MyPet Health works across web, iOS, and Android so you can access
            your pet’s record anywhere. Add new documents, keep the record
            up-to-date, and share it whenever care happens next.
          </>
        }
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2Fdevelop-ios-android-and-web-apps.webp?alt=media&token=55e685e7-d7e8-4e5c-b14b-cb506fa7506f"
        headerFontSize={34}
        mediaVariant="highlevel"
      />
    </SectionWrap>
  );
}

export default MainHighLevelSection;
