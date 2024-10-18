// src/components/TweetQA.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import styled from "styled-components";
import MainContainerQA from "./MainContainerQA"; // Import MainContainerQA

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  padding-bottom: 10px;
  border-bottom: 0.5px solid lightgrey;
  cursor: pointer; // Add cursor style to indicate it's clickable
`;

const TweetQA = ({ tweet, collection }) => {
  const navigate = useNavigate();

  // Handle click to navigate to detailed view
  const handleClick = () => {
    navigate("/feed-detail", { state: { tweet, collection } });
  };

  return (
    <Container onClick={handleClick}>
      <MainContainerQA collection={collection} tweet={tweet} />
    </Container>
  );
};

export default TweetQA;
