import React from "react";
import styled from "styled-components";

// Importing images and sprite
import testimonialImage from "../images/testimonial2.jpeg";
import sprite from "../images/sprite.svg"; // Ensure this contains the correct icons
import { motion } from "framer-motion";

// Define styled components
const TestimonialsContainer = styled(motion.section)`
  max-width: 1140px;
  margin: 0 auto;
  padding: 5rem 2rem;
  background: #fff; // Assuming a white background for the section
  text-align: center; // Centering the heading
  box-shadow: 0 20px 20px rgba(0, 0, 0, 0.1); // Adding a shadow for a card-like effect
  border-radius: 20px; // Rounded corners for the container
  margin-bottom: 10rem;
`;

const TestimonialBlock = styled.div`
  display: flex;
  align-items: center; // Align items vertically
  gap: 2rem;
  margin-top: 2rem; // Space from the heading
`;

const TestimonialImage = styled.img`
  width: 50%; // Adjust based on the actual size needed
  border-radius: 8px; // Assuming there's a slight rounding on the image
`;

const TestimonialContent = styled.div`
  flex: 1; // Take up remaining space
  padding: 2rem;
  background: #f9f9f9; // Light grey background for the text block
  border-radius: 8px; // Consistent border rounding
  position: relative; // For absolute positioning of the quote icon
`;

const QuoteIcon = styled.div`
  position: absolute;
  top: -50px; // Adjust as needed to position outside the block */
  right: 500px; // Right align the icon
  background: #f56a6a; // Icon background color
  color: white; // Icon color
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Quote = styled.blockquote`
  font-size: 1.5rem;
  font-style: italic;
  color: var(--color-body-darker);
  margin: 0;
`;

const Author = styled.figcaption`
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--color-headings);
  margin-top: 1rem; // Space between quote and author
`;

const TestimonialsSection = () => {
  return (
    <TestimonialsContainer>
      <h2>What our Customers are Saying</h2>
      <TestimonialBlock>
        <TestimonialImage
          src={testimonialImage}
          alt="A happy, smiling customer"
        />
        <TestimonialContent>
          <QuoteIcon>
            <svg width="30" height="30">
              // Adjust size as necessary
              <use xlinkHref={`${sprite}#quotes`} />
            </svg>
          </QuoteIcon>
          <Quote>
            "Vetcation really helps me better use of my time and connect with my
            clients."
          </Quote>
          <Author>Dr. Lee - Sawtelle Clinic</Author>
        </TestimonialContent>
      </TestimonialBlock>
    </TestimonialsContainer>
  );
};

export default TestimonialsSection;
