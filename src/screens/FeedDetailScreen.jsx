import React from "react";
import styled from "styled-components";
import { AiOutlineArrowLeft } from "react-icons/ai";
import FeedDetails from "../components/FeedDetails";

const ScrollContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh; /* Ensure the container takes the full viewport height */
  overflow-y: auto;
`;

const BackButtonContainer = styled.div`
  position: sticky;
  top: 0;
  background-color: white;
  padding: 10px;
  z-index: 1000;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  background: none;
  color: #1da1f2;
  font-weight: bold;
`;

export default function FeedDetailScreen({
  tweet,
  collection,
  setActiveScreen,
}) {
  const handleBackClick = () => {
    setActiveScreen("Home");
  };

  return (
    <ScrollContainer>
      <BackButtonContainer>
        <BackButton onClick={handleBackClick}>
          <AiOutlineArrowLeft style={{ marginRight: "8px" }} /> Back
        </BackButton>
      </BackButtonContainer>
      <FeedDetails
        tweet={tweet}
        collection={collection}
        setActiveScreen={setActiveScreen}
      />
    </ScrollContainer>
  );
}
