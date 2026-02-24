// src/components/HeroSection.jsx
import React from "react";
import styled from "styled-components";
import heroImage from "../images/banner4.png"; // update path if needed
import {
  Container,
  Row,
  Col,
  Button as BootstrapButton,
} from "react-bootstrap";

const breakpoint = 800;

const StyledHeroSection = styled.section`
  position: relative;
  padding: 5rem 2rem;
  clip-path: polygon(0% 0%, 100% 0%, 100% 95%, 0% 100%);
  background-image: url(${heroImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #000;
  color: #ffffff;

  /* 👇 add this */
  min-height: 80vh; /* try 80vh or 90vh for almost full-screen */

  display: flex; /* center content vertically */
  align-items: center;

  @media (max-width: 768px) {
    min-height: 60vh;
  }
`;

// Darkens only the left side, fades out to the right
const LeftGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.55) 0%,
    rgba(0, 0, 0, 0.45) 25%,
    rgba(0, 0, 0, 0.2) 55%,
    rgba(0, 0, 0, 0) 80%
  );
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
`;

const HeroHeader = styled.h1`
  color: #ffffff;
  margin-bottom: 1rem;
  font-size: 60px;
  font-weight: 700;
  line-height: 1.1;

  @media (max-width: 1022px) {
    font-size: 48px;
  }

  @media (max-width: ${breakpoint}px) {
    text-align: left;
  }
`;

const HeroTagline = styled.p`
  color: #e5edf5;
  margin: 1.5rem 0 3rem;
  font-size: 22px;
  line-height: 1.5;

  @media (max-width: 1022px) {
    font-size: 20px;
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
  padding: 1.2rem 2.8rem;
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

const SecondaryButton = styled(BootstrapButton).attrs({
  variant: "outline-light",
})`
  padding: 1.2rem 2.8rem;
  text-transform: uppercase;
  border-radius: 999px;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.04em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

function HeroSection() {
  return (
    <StyledHeroSection>
      <LeftGradient />
      <Content>
        <Container style={{ maxWidth: "1140px" }}>
          <Row>
            <Col md={7} lg={6}>
              <HeroHeader>Vetcation</HeroHeader>
              <HeroTagline>
                Vetcation helps you pull and organize your pet’s scattered
                medical records into one place, so you and your vet can see the
                full picture in seconds and make informed decisions together.
              </HeroTagline>
              <ButtonsRow>
                {/* <PrimaryButton href="/register">Sign up now</PrimaryButton> */}
                {/* <SecondaryButton href="/demo">
                  Book a walk through
                </SecondaryButton> */}
              </ButtonsRow>
            </Col>
          </Row>
        </Container>
      </Content>
    </StyledHeroSection>
  );
}

export default HeroSection;
