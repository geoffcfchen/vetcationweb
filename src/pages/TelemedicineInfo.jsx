import React from "react";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// You can import an image that you want to display
// import telemedicineImg from "../images/telemedicine_example.jpg";

const PageContainer = styled.div`
  background-color: #f8f9fa; // Light gray or your choice of background
  min-height: 100vh; // Full viewport height
  padding: 2rem; // Some spacing around content
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #333; // Adjust to match your design
`;

const SubTitle = styled.h2`
  font-size: 1.75rem;
  margin: 2rem 0 1rem;
  color: #444; // Slightly lighter than Title color
`;

const Paragraph = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: #555;
`;

const ImageContainer = styled.div`
  text-align: center;
  margin: 2rem 0;
`;

// This is just a placeholder – replace with your own content
function TelemedicineInfo() {
  return (
    <PageContainer>
      <Container>
        <Row>
          <Col>
            <Title>How It Works & Legal Requirements</Title>
            <Paragraph>
              Welcome to our telemedicine platform! We’re excited to guide you
              through how our service works and ensure you understand the
              telemedicine regulations in your region. Here you’ll find details
              on connecting with a licensed vet, preparing for your virtual
              visit, and any state or regional laws you should know.
            </Paragraph>
            <ImageContainer>
              {/* If you have an image, you can display it here:
                  <img src={telemedicineImg} alt="Telemedicine Demo" style={{ maxWidth: "100%" }} />
              */}
            </ImageContainer>
            <SubTitle>Getting Started</SubTitle>
            <Paragraph>
              1. **Create an Account**: If you don’t already have one, you’ll
              need to register an account on our platform. This will help us
              keep track of your pet’s medical records, prescriptions, and more.
            </Paragraph>
            <Paragraph>
              2. **Schedule a Consultation**: Once logged in, choose an
              available time slot for a video consultation with one of our
              licensed veterinarians.
            </Paragraph>
            <Paragraph>
              3. **Complete Pre-Consultation Details**: Provide basic
              information about your pet’s symptoms or any concerns prior to the
              call. This helps the vet prepare and ensures your appointment runs
              smoothly.
            </Paragraph>

            <SubTitle>Legal & Telemedicine Requirements</SubTitle>
            <Paragraph>
              Telemedicine for animals may vary by location and is generally
              governed by state or national veterinary boards. Key points:
            </Paragraph>
            <Paragraph>
              - **Veterinarian-Client-Patient Relationship (VCPR)**: In most
              regions, a valid VCPR must be established before a veterinarian
              can diagnose or treat your pet.
              <br />
              - **Prescriptions**: Some states require an in-person exam before
              certain prescriptions can be dispensed.
              <br />- **Privacy**: We comply with applicable data privacy
              regulations to keep you and your pet’s information secure.
            </Paragraph>

            <SubTitle>Questions or Concerns?</SubTitle>
            <Paragraph>
              If you have any questions about our telemedicine services or want
              to ensure compliance with local regulations, feel free to reach
              out to our support team at <strong>support@vetcation.com</strong>.
            </Paragraph>
          </Col>
        </Row>
      </Container>
    </PageContainer>
  );
}

export default TelemedicineInfo;
