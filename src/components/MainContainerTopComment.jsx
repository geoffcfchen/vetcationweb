// src/components/MainContainerTopComment.jsx
import React from "react";
import styled from "styled-components";
import moment from "moment";
import LeftContainer from "./LeftContainer";
// import FooterQA from "./FooterQA"; // Assuming FooterQA is another component you’ve converted
import AppText from "./AppText";
import NameBadge from "./NameBadge";
import FooterQA from "./FooterQA";

const Container = styled.div`
  padding: 10px;
  border: 2px solid lightblue;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const TweetHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TweetHeaderNames = styled.div`
  display: flex;
  align-items: center;
`;

const Username = styled.span`
  margin-left: 2px;
  color: grey;
`;

const CreatedAt = styled.span`
  margin-right: 5px;
  color: grey;
`;

const Content = styled.p`
  margin-top: 5px;
  line-height: 18px;
`;

const Image = styled.img`
  margin-top: 10px;
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 15px;
`;

const MainContainerTopComment = ({
  topComment,
  commentCollectionName,
  getUserBDataForBottomSheet,
}) => {
  const username = topComment.user?.userName
    ? topComment.user.userName
    : topComment.user.email.substr(0, topComment.user.email.indexOf("@"));

  const normalizedCreatedAt = moment(topComment.createdAt?.toDate()).fromNow();

  return (
    <Container>
      <TweetHeaderContainer>
        <TweetHeaderNames>
          <LeftContainer
            userB={topComment.user}
            getUserBDataForBottomSheet={getUserBDataForBottomSheet}
          />
          <div style={{ marginLeft: 5 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <NameBadge userBData={topComment.user}></NameBadge>
              <Username>@{username}</Username>
            </div>
            <CreatedAt>{normalizedCreatedAt}</CreatedAt>
          </div>
        </TweetHeaderNames>
      </TweetHeaderContainer>

      <div>
        <AppText>{topComment.content}</AppText>
        {topComment.image && (
          <Image src={topComment.image} alt="Comment Image" />
        )}
      </div>

      <FooterQA tweet={topComment} collection="questionComments" comment />
    </Container>
  );
};

export default MainContainerTopComment;
