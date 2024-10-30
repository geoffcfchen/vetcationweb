import React, { useRef } from "react";
import styled from "styled-components";
import ProfilePicture from "../ProfilePicture";
import useGetSingleUser from "../../hooks/useGetSingleUser";

const Container = styled.div`
  cursor: pointer;
`;

function LeftContainer({
  userB,
  disableNav = false,
  getUserBDataForBottomSheet = null,
}) {
  const profileRef = useRef();
  const { user: parsedCustomers, loading } = useGetSingleUser(userB?.uid);

  const handleClick = () => {
    if (userB?.uid === "AI_Assistant" || disableNav) return;

    if (getUserBDataForBottomSheet) {
      getUserBDataForBottomSheet(parsedCustomers);
    } else {
      // Use window location to navigate or another navigation method for web
      window.location.href = `/profile/${parsedCustomers.uid}`;
    }
  };

  return (
    <Container ref={profileRef} onClick={handleClick}>
      <ProfilePicture userData={parsedCustomers} size={45} />
    </Container>
  );
}

export default LeftContainer;
