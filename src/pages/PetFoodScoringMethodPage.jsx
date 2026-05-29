import React from "react";
import styled from "styled-components";
import {
  FiAlertTriangle,
  FiAward,
  FiBarChart2,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiInfo,
  FiLayers,
  FiShield,
  FiSliders,
} from "react-icons/fi";
import SiteShell from "../components/SiteShell";

const Page = styled.main`
  background: #ffffff;
  color: #152019;
`;

const Hero = styled.section`
  background:
    radial-gradient(
      circle at 78% 18%,
      rgba(186, 242, 138, 0.34),
      transparent 30%
    ),
    linear-gradient(180deg, #f8fbf4 0%, #ffffff 100%);
  border-bottom: 1px solid #e3eadf;
`;

const HeroInner = styled.div`
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: 74px 0 64px;
`;

const BackLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #2f6d2e;
  text-decoration: none;
  font-size: 14px;
  font-weight: 850;

  &:hover {
    color: #244f23;
  }
`;

const Kicker = styled.div`
  margin-top: 28px;
  color: #487b35;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  max-width: 860px;
  margin: 14px 0 18px;
  font-size: clamp(38px, 5vw, 64px);
  line-height: 1.04;
  font-weight: 950;
  letter-spacing: 0;
`;

const Lead = styled.p`
  max-width: 780px;
  margin: 0;
  color: #405045;
  font-size: clamp(18px, 2vw, 23px);
  line-height: 1.5;
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 34px;

  @media (max-width: 820px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Stat = styled.div`
  border: 1px solid #dce7d7;
  border-radius: 8px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.78);
`;

const StatValue = styled.div`
  color: #152019;
  font-size: 28px;
  line-height: 1;
  font-weight: 950;
`;

const StatLabel = styled.div`
  margin-top: 8px;
  color: #536059;
  font-size: 14px;
  line-height: 1.35;
  font-weight: 750;
`;

const DistributionBand = styled.section`
  background: #ffffff;
  border-bottom: 1px solid #e5ece5;
`;

const DistributionInner = styled.div`
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: 66px 0;
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  gap: 38px;
  align-items: center;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
    padding: 52px 0;
  }
`;

const DistributionIntro = styled.div`
  max-width: 520px;
`;

const DistributionStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 24px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const MiniStat = styled.div`
  border: 1px solid #dce4dc;
  border-radius: 8px;
  padding: 16px;
  background: #fbfcfa;
`;

const MiniValue = styled.div`
  color: #152019;
  font-size: 26px;
  font-weight: 950;
  line-height: 1;
`;

const MiniLabel = styled.div`
  margin-top: 7px;
  color: #536059;
  font-size: 13px;
  line-height: 1.35;
  font-weight: 750;
`;

const ChartCard = styled.div`
  border: 1px solid #dce4dc;
  border-radius: 8px;
  padding: 22px;
  background: #ffffff;
  box-shadow: 0 18px 42px rgba(43, 54, 45, 0.07);
`;

const ChartTitle = styled.div`
  color: #152019;
  font-size: 18px;
  font-weight: 950;
`;

const ChartNote = styled.p`
  margin: 6px 0 18px;
  color: #66736a;
  font-size: 14px;
  line-height: 1.45;
`;

const Histogram = styled.div`
  display: grid;
  gap: 9px;
`;

const HistogramRow = styled.div`
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr) 54px;
  gap: 12px;
  align-items: center;
  color: #314039;
  font-size: 13px;
  font-weight: 850;
`;

const HistogramTrack = styled.div`
  height: 18px;
  border-radius: 999px;
  background: #edf2ec;
  overflow: hidden;
`;

const HistogramFill = styled.div`
  width: ${(props) => props.$width}%;
  height: 100%;
  border-radius: inherit;
  background: ${(props) => props.$color};
`;

const DistributionLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  margin-top: 18px;
  color: #536059;
  font-size: 13px;
  font-weight: 750;
`;

const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
`;

const LegendSwatch = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(props) => props.$color};
`;

const Section = styled.section`
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: 72px 0;

  @media (max-width: 760px) {
    padding: 54px 0;
  }
`;

const SectionHeader = styled.div`
  max-width: 760px;
  margin-bottom: 28px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: #121c16;
  font-size: clamp(30px, 4vw, 48px);
  line-height: 1.08;
  font-weight: 950;
