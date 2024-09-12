import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function SMSTermsPage() {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={8}>
          <h1>SMS Terms & Conditions</h1>
          <p>
            By opting in to receive SMS notifications from Vetcation, you agree
            to the following terms and conditions:
          </p>

          <h2>Consent to Receive SMS</h2>
          <p>
            By providing your mobile phone number and opting in to receive SMS
            notifications from Vetcation, you consent to receive informational
            and promotional text messages from us. Message frequency may vary.
          </p>

          <h2>Message and Data Rates May Apply</h2>
          <p>
            Standard message and data rates may apply to SMS messages sent and
            received. These charges are imposed and billed by your mobile
            service provider. Vetcation is not responsible for any charges
            incurred as a result of receiving SMS notifications.
          </p>

          <h2>Carrier Disclaimer</h2>
          <p>Carriers are not liable for delayed or undelivered messages.</p>

          <h2>Opting Out</h2>
          <p>
            If you wish to stop receiving SMS notifications from Vetcation, you
            can opt out at any time by texting "STOP" to +16072589781. You may
            also contact us at +15304006227 to opt out.
          </p>

          <h2>Text HELP</h2>
          <p>
            If you need assistance or have questions about our SMS
            notifications, text HELP to +16072589781.
          </p>

          <h2>Privacy Policy</h2>
          <p>
            Our SMS notifications are subject to our Privacy Policy. By opting
            in to receive SMS notifications, you acknowledge that you have read
            and agree to our Privacy Policy.
          </p>

          <h2>Contacting Us</h2>
          <p>
            If you have any questions about these SMS Terms & Conditions, the
            practices of Vetcation, or your dealings with us, please contact us
            at: <a href="mailto:gcfchen@vetcation.com">gcfchen@vetcation.com</a>
            .
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default SMSTermsPage;
