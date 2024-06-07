import React from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 100%; // Adjusting to full width
  margin: 0;
`;

const Callout = styled.div`
  padding: 1rem 2rem; // Adjust padding to make it slimmer
  border-radius: 8px; // Smooth out the corners
  background: #00aaff; // Set the specific shade of blue
  color: #fff;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center; // Vertically align items
`;

const CalloutContent = styled.div`
  text-align: center;
`;

const CalloutHeading = styled.h2`
  margin-top: 0;
  font-size: 2rem; // Reduce font size for better fit
  font-weight: bold; // Ensure the text is bold
`;

const Button = styled.a`
  border-radius: 30px; // More pronounced rounded edges
  background: #ffffff; // White background for the button
  color: #00aaff; // Text color matches the callout background
  font-size: 1.2rem; // Adjust font size for button text
  font-weight: bold;
  padding: 1rem 2rem; // Padding to make the button larger
  text-transform: uppercase;
  text-decoration: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // Add a subtle shadow for 3D effect
  transition: background-color 0.3s, transform 0.2s; // Smooth transition for hover effects

  &:hover {
    background-color: #e0f7ff; // Lighter blue on hover
    transform: translateY(-2px); // Lift the button on hover
  }
`;
const GetStartedCallout = () => {
  return (
    <Container>
      <Callout>
        <CalloutContent>
          <CalloutHeading>Ready to Get Started?</CalloutHeading>
        </CalloutContent>
        <Button href="/register">Get Started</Button>
      </Callout>
    </Container>
  );
};

export default GetStartedCallout;
