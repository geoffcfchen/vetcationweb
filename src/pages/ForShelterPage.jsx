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
      <GetStartedCallout qrCodeLink={qrCodeImage} />
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </SiteShell>
  );
}

export default ForShelterPage;
