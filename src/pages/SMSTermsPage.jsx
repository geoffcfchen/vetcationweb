import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";

const PageContainer = styled(Container)`
  padding: 2rem 1rem;
  background-color: #f9f9f9;
  color: #333;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  color: #222;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  margin-top: 2rem;
  color: #444;
`;

const Paragraph = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
`;

const Link = styled.a`
  color: #007bff;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: #0056b3;
    text-decoration: underline;
  }
`;

const SMSTermsPage = () => (
  <PageContainer>
    <Row className="justify-content-center">
      <Col lg={8}>
        <Title>SMS Terms & Conditions</Title>
        <Paragraph>
          By opting in to receive SMS notifications from Vetcation, you agree to
          the following terms and conditions:
        </Paragraph>

        <SectionTitle>Consent to Receive SMS</SectionTitle>
        <Paragraph>
          By providing your mobile phone number and opting in to receive SMS
          notifications from Vetcation, you consent to receive informational and
          promotional text messages from us. Message frequency may vary.
        </Paragraph>

        <SectionTitle>Message and Data Rates May Apply</SectionTitle>
        <Paragraph>
          Standard message and data rates may apply to SMS messages sent and
          received. These charges are imposed and billed by your mobile service
          provider. Vetcation is not responsible for any charges incurred as a
          result of receiving SMS notifications.
        </Paragraph>

        <SectionTitle>Carrier Disclaimer</SectionTitle>
        <Paragraph>
          Carriers are not liable for delayed or undelivered messages.
        </Paragraph>

        <SectionTitle>Opting Out</SectionTitle>
        <Paragraph>
          If you wish to stop receiving SMS notifications from Vetcation, you
          can opt out at any time by texting "STOP" to{" "}
          <strong>+16072589781</strong>. You may also contact us at{" "}
          <strong>+15304006227</strong> to opt out.
        </Paragraph>

        <SectionTitle>Text HELP</SectionTitle>
        <Paragraph>
          If you need assistance or have questions about our SMS notifications,
          text HELP to <strong>+16072589781</strong>.
        </Paragraph>

        <SectionTitle>Privacy Policy</SectionTitle>
        <Paragraph>
          Our SMS notifications are subject to our Privacy Policy. By opting in
          to receive SMS notifications, you acknowledge that you have read and
          agree to our <Link href="/privacy-policy">Privacy Policy</Link>.
        </Paragraph>

        <SectionTitle>Contacting Us</SectionTitle>
        <Paragraph>
          If you have any questions about these SMS Terms & Conditions, the
          practices of Vetcation, or your dealings with us, please contact us
          at:{" "}
          <Link href="mailto:gcfchen@vetcation.com">gcfchen@vetcation.com</Link>
          .
        </Paragraph>
      </Col>
    </Row>
  </PageContainer>
);

export default SMSTermsPage;
