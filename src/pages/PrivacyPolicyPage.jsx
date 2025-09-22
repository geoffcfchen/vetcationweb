// PrivacyPolicyPage.jsx (no cards)
import React, { useMemo } from "react";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import { FaEnvelope, FaShieldAlt } from "react-icons/fa";

/* === Dark theme tokens === */
const Page = styled.main`
  --bg: #0b0b0b;
  --surface: #0b0b0b;
  --border: rgba(255, 255, 255, 0.08);
  --text: #eaeaea;
  --muted: #a1a1a1;
  --accent: #60a5fa;
  --accent-2: #22d3ee;

  background: radial-gradient(
      1200px 600px at 20% -10%,
      #0f172a 0%,
      var(--bg) 45%
    )
    fixed;
  color: var(--text);
  min-height: 100vh;
`;

const Header = styled.header`
  padding: clamp(24px, 4vw, 48px) 0;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(
    180deg,
    rgba(34, 211, 238, 0.06) 0%,
    rgba(96, 165, 250, 0.04) 60%,
    transparent 100%
  );
`;

const Title = styled.h1`
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 800;
  letter-spacing: 0.2px;
  margin: 0;
`;

const Sub = styled.p`
  margin: 12px 0 0 0;
  color: var(--muted);
  max-width: 62ch;
`;

const Badge = styled.span`
  display: inline-block;
  margin-top: 12px;
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 12.5px;
  color: #cfcfcf;
`;

const LayoutCol = styled(Col)`
  @media (min-width: 992px) {
    padding-right: 28px;
  }
`;

/* --- Minimal section style (no card) --- */
const Section = styled.section`
  padding: 0;
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: clamp(18px, 2.2vw, 20px);
  font-weight: 700;
  margin: 0 0 10px 0;
  scroll-margin-top: 96px;
`;

const SectionBody = styled.div`
  color: var(--muted);
  line-height: 1.7;
  a {
    color: #d7e2ff;
    text-decoration: underline dotted;
    text-underline-offset: 2px;
  }
  strong {
    color: var(--text);
  }
`;

const Divider = styled.hr`
  height: 1px;
  border: 0;
  background: var(--border);
  margin: clamp(18px, 3.5vw, 28px) 0;
`;

const List = styled.ul`
  margin: 6px 0 0 0;
  padding-left: 18px;
  color: var(--muted);
  line-height: 1.7;
  li + li {
    margin-top: 6px;
  }
  strong {
    color: var(--text);
  }
`;

const StickyToc = styled.nav`
  position: sticky;
  top: 24px;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.02);
  @media (max-width: 991.98px) {
    margin-top: 18px;
  }
`;

const TocTitle = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--muted);
  margin-bottom: 8px;
`;

const TocList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const TocItem = styled.li`
  a {
    display: block;
    padding: 8px 10px;
    margin: 2px 0;
    border-radius: 10px;
    color: #d7e2ff;
    text-decoration: none;
    font-size: 14px;
    transition: background 0.2s ease, color 0.2s ease, transform 0.04s ease;
    &:hover {
      background: rgba(96, 165, 250, 0.12);
      color: #fff;
      transform: translateY(-1px);
    }
    &:active {
      transform: translateY(0);
    }
  }
`;

const FooterMeta = styled.div`
  margin-top: 16px;
  color: var(--muted);
  font-size: 12.5px;
