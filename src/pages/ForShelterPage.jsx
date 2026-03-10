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

const PageShell = styled.main`
  background: #f8fafc;
`;

function ForShelterPage() {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <SiteShell>
      <PageShell>
        <ShelterHeroSection onGetStarted={() => setShowLogin(true)} />
        <ShelterHowItWorksSection />
      </PageShell>

      {/* Reuse the same QR callout so shelters can see / share the app */}
      <TestimonialsSection />
      <GetStartedCallout
        qrCodeLink={qrCodeImage}
        heading="Help adopters start a lifelong medical record"
        subheading="Scan to get MyPet Health and give every adopted pet a centralized medical record that can grow over time and be shared with future vets."
        imageAlt="Scan to get started with MyPet Health"
      />
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </SiteShell>
  );
}

export default ForShelterPage;
