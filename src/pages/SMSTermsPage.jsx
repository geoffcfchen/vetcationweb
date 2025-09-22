// SMSTermsPage.jsx (no cards)
import React, { useMemo } from "react";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import { FaSms, FaInfoCircle, FaPhoneAlt, FaShieldAlt } from "react-icons/fa";

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
  scroll-margin-top: 96px; /* anchor offset below sticky navs */
  & svg {
    opacity: 0.9;
  }
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

export default function SMSTermsPage() {
  const primaryNumber = "+16072589781"; // STOP/HELP number
  const altNumber = "+15304006227"; // alternative contact for opt-out

  const sections = useMemo(
    () => [
      {
        id: "consent",
        icon: <FaSms />,
        title: "Consent to Receive SMS",
        body: (
          <>
            By providing your mobile phone number and opting in, you consent to
            receive informational and promotional text messages from Vetcation.
            Message frequency may vary.
          </>
        ),
      },
      {
        id: "rates",
        icon: <FaInfoCircle />,
        title: "Message & Data Rates May Apply",
        body: (
          <>
            Standard message and data rates may apply to messages sent and
            received. These charges are imposed and billed by your mobile
            service provider. Vetcation is not responsible for any charges you
            incur.
          </>
        ),
      },
      {
        id: "carrier",
        icon: <FaShieldAlt />,
        title: "Carrier Disclaimer",
        body: <>Carriers are not liable for delayed or undelivered messages.</>,
      },
      {
        id: "opt-out",
        icon: <FaPhoneAlt />,
        title: "Opting Out",
        body: (
          <>
            To stop receiving SMS notifications from Vetcation, text{" "}
            <strong>STOP</strong> to <strong>{primaryNumber}</strong> at any
            time. You may also contact us at <strong>{altNumber}</strong> to opt
            out.
          </>
        ),
      },
      {
        id: "help",
        title: "Text HELP",
        body: (
          <>
            For assistance or questions about our SMS notifications, text{" "}
            <strong>HELP</strong> to <strong>{primaryNumber}</strong>.
          </>
        ),
      },
      {
        id: "privacy",
        title: "Privacy Policy",
        body: (
          <>
            Our SMS notifications are subject to our{" "}
            <a href="/privacy-policy">Privacy Policy</a>. By opting in, you
            acknowledge that you have read and agree to the Privacy Policy.
          </>
        ),
      },
      {
        id: "contact",
        title: "Contacting Us",
        body: (
          <>
            If you have questions about these SMS Terms &amp; Conditions or your
            dealings with us, please email{" "}
            <a href="mailto:gcfchen@vetcation.com">gcfchen@vetcation.com</a>.
          </>
        ),
      },
    ],
    [primaryNumber, altNumber]
  );

  return (
    <Page>
      <Header>
        <Container>
          <Row>
            <Col lg={9} xl={8}>
              <Title>SMS Terms &amp; Conditions</Title>
              <Sub>
                By opting in to receive SMS notifications from Vetcation, you
                agree to the following terms.
              </Sub>
              <Badge>Program: Vetcation SMS</Badge>
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
