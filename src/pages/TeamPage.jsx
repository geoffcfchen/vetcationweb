// src/pages/TeamPage.jsx
import React from "react";
import styled from "styled-components";
import SiteShell from "../components/SiteShell";
import contentData from "../data/docsContentData";

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
  font-size: clamp(32px, 4.3vw, 44px);
  line-height: 1.12;
  font-weight: 800;
  color: #0f172a;
`;

const HeroSubtitle = styled.p`
  margin: 0;
  margin-top: 6px;
  font-size: 18px;
  line-height: 1.6;
  color: #4b5563;
  max-width: 780px;
`;

/* Sections */

const ContentSection = styled.section`
  padding: 3rem 0 4.5rem;
`;

const SectionShell = styled.section`
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 20px;

  & + & {
    margin-top: 3rem;
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 1.75rem;
`;

const SectionTitle = styled.h2`
  margin: 0 0 0.35rem;
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
`;

const SectionSubtitle = styled.p`
  margin: 0;
  font-size: 15px;
  color: #6b7280;
`;

const CardsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const PersonCard = styled.article`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.25rem 1.25rem 1.3rem;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center; /* add this */
  text-align: center; /* add this */
  height: 100%;
`;

const PhotoWrapper = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 1.1rem;
  margin-left: auto;
  margin-right: auto;
  background: #e5e7eb;
  flex-shrink: 0;

  @media (max-width: 640px) {
    width: 110px;
    height: 110px;
  }
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PersonName = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: #111827;
`;

const PersonTitle = styled.p`
  margin: 4px 0 0.65rem;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
`;

const PersonDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.55;
`;

// Simple helper to flatten all "customContributorList" blocks in a section
function getContributorsForSection(section) {
  if (!section || !Array.isArray(section.blocks)) return [];
  const lists = section.blocks
    .filter(
      (b) =>
        b.type === "customContributorList" && Array.isArray(b.contributors),
    )
    .map((b) => b.contributors);
  return lists.flat();
}

function TeamPage() {
  const ourContributors = contentData?.contributors?.ourContributors;

  const coreTeamSection = ourContributors?.sections?.find(
    (s) => s.id === "coreTeam",
  );
  const internsSection = ourContributors?.sections?.find(
    (s) => s.id === "interns",
  );
  const advisorsSection = ourContributors?.sections?.find(
    (s) => s.id === "advisors",
  );
  const contributorsSection = ourContributors?.sections?.find(
    (s) => s.id === "contributors",
  );

  const heroTitle = ourContributors?.mainTitle || "Our team";
  const heroDescription =
    ourContributors?.mainDescription ||
    "MyPet Health is built by a small team of builders, veterinarians and collaborators who care about giving every pet a universal medical record.";

  const coreTeam = getContributorsForSection(coreTeamSection);
  const interns = getContributorsForSection(internsSection);
  const advisors = getContributorsForSection(advisorsSection);
  const contributors = getContributorsForSection(contributorsSection);

  return (
    <SiteShell>
      <PageShell>
        <HeroSection>
          <Max>
            <HeroEyebrow>People behind MyPet Health</HeroEyebrow>
            <HeroTitle>{heroTitle}</HeroTitle>
            <HeroSubtitle>{heroDescription}</HeroSubtitle>
          </Max>
        </HeroSection>

        <ContentSection>
          {/* Team */}
          {coreTeam.length > 0 && (
            <SectionShell>
              <SectionHeader>
                <SectionTitle>Team</SectionTitle>
                <SectionSubtitle>
                  The core team working on product, engineering and design every
                  day.
                </SectionSubtitle>
              </SectionHeader>
              <CardsGrid>
                {coreTeam.map((person) => (
                  <PersonCard key={person.name}>
                    {/* Photo only if present */}
                    {person.photoUrl && (
                      <PhotoWrapper>
                        <Photo src={person.photoUrl} alt={person.name} />
                      </PhotoWrapper>
                    )}
                    <PersonName>{person.name}</PersonName>
                    {person.title && <PersonTitle>{person.title}</PersonTitle>}
                    {person.description && (
                      <PersonDescription>
                        {person.description}
                      </PersonDescription>
                    )}
                  </PersonCard>
                ))}
              </CardsGrid>
            </SectionShell>
          )}

          {/* Interns */}
          {interns.length > 0 && (
            <SectionShell>
              <SectionHeader>
                <SectionTitle>Interns</SectionTitle>
                <SectionSubtitle>
                  Students and early career contributors helping MyPet Health
                  grow.
                </SectionSubtitle>
              </SectionHeader>
              <CardsGrid>
                {interns.map((person) => (
                  <PersonCard key={person.name}>
                    {person.photoUrl && (
                      <PhotoWrapper>
                        <Photo src={person.photoUrl} alt={person.name} />
                      </PhotoWrapper>
                    )}
                    <PersonName>{person.name}</PersonName>
                    {person.title && <PersonTitle>{person.title}</PersonTitle>}
                    {person.description && (
                      <PersonDescription>
                        {person.description}
                      </PersonDescription>
                    )}
                  </PersonCard>
                ))}
              </CardsGrid>
            </SectionShell>
          )}

          {/* Advisors */}
          {advisors.length > 0 && (
            <SectionShell>
              <SectionHeader>
                <SectionTitle>Advisors</SectionTitle>
                <SectionSubtitle>
                  Leaders who have guided the direction of telemedicine and the
                  universal record.
                </SectionSubtitle>
              </SectionHeader>
              <CardsGrid>
                {advisors.map((person) => (
                  <PersonCard key={person.name}>
                    {person.photoUrl && (
                      <PhotoWrapper>
                        <Photo src={person.photoUrl} alt={person.name} />
                      </PhotoWrapper>
                    )}
                    <PersonName>{person.name}</PersonName>
                    {person.title && <PersonTitle>{person.title}</PersonTitle>}
                    {person.description && (
                      <PersonDescription>
                        {person.description}
                      </PersonDescription>
                    )}
                  </PersonCard>
                ))}
              </CardsGrid>
            </SectionShell>
          )}

          {/* Other contributors */}
          {contributors.length > 0 && (
            <SectionShell>
              <SectionHeader>
                <SectionTitle>Contributors</SectionTitle>
                <SectionSubtitle>
                  Veterinary professionals and partners who have shaped features
                  and workflows.
                </SectionSubtitle>
              </SectionHeader>
              <CardsGrid>
                {contributors.map((person) => (
                  <PersonCard key={person.name}>
                    {person.photoUrl && (
                      <PhotoWrapper>
                        <Photo src={person.photoUrl} alt={person.name} />
                      </PhotoWrapper>
                    )}
                    <PersonName>{person.name}</PersonName>
                    {person.title && <PersonTitle>{person.title}</PersonTitle>}
                    {person.description && (
                      <PersonDescription>
                        {person.description}
                      </PersonDescription>
                    )}
                  </PersonCard>
                ))}
              </CardsGrid>
            </SectionShell>
          )}
        </ContentSection>
      </PageShell>
    </SiteShell>
  );
}

export default TeamPage;
