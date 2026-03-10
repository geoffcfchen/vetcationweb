// src/pages/MissionPage.jsx
import React from "react";
import styled from "styled-components";
import SiteShell from "../components/SiteShell";
import GetStartedCallout from "../components/GetStartedCallout";
import qrCodeImage from "../images/qrcode7.png";

const PageShell = styled.main`
  background: #f8fafc;
`;

/* Hero */

const HeroSection = styled.section`
  padding: 4.5rem 0 3.5rem;
  background: radial-gradient(circle at top left, #e0f2fe 0, #f8fafc 48%);
`;

const Max = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroEyebrow = styled.div`
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6b7280;
`;

const HeroTitle = styled.h1`
  margin: 12px 0 10px;
  font-size: clamp(34px, 4.5vw, 46px);
  line-height: 1.12;
  font-weight: 800;
  color: #0f172a;
`;

const HeroSubtitle = styled.p`
  margin: 0;
  margin-top: 6px;
  font-size: 19px;
  line-height: 1.65;
  color: #4b5563;
  max-width: 720px;
`;

/* Main content sections */

const ContentSection = styled.section`
  padding: 3rem 0 4.5rem;
`;

const SectionBlock = styled.section`
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 2.25rem;
  align-items: flex-start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  & + & {
    margin-top: 3rem;
  }
`;

const SectionTitle = styled.h2`
  margin: 0 0 0.75rem;
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
`;

const SectionLead = styled.p`
  margin: 0 0 1rem;
  font-size: 18px;
  color: #475569;
  line-height: 1.65;
`;

const BulletList = styled.ul`
  margin: 0;
  padding-left: 1.1rem;
  font-size: 16px;
  color: #374151;
  line-height: 1.7;

  li + li {
    margin-top: 0.45rem;
  }
`;

const PillRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.75rem;
`;

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 13px;
  color: #0f172a;
  background: #e0f2fe;
  border: 1px solid #bfdbfe;
`;

const CardGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const SmallCard = styled.div`
  background: #ffffff;
  border-radius: 14px;
  padding: 1.1rem 1.25rem 1.1rem;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
`;

const SmallCardTitle = styled.h3`
  margin: 0 0 0.45rem;
  font-size: 17px;
  font-weight: 700;
  color: #111827;
`;
const SmallCardText = styled.p`
  margin: 0;
  font-size: 15px;
  color: #4b5563;
  line-height: 1.6;
`;

/* Divider */

const SectionDivider = styled.div`
  max-width: 1140px;
  margin: 3rem auto;
  padding: 0 20px;
  border-top: 1px solid #e5e7eb;
`;

/* Principles */

const PrincipleList = styled.ul`
  margin: 0;
  padding-left: 1.1rem;
  font-size: 16px;
  color: #374151;
  line-height: 1.7;

  li + li {
    margin-top: 0.5rem;
  }
`;

