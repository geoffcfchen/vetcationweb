import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import sprite from "../images/sprite.svg";
import iPhoneFrame from "../images/iphone-frame_15pro.png";

const HighLevelMedia = styled.picture`
  width: 100%;
  display: block;
  border-radius: 18px;
  overflow: hidden;
`;

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

const Heading = styled.h3`
  margin: 10px 0 0;
  font-weight: 600;
  line-height: 1.3;
  color: #000;
  font-family: inherit;
  font-size: ${(p) => p.$size}px;

  @media (max-width: 768px) {
    font-size: clamp(20px, 5.2vw, ${(p) => Math.round(p.$size * 0.9)}px);
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
  margin: 8rem 0;
  outline: none;
  cursor: ${(props) => (props.$clickable ? "pointer" : "default")};

  &:first-of-type {
    margin-top: 3rem;
  }

  &:last-of-type {
    margin-bottom: 6rem;
  }

  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);

    ${(props) =>
      props.$mediaVariant === "desktop" &&
      `
        grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.55fr);

        &:nth-of-type(even) {
          grid-template-columns: minmax(0, 1.55fr) minmax(0, 0.85fr);
        }
      `}

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

const BodyText = styled.p`
  color: var(--color-body);
  font-size: clamp(16px, 4.6vw, 28px);
  margin-top: 5px;
  line-height: 1.3;
  margin-bottom: 0;

  a {
    color: inherit;
    font-weight: 800;
    text-decoration: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.35);
    padding-bottom: 1px;
  }

  a:hover {
    border-bottom-color: rgba(0, 0, 0, 0.7);
  }

  a:focus-visible {
    outline: 2px solid rgba(0, 0, 0, 0.35);
    outline-offset: 3px;
    border-radius: 6px;
  }
`;

const CtaLink = styled.a`
  color: red;
  text-transform: uppercase;
  font-size: clamp(12px, 3.4vw, 15px);
  font-weight: bold;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  position: relative;
  margin-top: 12px;
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
  display: block;
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

const DesktopFrameContainer = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
`;

const BrowserFrame = styled.div`
  border-radius: 18px;
  overflow: hidden;
  background: #0b1220;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.18);
`;

const BrowserTopBar = styled.div`
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  gap: 8px;
  background: rgba(255, 255, 255, 0.06);
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.35);
`;

const BrowserBody = styled.div`
  background: #0b1220;
`;

const DesktopImage = styled(motion.img)`
  display: block;
  width: 100%;
  height: auto;
`;

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
  to,
  headerFontSize = 30,
  mediaVariant = "phone", // "phone" | "desktop" | "highlevel"
  clickTarget = "feature", // "feature" | "cta"
}) {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  const featureClickable = Boolean(to) && clickTarget === "feature";
  const ctaNavigates = Boolean(to);

  const go = () => {
    if (to) navigate(to);
  };

  const onFeatureKeyDown = (e) => {
    if (!featureClickable) return;
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
      onClick={featureClickable ? go : undefined}
      onKeyDown={featureClickable ? onFeatureKeyDown : undefined}
      role={featureClickable ? "link" : undefined}
      tabIndex={featureClickable ? 0 : undefined}
      aria-label={featureClickable ? `Open ${heading}` : undefined}
      $clickable={featureClickable}
      $mediaVariant={mediaVariant}
    >
      <FeatureContent>
        {iconId && (
          <IconContainer>
            <svg>
              <use xlinkHref={`${sprite}#${iconId}`} />
            </svg>
          </IconContainer>
        )}

        <Heading $size={headerFontSize}>{heading}</Heading>

        <BodyText>{text}</BodyText>

        {linkText && (
          <CtaLink
            href={to || linkHref || "#"}
            onClick={(e) => {
              if (ctaNavigates) {
                e.preventDefault();
                go();
              }
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            aria-label={linkText}
          >
            {linkText}
            <FaArrowRight
              style={{
                marginLeft: "5px",
                transition: "transform 0.3s ease",
                transform: hover ? "translateX(5px)" : "translateX(0)",
              }}
            />
          </CtaLink>
        )}

        {qrCodeLink && (
          <QRCodeImage
            src={qrCodeLink}
            alt="QR Code"
            $clickable={featureClickable}
            onClick={featureClickable ? go : undefined}
          />
        )}
      </FeatureContent>

      {videoSrc ? (
        <VideoFrameContainer
          onClick={featureClickable ? go : undefined}
          role={featureClickable ? "img" : undefined}
          aria-label={featureClickable ? `${heading} demo` : undefined}
          tabIndex={featureClickable ? 0 : undefined}
          onKeyDown={featureClickable ? onFeatureKeyDown : undefined}
          style={{ cursor: featureClickable ? "pointer" : "default" }}
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
        mediaVariant === "highlevel" ? (
          <HighLevelMedia
            onClick={featureClickable ? go : undefined}
            role={featureClickable ? "img" : undefined}
            aria-label={featureClickable ? `${heading} image` : undefined}
            tabIndex={featureClickable ? 0 : undefined}
            onKeyDown={featureClickable ? onFeatureKeyDown : undefined}
            style={{ cursor: featureClickable ? "pointer" : "default" }}
          >
            <FeatureImage
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={imageVariants}
              src={imageSrc}
              alt={heading}
            />
          </HighLevelMedia>
        ) : mediaVariant === "desktop" ? (
          <DesktopFrameContainer
            onClick={featureClickable ? go : undefined}
            style={{ cursor: featureClickable ? "pointer" : "default" }}
            role={featureClickable ? "img" : undefined}
            aria-label={featureClickable ? `${heading} screenshot` : undefined}
            tabIndex={featureClickable ? 0 : undefined}
            onKeyDown={featureClickable ? onFeatureKeyDown : undefined}
          >
            <BrowserFrame>
              <BrowserTopBar aria-hidden="true">
                <Dot />
                <Dot />
                <Dot />
              </BrowserTopBar>
              <BrowserBody>
                <DesktopImage
                  variants={imageVariants}
                  src={imageSrc}
                  alt={heading}
                />
              </BrowserBody>
            </BrowserFrame>
          </DesktopFrameContainer>
        ) : (
          <VideoFrameContainer
            onClick={featureClickable ? go : undefined}
            role={featureClickable ? "img" : undefined}
            aria-label={featureClickable ? `${heading} image` : undefined}
            tabIndex={featureClickable ? 0 : undefined}
            onKeyDown={featureClickable ? onFeatureKeyDown : undefined}
            style={{ cursor: featureClickable ? "pointer" : "default" }}
          >
            <FramedImage
              variants={imageVariants}
              src={imageSrc}
              alt={heading}
            />
            <FrameImage src={iPhoneFrame} alt="iPhone Frame" />
          </VideoFrameContainer>
        )
      ) : (
        <picture
          onClick={featureClickable ? go : undefined}
          role={featureClickable ? "img" : undefined}
          aria-label={featureClickable ? `${heading} image` : undefined}
          tabIndex={featureClickable ? 0 : undefined}
          onKeyDown={featureClickable ? onFeatureKeyDown : undefined}
          style={{ cursor: featureClickable ? "pointer" : "default" }}
        >
          <FeatureImage
            variants={imageVariants}
            src={image?.png}
            alt={heading}
          />
        </picture>
      )}
    </FeatureBlock>
  );
}
