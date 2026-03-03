// src/pages/UniversalRecordsPage.jsx
import React from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GetStartedCallout from "../components/GetStartedCallout";
import qrCodeImage from "../images/qrcode7.png";
import SiteShell from "../components/SiteShell";

const PageShell = styled.main`
  background: #f8fafc;
`;

const HeroSection = styled.section`
  background: #0f172a;
  color: #ffffff;
  padding: 4rem 0 3rem;
`;

const Max = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroEyebrow = styled.div`
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9ca3af;
`;

const HeroTitle = styled.h1`
  margin: 10px 0 8px;
  font-size: clamp(32px, 4vw, 44px);
  line-height: 1.15;
  font-weight: 700;
`;

const HeroSubtitle = styled.p`
  margin: 0;
  font-size: 18px;
  line-height: 1.55;
  color: #e5e7eb;
  max-width: 720px;
`;

const ContentSection = styled.section`
  padding: 3rem 0 5rem;
`;

const TwoColumn = styled.div`
  max-width: 1140px;
  margin: 3rem auto 0;
  padding: 0 20px;
  display: grid;
  gap: 2.5rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ColumnCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.75rem 1.75rem 1.5rem;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
`;

const ColumnTitle = styled.h2`
  margin: 0 0 0.75rem;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
`;

const ColumnText = styled.p`
  margin: 0 0 1rem;
  font-size: 16px;
  color: #4b5563;
  line-height: 1.55;
`;

const BulletList = styled.ul`
  margin: 0;
  padding-left: 1.1rem;
  font-size: 15px;
  color: #374151;
  line-height: 1.55;

  li + li {
    margin-top: 0.4rem;
  }
`;

const SectionDivider = styled.div`
  max-width: 1140px;
  margin: 3.25rem auto 0;
  padding: 0 20px;
  border-top: 1px solid #e5e7eb;
`;

const ScreenshotSection = styled.section`
  margin-top: 3.25rem;
  padding: 0 20px;
`;

const ScreenshotShell = styled.div`
  max-width: 1140px;
  margin: 0 auto;
`;

const ScreenshotHeading = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 24px;
  font-weight: 700;
  color: #111827;
`;

const ScreenshotText = styled.p`
  margin: 0 0 1.5rem;
  font-size: 16px;
  color: #4b5563;
  max-width: 720px;
  line-height: 1.55;
`;

const ScreenshotFrame = styled.div`
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.18);
  background: #0b1220;
`;

const ScreenshotImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
`;

function UniversalRecordsPage() {
  return (
    <SiteShell>
      <PageShell>
        <HeroSection>
          <Max>
            <HeroEyebrow>How it works</HeroEyebrow>
            <HeroTitle>From PDFs to a vet-ready timeline</HeroTitle>
            <HeroSubtitle>
              MyPet Health ingests whatever you have (PDFs, photos, exports),
              normalizes key clinical fields into a structured timeline, and
              keeps source-of-truth attachments linked so vets can understand
              the full story fast, especially in emergencies.
            </HeroSubtitle>
          </Max>
        </HeroSection>

        <ContentSection>
          {/* What happens after upload */}
          <TwoColumn>
            <ColumnCard>
              <ColumnTitle>What happens after you upload</ColumnTitle>
              <ColumnText>
                MyPet Health reads your documents and turns them into structured
                medical history, without losing the originals.
              </ColumnText>
              <BulletList>
                <li>Extracts visit dates and groups related records.</li>
                <li>
                  Pulls problems, treatments, medications, labs, and imaging.
                </li>
                <li>Builds a chronological timeline you can scroll quickly.</li>
                <li>
                  Keeps every source document attached for verification and
                  context.
                </li>
              </BulletList>
            </ColumnCard>

            <ColumnCard>
              <ColumnTitle>Source-of-truth stays intact</ColumnTitle>
              <ColumnText>
                The summary is fast. The attachments are the proof.
              </ColumnText>
              <BulletList>
                <li>
                  Original PDFs and photos remain linked to each timeline item.
                </li>
                <li>
                  Easy to confirm details like medication dose or lab values.
                </li>
                <li>
                  Reduces missing history and repeated paperwork across clinics.
                </li>
                <li>Designed for urgent situations, travel, and referrals.</li>
              </BulletList>
            </ColumnCard>
          </TwoColumn>

          <SectionDivider />

          {/* What vets see */}
          <ScreenshotSection>
            <ScreenshotShell>
              <ScreenshotHeading>
                What vets see when you share
              </ScreenshotHeading>
              <ScreenshotText>
                A concise vet-ready summary plus the full timeline, with
                original records attached for context.
              </ScreenshotText>
              <ScreenshotFrame>
                <ScreenshotImage
                  src="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2Fvetsummary.webp?alt=media&token=83ed2036-eeea-46a2-a692-8a2ef3c4d4d2"
                  alt="Example MyPet Health vet-ready summary view"
                />
              </ScreenshotFrame>
            </ScreenshotShell>
          </ScreenshotSection>

          <SectionDivider />

          {/* Privacy + control */}
          <TwoColumn>
            <ColumnCard>
              <ColumnTitle>Owner-controlled sharing</ColumnTitle>
              <ColumnText>
                You decide who can access your pet’s record and when.
              </ColumnText>
              <BulletList>
                <li>Share a secure link when you need help.</li>
                <li>
                  Use it for new clinics, specialists, second opinions, or
                  travel.
                </li>
                <li>
                  Keep your timeline organized even if you switch providers.
                </li>
              </BulletList>
            </ColumnCard>

            <ColumnCard>
              <ColumnTitle>Built to reduce friction for vets</ColumnTitle>
              <ColumnText>
                Vets get context fast, without hunting through portals and email
                threads.
              </ColumnText>
              <BulletList>
                <li>One link for summary plus supporting documents.</li>
                <li>Quick briefing before appointments or urgent care.</li>
                <li>Less time on paperwork, more time on care.</li>
              </BulletList>
            </ColumnCard>
          </TwoColumn>

          <SectionDivider />

          {/* Emergency scenario */}
          <TwoColumn>
            <ColumnCard>
              <ColumnTitle>Emergency example</ColumnTitle>
              <ColumnText>
                Your pet gets sick while traveling or ends up at an ER that has
                never seen them before.
              </ColumnText>
              <BulletList>
                <li>Open MyPet Health.</li>
                <li>Share the vet-ready summary link.</li>
                <li>
                  The ER team sees history, meds, and key problems immediately.
                </li>
              </BulletList>
            </ColumnCard>

            <ColumnCard>
              <ColumnTitle>Why this matters</ColumnTitle>
              <ColumnText>
                Missing history can lead to delays, duplicate tests, and
                avoidable risk. A clear record helps vets act faster with more
                confidence.
              </ColumnText>
              <BulletList>
                <li>Especially important for chronic or complex cases.</li>
                <li>Useful for referrals and specialist handoffs.</li>
                <li>Peace of mind for pet owners.</li>
              </BulletList>
            </ColumnCard>
          </TwoColumn>
        </ContentSection>
      </PageShell>
      <GetStartedCallout qrCodeLink={qrCodeImage} />
    </SiteShell>
  );
}

export default UniversalRecordsPage;
