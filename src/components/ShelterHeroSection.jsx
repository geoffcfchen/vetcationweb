// src/components/ShelterHeroSection.jsx
import React from "react";
import styled from "styled-components";
import {
  Container,
  Row,
  Col,
  Button as BootstrapButton,
} from "react-bootstrap";
import { Link as RouterLink } from "react-router-dom";

// Swap this for a shelter-specific photo when you have it
import shelterHeroImage from "../images/banner7.webp";

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
    min-height: 60vh;
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
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
`;

const BrandKicker = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;

  @media (max-width: ${breakpoint}px) {
    text-align: left;
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
`;

const HeroTagline = styled.p`
  color: #e5edf5;
  margin: 1.5rem 0 3rem;
  font-size: 20px;
  line-height: 1.5;

  @media (max-width: 1022px) {
    font-size: 18px;
  }

  @media (max-width: ${breakpoint}px) {
    text-align: left;
  }
`;

const ButtonsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: ${breakpoint}px) {
    justify-content: flex-start;
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
`;

const SecondaryButton = styled(BootstrapButton)`
  padding: 1.1rem 2.6rem;
  text-transform: uppercase;
  border-radius: 999px;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.04em;

  background: transparent;
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  color: #ffffff;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #ffffff;
    color: #ffffff;
  }
`;

function ShelterHeroSection({ onGetStarted }) {
  return (
    <StyledHeroSection>
      <LeftGradient />
      <Content>
        <Container style={{ maxWidth: "1140px" }}>
          <Row>
            <Col md={10} lg={8} xl={7}>
              <BrandKicker>For shelters and rescue groups</BrandKicker>
              <HeroHeader>
                Give every adopted pet a universal medical record and
                post-adoption support
              </HeroHeader>
              <HeroTagline>
                With MyPet Health, your intake, vaccine, and surgery paperwork
                becomes the first chapter of a lifelong medical record that
                follows the pet after adoption, reduces post-adoption questions,
                and gives every vet a clear history from day one.
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
