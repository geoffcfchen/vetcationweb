import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import {
  FiHeart,
  FiUsers,
  FiBriefcase,
  FiTarget,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";

const Global = createGlobalStyle`
  :root {
    --bg: #0b0c0f;
    --panel: #121418;
    --muted: #9aa3af;
    --text: #e5e7eb;
    --title: #f3f4f6;
    --accent: #5b9cff;
  }
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body { margin: 0; background: var(--bg); color: var(--text); font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }
`;

const Page = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Hero = styled.section`
  padding: 72px 20px 36px;
  background: radial-gradient(
      1200px 600px at 20% -10%,
      rgba(91, 156, 255, 0.25),
      transparent 60%
    ),
    radial-gradient(
      900px 500px at 80% -10%,
      rgba(91, 156, 255, 0.2),
      transparent 60%
    );
`;

const Container = styled.div`
  width: min(1160px, 94%);
  margin: 0 auto;
`;

const Eyebrow = styled.div`
  font-size: 14px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
`;

const Title = styled.h1`
  margin: 10px 0 14px;
  font-size: clamp(28px, 5.4vw, 44px);
  line-height: 1.15;
  color: var(--title);
`;

const Lead = styled.p`
  margin: 0;
  font-size: clamp(16px, 2.4vw, 18px);
  color: var(--muted);
  max-width: 860px;
`;

const Pillars = styled.section`
  padding: 28px 20px 8px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
  @media (min-width: 880px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled.article`
  background: var(--panel);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: transform 160ms ease, box-shadow 160ms ease,
    border-color 160ms ease;
  will-change: transform;
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(91, 156, 255, 0.3);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  }
`;

const IconWrap = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: rgba(91, 156, 255, 0.12);
  color: var(--accent);
`;

const CardTitle = styled.h2`
  font-size: 20px;
  margin: 0;
  color: var(--title);
`;

const Text = styled.p`
  margin: 0;
  color: var(--text);
  opacity: 0.92;
  font-size: 15.5px;
  line-height: 1.6;
`;

const Section = styled.section`
  padding: 26px 20px;
`;

const SectionTitle = styled.h3`
  font-size: clamp(18px, 2.4vw, 22px);
  margin: 0 0 10px;
  color: var(--title);
`;

const List = styled.ul`
  padding-left: 18px;
  margin: 8px 0 0;
`;

const Bullet = styled.li`
  margin: 8px 0;
  color: var(--text);
  opacity: 0.95;
  font-size: 15.5px;
  line-height: 1.6;
`;

const Small = styled.p`
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.6;
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
  @media (min-width: 880px) {
    grid-template-columns: 1.1fr 1fr;
  }
`;

const Panel = styled.div`
  background: var(--panel);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 18px;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--accent);
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(91, 156, 255, 0.12);
  border: 1px solid rgba(91, 156, 255, 0.22);
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 8px;
  @media (min-width: 720px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const KPI = styled.div`
  background: var(--panel);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 16px;
`;

const KPIVal = styled.div`
  font-size: 22px;
  color: var(--title);
  font-weight: 600;
  margin-bottom: 4px;
`;

const KPILabel = styled.div`
  font-size: 13px;
  color: var(--muted);
