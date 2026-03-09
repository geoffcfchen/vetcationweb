// src/pages/ForShelterPage.jsx
import React from "react";
import styled from "styled-components";
import SiteShell from "../components/SiteShell";
import ShelterHeroSection from "../components/ShelterHeroSection";
import ShelterHowItWorksSection from "../components/ShelterHowItWorksSection";
import GetStartedCallout from "../components/GetStartedCallout";
import qrCodeImage from "../images/qrcode7.png";

const PageShell = styled.main`
  background: #f8fafc;
`;

function ForShelterPage() {
  return (
    <SiteShell>
      <PageShell>
        <ShelterHeroSection />
        <ShelterHowItWorksSection />
      </PageShell>

      {/* Reuse the same QR callout so shelters can see / share the app */}
      <GetStartedCallout qrCodeLink={qrCodeImage} />
    </SiteShell>
  );
}

export default ForShelterPage;
