import React from "react";
import styled from "styled-components";
import LeftContainer from "./LeftContainer";
import MainContainerComment from "./MainContainer/MainContainerComment";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 15px;
  border-bottom: 0.5px solid lightgrey;
`;

function Comment({ comment, commentCollectionName, onRemoveBlockedPost }) {
  return (
    <Container>
      <LeftContainer userB={comment.user} />
      <MainContainerComment
        tweet={comment}
        commentCollectionName={commentCollectionName}
        onRemoveBlockedPost={onRemoveBlockedPost}
      />
    </Container>
  );
}

export default Comment;