function MissionPage() {
  return (
    <SiteShell>
      <PageShell>
        <HeroSection>
          <Max>
            <HeroEyebrow>Our mission</HeroEyebrow>
            <HeroTitle>A universal medical record for every pet</HeroTitle>
            <HeroSubtitle>
              MyPet Health exists so pet owners, veterinarians, shelters and
              emergency teams can finally see the same complete story. One
              record that follows the pet for life, instead of fragments
              scattered across portals, emails and paper.
            </HeroSubtitle>
          </Max>
        </HeroSection>

        <ContentSection>
          {/* Problem section */}
          <SectionBlock>
            <div>
              <SectionTitle>
                Why pet health records are broken today
              </SectionTitle>
              <SectionLead>
                Every clinic, rescue and hospital generates its own record. Pet
                owners are expected to be the glue, forwarding PDFs and
                screenshots whenever something important happens.
              </SectionLead>
              <BulletList>
                <li>
                  Records live in separate silos: different practice software,
                  email threads, printed invoices and discharge summaries.
                </li>
                <li>
                  In an emergency, staff often have no history at all. They
                  repeat tests, guess medications or call former clinics while
                  the pet waits.
                </li>
                <li>
                  Shelters and rescues send pets home with single visit packets,
                  not a record that can grow with the animal.
                </li>
                <li>
                  Vets lose time hunting for context instead of using their
                  skills to make decisions.
                </li>
              </BulletList>
            </div>

            <div>
              <SmallCard>
                <SmallCardTitle>The result</SmallCardTitle>
                <SmallCardText>
                  Gaps in history, duplicated work and extra risk for the pet.
                  Owners feel guilty for not having the right paperwork.
                  Clinicians feel frustrated because they are solving a puzzle
                  without all the pieces.
                </SmallCardText>
              </SmallCard>
            </div>
          </SectionBlock>

          <SectionDivider />

          {/* What we are building */}
          <SectionBlock>
            <div>
              <SectionTitle>What we are building</SectionTitle>
              <SectionLead>
                MyPet Health is a universal medical record that is owned by the
                pet family and designed for veterinary teams. It pulls together
                every visit, diagnosis and document into one structured timeline
                that can be shared in seconds.
              </SectionLead>
              <BulletList>
                <li>
                  One place where intake notes, vaccines, lab results, imaging,
                  prescriptions and invoices live together.
                </li>
                <li>
                  A clear timeline that shows what happened, when and why, with
                  the original files one tap away for verification.
                </li>
                <li>
                  A vet ready summary that condenses the history into the key
                  problems, medications and recent changes.
                </li>
                <li>
                  A secure link that owners can share with clinics, ERs,
                  specialists, shelters and telemedicine teams.
                </li>
              </BulletList>
              <PillRow>
                <Pill>Owner controlled</Pill>
                <Pill>Vet ready</Pill>
                <Pill>Follows the pet for life</Pill>
              </PillRow>
            </div>

            <div>
              <CardGrid>
                <SmallCard>
                  <SmallCardTitle>For pet owners</SmallCardTitle>
                  <SmallCardText>
                    A single record instead of a drawer full of papers. Peace of
                    mind that if something happens, the history is ready to
                    share from the phone in your pocket.
                  </SmallCardText>
                </SmallCard>

                <SmallCard>
                  <SmallCardTitle>For veterinary teams</SmallCardTitle>
                  <SmallCardText>
                    The right context at the right time. Less detective work and
                    re entry, more time for examination, thinking and
                    communication.
                  </SmallCardText>
                </SmallCard>

                <SmallCard>
                  <SmallCardTitle>For shelters and rescues</SmallCardTitle>
                  <SmallCardText>
                    A pet leaves with a living record, not just an adoption
                    packet. New vets and adopters see where the pet started and
                    what has already been done.
                  </SmallCardText>
                </SmallCard>

                <SmallCard>
                  <SmallCardTitle>For the system</SmallCardTitle>
                  <SmallCardText>
                    Less duplication, fewer missed details and a clearer picture
                    when cases are complex or involve many providers over time.
                  </SmallCardText>
                </SmallCard>
              </CardGrid>
            </div>
          </SectionBlock>

          <SectionDivider />

          {/* How it works in practice */}
          <SectionBlock>
            <div>
              <SectionTitle>
                How a universal record works in real life
              </SectionTitle>
              <SectionLead>
                Our goal is not to replace clinic software. We focus on the part
                that crosses boundaries, so that every provider and every
                adopter can quickly understand the story so far.
              </SectionLead>
              <BulletList>
                <li>
                  Owners upload PDFs, photos and exports from any clinic,
                  shelter or ER. MyPet Health keeps the originals linked to each
                  timeline entry.
                </li>
                <li>
                  The app builds a chronological view of visits, problems,
                  treatments and results that can be skimmed in a minute.
                </li>
                <li>
                  When care changes clinic, city or state, the owner shares a
                  single secure link instead of chasing forms.
                </li>
                <li>
                  Telemedicine and in person teams see the same record, so
                  advice and decisions are based on the same facts.
                </li>
              </BulletList>
            </div>

            <div>
              <SmallCard>
                <SmallCardTitle>Emergency example</SmallCardTitle>
                <SmallCardText>
                  A pet becomes sick at night in a new city. The ER clinic has
                  never seen them before. With MyPet Health the owner shares a
                  link and staff can skim the timeline and summary while the pet
                  is triaged, instead of starting from zero.
                </SmallCardText>
              </SmallCard>
            </div>
          </SectionBlock>

          <SectionDivider />

          {/* Principles */}
          <SectionBlock>
            <div>
              <SectionTitle>The principles behind MyPet Health</SectionTitle>
              <SectionLead>
                Everything we design follows a few simple rules about who owns
                the record, who it serves and how it should behave in stressful
                moments.
              </SectionLead>
              <PrincipleList>
                <li>
                  The record belongs to the pet family. They decide who can see
                  it and when.
                </li>
                <li>
                  The record is written for veterinary teams. It should be
                  structured, verifiable and fast to read.
                </li>
                <li>
                  The record must include source documents, not just summaries,
                  so details can always be checked.
                </li>
                <li>
                  The record should help in the worst day as much as on ordinary
                  days, especially in emergencies and referrals.
                </li>
                <li>
                  The record should reduce stress for owners and clinicians, not
                  add new logins and confusion.
                </li>
              </PrincipleList>
            </div>

            <div>
              <SmallCard>
                <SmallCardTitle>Where we are going</SmallCardTitle>
                <SmallCardText>
                  Our long term goal is simple. Any time a vet opens a chart or
                  an adopter walks into a clinic, the complete story of that pet
                  is already there. No matter which shelter they started in,
                  which city they moved to or how many clinics they have seen.
                </SmallCardText>
              </SmallCard>
            </div>
          </SectionBlock>
        </ContentSection>
      </PageShell>

      <GetStartedCallout qrCodeLink={qrCodeImage} />
    </SiteShell>
  );
}

export default MissionPage;
