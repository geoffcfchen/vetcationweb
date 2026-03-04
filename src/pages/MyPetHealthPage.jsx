// src/pages/MyPetHealthPage.jsx
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SiteShell from "../components/SiteShell";

const Wrap = styled.main`
  max-width: 1140px;
  margin: 0 auto;
  padding: 56px 20px 72px;
`;

const H1 = styled.h1`
  font-size: clamp(40px, 5vw, 56px);
  font-weight: 900;
  margin: 0 0 14px;
  letter-spacing: -0.02em;
  color: #0f172a;
`;

const Lead = styled.p`
  font-size: 20px;
  line-height: 1.7;
  margin: 0 0 18px;
  max-width: 880px;
  color: #334155;
`;

const MetaLine = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0 0 28px;
`;

const H2 = styled.h2`
  margin-top: 38px;
  margin-bottom: 12px;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
`;

const P = styled.p`
  font-size: 18px;
  line-height: 1.75;
  margin: 0 0 16px;
  color: #334155;
  max-width: 920px;
`;

const Ul = styled.ul`
  font-size: 18px;
  line-height: 1.75;
  margin: 0;
  padding-left: 1.1rem;
  color: #334155;

  li + li {
    margin-top: 8px;
  }
`;

const CardRow = styled.section`
  margin-top: 26px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 16px 16px 14px;
`;

const CardTitle = styled.h3`
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
`;

const CardText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
`;

const LinkRow = styled.div`
  margin-top: 18px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const PrimaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border-radius: 999px;
  background: #0f172a;
  color: #ffffff;
  text-decoration: none;
  font-weight: 800;
  font-size: 14px;

  &:hover {
    opacity: 0.92;
  }
`;

const SecondaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border-radius: 999px;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  text-decoration: none;
  font-weight: 800;
  font-size: 14px;
  background: #ffffff;

  &:hover {
    background: #f8fafc;
  }
`;

const Hr = styled.hr`
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 44px 0 0;
`;

function MyPetHealthPage() {
  return (
    <SiteShell>
      <Wrap>
        <H1>MyPet Health</H1>

        <Lead>
          MyPet Health by Vetcation helps you pull your pet’s medical records
          into one place, then turn scattered PDFs and photos into a clear,
          vet-ready timeline you can share in seconds, especially in
          emergencies.
        </Lead>

        <MetaLine>
          Looking for the detailed walkthrough?{" "}
          <Link to="/pet-health-record/">
            See how the universal record works
          </Link>
          .
        </MetaLine>

        <LinkRow>
          <PrimaryLink to="/">Create a pet record</PrimaryLink>
          <SecondaryLink to="/pet-health-record/">
            What vets see when you share
          </SecondaryLink>
        </LinkRow>

        <CardRow>
          <Card>
            <CardTitle>Owner-controlled sharing</CardTitle>
            <CardText>
              Share a secure link when you want. Your pet’s history stays in one
              place instead of being scattered across portals and email.
            </CardText>
          </Card>

          <Card>
            <CardTitle>Built for all visits and emergencies</CardTitle>
            <CardText>
              ER visits move fast. MyPet Health helps you get the important
              history in front of the vet without digging through paperwork.
            </CardText>
          </Card>

          <Card>
            <CardTitle>Works with any clinic</CardTitle>
            <CardText>
              Upload what you have, or request records from clinics and shelters
              using a shareable link.
            </CardText>
          </Card>
        </CardRow>

        <H2>What you can do</H2>
        <Ul>
          <li>Create a profile for each pet</li>
          <li>
            Upload PDFs, lab results, imaging, invoices, and phone photos into
            one timeline
          </li>
          <li>
            Keep a structured “medical memory” that is easy to scroll and review
          </li>
          <li>
            Share your pet’s history with any vet, ER, specialist, or caregiver
            (with permission)
          </li>
        </Ul>

        <H2>Why this matters</H2>
        <P>
          Most pet medical records are siloed across shelters, hospitals, and
          file formats. Even when owners are allowed to request records, it is
          hard to collect everything quickly, which is not ideal in emergencies.
          MyPet Health gives owners a single place to keep the full story ready
          to share.
        </P>

        <H2>Privacy and control</H2>
        <Ul>
          <li>You control what gets shared and when</li>
          <li>Your timeline stays private unless you share it</li>
          <li>Designed to help vets review history faster, not replace care</li>
        </Ul>

        <H2>FAQ</H2>
        <Ul>
          <li>
            <strong>Is MyPet Health a vet clinic?</strong> No. MyPet Health is a
            record organization and sharing platform for pet owners.
          </li>
          <li>
            <strong>Can my vet upload records?</strong> Yes. You can send a
            secure link to your clinic or shelter to request records.
          </li>
          <li>
            <strong>Does it work if I only have photos and PDFs?</strong> Yes.
            Upload what you have. We organize everything into a timeline view.
          </li>
        </Ul>

        <Hr />
      </Wrap>
    </SiteShell>
  );
}

export default MyPetHealthPage;
