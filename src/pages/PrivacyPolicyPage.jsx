import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaEnvelope, FaShieldAlt } from "react-icons/fa";

/**
 * PrivacyPolicyPage
 * - Visual style aligned with SupportPage: dark, modern, concise
 * - Mobile-first, readable sections in Cards
 */
export default function PrivacyPolicyPage() {
  //today
  const effectiveDate = "September 16, 2025";

  return (
    <div style={{ background: "#0b0b0b", color: "#fff", minHeight: "100vh" }}>
      <Container className="py-5">
        <Row className="mb-4">
          <Col md={9} lg={8}>
            <h1 className="fw-bold" style={{ fontSize: "2rem" }}>
              Privacy Policy
            </h1>
            <div className="text-secondary mt-2">
              Effective Date:{" "}
              <strong className="text-light">{effectiveDate}</strong>
            </div>
            <p className="text-light mt-3" style={{ opacity: 0.9 }}>
              This Privacy Policy describes how Vetcation collects, uses, and
              protects information on our platform and related services (the
              "Service").
            </p>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={8}>
            <Card bg="dark" text="light" className="shadow-sm border-0">
              <Card.Body>
                <Card.Title
                  as="h2"
                  className="h5 d-flex align-items-center gap-2"
                >
                  <FaShieldAlt /> Disclaimer: We Do Not Sell Your Data
                </Card.Title>
                <Card.Text className="text-secondary">
                  We are committed to safeguarding your privacy and ensuring the
                  security of your personal information.{" "}
                  <strong className="text-light">
                    Vetcation does not sell, trade, or rent Users' personal
                    identification information to others.
                  </strong>{" "}
                  Any data we collect is used solely to provide and improve our
                  services, and we will only share information as described in
                  this Privacy Policy.
                </Card.Text>
              </Card.Body>
            </Card>

            <Card bg="dark" text="light" className="shadow-sm border-0 mt-4">
              <Card.Body>
                <Card.Title as="h2" className="h5">
                  Information We Collect
                </Card.Title>
                <Card.Text className="text-secondary">
                  We may collect personal information when you register, place
                  an order, subscribe to a newsletter, respond to a survey, fill
                  out a form, or use features within the Service. Examples
                  include name, email, mailing address, and phone number. You
                  may visit the Service anonymously. We collect personal
                  information only if you voluntarily submit it; refusal may
                  limit participation in some activities.
                </Card.Text>
              </Card.Body>
            </Card>

            <Card bg="dark" text="light" className="shadow-sm border-0 mt-4">
              <Card.Body>
                <Card.Title as="h2" className="h5">
                  How We Use Collected Information
                </Card.Title>
                <ul className="text-secondary mb-0">
                  <li className="mb-2">
                    <strong className="text-light">
                      To improve customer service:
                    </strong>{" "}
                    Helps us respond to requests and support needs more
                    efficiently.
                  </li>
                  <li className="mb-2">
                    <strong className="text-light">
                      To personalize user experience:
                    </strong>{" "}
                    We may use aggregate information to understand how Users as
                    a group use the Service.
                  </li>
                  <li className="mb-0">
                    <strong className="text-light">
                      To send periodic emails:
                    </strong>{" "}
                    Order updates and responses to inquiries or requests.
                  </li>
                </ul>
              </Card.Body>
            </Card>

            <Card bg="dark" text="light" className="shadow-sm border-0 mt-4">
              <Card.Body>
                <Card.Title as="h2" className="h5">
                  How We Protect Your Information
                </Card.Title>
                <Card.Text className="text-secondary">
                  We adopt appropriate data collection, storage, and processing
                  practices and security measures to protect against
                  unauthorized access, alteration, disclosure, or destruction of
                  personal information, credentials, transaction data, and other
                  information stored on the Service.
                </Card.Text>
              </Card.Body>
            </Card>

            <Card bg="dark" text="light" className="shadow-sm border-0 mt-4">
              <Card.Body>
                <Card.Title as="h2" className="h5">
                  Changes to This Privacy Policy
                </Card.Title>
                <Card.Text className="text-secondary">
                  We may update this Privacy Policy from time to time. When we
                  do, we will revise the effective date above. Please review
                  this page periodically to stay informed about how we protect
                  your information.
                </Card.Text>
              </Card.Body>
            </Card>

            <Card bg="dark" text="light" className="shadow-sm border-0 mt-4">
              <Card.Body>
                <Card.Title as="h2" className="h5">
                  Your Acceptance of These Terms
                </Card.Title>
                <Card.Text className="text-secondary">
                  By using the Service, you agree to this Privacy Policy. If you
                  do not agree, please do not use the Service. Continued use
                  following posted changes signifies your acceptance of those
                  changes.
                </Card.Text>
              </Card.Body>
            </Card>

            <Card bg="dark" text="light" className="shadow-sm border-0 mt-4">
              <Card.Body>
                <Card.Title as="h2" className="h5">
                  No Mobile Information Sharing
                </Card.Title>
                <Card.Text className="text-secondary">
                  No mobile information will be shared with third parties or
                  affiliates for marketing or promotional purposes. All the
                  above categories exclude text messaging originator opt-in data
                  and consent; this information will not be shared with any
                  third parties.
                </Card.Text>
              </Card.Body>
            </Card>

            <Card bg="dark" text="light" className="shadow-sm border-0 mt-4">
              <Card.Body>
                <Card.Title
                  as="h2"
                  className="h5 d-flex align-items-center gap-2"
                >
                  <FaEnvelope /> Contacting Us
                </Card.Title>
                <Card.Text className="text-secondary">
                  If you have questions about this Privacy Policy or your
                  dealings with this Service, please email{" "}
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

          <Col md={4}>
            {/* Reserved column for future quick links or TOC to match SupportPage layout */}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
