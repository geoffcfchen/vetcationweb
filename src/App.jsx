import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Header from "./components/Header";
// import HeroSection from "./components/HeroSection";
// import FeaturesSection from "./components/FeaturesSection";
import RegisterPage from "./pages/RegisterPage";
import "bootstrap/dist/css/bootstrap.min.css";
import GlobalStyle from "./GlobalStyle";

import RedirectPage from "./pages/RedirectPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import SMSTermsPage from "./pages/SMSTermsPage";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <>
      <GlobalStyle />
      {/* <Header /> */}
      {/* <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <GetStartedCallout />
      <StayConnected /> */}
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        {/* <Route path="/" element={<LoginPage />} /> */}
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
        {/* <Route path="/vets" element={<ForVetPage />} />
        <Route path="/clients" element={<HomePage />} />
        <Route path="/clinics" element={<ForClinicPage />} /> */}
        {/* <Route path="/register" element={<RegisterPage />} /> */}
        <Route path="/redirect" element={<RedirectPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/SMSTerms" element={<SMSTermsPage />} />
      </Routes>
      {/* <GetStartedCallout /> */}
      {/* <StayConnected /> */}

      {/* More Features as needed */}
    </>
  );
}

export default App;
