import React from "react";
import styled, { keyframes } from "styled-components";
import heroImage from "../images/banner1.png"; // Adjust the path as necessary
import {
  Container,
  Row,
  Col,
  Button as BootstrapButton,
} from "react-bootstrap";

const breakpoint = 800;

// Animation keyframes for the image appearance
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled components
const StyledHeroSection = styled.section`
  background: #000;
  color: #7b858b;
  padding: 5rem 2rem;
  clip-path: polygon(0% 0%, 100% 0%, 100% 95%, 0% 100%);
`;

const HeroHeader = styled.h1`
  color: #fff;
  margin-bottom: 1rem;
  font-size: 60px; // Adjust as necessary for responsive behavior
  font-weight: 700;
  @media (max-width: 1022px) {
    font-size: 48px;
  }
  @media (max-width: ${breakpoint}px) {
    text-align: center;
  }
`;

const HeroTagline = styled.p`
  color: #b9c3cf;
  margin: 2rem 0 5rem;
  font-size: 24px; // Adjust as necessary for responsive behavior
  @media (max-width: 1022px) {
    font-size: 20px;
  }
  @media (max-width: ${breakpoint}px) {
    text-align: center;
  }
`;

const HeroButton = styled(BootstrapButton).attrs({
  variant: "danger",
})`
  padding: 2rem 4vw;
  text-transform: uppercase;
  border-radius: 100px;
  background: #ff3b00;
  &:hover {
    background: #ec3000; // Darker shade for hover
  }
  width: 240px; // Set a fixed width
  height: 60px; // Set a fixed height
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${breakpoint}px) {
    display: block;
    margin: 0 auto;
    margin-bottom: 1rem;
    height: 60px;
    width: 240px; // Adjust this to set a specific width or use 'auto' for full width
    display: flex;
    /* justify-content: center; */
    /* align-items: center; */
  }
`;

const HeroImage = styled.img`
  width: 100%;
  animation: ${fadeIn} 1s ease-out; // Apply the animation here
`;

function ClinicHeroSection() {
  return (
    <StyledHeroSection>
      <Container style={{ maxWidth: "1140px" }}>
        <Row>
          <Col md={6}>
            <div>
              <HeroHeader>
                Elevate your practice and become a top choice for veterinary
                talent
              </HeroHeader>
              <HeroTagline>
                Transform Your Clinic Operations with Vetcation’s All-in-One
                Platform
              </HeroTagline>
              <HeroButton href="/register">Get Started</HeroButton>
            </div>
          </Col>
          <Col md={6}>
            <HeroImage src={heroImage} alt="Hero" />
          </Col>
        </Row>
      </Container>
    </StyledHeroSection>
  );
}

export default ClinicHeroSection;
