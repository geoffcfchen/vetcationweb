import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // ⬅️ add this
import sprite from "../images/sprite.svg";
import iPhoneFrame from "../images/iphone-frame_15pro.png";

const ContributionNote = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  border-top: 1px solid #ddd;
  text-align: center;
  font-size: 16px;
  color: #555;

  a {
    color: #316ff6;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const QRCodeImage = styled.img`
  margin-top: 10px;
  width: 450px;
  height: 210px;
  max-width: 450px;
  max-height: 210px;
  cursor: ${(props) => (props.$clickable ? "pointer" : "default")};

  @media (max-width: 768px) {
    width: 340px;
    height: 160px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const FeatureBlock = styled(motion.article)`
  display: grid;
  gap: 4rem;
  margin: 12rem 0;
  outline: none; /* for custom focus when clickable */
  cursor: ${(props) => (props.$clickable ? "pointer" : "default")};

  &:first-of-type {
    margin-top: 4rem;
  }

  &:last-of-type {
    margin-bottom: 6rem;
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
    font-size: 30px;
    font-weight: 600;
    line-height: 1.3;
  }

  p {
    color: var(--color-body);
    font-size: 20px;
    line-height: 1.5;
    margin-top: 0;
  }

  a {
    color: red;
    text-transform: uppercase;
    font-size: 15px;
    font-weight: bold;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    position: relative;
  }

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
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
    width: 40px;
    height: 40px;
  }
`;

const FeatureImage = styled(motion.img)`
  width: 100%;
`;

const VideoFrameContainer = styled.div`
  position: relative;
  width: 300px;
  height: 600px;
  margin: 0 auto;
`;

const FrameImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
`;

const StyledVideo = styled(motion.video)`
  position: absolute;
  top: 1.69%;
  height: 96.3%;
  left: 0%;
  width: 100%;
`;

const FramedImage = styled(motion.img)`
  position: absolute;
  top: 1.5%;
  left: 1.5%;
  width: 97%;
  height: 97%;
  object-fit: contain;
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
  qrCodeLink,
  image,
  videoSrc,
  imageSrc,
  to, // ⬅️ NEW: route to navigate on click (e.g., "/telemedicine-info")
}) {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  const clickable = Boolean(to);

  const go = () => {
    if (to) navigate(to);
  };

  const onKeyDown = (e) => {
    if (!clickable) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go();
    }
  };

  return (
    <FeatureBlock
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={contentVariants}
      onClick={clickable ? go : undefined}
      onKeyDown={onKeyDown}
      role={clickable ? "link" : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable ? `Open ${heading}` : undefined}
      $clickable={clickable}
    >
      <FeatureContent>
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
            color: "#000000",
            fontFamily: "inherit",
            marginBottom: 0,
          }}
        >
          {heading}
        </h3>

        <p
          style={{
            fontSize: 28,
            marginTop: 5,
            lineHeight: 1.2,
            fontFamily: "inherit",
          }}
        >
          {text}
        </p>

        {/* If we have a specific linkText button, make it route with SPA navigation */}
        {linkText && (
          <a
            href={to || linkHref || "#"}
            onClick={(e) => {
              if (to) {
                e.preventDefault();
                go();
              }
            }}
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
            <FaArrowRight
              style={{
                marginLeft: "5px",
                transition: "transform 0.3s ease",
                transform: hover ? "translateX(5px)" : "translateX(0)",
              }}
            />
          </a>
        )}

        {qrCodeLink && (
          <QRCodeImage
            src={qrCodeLink}
            alt="QR Code"
            $clickable={clickable}
            onClick={clickable ? go : undefined}
          />
        )}
      </FeatureContent>

      {/* Media side */}
      {videoSrc ? (
        <VideoFrameContainer
          onClick={clickable ? go : undefined}
          role={clickable ? "img" : undefined}
          aria-label={clickable ? `${heading} demo` : undefined}
          tabIndex={clickable ? 0 : undefined}
          onKeyDown={onKeyDown}
          style={{ cursor: clickable ? "pointer" : "default" }}
        >
          <StyledVideo
            variants={imageVariants}
            src={videoSrc}
            alt={heading}
            autoPlay
            loop
            muted
            playsInline
          />
          <FrameImage src={iPhoneFrame} alt="iPhone Frame" />
        </VideoFrameContainer>
      ) : imageSrc ? (
        <VideoFrameContainer
          onClick={clickable ? go : undefined}
          role={clickable ? "img" : undefined}
          aria-label={clickable ? `${heading} image` : undefined}
          tabIndex={clickable ? 0 : undefined}
          onKeyDown={onKeyDown}
          style={{ cursor: clickable ? "pointer" : "default" }}
        >
          <FramedImage variants={imageVariants} src={imageSrc} alt={heading} />
          <FrameImage src={iPhoneFrame} alt="iPhone Frame" />
        </VideoFrameContainer>
      ) : (
        <picture
          onClick={clickable ? go : undefined}
          role={clickable ? "img" : undefined}
          aria-label={clickable ? `${heading} image` : undefined}
          tabIndex={clickable ? 0 : undefined}
          onKeyDown={onKeyDown}
          style={{ cursor: clickable ? "pointer" : "default" }}
        >
          <FeatureImage
            variants={imageVariants}
            src={image?.png}
            alt={heading}
          />
        </picture>
      )}

      {/* <ContributionNote> ... </ContributionNote> */}
    </FeatureBlock>
  );
}
