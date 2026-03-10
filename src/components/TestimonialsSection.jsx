// src/components/TestimonialsSection.jsx
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const SectionShell = styled.section`
  background: #f3f4f6;
  padding: 5rem 0 6rem;
`;

const TestimonialsContainer = styled(motion.div)`
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Heading = styled.h2`
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.75rem;
`;

const Subheading = styled.p`
  text-align: center;
  font-size: 16px;
  color: #6b7280;
  margin: 0 auto 2.5rem;
  max-width: 760px;
  line-height: 1.55;
`;

const CardsRow = styled.div`
  display: flex;
  gap: 1.75rem;
  overflow-x: auto;
  padding-bottom: 0.75rem;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #e5e7eb;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 999px;
  }
`;

const Card = styled(motion.figure)`
  flex: 0 0 520px;
  max-width: 520px;
  margin: 0;
  background: #ffffff;
  border-radius: 24px;
  padding: 2.25rem 2.5rem 2rem;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.12);
  scroll-snap-align: start;
  position: relative;

  @media (max-width: 768px) {
    flex: 0 0 86vw;
    max-width: 86vw;
    padding: 1.75rem 1.5rem 1.5rem;
  }
`;

const Quote = styled.blockquote`
  margin: 0 0 1.25rem;
  font-size: 16px;
  line-height: 1.6;
  color: #111827;
`;

const Author = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #111827;
`;

const Meta = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-top: 0.15rem;
`;

const testimonials = [
  {
    quote:
      "This app could even save your pet's life if you have to take them to an Emergency Vet or when out of town and they are borded and need help.",
    author: "Kaye W. on BlueSky",
    meta: "Dog parent, San Diego",
  },
  {
    quote:
      "Medical records are usually scattered across clinics. Having the full history in one place, with the source documents attached, is incredibly helpful.",
    author: "Dr. Chen",
    meta: "Small animal vet, Los Angeles",
  },
  {
    quote:
      "I used to bring a binder of papers to every appointment. Now I just share one MyPet Health link and the vet can review everything before we even start.",
    author: "Sarah P.",
    meta: "Dog parent, Pasadena",
  },

  {
    quote:
      "When I get a new patient, missing history slows everything down. A clean timeline plus the original PDFs saves time and prevents mistakes.",
    author: "Dr. Tsou",
    meta: "Small animal vet, Los Angeles",
  },
  {
    quote:
      "I love that I can upload PDFs, lab reports, and even phone photos. It all ends up organized instead of living across email threads and portals.",
    author: "Hannah W.",
    meta: "Cat and dog parent",
  },
  {
    quote:
      "Sharing records used to be a headache. Now I can send a single link for referrals or emergencies and feel confident the next vet sees the full picture.",
    author: "Monica T.",
    meta: "Senior dog parent, Long Beach",
  },
];

const TestimonialsSection = () => {
  return (
    <SectionShell>
      <TestimonialsContainer
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Heading>What people are saying</Heading>
        <Subheading>
          MyPet Health helps pet owners and vets stop chasing paperwork by
          turning scattered files into a structured timeline with source
          documents attached.
        </Subheading>

        <CardsRow>
          {testimonials.map((t, idx) => (
            <Card
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <Quote>“{t.quote}”</Quote>
              <Author>{t.author}</Author>
              <Meta>{t.meta}</Meta>
            </Card>
          ))}
        </CardsRow>
      </TestimonialsContainer>
    </SectionShell>
  );
};

export default TestimonialsSection;
