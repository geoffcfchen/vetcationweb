import React from "react";
import styled from "styled-components";
import moment from "moment";
import AppText from "../../AppText";
import FooterQA from "../../FooterQA";
import MediaDisplay from "../../MediaDisplay";

function MainContainerCommentHeader({
  tweet,
  onImagePress,
  collection,
  tweetExists = true,
}) {
  return (
    <Container>
      {tweet.content && collection === "questions" && (
        <AppText className="content">{tweet.content}</AppText>
      )}
      {tweet.mediaUrls && (
        <MediaDisplay mediaUrls={tweet.mediaUrls} onImageClick={onImagePress} />
      )}
      {tweet.content && collection === "posts" && (
        <AppText className="content">{tweet.content}</AppText>
      )}
      <AppText className="createdAt">
        {moment(tweet.createdAt.toDate()).format("hh:mm A, MM/DD/YYYY")}
      </AppText>
      {tweetExists && (
        <BorderContainer>
          <FooterContainer>
            <FooterQA
              tweet={tweet}
              collection={collection}
              commentHeader={true}
            />
          </FooterContainer>
        </BorderContainer>
      )}
      {tweetExists && <FooterQA tweet={tweet} collection={collection} />}
    </Container>
  );
}

// Styled Components for the layout
const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  .content {
    margin-top: 10px;
    line-height: 1.5;
  }

  .createdAt {
    font-size: 13px;
    color: grey;
    margin-top: 10px;
    margin-bottom: 10px;
  }
`;

const BorderContainer = styled.div`
  border-top: 0.5px solid lightgrey;
  border-bottom: 0.5px solid lightgrey;
  margin-bottom: 10px;
`;

const FooterContainer = styled.div`
  margin-top: 5px;
  margin-bottom: 10px;
`;

export default MainContainerCommentHeader;
