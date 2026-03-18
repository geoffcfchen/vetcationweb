// src/components/ListUser/ListUser.jsx
import React from "react";
import styled from "styled-components";
import LeftContainer from "./LeftContainer";
import MainContainer from "./MainContainer/MainContainer";

function ListUser({
  user,
  Follow = "Follow",
  Following = "Following",
  canFollow = true,
  canNavigate = true,
  hasBorderBottomline = true,
  canAskQuestion = false,
  canAskClinicDoctor,
  onPress,
  canDelete = false,
  isManagerCanDelete = false,
  canSeeMore = false,
}) {
  return (
    <Container hasBorderBottomline={hasBorderBottomline}>
      <LeftContainer user={user} canNavigate={canNavigate} />
      <MainContainer
        user={user}
        Follow={Follow}
        Following={Following}
        canFollow={canFollow}
        canNavigate={canNavigate}
        canAskQuestion={canAskQuestion}
        canAskClinicDoctor={canAskClinicDoctor}
        canDelete={canDelete}
        onPress={onPress}
        isManagerCanDelete={isManagerCanDelete}
        canSeeMore={canSeeMore}
      />
    </Container>
  );
}

export default ListUser;

// Styled components for styles
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 14px 12px;
  border-bottom: ${(props) =>
    props.hasBorderBottomline ? "0.5px solid lightgrey" : "none"};
`;
