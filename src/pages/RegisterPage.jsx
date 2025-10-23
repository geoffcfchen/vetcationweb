import React from "react";
import styled from "styled-components";
import RegisterSection from "../components/RegisterSection";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ClinicsMapSection from "../components/ClinicsMapSection";

function RegisterPage() {
  return (
    <>
      <Header />
      <RegisterSection />
      {/* Full-screen map section */}
      <ClinicsMapSection
        initialCenter={{ lat: 34.0195, lng: -118.4912 }} // set a sensible default
        initialZoom={13}
        centerLabel="Selected area"
      />
      <Footer />
    </>
  );
}

export default RegisterPage;
