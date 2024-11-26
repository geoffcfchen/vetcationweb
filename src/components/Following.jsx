import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, onSnapshot, getFirestore } from "firebase/firestore";
import styled from "styled-components";

export default function Following({ userBData }) {
  const navigate = useNavigate();
  const [followingNumber, setFollowingNumber] = useState(0);
  const db = getFirestore();

  useEffect(() => {
    if (!userBData?.uid) return;

    const FollowingOfUserRef = doc(db, "following", userBData.uid);

    const unsubscribe = onSnapshot(FollowingOfUserRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data.hasOwnProperty("followingCount")) {
          setFollowingNumber(data.followingCount);
        }
      }
    });

    return () => unsubscribe();
  }, [db, userBData?.uid]);

  const handleNavigation = () => {
    navigate("/followScreen", {
      state: {
        userBData,
        Init: "Following",
      },
    });
  };

  return (
    <FollowingContainer onClick={handleNavigation}>
      <FollowingNumber>{followingNumber}</FollowingNumber>
      <FollowingText> Following</FollowingText>
    </FollowingContainer>
  );
}

// Styled Components for styling
const FollowingContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  margin-right: 10px;
`;

const FollowingNumber = styled.span`
  font-size: 16px;
  font-weight: bold;
`;

const FollowingText = styled.span`
  font-size: 16px;
  color: #777;
`;
