import React, { useState } from "react";
import styled from "styled-components";
import {
  FiAlertTriangle,
  FiAward,
  FiCheckCircle,
  FiChevronRight,
  FiDownload,
  FiSearch,
  FiShield,
  FiSliders,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";
import SiteShell from "../components/SiteShell";
import LoginModal from "../components/LoginModal";
import Feature from "../components/Feature";
import heroImage from "../images/banner4.webp";
import foodImage from "../images/IMG_3381.webp";
import searchImage from "../images/search.webp";
import ingredientImage from "../images/ingredient.webp";
import scoreDetailImage from "../images/pet-food-score-breakdown.png";
import memberFilterImage from "../images/member-filter-products.png";
import qrCodeImage from "../images/qrcode7.png";
import socialImage from "../images/social.jpg";

const Page = styled.main`
  background: #ffffff;
  color: #152019;
`;

const Hero = styled.section`
  overflow: hidden;
  background:
    radial-gradient(
      circle at 82% 18%,
      rgba(255, 205, 87, 0.28),
      transparent 28%
    ),
    #ffffff;
`;

const HeroInner = styled.div`
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
  min-height: calc(100vh - 72px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) 430px;
  gap: 56px;
  align-items: center;
  padding: 64px 0 76px;

  @media (max-width: 940px) {
    min-height: auto;
    grid-template-columns: 1fr;
    padding: 48px 0 64px;
  }
`;

const Kicker = styled.div`
  color: #487b35;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const HeroTitle = styled.h1`
  max-width: 780px;
  margin: 14px 0 18px;
  font-size: clamp(36px, 5.2vw, 60px);
  line-height: 1.04;
  font-weight: 900;
  letter-spacing: 0;
`;

const HeroText = styled.p`
  max-width: 700px;
  margin: 0;
  color: #405045;
  font-size: clamp(19px, 2.2vw, 25px);
  line-height: 1.45;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;

  @media (max-width: 560px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled.button`
  appearance: none;
  border: 0;
  border-radius: 999px;
  min-height: 56px;
  padding: 15px 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #121c16;
  color: #ffffff;
  font-size: 15px;
  font-weight: 850;
  cursor: pointer;
  box-shadow: 0 14px 26px rgba(18, 28, 22, 0.16);

  &:hover {
    background: #243326;
  }
`;

const SecondaryLink = styled.a`
  border: 1px solid #d7ded7;
  border-radius: 999px;
  min-height: 56px;
  padding: 15px 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #18221b;
  text-decoration: none;
  font-size: 15px;
  font-weight: 850;
  background: rgba(255, 255, 255, 0.64);

  &:hover {
    color: #18221b;
    background: #ffffff;
  }
`;

const ProofRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
`;

const ProofPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1px solid #dce4dc;
  border-radius: 999px;
  padding: 8px 11px;
  background: rgba(255, 255, 255, 0.72);
  color: #2b3a30;
  font-size: 13px;
  font-weight: 800;
`;

const HeroFeatureWrap = styled.div`
  display: flex;
  justify-content: center;
  filter: drop-shadow(0 32px 64px rgba(43, 54, 45, 0.24));
`;

const Section = styled.section`
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: 82px 0;

  @media (max-width: 760px) {
    padding: 58px 0;
  }
`;

const CenterHeader = styled.div`
  max-width: 780px;
  margin: 0 auto 34px;
  text-align: center;
`;

const SectionTitle = styled.h2`
  margin: 10px 0 0;
  color: #121c16;
  font-size: clamp(32px, 4.5vw, 54px);
  line-height: 1.08;
  font-weight: 900;
`;

const SectionText = styled.p`
  margin: 14px auto 0;
  max-width: 780px;
  color: #4c5a51;
  font-size: 19px;
  line-height: 1.55;
`;

const IndependenceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const IndependenceCard = styled.article`
  border: 1px solid #dce4dc;
  border-radius: 8px;
  padding: 24px;
  background: #ffffff;
  text-align: center;
`;

const BigIcon = styled.div`
  width: 58px;
  height: 58px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  margin: 0 auto 16px;
  background: #ecf8df;
  color: #3f7d32;
  font-size: 25px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 22px;
  line-height: 1.2;
  font-weight: 900;
`;

const CardText = styled.p`
  margin: 10px 0 0;
  color: #536059;
  font-size: 16px;
  line-height: 1.48;
`;

const QualityBand = styled.section`
  background: #ffffff;
  border-top: 1px solid #e5ece5;
  border-bottom: 1px solid #e5ece5;
`;

const Split = styled.div`
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: 82px 0;
  display: grid;
  grid-template-columns: 430px minmax(0, 1fr);
  gap: 62px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 58px 0;
  }
`;

const CriteriaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-top: 28px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Criteria = styled.div`
  border-radius: 8px;
  padding: 18px;
  background: #ffffff;
  border: 1px solid #dce4dc;
`;

const CriteriaTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  font-weight: 900;
`;

const CriteriaText = styled.p`
  margin: 8px 0 0;
  color: #536059;
  font-size: 15px;
  line-height: 1.45;
`;

const AlternativeGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 26px;
  align-items: center;

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }
`;

const ReasonContent = styled.div`
  ${SectionText} {
    margin-left: 0;
    margin-right: 0;
  }
`;

const MemberBand = styled.section`
  background: #f1faed;
  border-top: 1px solid #d6ead0;
  border-bottom: 1px solid #d6ead0;
`;

const MemberShell = styled.div`
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: 72px 0;
`;

const MemberInner = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 42px;
  align-items: center;
  padding: 34px;
  border: 1px solid #c9e5c0;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 22px 54px rgba(43, 54, 45, 0.08);

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
    padding: 24px;
  }
`;

const ImpactBand = styled.section`
  background: #ffffff;
  color: #152019;
  border-top: 1px solid #e5ece5;
`;

const ImpactInner = styled.div`
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: 78px 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 44px;
  align-items: center;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const ImpactTitle = styled.h2`
  max-width: 760px;
  margin: 0;
  font-size: clamp(28px, 4vw, 46px);
  line-height: 1.12;
  font-weight: 900;
`;

const ImpactHighlight = styled.span`
  color: #3f7d32;
`;

const ImpactText = styled.p`
  max-width: 650px;
  margin: 14px 0 0;
  color: #536059;
  font-size: 17px;
  line-height: 1.55;
`;

const CommunityBand = styled.section`
  background:
    linear-gradient(90deg, rgba(18, 28, 22, 0.86), rgba(18, 28, 22, 0.7)),
    url(${heroImage}) center/cover;
  color: #ffffff;
`;

const CommunityInner = styled.div`
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: 74px 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 42px;
  align-items: center;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const CommunityNumber = styled.div`
  font-size: clamp(62px, 10vw, 106px);
  line-height: 0.9;
  font-weight: 950;
  color: #baf28a;
`;

const CommunityTitle = styled.h2`
  margin: 8px 0 0;
  font-size: clamp(30px, 4vw, 48px);
  line-height: 1.12;
  font-weight: 900;
`;

const CommunityText = styled.p`
  margin: 12px 0 0;
  max-width: 650px;
  color: #f0f6ef;
  font-size: 19px;
  line-height: 1.52;
`;

const QRPanel = styled.div`
  border-radius: 8px;
  padding: 20px;
  background: #ffffff;
  color: #152019;
  text-align: center;
`;

const ImpactPanel = styled(QRPanel)`
  border: 1px solid #c9e5c0;
  box-shadow: 0 18px 42px rgba(43, 54, 45, 0.08);
`;

const QR = styled.img`
  display: block;
  width: 100%;
  max-width: 210px;
  margin: 0 auto 14px;
`;

const SocialImage = styled.img`
  display: block;
  width: 100%;
  border-radius: 8px;
`;

const QRTitle = styled.div`
  font-size: 18px;
  font-weight: 900;
`;

const QRText = styled.p`
  margin: 7px 0 0;
  color: #536059;
  font-size: 14px;
  line-height: 1.4;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(18, 28, 22, 0.56);
`;

const DownloadModal = styled.div`
  width: min(100%, 390px);
  border-radius: 18px;
  padding: 24px;
  background: #ffffff;
  color: #152019;
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.24);
  text-align: center;
