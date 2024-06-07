import React from "react";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import GetStartedCallout from "../components/GetStartedCallout";
import StayConnected from "../components/StayConnected";

function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <GetStartedCallout />
      <StayConnected />
    </>
  );
}

export default HomePage;
