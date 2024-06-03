import React from "react";
import styled from "styled-components";
import easyWebp from "../images/easy.webp"; // Adjust path as needed
import easyPng from "../images/easy1@2x.png"; // Adjust path as needed

const FeatureBlock = styled.article`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  margin: 12rem 0;

  @media screen and (min-width: 1024px) {
    &:nth-of-type(even) {
      flex-direction: row-reverse;
    }
  }
`;

const FeatureContent = styled.div`
  h3 {
    color: var(--color-primary);
    margin: 1rem 0;
  }
  p {
    margin-top: 0;
  }
`;

const FeatureImage = styled.img`
  width: 100%;
`;

function Feature({ icon, heading, text, linkText, linkHref }) {
  return (
    <FeatureBlock>
      <FeatureContent>
        <h3>{heading}</h3>
        <p>{text}</p>
        <a href={linkHref}>{linkText}</a>
      </FeatureContent>
      <FeatureImage
        src={easyPng}
        srcSet={`${easyWebp} 1x, ${easyPng} 2x`}
        alt="Feature image"
      />
    </FeatureBlock>
  );
}

export default Feature;
