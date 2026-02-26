import React from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Wrap = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  padding: 48px 20px;
`;

const H1 = styled.h1`
  font-size: 52px;
  font-weight: 800;
  margin: 0 0 12px;
`;

const P = styled.p`
  font-size: 20px;
  line-height: 1.6;
  margin: 0 0 18px;
`;

const H2 = styled.h2`
  margin-top: 32px;
  font-size: 28px;
`;

const Ul = styled.ul`
  font-size: 18px;
  line-height: 1.7;
`;

function MyPetHealthPage() {
  return (
    <>
      <Header />
      <Wrap>
        <H1>MyPet Health</H1>
        <P>
          MyPet Health by Vetcation helps you keep your pet’s health organized
          in one place. Pull records from any clinic and share in one click,
          message your vet when you need help, and get meds when appropriate.
        </P>

        <H2>What you can do with MyPet Health</H2>
        <Ul>
          <li>
            Pull PDFs, invoices, lab reports, and images from any clinic into
            one timeline
          </li>
          <li>
            Share your pet’s history in one click when you see a new vet or ER
          </li>
          <li>Message your vet when you need help</li>
          <li>
            Use telehealth for treatment and prescriptions when appropriate
          </li>
        </Ul>

        <H2>FAQ</H2>
        <Ul>
          <li>
            <strong>Is MyPet Health a vet clinic?</strong> No. It’s a platform
            that helps you organize records and connect with licensed
            veterinarians.
          </li>
          <li>
            <strong>Can MyPet Health help with prescriptions?</strong> When
            appropriate, telehealth visits may lead to prescriptions and
            fulfillment through a pharmacy, where allowed.
          </li>
        </Ul>
      </Wrap>
      <Footer />
    </>
  );
}

export default MyPetHealthPage;
