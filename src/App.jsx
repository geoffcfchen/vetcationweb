import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import "bootstrap/dist/css/bootstrap.min.css";
import GlobalStyle from "./GlobalStyle";
import TestimonialsSection from "./components/TestimonialsSection";
import GetStartedCallout from "./components/GetStartedCallout";
import StayConnected from "./components/StayConnected";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import RedirectPage from "./pages/RedirectPage";

function App() {
  return (
    <>
      <GlobalStyle />
      <Header />
      {/* <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <GetStartedCallout />
      <StayConnected /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/vets" element={<VetPage />} /> */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/redirect" element={<RedirectPage />} />
      </Routes>
      <Footer />
      {/* More Features as needed */}
    </>
  );
}

export default App;