`;

export default function PrivacyPolicyPage() {
  const effectiveDate = "September 16, 2025";

  const sections = useMemo(
    () => [
      {
        id: "no-sale",
        icon: <FaShieldAlt />,
        title: "Disclaimer: We Do Not Sell Your Data",
        body: (
          <>
            We are committed to safeguarding your privacy and ensuring the
            security of your personal information.{" "}
            <strong>
              Vetcation does not sell, trade, or rent users’ personal
              identification information.
            </strong>{" "}
            Any data we collect is used solely to provide and improve our
            services, and we only share information as described in this Privacy
            Policy.
          </>
        ),
      },
      {
        id: "info-we-collect",
        title: "Information We Collect",
        body: (
          <>
            We may collect personal information when you register, place an
            order, subscribe to a newsletter, respond to a survey, fill out a
            form, or use features within the Service (e.g., name, email, mailing
            address, phone number). You may visit the Service anonymously. We
            collect personal information only if you voluntarily submit it;
            refusal may limit participation in some activities.
          </>
        ),
      },
      {
        id: "how-we-use",
        title: "How We Use Collected Information",
        body: (
          <List>
            <li>
              <strong>To improve customer service:</strong> Helps us respond to
              requests and support needs more efficiently.
            </li>
            <li>
              <strong>To personalize user experience:</strong> We may use
              aggregate information to understand how users as a group use the
              Service.
            </li>
            <li>
              <strong>To send periodic emails:</strong> Order updates and
              responses to inquiries or requests.
            </li>
          </List>
        ),
      },
      {
        id: "security",
        title: "How We Protect Your Information",
        body: (
          <>
            We adopt appropriate data collection, storage, and processing
            practices and security measures to protect against unauthorized
            access, alteration, disclosure, or destruction of personal
            information, credentials, transaction data, and other information
            stored on the Service.
          </>
        ),
      },
      {
        id: "changes",
        title: "Changes to This Privacy Policy",
        body: (
          <>
            We may update this Privacy Policy from time to time. When we do, we
            will revise the effective date above. Please review this page
            periodically to stay informed about how we protect your information.
          </>
        ),
      },
      {
        id: "acceptance",
        title: "Your Acceptance of These Terms",
        body: (
          <>
            By using the Service, you agree to this Privacy Policy. If you do
            not agree, please do not use the Service. Continued use following
            posted changes signifies your acceptance of those changes.
          </>
        ),
      },
      {
        id: "sms",
        title: "No Mobile Information Sharing",
        body: (
          <>
            No mobile information will be shared with third parties or
            affiliates for marketing or promotional purposes. All the above
            categories exclude text messaging originator opt-in data and
            consent; this information will not be shared with any third parties.
          </>
        ),
      },
      {
        id: "contact",
        icon: <FaEnvelope />,
        title: "Contacting Us",
        body: (
          <>
            If you have questions about this Privacy Policy or your dealings
            with this Service, please email{" "}
            <a href="mailto:gcfchen@vetcation.com">gcfchen@vetcation.com</a>.
          </>
        ),
      },
    ],
    []
  );

  return (
    <Page>
      <Header>
        <Container>
          <Row>
            <Col lg={9} xl={8}>
              <Title>Privacy Policy</Title>
              <Sub>
                This Privacy Policy describes how Vetcation collects, uses, and
                protects information on our platform and related services
                (“Service”).
              </Sub>
              <Badge>Effective Date: {effectiveDate}</Badge>
            </Col>
          </Row>
        </Container>
      </Header>

      <Container style={{ paddingTop: 24, paddingBottom: 40 }}>
        <Row className="g-4">
          {/* Main content */}
          <LayoutCol lg={8} xl={8}>
            {sections.map((s, i) => (
              <React.Fragment key={s.id}>
                {i !== 0 && <Divider aria-hidden="true" />}
                <Section id={s.id} aria-labelledby={`${s.id}-title`}>
                  <SectionTitle id={`${s.id}-title`}>
                    {s.icon ?? null}
                    {s.title}
                  </SectionTitle>
                  <SectionBody>{s.body}</SectionBody>
                </Section>
              </React.Fragment>
            ))}
            <FooterMeta>
              Last updated: {new Date().toLocaleDateString()}
            </FooterMeta>
          </LayoutCol>

          {/* Sticky TOC */}
          <Col lg={4} xl={4}>
            <StickyToc aria-label="On this page">
              <TocTitle>On this page</TocTitle>
              <TocList>
                {sections.map((s) => (
                  <TocItem key={s.id}>
                    <a href={`#${s.id}`}>{s.title}</a>
                  </TocItem>
                ))}
              </TocList>
            </StickyToc>
          </Col>
        </Row>
      </Container>
    </Page>
  );
}
