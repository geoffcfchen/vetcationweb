// src/components/ShelterHeroSection.jsx
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import {
  Container,
  Row,
  Col,
  Button as BootstrapButton,
} from "react-bootstrap";
import shelterHeroImage from "../images/banner7_2.webp";

const breakpoint = 800;

// Bigger = stronger movement (not slower)
const PARALLAX_SPEED_DESKTOP = 0.35;
// Mobile should usually be smaller for smoothness
const PARALLAX_SPEED_TOUCH = 0.14;

const MAX_SHIFT_PX_DESKTOP = 180;
const MAX_SHIFT_PX_TOUCH = 90;

const StyledHeroSection = styled.section`
  position: relative;
  padding: 5rem 2rem;
  clip-path: polygon(0% 0%, 100% 0%, 100% 95%, 0% 100%);
  background-color: #000;
  color: #ffffff;

  min-height: 70vh;
  display: flex;
  align-items: center;

  overflow: hidden;

  @media (max-width: 768px) {
    padding: 3.5rem 1.25rem 3rem;
    min-height: auto;
    clip-path: none;
    align-items: flex-start;
  }
`;

const BgLayer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: -12%;
  bottom: -12%;

  background-image: url(${shelterHeroImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  will-change: transform;
  transform: translate3d(0, 0, 0) scale(1.08);
  z-index: 0;

  /* IMPORTANT: do NOT disable transform on mobile */
  @media (max-width: 768px) {
    top: -8%;
    bottom: -8%;
  }

  @media (prefers-reduced-motion: reduce) {
    transform: none !important;
  }
`;

const LeftGradient = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.65) 0%,
    rgba(0, 0, 0, 0.5) 25%,
    rgba(0, 0, 0, 0.2) 55%,
    rgba(0, 0, 0, 0) 80%
  );

  @media (max-width: 768px) {
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.72) 0%,
      rgba(0, 0, 0, 0.48) 55%,
      rgba(0, 0, 0, 0.18) 100%
    );
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
`;

const BrandKicker = styled.div`
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;

  @media (max-width: ${breakpoint}px) {
    text-align: left;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    letter-spacing: 0.07em;
  }
`;

const HeroHeader = styled.h1`
  max-width: 760px;
  color: #ffffff;
  margin-bottom: 1rem;
  font-size: clamp(38px, 4.8vw, 44px);
  font-weight: 600;
  line-height: 1.1;

  @media (max-width: 1022px) {
    font-size: 44px;
  }

  @media (max-width: ${breakpoint}px) {
    text-align: left;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    font-size: clamp(30px, 8.5vw, 38px);
    line-height: 1.08;
    margin-bottom: 0.75rem;
  }
`;

const HeroTagline = styled.p`
  color: #e5edf5;
  margin: 1.25rem 0 2.5rem;
  font-size: 20px;
  line-height: 1.5;
  max-width: 760px;

  @media (max-width: 1022px) {
    font-size: 18px;
  }

  @media (max-width: ${breakpoint}px) {
    text-align: left;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    font-size: clamp(16px, 4.6vw, 18px);
    margin: 1rem 0 1.75rem;
    line-height: 1.45;
  }
`;

const ButtonsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: ${breakpoint}px) {
    justify-content: flex-start;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    gap: 0.75rem;
  }
`;

const PrimaryButton = styled(BootstrapButton).attrs({ variant: "danger" })`
  padding: 1.1rem 2.6rem;
  text-transform: uppercase;
  border-radius: 999px;
  background: #ff3b00;
  border: none;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.04em;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: #ec3000;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.95rem 1.25rem;
  }
`;

const SecondaryButton = styled(BootstrapButton)`
  padding: 1.1rem 2.6rem;
  text-transform: uppercase;
  border-radius: 999px;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.04em;

  background: transparent;
  border: 1.5px solid rgba(255, 255, 255, 0.55);
  color: #ffffff;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #ffffff;
    color: #ffffff;
  }

  @media (max-width: 768px) {
    width: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
`;

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export default function ShelterHeroSection({ onGetStarted }) {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg) return;

    const isTouchDevice = () =>
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    const prefersReducedMotion = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const update = () => {
      if (prefersReducedMotion()) {
        bg.style.transform = "";
        return;
      }

      const rect = section.getBoundingClientRect();

      const speed = isTouchDevice()
        ? PARALLAX_SPEED_TOUCH
        : PARALLAX_SPEED_DESKTOP;

      const maxShift = isTouchDevice()
        ? MAX_SHIFT_PX_TOUCH
        : MAX_SHIFT_PX_DESKTOP;

      const shift = clamp(-rect.top * speed, -maxShift, maxShift);

      bg.style.transform = `translate3d(0, ${shift}px, 0) scale(1.08)`;
    };

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <StyledHeroSection ref={sectionRef}>
      <BgLayer ref={bgRef} />
      <LeftGradient />

      <Content>
        <Container style={{ maxWidth: "1140px" }}>
          <Row>
            <Col xs={12} md={10} lg={8} xl={7}>
              <BrandKicker>For shelters and rescue groups</BrandKicker>
              <HeroHeader>
                A digital medical record system that protects pets for life
              </HeroHeader>
              <HeroTagline>
                MyPet Health helps shelters give adopters a digital medical
                record system. It’s free for shelters, with no downloads for
                your staff. Create a pet record and transfer it to the adopter
                at adoption day.
              </HeroTagline>

              <ButtonsRow>
                <PrimaryButton
                  type="button"
                  onClick={() => onGetStarted && onGetStarted()}
                >
                  Create a pet record
                </PrimaryButton>
                <SecondaryButton as="a" href="#shelter-contact" type="button">
                  Talk to us
                </SecondaryButton>
              </ButtonsRow>
            </Col>
          </Row>
        </Container>
      </Content>
    </StyledHeroSection>
  );
}
