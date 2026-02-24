// src/components/TestimonialsSection.jsx
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import sprite from "../images/sprite.svg";

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
  margin: 0 0 2.5rem;
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

const QuoteIcon = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 2.5rem;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: #f97316;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;

  svg {
    width: 22px;
    height: 22px;
  }

  @media (max-width: 768px) {
    right: 1.5rem;
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
      "I like that vets can review everything in chat first, then decide if we should book a video visit for meds. It feels responsible, not rushed.",
    author: "Monica T.",
    meta: "Senior dog mom, Long Beach",
  },
  {
    quote:
      "I used to bring a folder of papers to every appointment. Now I just send my Vetcation link and my vet already knows our history before we start talking.",
    author: "Sarah P.",
    meta: "Dog parent, Pasadena",
  },

  {
    quote:
      "Having one shared record between our primary, ER, and cardiologist means fewer repeated tests and fewer things slipping through the cracks.",
    author: "Dr. Tsou",
    meta: "Small animal vet, Los Angeles",
  },
  {
    quote:
      "Vetcation helps me see the full medical history, including what other doctors have already tried. That is incredibly helpful, because medical records are usually scattered across different clinics.",
    author: "Dr. Chen",
    meta: "Small animal vet, Los Angeles",
  },

  {
    quote:
      "Being able to message a vet who can see my dog’s timeline makes follow ups much easier. I do not have to repeat the story every single time.",
    author: "Kevin L.",
    meta: "Dog owner, Bay Area",
  },
  {
    quote:
      "I love that I can upload PDFs, lab reports, and even phone photos. It all ends up in one clean view instead of ten different apps and email chains.",
    author: "Hannah W.",
    meta: "Cat and dog parent",
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
          How universal medical records and telemedicine tools change daily
          practice for veterinarians.
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
              {/* <QuoteIcon>
                <svg aria-hidden="true">
                  <use xlinkHref={`${sprite}#quotes`} />
                </svg>
              </QuoteIcon> */}

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
