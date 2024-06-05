import React, { useState } from "react";
import styled from "styled-components";
import easyWebp from "../images/easy.webp";
import easyPng from "../images/easy1@2x.png"; // Adjust the path
import fast1Webp from "../images/fast1.webp";
import fast1Png from "../images/fast1@2x.png"; // Adjust the path
import wordpress1Webp from "../images/wordpress1.webp";
import wordpress1Png from "../images/wordpress1@2x.png"; // Adjust the path
import sprite from "../images/sprite.svg"; // Import the sprite path
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa"; // Importing from Font Awesome

const FeaturesContainer = styled.section`
  max-width: 1140px;
  margin: 0 auto;
  padding: 0rem 2rem;
`;

const FeatureBlock = styled(motion.article)`
  display: grid;
  gap: 4rem;
  margin: 12rem 0;

  &:first-of-type {
    margin-top: 6rem;
  }

  &:last-of-type {
    margin-bottom: 6rem; // Reduce or remove bottom margin for the last feature block
  }

  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    &:nth-of-type(even) {
      & > div:first-child {
        order: 2;
      }
    }
  }
`;

const FeatureContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;

  h3 {
    color: var(--color-headings);
    margin-bottom: 1rem;
    font-size: 30px; // Ensuring consistency with inline styles
    font-weight: 600;
    line-height: 1.3;
  }

  p {
    color: var(--color-body);
    font-size: 20px; // Ensuring consistency with inline styles
    line-height: 1.5;
    margin-top: 0;
  }

  a {
    color: red; // Ensuring consistency with inline styles
    text-transform: uppercase;
    font-size: 15px; // Ensuring consistency with inline styles
    font-weight: bold;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    position: relative; // Relative positioning for pseudoelements
  }
`;

const IconContainer = styled.span`
  background: #f3f9fa;
  width: 64px;
  height: 64px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 40px; // Reduced from 40px to 30px
    height: 40px; // Reduced from 40px to 30px
  }
`;

const FeatureImage = styled(motion.img)`
  width: 100%;
`;

// Animation variants
const contentVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", duration: 0.8 } },
};

const imageVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", duration: 0.8 },
  },
};

function Feature({ iconId, heading, text, linkText, linkHref, image }) {
  const [hover, setHover] = useState(false);
  return (
    <FeatureBlock
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <FeatureContent variants={contentVariants}>
        <IconContainer>
          <svg>
            <use xlinkHref={`${sprite}#${iconId}`} />
          </svg>
        </IconContainer>
        <h3 style={{ fontSize: 30 }}>{heading}</h3>
        <p style={{ fontSize: 20 }}>{text}</p>
        <a
          style={{
            fontSize: "15px",
            color: "red",
            display: "inline-flex",
            alignItems: "center",
            textDecoration: "none",
          }}
          href={linkHref}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {linkText}{" "}
          <FaArrowRight
            style={{
              marginLeft: "5px",
              transition: "transform 0.3s ease",
              transform: hover ? "translateX(5px)" : "translateX(0)",
            }}
          />
        </a>
      </FeatureContent>
      <picture>
        <FeatureImage
          variants={imageVariants}
          src={image.png}
          alt={heading}
          as={motion.img} // Applying the motion component directly
        />
      </picture>
    </FeatureBlock>
  );
}

function FeaturesSection() {
  return (
    <FeaturesContainer>
      <header
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100px",
        }}
      >
        <h2>A community to help you make the right decision for your pets</h2>
      </header>
      <Feature
        iconId="easy" // Use the ID of the icon from the sprite
        heading="Super Easy to get advice"
        text="Look no further! Our platform provides a unique opportunity to ask veterinarians questions and gain a veterinary perspective on your furry friend's well-being. Join now to ensure your pet receives the best care possible!"
        linkText="Learn More"
        linkHref="#"
        image={{
          webp: easyWebp,
          webp2x: easyWebp,
          png: easyPng,
          png2x: easyPng,
        }}
      />
      <Feature
        iconId="clock" // Use the ID of the icon from the sprite
        heading="Reserve your earliest appointments"
        text="Looking for early appointments or tired of waiting? Find the perfect solution at clinics near you! Book your earliest appointment today or join the waitlist to shorten your wait time. Don't wait, act now and experience hassle-free healthcare!"
        linkText="Learn More"
        linkHref="#"
        image={{
          webp: fast1Webp,
          webp2x: fast1Webp,
          png: fast1Png,
          png2x: fast1Png,
        }}
      />
      <Feature
        iconId="wordpress" // Use the ID of the icon from the sprite
        heading="Build strong connections with your clients"
        text="Looking for an efficient way to manage your clients and stay connected with them? Our platform can help you do just that! With our user-friendly interface, you can manage your clients with ease and be available to them at all times. Don't let distance or time constraints get in the way of your business. Join now and take your client management to the next level!"
        linkText="Learn More"
        linkHref="#"
        image={{
          webp: wordpress1Webp,
          webp2x: wordpress1Webp,
          png: wordpress1Png,
          png2x: wordpress1Png,
        }}
      />
    </FeaturesContainer>
  );
}

export default FeaturesSection;