`;

const SectionText = styled.p`
  margin: 14px 0 0;
  color: #4c5a51;
  font-size: 18px;
  line-height: 1.58;
`;

const StepGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  border: 1px solid #dce4dc;
  border-radius: 8px;
  padding: 22px;
  background: #ffffff;
`;

const IconCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  margin-bottom: 14px;
  background: #ecf8df;
  color: #3f7d32;
  font-size: 22px;
`;

const CardTitle = styled.h3`
  margin: 0;
  color: #152019;
  font-size: 21px;
  line-height: 1.22;
  font-weight: 900;
`;

const CardText = styled.p`
  margin: 10px 0 0;
  color: #536059;
  font-size: 16px;
  line-height: 1.52;
`;

const WeightBand = styled.section`
  background: #f7faf4;
  border-top: 1px solid #e3eadf;
  border-bottom: 1px solid #e3eadf;
`;

const WeightGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const WeightCard = styled(Card)`
  background: #ffffff;
`;

const WeightRows = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 18px;
`;

const WeightRow = styled.div`
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr) 48px;
  gap: 12px;
  align-items: center;
  color: #26342b;
  font-size: 14px;
  font-weight: 800;

  @media (max-width: 520px) {
    grid-template-columns: 1fr 44px;
  }
`;

const WeightName = styled.span`
  @media (max-width: 520px) {
    grid-column: 1 / -1;
  }
`;

const Track = styled.div`
  height: 10px;
  border-radius: 999px;
  background: #e6ece5;
  overflow: hidden;
`;

const Fill = styled.div`
  width: ${(props) => props.$value}%;
  height: 100%;
  border-radius: inherit;
  background: ${(props) => props.$color || "#58b947"};
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const DetailCard = styled(Card)`
  background: ${(props) => props.$soft || "#ffffff"};
`;

const BulletList = styled.ul`
  margin: 14px 0 0;
  padding-left: 20px;
  color: #536059;
  font-size: 16px;
  line-height: 1.55;
`;

const Formula = styled.div`
  margin-top: 18px;
  border-radius: 8px;
  padding: 18px;
  background: #152019;
  color: #ffffff;
  font-size: 17px;
  line-height: 1.5;
  font-weight: 850;
`;

const Grades = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Grade = styled.div`
  border-radius: 8px;
  padding: 16px;
  background: ${(props) => props.$bg};
  color: ${(props) => props.$color || "#152019"};
`;

const GradeName = styled.div`
  font-size: 20px;
  font-weight: 950;
`;

const GradeRange = styled.div`
  margin-top: 5px;
  font-size: 14px;
  font-weight: 850;
`;

const Note = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 22px;
  border: 1px solid #dce4dc;
  border-radius: 8px;
  padding: 16px;
  background: #fbfcfa;
  color: #536059;
  font-size: 15px;
  line-height: 1.5;
`;

const CtaBand = styled.section`
  background: #f1faed;
  border-top: 1px solid #d6ead0;
`;

const CtaInner = styled.div`
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: 56px 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 22px;
  align-items: center;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const Button = styled.a`
  border-radius: 999px;
  min-height: 54px;
  padding: 15px 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  background: #121c16;
  color: #ffffff;
  text-decoration: none;
  font-size: 15px;
  font-weight: 850;

  &:hover {
    color: #ffffff;
    background: #243326;
  }
