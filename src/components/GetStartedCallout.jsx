// src/components/GetStartedCallout.jsx
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 1140px;
  margin: 0 auto 4rem;
  padding: 0 2rem;
`;

const Callout = styled.div`
  padding: 1.5rem 0;
  border-radius: 16px;
  background: transparent;
  color: #0f172a;
  display: grid;
  grid-template-columns: minmax(0, 2fr) auto;
  align-items: center;
  gap: 1.5rem;
`;

const CalloutContent = styled.div`
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const CalloutHeading = styled.h2`
  margin: 0 0 0.4rem;
  font-size: 2rem;
  font-weight: 700;
`;

const CalloutSubheading = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #4b5563;
`;

const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const QRCodeImage = styled.img`
  width: 500px;
  height: auto;
  max-width: 100%;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 240px;
  }
`;

const GetStartedCallout = ({ qrCodeLink }) => {
  return (
    <Container>
      <Callout>
        <CalloutContent>
          <CalloutHeading>Ready to get started?</CalloutHeading>
          <CalloutSubheading>
            Scan the QR code to download the Vetcation app.
          </CalloutSubheading>
        </CalloutContent>

        <RightSide>
          {qrCodeLink && (
            <QRCodeImage
              src={qrCodeLink}
              alt="Scan to download the Vetcation app"
            />
          )}
        </RightSide>
      </Callout>
    </Container>
  );
};

export default GetStartedCallout;
