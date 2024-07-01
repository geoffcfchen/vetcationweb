import React, { useState } from "react";
import styled from "styled-components";
import easyWebp from "../images/easy.webp";
import easyPng from "../images/easy1@2x.png"; // Adjust the path
import fast1Webp from "../images/fast1.webp";
import fast1Png from "../images/fast1@2x.png"; // Adjust the path
import wordpress1Webp from "../images/wordpress1.webp";
import wordpress1Png from "../images/wordpress1@2x.png"; // Adjust the path
import Feature from "./Feature";

const FeaturesContainer = styled.section`
  max-width: 1140px;
  margin: 0 auto;
  padding: 0rem 2rem;
`;

function ClinicFeaturesSection() {
  return (
    <FeaturesContainer>
      <header
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100px",
          marginTop: "50px",
        }}
      >
        <h2>
          Streamlining Clinic Operations with Advanced Communication Tools
        </h2>
      </header>
      <Feature
        iconId="clock" // Use the ID of the icon from the sprite
        heading="Manage your clinic with ease"
        text="Our system is designed to help you manage your vet staff with ease. They will have badges to show their clients that they are the vet staffs from your clinic."
        // linkText="Learn More"
        linkHref="#"
        image={{
          webp: fast1Webp,
          webp2x: fast1Webp,
          png: fast1Png,
          png2x: fast1Png,
        }}
        videoSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/videos%2FRPReplay_Final1719429784.MP4?alt=media&token=63b3a05f-b90b-44f0-9b3f-d8f11cb490f4"
      />
      <Feature
        iconId="wordpress" // Use the ID of the icon from the sprite
        heading="Open new appointments for your clients in less 50 seconds"
        text="Unlock seamless appointment scheduling in less than 50 seconds with Vetcation. Our industry-leading system not only allows you to effortlessly set up appointments with varying times, dates, and durations, but also enables veterinarians to access all appointment details directly from their phones. By joining Vetcation, you gain access to the most comprehensive and user-friendly appointment management solution available. Start streamlining your booking process today and ensure your staff is well-prepared and informed for every client interaction."
        // linkText="Learn More"
        linkHref="#"
        image={{
          webp: wordpress1Webp,
          webp2x: wordpress1Webp,
          png: wordpress1Png,
          png2x: wordpress1Png,
        }}
        videoSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/videos%2FRPReplay_Final1719431767.MP4?alt=media&token=19a3a56d-665d-4e86-a1bc-216c7cad8534"
      />
      <Feature
        iconId="easy" // Use the ID of the icon from the sprite
        heading="Every vet can acceess Pre-Screen Summaries for every Upcoming Appointments"
        text="Enhance your preparation with Vetcation's advanced AI-driven features. Every veterinarian in your clinic can access comprehensive pre-screen summaries directly from the in-app calendar. These summaries include detailed information and images submitted by pet owners about their upcoming appointments. Our AI system meticulously analyzes the provided content to generate insightful summaries, helping veterinarians understand each pet's condition before the visit. This proactive approach not only saves time but also ensures more effective and efficient appointments. Join Vetcation to leverage cutting-edge technology for better care and streamlined operations."
        // linkText="Learn More"
        linkHref="#"
        image={{
          webp: easyWebp,
          webp2x: easyWebp,
          png: easyPng,
          png2x: easyPng,
        }}
        videoSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/videos%2FRPReplay_Final1719434125.MP4?alt=media&token=949612d1-dd77-414e-9d2d-74f6dac99e8e"
      />
    </FeaturesContainer>
  );
}

export default ClinicFeaturesSection;
