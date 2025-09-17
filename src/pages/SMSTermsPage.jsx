import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaSms, FaInfoCircle, FaPhoneAlt, FaShieldAlt } from "react-icons/fa";

/**
 * SMS Terms & Conditions (Dark style)
 * - Matches Support/Privacy dark UI
 * - Clear sections in Cards, mobile-first
 */
export default function SMSTermsPage() {
  const primaryNumber = "+16072589781"; // STOP/HELP number
  const altNumber = "+15304006227"; // alternative contact for opt-out

  return (
    <div style={{ background: "#0b0b0b", color: "#fff", minHeight: "100vh" }}>
      <Container className="py-5">
        <Row className="mb-4">
          <Col md={9} lg={8}>
            <h1 className="fw-bold" style={{ fontSize: "2rem" }}>
              SMS Terms & Conditions
            </h1>
            <p className="text-light mt-2" style={{ opacity: 0.9 }}>
              By opting in to receive SMS notifications from Vetcation, you
              agree to the following terms.
            </p>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={8}>
            {/* Consent */}
            <Card bg="dark" text="light" className="shadow-sm border-0">
              <Card.Body>
                <Card.Title
                  as="h2"
                  className="h5 d-flex align-items-center gap-2"
                >
                  <FaSms /> Consent to Receive SMS
                </Card.Title>
                <Card.Text className="text-secondary">
                  By providing your mobile phone number and opting in, you
                  consent to receive informational and promotional text messages
                  from Vetcation. Message frequency may vary.
                </Card.Text>
              </Card.Body>
            </Card>

            {/* Rates */}
            <Card bg="dark" text="light" className="shadow-sm border-0 mt-4">
              <Card.Body>
                <Card.Title
                  as="h2"
                  className="h5 d-flex align-items-center gap-2"
                >
                  <FaInfoCircle /> Message & Data Rates May Apply
                </Card.Title>
                <Card.Text className="text-secondary">
                  Standard message and data rates may apply to messages sent and
                  received. These charges are imposed and billed by your mobile
                  service provider. Vetcation is not responsible for any charges
                  you incur.
                </Card.Text>
              </Card.Body>
            </Card>

            {/* Carrier Disclaimer */}
            <Card bg="dark" text="light" className="shadow-sm border-0 mt-4">
              <Card.Body>
                <Card.Title
                  as="h2"
                  className="h5 d-flex align-items-center gap-2"
                >
                  <FaShieldAlt /> Carrier Disclaimer
                </Card.Title>
                <Card.Text className="text-secondary">
                  Carriers are not liable for delayed or undelivered messages.
                </Card.Text>
              </Card.Body>
            </Card>

            {/* Opt Out */}
            <Card bg="dark" text="light" className="shadow-sm border-0 mt-4">
              <Card.Body>
                <Card.Title
                  as="h2"
                  className="h5 d-flex align-items-center gap-2"
                >
                  <FaPhoneAlt /> Opting Out
                </Card.Title>
                <Card.Text className="text-secondary">
                  To stop receiving SMS notifications from Vetcation, text{" "}
                  <strong>STOP</strong> to <strong>{primaryNumber}</strong> at
                  any time. You may also contact us at{" "}
                  <strong>{altNumber}</strong> to opt out.
                </Card.Text>
              </Card.Body>
            </Card>

            {/* HELP */}
            <Card bg="dark" text="light" className="shadow-sm border-0 mt-4">
              <Card.Body>
                <Card.Title as="h2" className="h5">
                  Text HELP
                </Card.Title>
                <Card.Text className="text-secondary">
                  For assistance or questions about our SMS notifications, text{" "}
                  <strong>HELP</strong> to <strong>{primaryNumber}</strong>.
                </Card.Text>
              </Card.Body>
            </Card>

            {/* Privacy */}
            <Card bg="dark" text="light" className="shadow-sm border-0 mt-4">
              <Card.Body>
                <Card.Title as="h2" className="h5">
                  Privacy Policy
                </Card.Title>
                <Card.Text className="text-secondary">
                  Our SMS notifications are subject to our{" "}
                  <a className="link-light" href="/privacy-policy">
                    Privacy Policy
                  </a>
                  . By opting in, you acknowledge that you have read and agree
                  to the Privacy Policy.
                </Card.Text>
              </Card.Body>
            </Card>

            {/* Contact */}
            <Card bg="dark" text="light" className="shadow-sm border-0 mt-4">
              <Card.Body>
                <Card.Title as="h2" className="h5">
                  Contacting Us
                </Card.Title>
                <Card.Text className="text-secondary">
                  If you have questions about these SMS Terms & Conditions or
                  your dealings with us, please email{" "}
                  <a className="link-light" href="mailto:gcfchen@vetcation.com">
                    gcfchen@vetcation.com
                  </a>
                  .
                </Card.Text>
              </Card.Body>
            </Card>

            <div className="mt-4 small text-secondary">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </Col>

          <Col md={4}>{/* Reserved for future quick links or TOC */}</Col>
        </Row>
      </Container>
    </div>
  );
}
