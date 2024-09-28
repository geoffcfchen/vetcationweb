import React, { useState } from "react";
import styled from "styled-components";

import sprite from "../images/sprite.svg"; // Import the sprite path
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa"; // Importing from Font Awesome
import iPhoneFrame from "../images/iphone-frame_15pro.png"; // Make sure to have the correct path to your iPhone frame image

const FeatureBlock = styled(motion.article)`
  display: grid;
  gap: 4rem;
  margin: 12rem 0;

  &:first-of-type {
    margin-top: 6rem;
  }

  &:last-of-type {
    margin-bottom: 6rem; // Reduce or remove bottom margin for the last feature block
  }

  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    &:nth-of-type(even) {
      & > div:first-child {
        order: 2;
      }
    }
  }
`;

const FeatureContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;

  h3 {
    color: var(--color-headings);
    margin-bottom: 1rem;
    font-size: 30px; // Ensuring consistency with inline styles
    font-weight: 600;
    line-height: 1.3;
  }

  p {
    color: var(--color-body);
    font-size: 20px; // Ensuring consistency with inline styles
    line-height: 1.5;
    margin-top: 0;
  }

  a {
    color: red; // Ensuring consistency with inline styles
    text-transform: uppercase;
    font-size: 15px; // Ensuring consistency with inline styles
    font-weight: bold;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    position: relative; // Relative positioning for pseudoelements
  }
`;

const IconContainer = styled.span`
  background: #f3f9fa;
  width: 64px;
  height: 64px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 40px; // Reduced from 40px to 30px
    height: 40px; // Reduced from 40px to 30px
  }
`;

const FeatureImage = styled(motion.img)`
  width: 100%;
`;

const VideoFrameContainer = styled.div`
  position: relative;
  width: 300px; // Set this to the width of your iPhone frame image
  height: 600px; // Set this to the height of your iPhone frame image
  margin: 0 auto; // Center the container
`;

const FrameImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none; // This ensures that the frame does not interfere with video controls
`;

const StyledVideo = styled(motion.video)`
  position: absolute;
  top: 1.69%; // Center vertically in the frame, adjust as necessary
  height: 96.3%; // Increased to make the video larger
  left: 0%; // Center horizontally in the frame, adjust as necessary
  width: 100%; // Increased to make the video larger
`;

// Animation variants
const contentVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", duration: 0.8 } },
};

const imageVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", duration: 0.8 },
  },
};

export default function Feature({
  iconId = null,
  heading,
  text,
  linkText,
  linkHref,
  qrCodeLink, // New prop for the QR code link
  image,
  videoSrc,
}) {
  const [hover, setHover] = useState(false);

  return (
    <FeatureBlock
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <FeatureContent variants={contentVariants}>
        {iconId && (
          <IconContainer>
            <svg>
              <use xlinkHref={`${sprite}#${iconId}`} />
            </svg>
          </IconContainer>
        )}
        <h3
          style={{
            fontSize: 60,
            color: "#316FF6",
            fontFamily: "inherit",
            marginBottom: 0,
          }}
        >
          {heading}
        </h3>
        <p
          style={{
            fontSize: 30,
            marginTop: 5,
            lineHeight: 1.2,
            fontFamily: "inherit",
          }}
        >
          {text}
        </p>
        <a
          href={linkHref}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            fontSize: "15px",
            color: "red",
            display: "inline-flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          {linkText}
          {linkText && (
            <FaArrowRight
              style={{
                marginLeft: "5px",
                transition: "transform 0.3s ease",
                transform: hover ? "translateX(5px)" : "translateX(0)",
              }}
            />
          )}
        </a>
        {qrCodeLink && (
          <img
            src={qrCodeLink}
            alt="QR Code"
            style={{ marginTop: "10px", width: "430px", height: "260px" }}
          />
        )}
      </FeatureContent>
      {videoSrc ? (
        <VideoFrameContainer>
          <StyledVideo
            variants={imageVariants}
            src={videoSrc}
            alt={heading}
            autoPlay
            loop
            muted
            playsInline
            as={motion.video}
          />
          <FrameImage src={iPhoneFrame} alt="iPhone Frame" />
        </VideoFrameContainer>
      ) : (
        <picture>
          <FeatureImage
            variants={imageVariants}
            src={image.png}
            alt={heading}
            as={motion.img}
          />
        </picture>
      )}
    </FeatureBlock>
  );
}
