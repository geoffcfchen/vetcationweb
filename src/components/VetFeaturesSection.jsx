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
          marginTop: "50px",
        }}
      >
        <h2>
          A communication tool to build a respectful relationship with your clients
        </h2>
      </header>
      <Feature
        iconId="clock" // Use the ID of the icon from the sprite
        heading="AI powered communication tool"
        text=" Our human-level AI assistant is here to free you from time-consuming, repetitive work. We want you to focus on more important things at work and in your life."
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
        heading="Build VCPR relationships with your clients and pets"
        text="Your clients can easily connect with you and get best advice for the pets that have build VCPR relationships with you. No more medical questions from the pets you haven't seen."
        linkText="Learn More"
        linkHref="#"
        image={{
          webp: wordpress1Webp,
          webp2x: wordpress1Webp,
          png: wordpress1Png,
          png2x: wordpress1Png,
        }}
        videoSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/videos%2FRPReplay_Final1718174604.MP4?alt=media&token=f3b1d940-e91d-4855-9ec8-c1b8bae2a780"
      />
      <Feature
        iconId="easy" // Use the ID of the icon from the sprite
        heading="Earn for Every Consult"
        text="Say goodbye to uncompensated follow-ups. Our app ensures you're rewarded for the service you provide. You can now earn for every consult you provide to your clients."
        linkText="Learn More"
        linkHref="#"
        image={{
          webp: easyWebp,
          webp2x: easyWebp,
          png: easyPng,
          png2x: easyPng,
        }}
        videoSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/videos%2FRPReplay_Final1718174935.MP4?alt=media&token=5c2f2514-87b3-4dcc-b767-3a6221e50fb0"
      />
      <Feature
        iconId="easy" // Use the ID of the icon from the sprite
        heading="One-way Calling"
        text=" Connect with pet owners securely without sharing your personal contact. Never get unsolicited calls. You have full control of when and how to engage."
        linkText="Learn More"
        linkHref="#"
        image={{
          webp: easyWebp,
          webp2x: easyWebp,
          png: easyPng,
          png2x: easyPng,
        }}
        videoSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/videos%2FRPReplay_Final1718175277.MP4?alt=media&token=fdcbd453-8ee8-40fd-a45e-71a70cb1b15d"
      />
      <Feature
        iconId="easy" // Use the ID of the icon from the sprite
        heading="Earn Recognition and Enhance Job Satisfaction"
        text="Elevate your professional profile with recognition from pet owners who value your service. Receive shout-outs, appreciation, and thanks that contribute to a lifelong reputation and career growth. Engage with a network of veterinarians to share knowledge and experiences, boosting job satisfaction and professional development."
        linkText="Learn More"
        linkHref="#"
        image={{
          webp: easyWebp,
          webp2x: easyWebp,
          png: easyPng,
          png2x: easyPng,
        }}
        videoSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/videos%2FRPReplay_Final1719436047.MP4?alt=media&token=fc0ca1c5-32e7-4b89-bb0c-4398ef56da00"
      />
    </FeaturesContainer>
  );
}

export default VetFeaturesSection;
