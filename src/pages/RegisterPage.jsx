// src/pages/RegisterPage.jsx
import React from "react";
import styled from "styled-components";
import RegisterSection from "../components/RegisterSection";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ClinicsMapSection from "../components/ClinicsMapSection";
import { IoLocationOutline, IoShieldCheckmarkSharp } from "react-icons/io5";

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
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06), 0 4px 10px rgba(0, 0, 0, 0.04);
  background: #fff;
`;

const FinePrint = styled.p`
  margin: 10px 2px 0;
  font-size: 12px;
  color: #6b7280;
`;

function RegisterPage() {
  return (
    <>
      <Header />
      <RegisterSection />

      {/* —— Map Section Shell (copy + legend + compliance link) —— */}
      <MapShell>
        <Max>
          <Eyebrow>
            <IoLocationOutline aria-hidden="true" />
            Find a hospital near you
          </Eyebrow>
          <Title>Hospitals offering telemedicine and more</Title>
          <Subtitle>
            This interactive map highlights participating hospitals that provide
            telemedicine services through our community. Drag or zoom the map,
            then tap <strong>“Search this area”</strong> to discover more
            hospitals around you.
          </Subtitle>

          <LinkRow>
            <LinkButton href="/telemedicine-info/compliance/Bill1399/">
              <IoShieldCheckmarkSharp aria-hidden="true" />
              What is telemedicine? (AB 1399)
            </LinkButton>
          </LinkRow>

          <MapCard>
            <ClinicsMapSection
              height="min(78vh, 780px)" // responsive height with a soft cap
              initialCenter={{
                lat: 34.04786158834932,
                lng: -118.21994555902405,
              }} // Downtown LA 34.04786158834932, -118.21994555902405
              initialZoom={13}
            />
          </MapCard>

          <FinePrint>
            Telemedicine offerings and requirements are determined by each
            clinic and applicable law. Please check the clinic’s page for
            details.
          </FinePrint>
        </Max>
      </MapShell>

      <Footer />
    </>
  );
}

export default RegisterPage;
