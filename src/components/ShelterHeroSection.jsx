// src/components/ShelterHeroSection.jsx
import React from "react";
import styled from "styled-components";
import {
  Container,
  Row,
  Col,
  Button as BootstrapButton,
} from "react-bootstrap";

import shelterHeroImage from "../images/banner7_2.webp";

const breakpoint = 800;

const StyledHeroSection = styled.section`
  position: relative;
  padding: 5rem 2rem;
  clip-path: polygon(0% 0%, 100% 0%, 100% 95%, 0% 100%);
  background-image: url(${shelterHeroImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #000;
  color: #ffffff;

  min-height: 70vh;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    padding: 3.5rem 1.25rem 3rem;
    min-height: auto;
    clip-path: none;
    align-items: flex-start;
  }
`;

const LeftGradient = styled.div`
  position: absolute;
  inset: 0;
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
  z-index: 1;
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

const PrimaryButton = styled(BootstrapButton).attrs({
  variant: "danger",
})`
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

function ShelterHeroSection({ onGetStarted }) {
  return (
    <StyledHeroSection>
      <LeftGradient />
      <Content>
        <Container style={{ maxWidth: "1140px" }}>
          <Row>
            <Col xs={12} md={10} lg={8} xl={7}>
              <BrandKicker>For shelters and rescue groups</BrandKicker>
              <HeroHeader>Modern shelter-branded post-adoption app</HeroHeader>
              <HeroTagline>
                MyPet Health helps shelters send adopters home with a lifelong
                digital medical record and trusted follow-up support from your
                partnered veterinarians. It’s free for shelters, with no
                downloads for your staff. Create a pet record and share the link
                in minutes.
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

export default ShelterHeroSection;
