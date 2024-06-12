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

function VetFeaturesSection() {
  return (
    <FeaturesContainer>
      <header
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100px",
        }}
      >
        <h2>
          A best communication tool to help you stremaline your work with your
          clients
        </h2>
      </header>
      <Feature
        iconId="clock" // Use the ID of the icon from the sprite
        heading="AI powered communication tool"
        text="A AI-powered best communication tool to help you stremaline your work with your clients"
        linkText="Learn More"
        linkHref="#"
        image={{
          webp: fast1Webp,
          webp2x: fast1Webp,
          png: fast1Png,
          png2x: fast1Png,
        }}
        videoSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/videos%2FRPReplay_Final1718172660.MP4?alt=media&token=c988a6b5-9d7c-4d1c-934b-b496a02dca98"
      />
      <Feature
        iconId="wordpress" // Use the ID of the icon from the sprite
        heading="Build strong connections with your doctor"
        text="Looking for an efficient way to manage your clients and stay connected with them? Our platform can help you do just that! With our user-friendly interface, you can manage your clients with ease and be available to them at all times. Don't let distance or time constraints get in the way of your business. Join now and take your client management to the next level!"
        linkText="Learn More"
        linkHref="#"
        image={{
          webp: wordpress1Webp,
          webp2x: wordpress1Webp,
          png: wordpress1Png,
          png2x: wordpress1Png,
        }}
        videoSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/videos%2FRPReplay_Final1717629711.MP4?alt=media&token=21e70d7f-101f-4412-a357-5ddcfb0a303a"
      />
      <Feature
        iconId="easy" // Use the ID of the icon from the sprite
        heading="Super Easy to get advice"
        text="Look no further! Our platform provides a unique opportunity to ask veterinarians questions and gain a veterinary perspective on your furry friend's well-being. Join now to ensure your pet receives the best care possible!"
        linkText="Learn More"
        linkHref="#"
        image={{
          webp: easyWebp,
          webp2x: easyWebp,
          png: easyPng,
          png2x: easyPng,
        }}
        videoSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/videos%2FRPReplay_Final1717710227.MP4?alt=media&token=7e0b7e77-0afa-4c11-a224-a2fc93b82386"
      />
    </FeaturesContainer>
  );
}

export default VetFeaturesSection;
