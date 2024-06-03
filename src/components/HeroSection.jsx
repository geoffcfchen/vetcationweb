import React from "react";
import styled from "styled-components";
import heroImage from "../images/banner1.png"; // Adjust the path as necessary

const HeroSection = styled.section`
  background: #000;
  color: #7b858b;
  padding: 5rem 2rem;
  clip-path: polygon(0% 0%, 100% 0%, 100% 95%, 0% 100%);
`;

const Container = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;

const HeroContent = styled.div`
  h1 {
    color: #fff;
    margin-bottom: 1rem;
  }
  p {
    color: #b9c3cf;
    margin: 2rem 0 5rem;
  }
`;

const Button = styled.a`
  background: #ff3400;
  color: #fff;
  padding: 2rem 4vw;
  text-transform: uppercase;
  text-decoration: none;
`;

const HeroImage = styled.img`
  width: 100%;
`;

function Hero() {
  return (
    <HeroSection>
      <Container>
        <HeroContent>
          <h1>
            Join the veterinary community and make the right decision for your
            pets
          </h1>
          <p>Build strong connections with your vets</p>
          <Button href="#">Get Started</Button>
        </HeroContent>
        <HeroImage src={heroImage} alt="Hero" />
      </Container>
    </HeroSection>
  );
}

export default Hero;