`;

const ModalTop = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 4px;
`;

const CloseButton = styled.button`
  appearance: none;
  border: 1px solid #dce4dc;
  border-radius: 999px;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  background: #ffffff;
  color: #152019;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: #f5f8f5;
  }
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 26px;
  line-height: 1.15;
  font-weight: 900;
`;

const ModalText = styled.p`
  margin: 10px auto 18px;
  color: #536059;
  font-size: 15px;
  line-height: 1.45;
`;

const ModalQr = styled.img`
  display: block;
  width: min(240px, 100%);
  margin: 0 auto;
  border-radius: 8px;
`;

const independence = [
  {
    icon: <FiShield />,
    title: "No influence from brands",
    text: "Pet food brands cannot pay to change ratings or recommendations.",
  },
  {
    icon: <FiXCircle />,
    title: "No paid placement",
    text: "Recommendations should be based on food quality and pet fit, not advertising.",
  },
  {
    icon: <FiAward />,
    title: "Built by vets",
    text: "An independent project by veterinary professionals for pet parents.",
  },
];

const criteria = [
  {
    icon: <FiCheckCircle />,
    title: "Ingredient quality",
    text: "Looks at first ingredients, named animal proteins, vague protein sources, legumes, fillers, and early flavor additives.",
  },
  {
    icon: <FiSliders />,
    title: "Guaranteed analysis",
    text: "Uses protein, fat, fiber, and moisture when available. Protein, fat, and fiber are compared on a dry-matter basis.",
  },
  {
    icon: <FiAward />,
    title: "Brand nutrition standards",
    text: "Adds confidence when a brand meets WSAVA-style nutrition standards beyond the product label itself.",
  },
  {
    icon: <FiAlertTriangle />,
    title: "Red flags avoided",
    text: "Starts full when no label red flags are found, then loses points for preservatives, colors, sweeteners, or similar concerns.",
  },
];

