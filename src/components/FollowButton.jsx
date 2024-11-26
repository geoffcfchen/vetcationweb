// src/components/FollowButton.jsx
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import GlobalContext from "../context/GlobalContext";
import { getFirestore, collection, doc, onSnapshot } from "firebase/firestore";
import useFollowActions from "../hooks/useFollowActions";
import colors from "../config/colors";
import { Button } from "react-bootstrap"; // Use react-bootstrap or another preferred library

const firestore = getFirestore();

function FollowButton({
  userBData,
  Following = "Following",
  Follow = "Follow",
}) {
  const [following, setFollowing] = useState(false);
  const { userData } = useContext(GlobalContext);

  // Add a check to avoid running if userData is null
  const { onFollow, onUnFollow, isLoading } = useFollowActions(
    userData,
    userBData.uid
  );

  useEffect(() => {
    if (!userData) {
      console.warn("User data is missing; cannot fetch following list.");
      return;
    }

    const allUsersThatUserFollowingRef = collection(
      doc(firestore, "following", userData.uid),
      "userFollowing"
    );

    const unsubscribe = onSnapshot(
      allUsersThatUserFollowingRef,
      (querySnapshot) => {
        const allUsersThatUserFollowing = querySnapshot.docs.map(
          (doc) => doc.id
        );
        setFollowing(allUsersThatUserFollowing.includes(userBData.uid));
      },
      (error) => {
        console.error("Error fetching following list: ", error);
      }
    );

    return () => unsubscribe();
  }, [userData, userBData.uid]);

  if (!userData || userBData.uid === userData.uid) {
    return null;
  }

  return (
    <Container>
      <StyledButton
        variant={following ? "outline-dark" : "dark"}
        onClick={following ? onUnFollow : onFollow}
        disabled={isLoading}
      >
        {following ? Following : Follow}
      </StyledButton>
    </Container>
  );
}

export default FollowButton;

// Styled Components
const Container = styled.div`
  width: 110px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledButton = styled(Button)`
  width: 100%;
  color: ${(props) =>
    props.variant === "outline-dark" ? colors.black : "white"};
  border: ${(props) =>
    props.variant === "outline-dark" ? `1px solid ${colors.black}` : "none"};
`;
