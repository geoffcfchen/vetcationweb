import { useState } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import "bootstrap/dist/css/bootstrap.min.css";
import GlobalStyle from "./GlobalStyle";
import TestimonialsSection from "./components/TestimonialsSection";
import GetStartedCallout from "./components/GetStartedCallout";
import StayConnected from "./components/StayConnected";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <GlobalStyle />
      <Header />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <GetStartedCallout />
      <StayConnected />
      <Footer />
      {/* More Features as needed */}
    </>
  );
}

export default App;