const memberFeatures = [
  {
    icon: <FiSliders />,
    title: "Advanced filters",
    text: "Narrow 30,000+ foods by pet, food type, life stage, and breed size.",
  },
  {
    icon: <FiCheckCircle />,
    title: "Health features",
    text: "Filter for brain care, kidney care, sensitive digestion, weight management, and more.",
  },
  {
    icon: <FiSearch />,
    title: "Ingredient search",
    text: "Include or exclude ingredients and ingredient categories based on your pet's needs.",
  },
  {
    icon: <FiShield />,
    title: "Brand standards",
    text: "Find foods from brands recognized for WSAVA-style nutrition standards.",
  },
];

function PetFoodScorePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showQr, setShowQr] = useState(false);

  return (
    <SiteShell>
      <Page>
        <Hero>
          <HeroInner>
            <div>
              <Kicker>Pet food scores</Kicker>
              <HeroTitle>The mobile app that scores pet food.</HeroTitle>
              <HeroText>
                Vetcation deciphers pet food labels and analyzes the health
                impact of food products. Search 30,000+ dog and cat foods to
                find what is good, what is questionable, and what to avoid.
              </HeroText>

              <Actions>
                <PrimaryButton type="button" onClick={() => setShowQr(true)}>
                  <FiDownload />
                  Download the app
                </PrimaryButton>
                <SecondaryLink href="#quality">
                  <FiSearch />
                  Search food ratings
                </SecondaryLink>
              </Actions>

              <ProofRow>
                <ProofPill>
                  <FiUsers />
                  68,000 users and followers on Bluesky
                </ProofPill>
                <ProofPill>
                  <FiShield />
                  100% independent
                </ProofPill>
                <ProofPill>
                  <FiSearch />
                  30,000+ pet foods
                </ProofPill>
              </ProofRow>
            </div>

            <HeroFeatureWrap>
              <Feature
                mediaOnly
                heading="Vetcation mobile app preview"
                text=""
                imageSrc={foodImage}
              />
            </HeroFeatureWrap>
          </HeroInner>
        </Hero>

        <Section>
          <CenterHeader>
            <Kicker>Built by vets for pet parents</Kicker>
            <SectionTitle>A 100% independent project</SectionTitle>
            <SectionText>
              Made for pets, not pet food brands. Pet food companies cannot pay
              to influence scores, rankings, or recommendations.
            </SectionText>
          </CenterHeader>

          <IndependenceGrid>
            {independence.map((item) => (
              <IndependenceCard key={item.title}>
                <BigIcon>{item.icon}</BigIcon>
                <CardTitle>{item.title}</CardTitle>
                <CardText>{item.text}</CardText>
              </IndependenceCard>
            ))}
          </IndependenceGrid>
        </Section>

        <QualityBand id="quality">
          <Split>
            <HeroFeatureWrap>
              <Feature
                mediaOnly
                heading="Pet food score example"
                text=""
                imageSrc={ingredientImage}
              />
            </HeroFeatureWrap>

            <div>
              <Kicker>Evaluate the quality of pet food</Kicker>
              <SectionTitle>
                Do you really know what is in the bowl?
              </SectionTitle>
              <SectionText>
                Marketing claims can make every bag sound healthy. Vetcation
                translates the ingredient panel into a simple score and shows
                the specific reasons behind it, so you can quickly see which
                foods look strong and which ones are worth avoiding.
              </SectionText>
            </div>
          </Split>
        </QualityBand>

        <Section>
          <AlternativeGrid>
            <ReasonContent>
              <Kicker>Understand every score</Kicker>
              <SectionTitle>Clear reasons, not mystery ratings.</SectionTitle>
              <SectionText>
                A score should be useful only if it explains itself. Each rating
                is designed to show the label signals that matter most for pets.
              </SectionText>

              <CriteriaGrid>
                {criteria.map((item) => (
                  <Criteria key={item.title}>
                    <CriteriaTitle>
                      {item.icon}
                      {item.title}
                    </CriteriaTitle>
                    <CriteriaText>{item.text}</CriteriaText>
                  </Criteria>
                ))}
              </CriteriaGrid>
            </ReasonContent>

            <HeroFeatureWrap>
              <Feature
                mediaOnly
                heading="Pet food score detail"
                text=""
                imageSrc={scoreDetailImage}
              />
            </HeroFeatureWrap>
          </AlternativeGrid>
        </Section>

        <CommunityBand>
          <CommunityInner>
            <div>
              <CommunityNumber>68,000+</CommunityNumber>
              <CommunityTitle>
                Join pet parents, users, and followers on Bluesky.
              </CommunityTitle>
              <CommunityText>
                Vetcation is building with a community that cares about safer,
                clearer pet food decisions. Bring your questions, compare
                labels, and help make healthier pet choices easier for everyone.
              </CommunityText>
            </div>

            <QRPanel>
              <SocialImage
                src={socialImage}
                alt="Vetcation Bluesky community"
              />
            </QRPanel>
          </CommunityInner>
        </CommunityBand>

        <Section>
          <AlternativeGrid>
            <HeroFeatureWrap>
              <Feature
                mediaOnly
                heading="Pet food score app placeholder"
                text=""
                imageSrc={searchImage}
              />
            </HeroFeatureWrap>

            <div>
              <Kicker>Start with one food</Kicker>
              <SectionTitle>
                Search the label before the next purchase.
              </SectionTitle>
              <SectionText>
                Look up a product, review the score, and understand the
                tradeoffs before it becomes part of your pet's daily routine.
              </SectionText>
              <Actions>
                <SecondaryLink href="/pet-health-record/">
                  View pet health records
                  <FiChevronRight />
                </SecondaryLink>
              </Actions>
            </div>
          </AlternativeGrid>
        </Section>

        <MemberBand>
          <MemberShell>
            <MemberInner>
              <ReasonContent>
                <Kicker>Member version</Kicker>
                <SectionTitle>
                  Even more ways to find the right food.
                </SectionTitle>
                <SectionText>
                  Member tools help pet parents search faster and filter foods
                  around the details that matter most. The Member version also
                  helps support Vetcation's independence.
                </SectionText>

                <CriteriaGrid>
                  {memberFeatures.map((item) => (
                    <Criteria key={item.title}>
                      <CriteriaTitle>
                        {item.icon}
                        {item.title}
                      </CriteriaTitle>
                      <CriteriaText>{item.text}</CriteriaText>
                    </Criteria>
                  ))}
                </CriteriaGrid>
              </ReasonContent>

              <HeroFeatureWrap>
                <Feature
                  mediaOnly
                  heading="Member filter products"
                  text=""
                  imageSrc={memberFilterImage}
                />
              </HeroFeatureWrap>
            </MemberInner>
          </MemberShell>
        </MemberBand>

        <ImpactBand>
          <ImpactInner>
            <div>
              <ImpactTitle>
                Thanks to Vetcation, pet parents can choose food with{" "}
                <ImpactHighlight>more confidence.</ImpactHighlight>
              </ImpactTitle>
              <ImpactText>
                Search the label, understand the score, and make your next food
                decision with clearer information before it reaches the bowl.
              </ImpactText>
              <Actions>
                <PrimaryButton type="button" onClick={() => setShowQr(true)}>
                  <FiDownload />
                  Download the app
                </PrimaryButton>
              </Actions>
            </div>

            <ImpactPanel>
              <QR src={qrCodeImage} alt="Vetcation app QR code" />
              <QRTitle>Download the app</QRTitle>
              <QRText>
                Scan this QR code with your phone to open Vetcation.
              </QRText>
            </ImpactPanel>
          </ImpactInner>
        </ImpactBand>
      </Page>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      {showQr && (
        <ModalBackdrop role="presentation" onClick={() => setShowQr(false)}>
          <DownloadModal
            role="dialog"
            aria-modal="true"
            aria-labelledby="download-app-title"
            onClick={(event) => event.stopPropagation()}
          >
            <ModalTop>
              <CloseButton
                type="button"
                aria-label="Close download QR code"
                onClick={() => setShowQr(false)}
              >
                x
              </CloseButton>
            </ModalTop>
            <ModalTitle id="download-app-title">Download the app</ModalTitle>
            <ModalText>
              Scan this QR code with your phone to open the Vetcation app.
            </ModalText>
            <ModalQr src={qrCodeImage} alt="Vetcation app QR code" />
          </DownloadModal>
        </ModalBackdrop>
      )}
    </SiteShell>
  );
}

export default PetFoodScorePage;
