import React from "react";
import styled from "styled-components";
import easyWebp from "../images/easy.webp";
import easyPng from "../images/easy1@2x.png"; // Adjust the path
// import clockWebp from "./path/to/images/fast1.webp"; // Adjust the path
// import clockPng from "./path/to/images/fast1@2x.png"; // Adjust the path
// import wordpressWebp from "./path/to/images/wordpress1.webp"; // Adjust the path
// import wordpressPng from "./path/to/images/wordpress1@2x.png"; // Adjust the path

// Container for the features section
const FeaturesContainer = styled.section`
  max-width: 1140px;
  margin: 0 auto;
  padding: 5rem 2rem;
`;

// Individual feature block
const FeatureBlock = styled.article`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  gap: 4rem;
  margin: 12rem 0;

  &:first-of-type {
    margin-top: 6rem;
  }

  @media screen and (min-width: 768px) {
    &:nth-of-type(even) .feature__content {
      order: 2;
    }
  }
`;

const FeatureContent = styled.div`
  h3 {
    color: var(--color-headings);
    margin-bottom: 1rem;
    font-size: 2.8rem;
    font-weight: 600;
    line-height: 1.3;
  }

  p {
    color: var(--color-body);
    font-size: 2rem;
    line-height: 1.5;
    margin-top: 0;
  }

  a {
    color: var(--color-accent);
    text-transform: uppercase;
    font-size: 2rem;
    font-weight: bold;
    text-decoration: none;
  }

  a::after {
    content: "-->";
    margin-left: 5px;
    transition: margin 0.15s;
  }

  a:hover::after {
    margin-left: 10px;
  }
`;

const FeatureImage = styled.img`
  width: 100%;
`;

// Example feature component
function Feature({ icon, heading, text, linkText, linkHref, image }) {
  return (
    <FeatureBlock>
      <FeatureContent>
        <span className="icon-container">
          <svg className="icon icon--primary">{/* Use icon dynamically */}</svg>
        </span>
        <h3>{heading}</h3>
        <p>{text}</p>
        <a href={linkHref}>{linkText}</a>
      </FeatureContent>
      <picture>
        <source
          srcSet={`${image.webp} 1x, ${image.webp2x} 2x`}
          type="image/webp"
        />
        <source
          srcSet={`${image.png} 1x, ${image.png2x} 2x`}
          type="image/png"
        />
        <FeatureImage src={image.png} alt={heading} />
      </picture>
    </FeatureBlock>
  );
}

function FeaturesSection() {
  return (
    <FeaturesContainer>
      <header>
        <h2>A community to help you make the right decision for your pets</h2>
      </header>
      <Feature
        icon="easy"
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
      {/* Include other features similarly */}
    </FeaturesContainer>
  );
}

export default FeaturesSection;
