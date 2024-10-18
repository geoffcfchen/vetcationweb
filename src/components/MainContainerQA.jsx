import React from "react";
import LeftContainer from "./LeftContainer"; // Import the LeftContainer component
import MediaDisplay from "./MediaDisplay";
import styled from "styled-components";
import moment from "moment";
import AppText from "./AppText";
import MainContainerTopComment from "./MainContainerTopComment";
import NameBadge from "./NameBadge";
import useGetSingleUser from "../hooks/useGetSingleUser";

const Container = styled.div`
  flex: 1;
  margin-top: 15px;
  margin-bottom: 0;
  padding: 15px;
  border-bottom: 0.5px solid lightgrey;
`;

const TweetHeaderContainer = styled.div`
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
`;

const TweetHeaderNames = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  margin-left: 5px;
`;

// const NameBadge = styled.span`
//   font-weight: bold;
//   margin-right: 5px;
// `;

const Username = styled.span`
  margin-right: 4px;
  color: grey;
`;

const CreatedAt = styled.span`
  color: grey;
`;

const Content = styled.p`
  margin-top: 10px;
  line-height: 18px;
`;

const MenuButton = styled.div`
  cursor: pointer;
`;

const MainContainerQA = ({ tweet, collection }) => {
  const username = tweet.user?.userName
    ? tweet.user?.userName
    : tweet.user.email.substr(0, tweet.user.email.indexOf("@"));
  const { user: upToDateUserData, loading } = useGetSingleUser(tweet.user?.uid);

  const fromNowShort = (date) => {
    const now = moment();
    const createdAt = moment(date);
    const diffMinutes = now.diff(createdAt, "minutes");
    const diffHours = now.diff(createdAt, "hours");
    const diffDays = now.diff(createdAt, "days");

    if (diffMinutes < 60) {
      return `${diffMinutes}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return createdAt.format("MM/DD");
    }
  };

  //   console.log("tweet.user", tweet.user);

  return (
    <Container>
      <TweetHeaderContainer>
        {/* Left side containing the user's profile picture */}
        <LeftContainer userB={tweet.user} collection={collection} />
        <TweetHeaderNames>
          <NameBadge userBData={upToDateUserData}></NameBadge>
          <Username>@{username}</Username>
          <CreatedAt>{fromNowShort(tweet.createdAt?.toDate())}</CreatedAt>
        </TweetHeaderNames>
        <MenuButton>
          <span>⋮</span> {/* Menu icon */}
        </MenuButton>
      </TweetHeaderContainer>

      {/* Render tweet content */}
      {tweet.content && <Content>{tweet.content}</Content>}

      {/* MediaDisplay component to display images or videos */}
      {tweet.mediaUrls && <MediaDisplay mediaUrls={tweet.mediaUrls} />}
      {/* Render top comment */}
      {tweet.topComment && (
        <div style={{ marginTop: "10px" }}>
          <MainContainerTopComment
            topComment={tweet.topComment}
            commentCollectionName={collection + "Comments"}
          />
        </div>
      )}
      {tweet?.numberOfComments !== 0 && collection === "questions" && (
        <AppText
          style={{
            fontSize: 15,
            color: "grey",
            marginTop: 10,
            marginBottom: 5,
          }}
        >
          View all {tweet?.numberOfComments} comments
        </AppText>
      )}
    </Container>
  );
};

export default MainContainerQA;
