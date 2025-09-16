import React, { useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  ListGroup,
} from "react-bootstrap";
import {
  FaEnvelope,
  FaBookOpen,
  FaShieldAlt,
  FaBug,
  FaPhoneAlt,
  FaClock,
} from "react-icons/fa";

/**
 * Vetcation Support Page
 * - Publicly accessible (no login required)
 * - Clear contact path with mailto fallback
 * - iOS App Review friendly: primary purpose is end‑user support
 * - Concise copy, mobile‑first layout
 */
export default function SupportPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "General",
    subject: "",
    message: "",
  });
  const [validated, setValidated] = useState(false);
  const [showSentHint, setShowSentHint] = useState(false);

  const mailtoHref = useMemo(() => {
    const to = "gcfchen@vetcation.com"; // update if you prefer help@ or support@ alias
    const subject = encodeURIComponent(
      `Vetcation Support: ${form.subject || form.category}`
    );
    const lines = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Category: ${form.category}`,
      "",
      "Issue / Question:",
      form.message,
    ];
    const body = encodeURIComponent(lines.join("\n"));
    return `mailto:${to}?subject=${subject}&body=${body}`;
  }, [form]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const current = e.currentTarget;
    if (!current.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    // For now: open email client with a prefilled message (simple + reliable for App Review)
    window.location.href = mailtoHref;
    setShowSentHint(true);
  }

  return (
    <div style={{ background: "#0b0b0b", color: "#fff", minHeight: "100vh" }}>
      <Container className="py-5">
        <Row className="mb-4">
          <Col md={8} lg={7}>
            <h1 className="fw-bold" style={{ fontSize: "2rem" }}>
              Support
            </h1>
            <p className="text-light" style={{ opacity: 0.9 }}>
              Need help with Vetcation? We’re here for you. Use the contact form
              or email us and we’ll reply as soon as possible.
            </p>
            <div className="d-flex align-items-center gap-3 mt-2">
              <span className="d-inline-flex align-items-center">
                <FaClock className="me-2" />
                Support hours: Mon–Fri, 9am–6pm PT
              </span>
              <span className="d-none d-md-inline">•</span>
              <span className="d-inline-flex align-items-center">
                Typical response: within 1 business day
              </span>
            </div>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Contact form */}
          <Col md={7}>
            <Card bg="dark" text="light" className="shadow-sm border-0">
              <Card.Body>
                <Card.Title as="h2" className="h5 mb-3">
                  Contact us
                </Card.Title>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col sm={6}>
                      <Form.Group controlId="supportName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your name"
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter your name.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group controlId="supportEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          required
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                        />
                        <Form.Control.Feedback type="invalid">
                          A valid email helps us reply.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="g-3 mt-1">
                    <Col sm={6}>
                      <Form.Group controlId="supportCategory">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                        >
                          <option>General</option>
                          <option>Account & Billing</option>
                          <option>Technical Issue</option>
                          <option>Report a Bug</option>
                          <option>Clinic Partner</option>
                          <option>Feedback</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group controlId="supportSubject">
                        <Form.Label>Subject</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          placeholder="Brief summary"
                        />
                        <Form.Control.Feedback type="invalid">
                          Please add a short subject.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group controlId="supportMessage" className="mt-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      required
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us what’s going on. Include your app version and device if relevant."
                    />
                    <Form.Control.Feedback type="invalid">
                      Please include a short description.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-flex gap-2 mt-4">
                    <Button type="submit" variant="primary">
                      Send email
                    </Button>
                    <Button as="a" href={mailtoHref} variant="outline-light">
                      Open in email app
                    </Button>
                  </div>

                  {showSentHint && (
                    <Alert variant="success" className="mt-3">
                      If your email client didn’t open, please email{" "}
                      <a
                        href="mailto:gcfchen@vetcation.com"
                        className="link-light"
                      >
                        gcfchen@vetcation.com
                      </a>{" "}
                      directly.
                    </Alert>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Quick links / info */}
          <Col md={5}>
            <Card bg="dark" text="light" className="shadow-sm border-0 mb-4">
              <Card.Body>
                <Card.Title as="h2" className="h6 mb-3">
                  Helpful links
                </Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item className="bg-dark text-light">
                    <FaBookOpen className="me-2" />
                    <a
                      href="/telemedicine-info/home/introToVetcation"
                      className="link-light"
                    >
                      About telemedicine in Vetcation
                    </a>
                  </ListGroup.Item>
                  <ListGroup.Item className="bg-dark text-light">
                    <FaShieldAlt className="me-2" />
                    <a href="/privacy-policy" className="link-light">
                      Privacy Policy & Data Requests
                    </a>
                  </ListGroup.Item>
                  <ListGroup.Item className="bg-dark text-light">
                    <FaBug className="me-2" />
                    <a
                      href="#"
                      className="link-light"
                      onClick={(e) => e.preventDefault()}
                    >
                      Known Issues & Updates (coming soon)
                    </a>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>

            <Card bg="dark" text="light" className="shadow-sm border-0">
              <Card.Body>
                <Card.Title as="h2" className="h6 mb-3">
                  Emergency care
                </Card.Title>
                <p className="mb-2">
                  If your pet may be in distress, please contact your nearest
                  emergency veterinary hospital immediately. Vetcation support
                  cannot provide medical advice or emergency triage.
                </p>
                <div className="d-flex align-items-center gap-2">
                  <FaPhoneAlt />
                  <span>Call your local emergency vet</span>
                </div>
              </Card.Body>
            </Card>

            {/* <p className="mt-4 small text-secondary mb-0">
              Vetcation is an educational platform; information provided through
              our app is for learning and does not constitute medical advice or
              establish a VCPR.
            </p> */}
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <div className="d-flex flex-wrap gap-3 align-items-center small text-secondary">
              <div>Last updated: {new Date().toLocaleDateString()}</div>
              <span className="d-none d-md-inline">•</span>
              <a className="link-light" href="mailto:gcfchen@vetcation.com">
                <FaEnvelope className="me-2" />
                gcfchen@vetcation.com
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
