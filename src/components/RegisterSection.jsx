import React, { useState } from "react";
import styled from "styled-components";
import easyWebp from "../images/easy.webp";
import easyPng from "../images/easy1@2x.png"; // Adjust the path
import fast1Webp from "../images/fast1.webp";
import fast1Png from "../images/fast1@2x.png"; // Adjust the path
import wordpress1Webp from "../images/wordpress1.webp";
import wordpress1Png from "../images/wordpress1@2x.png"; // Adjust the path
import Feature from "./Feature";
import qrCodeImage from "../images/qrcode4.png"; // Adjust path as necessary

const FeaturesContainer = styled.section`
  max-width: 1140px;
  margin: 0 auto;
  padding: 0rem 2rem;
`;

function RegisterSection() {
  return (
    <FeaturesContainer>
      <Feature
        // iconId="wordpress" // Use the ID of the icon from the sprite
        heading="Vetcation"
        text="Ask, connect, and learn from a community of licensed veterinary experts on Vetcation."
        // linkText="Learn More"
        qrCodeLink={qrCodeImage}
        linkHref="#"
        image={{
          webp: wordpress1Webp,
          webp2x: wordpress1Webp,
          png: wordpress1Png,
          png2x: wordpress1Png,
        }}
        // videoSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/videos%2FScreenRecording_09-28-2024%2001-59-58_1_compress.mp4?alt=media&token=4ce6b9a5-4cbf-4102-ab6a-8ce4f99e36cd"
        imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/IMG_7383_compressed.png?alt=media&token=4f4cc1eb-073b-4a46-acba-1dedd89943ad"
      />
    </FeaturesContainer>
  );
}

export default RegisterSection;
