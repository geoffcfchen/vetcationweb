import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, onSnapshot, getFirestore } from "firebase/firestore";
import styled from "styled-components";

export default function Followers({ userBData }) {
  const navigate = useNavigate();
  const [followerNumber, setFollowerNumber] = useState(0);
  const db = getFirestore();

  useEffect(() => {
    if (!userBData?.uid) return;

    const FollowersOfUserRef = doc(db, "followers", userBData.uid);

    const unsubscribe = onSnapshot(FollowersOfUserRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data.hasOwnProperty("followersCount")) {
          setFollowerNumber(data.followersCount);
        }
      }
    });

    return () => unsubscribe();
  }, [db, userBData?.uid]);

  const handleNavigation = () => {
    navigate("/followScreen", {
      state: {
        userBData,
        Init: "Followers",
      },
    });
  };

  return (
    <FollowersContainer onClick={handleNavigation}>
      <FollowerNumber>{followerNumber}</FollowerNumber>
      <FollowerText> Followers</FollowerText>
    </FollowersContainer>
  );
}

// Styled Components for styling
const FollowersContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  margin-right: 10px;
`;

const FollowerNumber = styled.span`
  font-size: 16px;
  font-weight: bold;
`;

const FollowerText = styled.span`
  font-size: 16px;
  color: #777;
`;