`;

const scoreSteps = [
  {
    icon: <FiLayers />,
    title: "We classify the product first",
    text: "A daily meal, treat, supplement, topper, and therapeutic diet are not judged in exactly the same way. The app compares products in the right context.",
  },
  {
    icon: <FiBarChart2 />,
    title: "We score several label signals",
    text: "The method reviews ingredient quality, guaranteed analysis, brand nutrition standards, red flags, and helpful functional additions.",
  },
  {
    icon: <FiShield />,
    title: "We show limits and cautions",
    text: "Missing data lowers confidence, toxic ingredients receive hard safety penalties, and every score stays educational rather than medical advice.",
  },
];

const mealWeights = [
  ["Ingredient quality", 36, "#58b947"],
  ["Guaranteed analysis", 30, "#35c979"],
  ["Red flags avoided", 17, "#f9a21b"],
  ["Brand standards", 10, "#4f8de8"],
  ["Helpful extras", 7, "#82b366"],
];

const treatWeights = [
  ["Ingredient quality", 46, "#58b947"],
  ["Red flags avoided", 31, "#f9a21b"],
  ["Brand standards", 10, "#4f8de8"],
  ["Helpful extras", 8, "#82b366"],
  ["Guaranteed analysis", 5, "#35c979"],
];

const topperWeights = [
  ["Ingredient quality", 50, "#58b947"],
  ["Red flags avoided", 30, "#f9a21b"],
  ["Brand standards", 10, "#4f8de8"],
  ["Helpful extras", 10, "#82b366"],
];

const scoreDistribution = [
  ["20-29", 20, "#e85252"],
  ["30-39", 106, "#e85252"],
  ["40-49", 221, "#e85252"],
  ["50-59", 509, "#f9a21b"],
  ["60-69", 1391, "#f9a21b"],
  ["70-79", 3378, "#58b947"],
  ["80-89", 3785, "#58b947"],
  ["90-99", 390, "#2f8f3a"],
];

const maxDistributionCount = Math.max(
  ...scoreDistribution.map(([, count]) => count),
);

function WeightTable({ title, text, rows }) {
  return (
    <WeightCard>
      <CardTitle>{title}</CardTitle>
      <CardText>{text}</CardText>
      <WeightRows>
        {rows.map(([label, value, color]) => (
          <WeightRow key={label}>
            <WeightName>{label}</WeightName>
            <Track>
              <Fill $value={value} $color={color} />
            </Track>
            <span>{value}%</span>
          </WeightRow>
        ))}
      </WeightRows>
    </WeightCard>
  );
}

function ScoreDistributionChart() {
  return (
    <ChartCard>
      <ChartTitle>Current score distribution</ChartTitle>
      <ChartNote>
        Based on 30,000 products+ in the current v1.11 scoring validation
        export.
      </ChartNote>
      <Histogram aria-label="Pet food score distribution">
        {scoreDistribution.map(([bin, count, color]) => (
          <HistogramRow key={bin}>
            <span>{bin}</span>
            <HistogramTrack>
              <HistogramFill
                $color={color}
                $width={Math.max((count / maxDistributionCount) * 100, 2)}
              />
            </HistogramTrack>
            <span>{count.toLocaleString()}</span>
          </HistogramRow>
        ))}
      </Histogram>
      <DistributionLegend>
        <LegendItem>
          <LegendSwatch $color="#e85252" />
          Poor
        </LegendItem>
        <LegendItem>
          <LegendSwatch $color="#f9a21b" />
          Fair
        </LegendItem>
        <LegendItem>
          <LegendSwatch $color="#58b947" />
          Good
        </LegendItem>
        <LegendItem>
          <LegendSwatch $color="#2f8f3a" />
          Excellent
        </LegendItem>
      </DistributionLegend>
    </ChartCard>
  );
}

function PetFoodScoringMethodPage() {
  return (
    <SiteShell>
      <Page>
        <Hero>
          <HeroInner>
            <BackLink href="/">
              <FiChevronLeft />
              Back to Vetcation
            </BackLink>
            <Kicker>Pet food scoring method</Kicker>
            <Title>How Vetcation scores pet food</Title>
            <Lead>
              Our rating is built to make pet food labels easier to understand.
              It turns ingredient lists, guaranteed analysis, brand nutrition
              practices, and label cautions into a transparent score that pet
              parents can review before buying.
            </Lead>

            <HeroGrid>
              <Stat>
                <StatValue>v1.11</StatValue>
                <StatLabel>Current scoring version used by the app</StatLabel>
              </Stat>
              <Stat>
                <StatValue>100</StatValue>
                <StatLabel>Maximum score before category adjustments</StatLabel>
              </Stat>
              <Stat>
                <StatValue>5</StatValue>
                <StatLabel>Main sections behind each rating</StatLabel>
              </Stat>
              <Stat>
                <StatValue>30k+</StatValue>
                <StatLabel>Dog and cat foods available to search</StatLabel>
              </Stat>
            </HeroGrid>
          </HeroInner>
        </Hero>

        <DistributionBand>
          <DistributionInner>
            <DistributionIntro>
              <Kicker>Score distribution</Kicker>
              <SectionTitle>
                Scores are meant to separate stronger labels from weaker ones.
              </SectionTitle>
              <SectionText>
                The method does not make every food look the same. In our
                current scoring export, products range from 26 to 96, with a
                median score of 78. That means a high score is earned, and a low
                score points to real label concerns or missing data.
              </SectionText>
              <DistributionStats>
                <MiniStat>
                  <MiniValue>78</MiniValue>
                  <MiniLabel>Median score</MiniLabel>
                </MiniStat>
                <MiniStat>
                  <MiniValue>26-96</MiniValue>
                  <MiniLabel>Observed score range</MiniLabel>
                </MiniStat>
                <MiniStat>
                  <MiniValue>61</MiniValue>
                  <MiniLabel>10th percentile</MiniLabel>
                </MiniStat>
                <MiniStat>
                  <MiniValue>87</MiniValue>
                  <MiniLabel>90th percentile</MiniLabel>
                </MiniStat>
              </DistributionStats>
            </DistributionIntro>

            <ScoreDistributionChart />
          </DistributionInner>
        </DistributionBand>

        <Section>
          <SectionHeader>
            <SectionTitle>The short version</SectionTitle>
            <SectionText>
              A good score should not feel like a black box. Vetcation starts
              with the product type, scores the most important label evidence,
              then applies safety notes and data-confidence limits.
            </SectionText>
          </SectionHeader>

          <StepGrid>
            {scoreSteps.map((step) => (
              <Card key={step.title}>
                <IconCircle>{step.icon}</IconCircle>
                <CardTitle>{step.title}</CardTitle>
                <CardText>{step.text}</CardText>
              </Card>
            ))}
          </StepGrid>
        </Section>

        <WeightBand>
          <Section>
            <SectionHeader>
              <SectionTitle>Different foods use different weights</SectionTitle>
              <SectionText>
                Complete meals need stronger nutrition review. Treats and
                toppers are more about ingredient quality, red flags, and how
                often they are fed. Therapeutic diets are labeled separately
                because they are designed for medical use.
              </SectionText>
            </SectionHeader>

            <WeightGrid>
              <WeightTable
                title="Daily meals"
                text="Dry and wet foods meant for regular feeding."
                rows={mealWeights}
              />
              <WeightTable
                title="Treats"
                text="Occasional foods where ingredients and red flags matter more than protein math."
                rows={treatWeights}
              />
              <WeightTable
                title="Supplements and toppers"
                text="Products that usually support or add to a meal rather than replace it."
                rows={topperWeights}
              />
              <WeightCard>
                <CardTitle>Therapeutic diets</CardTitle>
                <CardText>
                  Therapeutic foods are still scored for transparency, but the
                  grade is shown as Therapeutic instead of Excellent, Good,
                  Fair, or Poor. These products should be chosen with veterinary
                  guidance.
                </CardText>
                <Formula>
                  Final score = weighted sections + category adjustments +
                  safety notes + missing-data limits
                </Formula>
              </WeightCard>
            </WeightGrid>
          </Section>
        </WeightBand>

        <Section>
          <SectionHeader>
            <SectionTitle>What each section looks for</SectionTitle>
            <SectionText>
              Each section creates its own 0-100 sub-score. The final score is
              the weighted combination, with clear reasons shown in the app.
            </SectionText>
          </SectionHeader>

          <DetailGrid>
            <DetailCard>
              <IconCircle>
                <FiCheckCircle />
              </IconCircle>
              <CardTitle>Ingredient quality</CardTitle>
              <CardText>
                Starts at 60/100 and evaluates the first ingredients.
              </CardText>
              <BulletList>
                <li>Rewards named animal protein near the top.</li>
                <li>Rewards multiple named proteins and recognizable carbs.</li>
                <li>
                  Subtracts for vague proteins, early flavor additives, unnamed
                  animal fat, heavy legumes, and lower-cost starches near the
                  top.
                </li>
                <li>
                  If ingredients are missing, this section is limited to 40/100.
                </li>
              </BulletList>
            </DetailCard>

            <DetailCard>
              <IconCircle>
                <FiSliders />
              </IconCircle>
              <CardTitle>Guaranteed analysis</CardTitle>
              <CardText>
                Starts at 60/100 and uses dry-matter protein, fat, and fiber
                when available.
              </CardText>
              <BulletList>
                <li>Protein is evaluated differently for dogs and cats.</li>
                <li>Typical fat and fiber ranges can add confidence.</li>
                <li>
                  Very high fat or very high fiber can reduce the score for
                  everyday meals.
                </li>
                <li>
                  Missing analysis uses a limited fallback: 55/100 for meals and
                  50/100 for non-meals.
                </li>
              </BulletList>
            </DetailCard>

            <DetailCard>
              <IconCircle>
                <FiAward />
              </IconCircle>
              <CardTitle>Brand nutrition standards</CardTitle>
              <CardText>
                Looks beyond the label at whether the brand is recognized for
                stronger WSAVA-style nutrition and quality-control practices.
              </CardText>
              <BulletList>
                <li>Recognized brands receive 100/100 in this section.</li>
                <li>
                  Brands not currently recognized receive a neutral baseline of
                  50/100.
                </li>
                <li>
                  Missing brand information receives 40/100 because it cannot be
                  evaluated.
                </li>
              </BulletList>
            </DetailCard>

            <DetailCard>
              <IconCircle>
                <FiAlertTriangle />
              </IconCircle>
              <CardTitle>Red flags avoided</CardTitle>
              <CardText>
                Starts at 100/100, then loses points when label concerns are
                detected.
              </CardText>
              <BulletList>
                <li>
                  Checks synthetic preservatives, artificial colors, sweeteners,
                  and artificial flavoring.
                </li>
                <li>
                  Category mapping and ingredient text are both used when
                  available.
                </li>
                <li>
                  If the ingredient list is missing, this section is limited to
                  70/100.
                </li>
              </BulletList>
            </DetailCard>

            <DetailCard>
              <IconCircle>
                <FiShield />
              </IconCircle>
              <CardTitle>Helpful extras</CardTitle>
              <CardText>
                Starts at 0/100 and earns credit for functional additions that
                may support everyday wellness.
              </CardText>
              <BulletList>
                <li>Probiotics or fermentation support can add 35 points.</li>
                <li>Prebiotic fiber can add 25 points.</li>
                <li>Omega-rich oils can add 20 points.</li>
                <li>Joint-support ingredients can add 10 points.</li>
              </BulletList>
            </DetailCard>

            <DetailCard $soft="#fbfcfa">
              <IconCircle>
                <FiInfo />
              </IconCircle>
              <CardTitle>Safety and data confidence</CardTitle>
              <CardText>
                The score also includes guardrails so incomplete or risky labels
                are not over-rated.
              </CardText>
              <BulletList>
                <li>
                  Xylitol receives a hard safety penalty because it is toxic to
                  dogs.
                </li>
                <li>
                  Garlic or onion ingredients are shown as notes because context
                  and amount matter.
                </li>
                <li>
                  If a meal is missing guaranteed analysis, its score is capped
                  at 87.
                </li>
                <li>
                  Data confidence is marked high, medium, or low based on
                  available ingredients, nutrition data, calories, and
                  ingredient categories.
                </li>
              </BulletList>
            </DetailCard>
          </DetailGrid>
        </Section>

        <WeightBand>
          <Section>
            <SectionHeader>
              <SectionTitle>How to read the final score</SectionTitle>
              <SectionText>
                The number is a fast summary, but the explanation matters more.
                Pet parents should open the score details to see which signals
                helped, which signals hurt, and where data was limited.
              </SectionText>
            </SectionHeader>

            <Grades>
              <Grade $bg="#e4f7dc">
                <GradeName>Excellent</GradeName>
                <GradeRange>88-100</GradeRange>
              </Grade>
              <Grade $bg="#eef9e9">
                <GradeName>Good</GradeName>
                <GradeRange>75-87</GradeRange>
              </Grade>
              <Grade $bg="#fff3dc">
                <GradeName>Fair</GradeName>
                <GradeRange>55-74</GradeRange>
              </Grade>
              <Grade $bg="#ffe9e9">
                <GradeName>Poor</GradeName>
                <GradeRange>0-54</GradeRange>
              </Grade>
            </Grades>

            <Note>
              <FiInfo />
              <span>
                Vetcation scores are educational and based on available label
                data. They are not medical recommendations. Pets with medical
                conditions, allergies, growth needs, pregnancy, weight-loss
                plans, or prescription diets should follow veterinary guidance.
              </span>
            </Note>
          </Section>
        </WeightBand>

        <CtaBand>
          <CtaInner>
            <div>
              <SectionTitle>Ready to inspect a label?</SectionTitle>
              <SectionText>
                Search a food, open the score, and review the exact reasons
                behind the rating before it reaches the bowl.
              </SectionText>
            </div>
            <Button href="/">
              Go to pet food scores
              <FiChevronRight />
            </Button>
          </CtaInner>
        </CtaBand>
      </Page>
    </SiteShell>
  );
}

export default PetFoodScoringMethodPage;
