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

const List = styled.ul`
  margin-top: 1rem;
  margin-left: 1.5rem;
  padding-left: 1rem;
  list-style-type: disc;
  color: #555;
`;

const ListItem = styled.li`
  font-size: 1rem;
  line-height: 1.6;
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

const PrivacyPolicyPage = () => (
  <PageContainer>
    <Row className="justify-content-center">
      <Col lg={8}>
        <Title>Privacy Policy</Title>
        <Paragraph>
          Effective Date: <strong>November 26, 2024</strong>
        </Paragraph>
        <Paragraph>
          This Privacy Policy governs the manner in which Vetcation collects,
          uses, maintains, and discloses information collected from users (each,
          a "User") of the Vetcation platform and related services ("Service").
        </Paragraph>

        <SectionTitle>Disclaimer: We Do Not Sell Your Data</SectionTitle>
        <Paragraph>
          We are committed to safeguarding your privacy and ensuring the
          security of your personal information.{" "}
          <strong>
            Vetcation does not sell, trade, or rent Users' personal
            identification information to others.
          </strong>{" "}
          Any data we collect is used solely to provide and improve our
          services, and we will only share information as described in this
          Privacy Policy.
        </Paragraph>

        <SectionTitle>Information We Collect</SectionTitle>
        <Paragraph>
          We may collect personal identification information from Users in
          various ways, including when Users register on the Service, place an
          order, subscribe to the newsletter, respond to a survey, fill out a
          form, and in connection with other activities, services, features, or
          resources we make available on our Service. Users may be asked for
          name, email address, mailing address, phone number, and other
          information. Users may, however, visit our Service anonymously. We
          will collect personal identification information from Users only if
          they voluntarily submit such information to us. Users can always
          refuse to supply personally identifiable information, except that it
          may prevent them from engaging in certain Service-related activities.
        </Paragraph>

        <SectionTitle>How We Use Collected Information</SectionTitle>
        <List>
          <ListItem>
            <strong>To improve customer service:</strong> Information you
            provide helps us respond to your customer service requests and
            support needs more efficiently.
          </ListItem>
          <ListItem>
            <strong>To personalize user experience:</strong> We may use
            information in the aggregate to understand how our Users as a group
            use the services and resources provided on our Service.
          </ListItem>
          <ListItem>
            <strong>To send periodic emails:</strong> We may use the email
            address to send User information and updates pertaining to their
            order. It may also be used to respond to their inquiries, questions,
            and other requests.
          </ListItem>
        </List>

        <SectionTitle>How We Protect Your Information</SectionTitle>
        <Paragraph>
          We adopt appropriate data collection, storage, and processing
          practices and security measures to protect against unauthorized
          access, alteration, disclosure, or destruction of your personal
          information, username, password, transaction information, and data
          stored on our Service.
        </Paragraph>

        <SectionTitle>Changes to This Privacy Policy</SectionTitle>
        <Paragraph>
          Vetcation has the discretion to update this Privacy Policy at any
          time. When we do, we will revise the updated date at the bottom of
          this page. We encourage Users to frequently check this page for any
          changes to stay informed about how we are helping to protect the
          personal information we collect. You acknowledge and agree that it is
          your responsibility to review this Privacy Policy periodically and
          become aware of modifications.
        </Paragraph>

        <SectionTitle>Your Acceptance of These Terms</SectionTitle>
        <Paragraph>
          By using this Service, you signify your acceptance of this policy. If
          you do not agree to this policy, please do not use our Service. Your
          continued use of the Service following the posting of changes to this
          policy will be deemed your acceptance of those changes.
        </Paragraph>

        <SectionTitle>No Mobile Information Sharing</SectionTitle>
        <Paragraph>
          No mobile information will be shared with third parties or affiliates
          for marketing or promotional purposes. All the above categories
          exclude text messaging originator opt-in data and consent; this
          information will not be shared with any third parties.
        </Paragraph>

        <SectionTitle>Contacting Us</SectionTitle>
        <Paragraph>
          If you have any questions about this Privacy Policy, the practices of
          this Service, or your dealings with this Service, please contact us
          at:{" "}
          <Link href="mailto:gcfchen@vetcation.com">gcfchen@vetcation.com</Link>
          .
        </Paragraph>
      </Col>
    </Row>
  </PageContainer>
);

export default PrivacyPolicyPage;
