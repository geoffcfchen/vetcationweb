// src/pages/UniversalRecordsPage.jsx
import React from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Feature from "../components/Feature";
import GetStartedCallout from "../components/GetStartedCallout";
import qrCodeImage from "../images/qrcode6.png";

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
  font-size: clamp(32px, 4vw, 40px);
  line-height: 1.2;
  font-weight: 600;
`;

const HeroSubtitle = styled.p`
  margin: 0;
  font-size: 18px;
  line-height: 1.5;
  color: #e5e7eb;
  max-width: 640px;
`;

const ContentSection = styled.section`
  padding: 3rem 0 5rem;
`;

const FeatureWrapper = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 20px;
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
  font-weight: 600;
  color: #111827;
`;

const ColumnText = styled.p`
  margin: 0 0 1rem;
  font-size: 16px;
  color: #4b5563;
`;

const BulletList = styled.ul`
  margin: 0;
  padding-left: 1.1rem;
  font-size: 15px;
  color: #374151;

  li + li {
    margin-top: 0.4rem;
  }
`;

const ScreenshotSection = styled.section`
  margin-top: 4rem;
  padding: 0 20px;
`;

const ScreenshotShell = styled.div`
  max-width: 1140px;
  margin: 0 auto;
`;

const ScreenshotHeading = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 24px;
  font-weight: 600;
  color: #111827;
`;

const ScreenshotText = styled.p`
  margin: 0 0 1.5rem;
  font-size: 16px;
  color: #4b5563;
  max-width: 640px;
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

const StepsWrapper = styled.section`
  max-width: 1140px;
  margin: 3rem auto 0;
  padding: 0 20px;
`;

function UniversalRecordsPage() {
  return (
    <>
      <Header />

      <PageShell>
        {/* Top hero copy */}
        <HeroSection>
          <Max>
            <HeroEyebrow>Universal pet health records</HeroEyebrow>
            <HeroTitle>See your pet’s full story in one place</HeroTitle>
            <HeroSubtitle>
              MyPet Health pulls together scattered PDFs, lab results, imaging,
              and visit notes so every vet can see the full picture in seconds,
              especially in emergencies.
            </HeroSubtitle>
          </Max>
        </HeroSection>

        <ContentSection>
          {/* Reuse your Feature layout at the top of this page */}
          {/* <FeatureWrapper>
            <Feature
              heading="Universal pet medical records"
              text="MyPet Health pulls your pet’s scattered records from any clinic into one secure place and turns them into a clear, vet ready timeline. Share it in one click before any visit."
              imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_1534.webp?alt=media&token=531293bb-381f-4090-afdf-08c3742ed450"
              headerFontSize={40}
            />
          </FeatureWrapper> */}
          <StepsWrapper>
            <Feature
              heading="Step 1 · Pull your pet’s health records into MyPet Health"
              text="Upload PDFs and photos from any clinic, ER, shelter, or specialist, or send a secure link to your vets and clinics to request medical records. Everything lands in one secure place instead of being scattered across email and apps."
              imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_1536.webp?alt=media&token=f2086851-3879-4607-acf4-98f7f6ac4733"
              headerFontSize={32}
            />

            <Feature
              heading="Step 2 · MyPet Health understands and organizes your health records"
              text="MyPet Health reads visit dates, problems, treatments, labs, and imaging so it understands your pet’s health history and turns it into a clear, vet ready timeline you can scroll in seconds."
              imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_1538.webp?alt=media&token=a90dfbad-68d9-4d11-b692-6689ad087941"
              headerFontSize={32}
            />

            <Feature
              heading="Step 3 · Share one link before any visit or telehealth call"
              text="Before an in person or telehealth visit, send your MyPet Health link so the vet can review the summary and history ahead of time and focus the appointment on decisions, not paperwork."
              imageSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_1539.webp?alt=media&token=871f676e-cb05-4bdf-9186-96191dced74e"
              headerFontSize={32}
            />
          </StepsWrapper>
          {/* Owner and vet benefits */}
          {/* <TwoColumn>
            <ColumnCard>
              <ColumnTitle>For pet owners</ColumnTitle>
              <ColumnText>
                Keep everything in one place so you are not digging through
                emails and portals when your pet needs help.
              </ColumnText>
              <BulletList>
                <li>
                  Upload records from any clinic, shelter, ER, or specialist.
                </li>
                <li>
                  See a simple, date ordered timeline of visits, labs, and
                  imaging.
                </li>
                <li>Share a secure link with your vet in one click.</li>
                <li>Bring the same organized history to every new hospital.</li>
              </BulletList>
            </ColumnCard>

            <ColumnCard>
              <ColumnTitle>For veterinarians</ColumnTitle>
              <ColumnText>
                Start each case with context so you can spend more time on
                thinking and less time hunting for files.
              </ColumnText>
              <BulletList>
                <li>
                  Review past diagnoses, medications, and lab trends at a
                  glance.
                </li>
                <li>
                  See which clinics have treated the pet before and what was
                  done.
                </li>
                <li>
                  Use the AI summary as a quick briefing before walking into the
                  room.
                </li>
                <li>
                  Reduce duplicate tests and missed history in urgent or complex
                  cases.
                </li>
              </BulletList>
            </ColumnCard>
          </TwoColumn> */}
          {/* Big full width summary screenshot */}
          <ScreenshotSection>
            <ScreenshotShell>
              <ScreenshotHeading>
                What the MyPet Health vet summary link looks like in laptop
              </ScreenshotHeading>
              <ScreenshotText>
                MyPet Health turns scattered health records into a structured
                clinical timeline and a clear summary, so every vet can see key
                problems, treatments, and milestones at a glance.
              </ScreenshotText>
              <ScreenshotFrame>
                <ScreenshotImage
                  src="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2Fvetsummary.webp?alt=media&token=83ed2036-eeea-46a2-a692-8a2ef3c4d4d2"
                  alt="Example universal health record summary view in Vetcation"
                />
              </ScreenshotFrame>
            </ScreenshotShell>
          </ScreenshotSection>
        </ContentSection>
      </PageShell>
      <GetStartedCallout qrCodeLink={qrCodeImage} />

      <Footer />
    </>
  );
}

export default UniversalRecordsPage;
