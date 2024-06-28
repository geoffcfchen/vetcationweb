import React, { useState } from "react";
import styled from "styled-components";
import easyWebp from "../images/easy.webp";
import easyPng from "../images/easy1@2x.png"; // Adjust the path
import fast1Webp from "../images/fast1.webp";
import fast1Png from "../images/fast1@2x.png"; // Adjust the path
import wordpress1Webp from "../images/wordpress1.webp";
import wordpress1Png from "../images/wordpress1@2x.png"; // Adjust the path
import Feature from "./Feature";
import qrCodeImage from "../images/qrcode_vetcation.com.png"; // Adjust path as necessary

const FeaturesContainer = styled.section`
  max-width: 1140px;
  margin: 0 auto;
  padding: 0rem 2rem;
`;

function RegisterSection() {
  return (
    <FeaturesContainer>
      <Feature
        iconId="wordpress" // Use the ID of the icon from the sprite
        heading="Welcome home!"
        text="An app that is designed for everyone who loves animals."
        // linkText="Learn More"
        qrCodeLink={qrCodeImage}
        linkHref="#"
        image={{
          webp: wordpress1Webp,
          webp2x: wordpress1Webp,
          png: wordpress1Png,
          png2x: wordpress1Png,
        }}
        videoSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/videos%2FRPReplay_Final1717741331.MP4?alt=media&token=dd8f94dd-6a15-4d33-a099-6eb78d4b037e"
      />
    </FeaturesContainer>
  );
}

export default RegisterSection;
