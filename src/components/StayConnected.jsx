import React from "react";
import styled from "styled-components";

// Define styled components
const StayConnectedContainer = styled.section`
  padding: 5rem 2rem;
  background: #000;
  color: #7b858b;
  text-align: center;
`;

const Header = styled.header`
  margin-bottom: 4rem;
`;

const Heading = styled.h2`
  color: #fff;
`;

const TextParagraph = styled.p`
  color: #7b858b; // Assuming you want regular text slightly lighter/different from the container
`;

const StrongText = styled.strong`
  color: #fff;
`;

const Callout = styled.div`
  padding: 4rem;
  border-radius: 5px;
  background: var(
    --color-primary,
    #0056b3
  ); // Fallback color if the variable isn't set
  color: #fff;
  margin-top: 2rem;
`;

const Link = styled.a`
  color: var(
    --color-accent,
    #ff6347
  ); // Fallback color if the variable isn't set
  text-decoration: none;
  text-transform: uppercase;
  font-size: 2rem;
  font-weight: bold;

  &::after {
    content: "-->";
    margin-left: 5px;
    transition: margin 0.15s;
  }

  &:hover::after {
    margin-left: 10px;
  }
`;

// Component function
const StayConnected = () => {
  return (
    <StayConnectedContainer>
      <Header>
        <Heading>Stay Connected with Vetcation</Heading>
      </Header>
      <TextParagraph>
        Get the latest pet health updates directly on your phone.
      </TextParagraph>
      <TextParagraph>
        <StrongText>Text 'JOIN' to +16072589781 to subscribe.</StrongText>
      </TextParagraph>
      <TextParagraph>
        Message frequency varies. Msg & Data rates may apply. Text HELP for
        help, STOP to cancel.
      </TextParagraph>
      <Callout>
        <Link href="/privacy-policy">Privacy Policy</Link> |{" "}
        <Link href="/SMSTerms">SMS Terms & Conditions</Link>
      </Callout>
    </StayConnectedContainer>
  );
};

export default StayConnected;
