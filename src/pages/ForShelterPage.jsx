// src/pages/ForShelterPage.jsx
import React, { useState } from "react";
import styled from "styled-components";
import SiteShell from "../components/SiteShell";
import ShelterHeroSection from "../components/ShelterHeroSection";
import ShelterHowItWorksSection from "../components/ShelterHowItWorksSection";
import GetStartedCallout from "../components/GetStartedCallout";
import qrCodeImage from "../images/qrcode7.png";
import TestimonialsSection from "../components/TestimonialsSection";
import LoginModal from "../components/LoginModal";
import ShelterContactSection from "../components/ShelterContactSection";
import ShelterHighLevelSection from "../components/ShelterHighLevelSection";
import ClinicsMapSection from "../components/ClinicsMapSection";
import { IoLocationOutline, IoShieldCheckmarkSharp } from "react-icons/io5";

const PageShell = styled.main`
  background: #f8fafc;
`;

const MapShell = styled.section`
  background: #f8fafc;
  border-top: 1px solid #eef2f7;
  padding: 32px 0 48px;
`;

const Max = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Eyebrow = styled.div`
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6b7280;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const Title = styled.h2`
  margin: 8px 0 6px;
  /* font-size: clamp(28px, 3.6vw, 32px); */
  font-size: 40px;
  line-height: 1.25;
  font-weight: 600;
  color: #000000;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 22px;
  line-height: 1.45;
  /* color: #475569; */
`;

const Pills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #0f172a;
`;

const LinkRow = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const LinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  text-decoration: none;
  background: #f5f9ff;
  border: 1px solid #4d9fec;
  color: #1e3a8a;

  &:hover {
    background: #eaf3ff;
  }
  &:focus-visible {
    outline: 2px solid #a9d0ff;
    outline-offset: 2px;
  }
`;

const MapCard = styled.div`
  margin-top: 16px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 12px 24px rgba(0, 0, 0, 0.06),
    0 4px 10px rgba(0, 0, 0, 0.04);
  background: #fff;
`;

const FinePrint = styled.p`
  margin: 10px 2px 0;
  font-size: 12px;
  color: #6b7280;
`;

function ForShelterPage() {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <SiteShell>
      <PageShell>
        <ShelterHeroSection onGetStarted={() => setShowLogin(true)} />
        <ShelterHighLevelSection />
        <ShelterHowItWorksSection />
        <MapShell>
          <Max>
            <Eyebrow>
              <IoLocationOutline aria-hidden="true" />
              Find post-adoption support near you
            </Eyebrow>
            <Title>Shelters and rescues offering post-adoption support</Title>
            <Subtitle>
              This interactive map highlights shelters, rescues, and adoption
              centers that help adopters after they bring a pet home, including
              guidance, follow-up resources, and partner support. Drag or zoom
              the map, then tap <strong>“Search this area”</strong> to discover
              more organizations near you.
            </Subtitle>

            <LinkRow>
              <LinkButton href="/post-adoption-support/">
                <IoShieldCheckmarkSharp aria-hidden="true" />
                What is post-adoption support?
              </LinkButton>
            </LinkRow>

            <MapCard>
              <ClinicsMapSection
                height="min(78vh, 780px)"
                initialCenter={{
                  lat: 34.043769864812724,
                  lng: -118.44334602718516,
                }}
                initialZoom={13}
                mode="browse" // default, but explicit is nice
                source="places" // IMPORTANT: do not read from Firestore clinics list
                placesKind="shelter" // use your shelter/adoption filtering + keywords
              />
            </MapCard>

            <FinePrint>
              Telemedicine offerings and requirements are determined by each
              clinic and applicable law. Please check the clinic’s page for
              details.
            </FinePrint>
          </Max>
        </MapShell>
        <TestimonialsSection />
        <ShelterContactSection />
      </PageShell>

      {/* Reuse the same QR callout so shelters can see / share the app */}

      {/* <GetStartedCallout
        qrCodeLink={qrCodeImage}
        heading="Help adopters start a lifelong medical record"
        subheading="Scan to get MyPet Health and give every adopted pet a centralized medical record that can grow over time and be shared with future vets."
        imageAlt="Scan to get started with MyPet Health"
      /> */}
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </SiteShell>
  );
}

export default ForShelterPage;