`;

export default function MissionsPage() {
  return (
    <Page>
      <Global />

      <Hero>
        <Container>
          <Eyebrow>Vetcation Missions</Eyebrow>
          <Title>
            Build a healthier veterinary ecosystem that works for clinicians,
            clients, and clinics
          </Title>
          <Lead>
            We focus on three problems that shape daily life in veterinary care.
            For each, we design practical systems and policies, then measure
            whether they reduce friction and improve outcomes.
          </Lead>
        </Container>
      </Hero>

      {/* Pillars */}
      <Pillars>
        <Container>
          <Grid>
            <Card id="wellbeing">
              <IconWrap aria-hidden>
                <FiHeart size={22} />
              </IconWrap>
              <CardTitle>Mission 1. Mental health and burnout</CardTitle>
              <Text>
                Make clinical work sustainable. Protect time, reduce avoidable
                conflict, and support healthy boundaries.
              </Text>
              <SectionTitle>What we build</SectionTitle>
              <List>
                <Bullet>
                  Structured telemedicine that respects clinic workflows and
                  clear paths to in person care when needed.
                </Bullet>
                <Bullet>
                  Educational Q&A spaces that are moderated and explicitly non
                  medical advice to lower real time pressure.
                </Bullet>
                <Bullet>
                  Caseload and availability controls so clinicians choose how
                  and when they practice.
                </Bullet>
                <Bullet>
                  Concise visit summaries that cut rework and late night follow
                  ups.
                </Bullet>
              </List>
              <Small>
                Goal: fewer preventable stressors and a culture that values time
                off and focus time.
              </Small>
            </Card>

            <Card id="communication">
              <IconWrap aria-hidden>
                <FiUsers size={22} />
              </IconWrap>
              <CardTitle>Mission 2. Clients and conflict</CardTitle>
              <Text>
                Improve understanding, set expectations early, and reduce heat
                in difficult moments.
              </Text>
              <SectionTitle>What we build</SectionTitle>
              <List>
                <Bullet>
                  Pre visit intake with clear scope, pricing visibility, and
                  consent templates.
                </Bullet>
                <Bullet>
                  Plain language care plans and summaries that clients can share
                  with their home hospital.
                </Bullet>
                <Bullet>
                  Community standards that prohibit harassment and protect
                  staff.
                </Bullet>
                <Bullet>
                  Educational content that explains tradeoffs, not just
                  treatments.
                </Bullet>
              </List>
              <Small>
                Goal: fewer misunderstandings and smoother handoffs between
                virtual and in person care.
              </Small>
            </Card>

            <Card id="workmodels">
              <IconWrap aria-hidden>
                <FiBriefcase size={22} />
              </IconWrap>
              <CardTitle>Mission 3. Fair work models and contracts</CardTitle>
              <Text>
                Increase clarity and predictability for independent
                veterinarians and partner hospitals.
              </Text>
              <SectionTitle>What we build</SectionTitle>
              <List>
                <Bullet>
                  Transparent wallet accounting and a cents first payout model
                  with recorded splits.
                </Bullet>
                <Bullet>
                  Hospital facilitation fee framed as platform service revenue,
                  not a share of professional fees.
                </Bullet>
                <Bullet>
                  No negative accrual and no coercive noncompete language in
                  platform terms.
                </Bullet>
                <Bullet>
                  Contract literacy resources and dashboards that make
                  compensation easy to understand.
                </Bullet>
              </List>
              <Small>
                Goal: align incentives without burnout or hidden penalties.
              </Small>
            </Card>
          </Grid>
        </Container>
      </Pillars>

      {/* How we operate */}
      <Section>
        <Container>
          <TwoCol>
            <Panel>
              <SectionTitle>
                <FiTarget style={{ verticalAlign: "-2px" }} /> Principles that
                guide product decisions
              </SectionTitle>
              <List>
                <Bullet>
                  Safety and compliance first. Telemedicine follows state rules
                  and local clinic policies.
                </Bullet>
                <Bullet>
                  Education is not medical advice. Our public Q&A exists for
                  learning and community.
                </Bullet>
                <Bullet>
                  Clinician control. Vets choose availability, scope, and
                  preferred partner clinics.
                </Bullet>
                <Bullet>
                  Respect for client budgets. Upfront scopes and summaries that
                  avoid surprise.
                </Bullet>
              </List>
              <TagRow>
                <Tag>
                  <FiCheckCircle /> Measurable
                </Tag>
                <Tag>
                  <FiCheckCircle /> Sustainable
                </Tag>
                <Tag>
                  <FiCheckCircle /> Clinic friendly
                </Tag>
                <Tag>
                  <FiCheckCircle /> Vet first
                </Tag>
              </TagRow>
            </Panel>

            <Panel>
              <SectionTitle>
                <FiInfo style={{ verticalAlign: "-2px" }} /> What we measure
              </SectionTitle>
              <KPIGrid>
                <KPI>
                  <KPIVal>Lower conflict rate</KPIVal>
                  <KPILabel>
                    Share of visits with escalations or complaints
                  </KPILabel>
                </KPI>
                <KPI>
                  <KPIVal>Faster handoffs</KPIVal>
                  <KPILabel>
                    Time from virtual summary to in person booking when needed
                  </KPILabel>
                </KPI>
                <KPI>
                  <KPIVal>Healthy schedules</KPIVal>
                  <KPILabel>
                    Average weekly focus hours and time off taken by clinicians
                  </KPILabel>
                </KPI>
              </KPIGrid>
              <Small style={{ marginTop: 10 }}>
                We publish methods and definitions so partners can verify
                results.
              </Small>
            </Panel>
          </TwoCol>
        </Container>
      </Section>

      {/* Implementation details */}
      <Section>
        <Container>
          <Panel>
            <SectionTitle>
              How these missions show up in the product
            </SectionTitle>
            <List>
              <Bullet>
                Partnered telemedicine between independent veterinarians and
                hospitals with clear escalation paths.
              </Bullet>
              <Bullet>
                Public education spaces that lower real time pressure and set
                expectations for care.
              </Bullet>
              <Bullet>
                Structured visit notes that transfer cleanly to the client’s
                home hospital.
              </Bullet>
              <Bullet>
                Payouts tracked in cents with explicit split snapshots for every
                appointment.
              </Bullet>
              <Bullet>
                Clinician moderation tools and community standards that
                prioritize safety.
              </Bullet>
            </List>
          </Panel>
        </Container>
      </Section>

      <Section>
        <Container>
          <Small>
            Vetcation is a knowledge sharing platform and a telemedicine
            marketplace. Public discussions are educational only and not a
            substitute for veterinary diagnosis or treatment. Telemedicine is
            provided by licensed veterinarians within the scope allowed by state
            law and clinic policy.
          </Small>
        </Container>
      </Section>
    </Page>
  );
}
