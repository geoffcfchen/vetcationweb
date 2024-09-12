import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function PrivacyPolicyPage() {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={8}>
          <h1>Privacy Policy</h1>
          <p>
            This Privacy Policy governs the manner in which Vetcation collects,
            uses, maintains, and discloses information collected from users
            (each, a "User") of the Vetcation platform and related services
            ("Service").
          </p>

          <h2>Information We Collect</h2>
          <p>
            We may collect personal identification information from Users in
            various ways, including, but not limited to, when Users register on
            the Service, place an order, subscribe to the newsletter, respond to
            a survey, fill out a form, and in connection with other activities,
            services, features, or resources we make available on our Service.
            Users may be asked for, as appropriate, name, email address, mailing
            address, phone number, and other information. Users may, however,
            visit our Service anonymously. We will collect personal
            identification information from Users only if they voluntarily
            submit such information to us. Users can always refuse to supply
            personally identification information, except that it may prevent
            them from engaging in certain Service-related activities.
          </p>

          <h2>How We Use Collected Information</h2>
          <ul>
            <li>
              To improve customer service: Information you provide helps us
              respond to your customer service requests and support needs more
              efficiently.
            </li>
            <li>
              To personalize user experience: We may use information in the
              aggregate to understand how our Users as a group use the services
              and resources provided on our Service.
            </li>
            <li>
              To send periodic emails: We may use the email address to send User
              information and updates pertaining to their order. It may also be
              used to respond to their inquiries, questions, and/or other
              requests.
            </li>
          </ul>

          <h2>How We Protect Your Information</h2>
          <p>
            We adopt appropriate data collection, storage, and processing
            practices and security measures to protect against unauthorized
            access, alteration, disclosure, or destruction of your personal
            information, username, password, transaction information, and data
            stored on our Service.
          </p>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            Vetcation has the discretion to update this Privacy Policy at any
            time. When we do, we will revise the updated date at the bottom of
            this page. We encourage Users to frequently check this page for any
            changes to stay informed about how we are helping to protect the
            personal information we collect. You acknowledge and agree that it
            is your responsibility to review this Privacy Policy periodically
            and become aware of modifications.
          </p>

          <h2>Your Acceptance of These Terms</h2>
          <p>
            By using this Service, you signify your acceptance of this policy.
            If you do not agree to this policy, please do not use our Service.
            Your continued use of the Service following the posting of changes
            to this policy will be deemed your acceptance of those changes.
          </p>

          <h2>No Mobile Information Sharing</h2>
          <p>
            No mobile information will be shared with third parties/affiliates
            for marketing/promotional purposes. All the above categories exclude
            text messaging originator opt-in data and consent; this information
            will not be shared with any third parties.
          </p>

          <h2>Contacting Us</h2>
          <p>
            If you have any questions about this Privacy Policy, the practices
            of this Service, or your dealings with this Service, please contact
            us at:
            <a href="mailto:gcfchen@vetcation.com">gcfchen@vetcation.com</a>.
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default PrivacyPolicyPage;
