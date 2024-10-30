// src/components/FeedDetails.jsx
import React, { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Comment from "./Tweet/Comment";
import LeftContainerCommentHeader from "./Tweet/LeftContainerCommentHeader";
import MainContainerCommentHeader from "./Tweet/MainContainer/MainContainerCommentHeader";
import {
  getFirestore,
  doc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import AppText from "./AppText";
import GlobalContext from "../context/GlobalContext";
import NewCommentButton from "./NewCommentButton";
import checkRole from "../utility/checkRole";

const Container = styled.div`
  width: 100%;
  padding: 15px;
  border-bottom: 0.5px solid lightgrey;
`;

const HeaderContainer = styled.div`
  margin-bottom: 15px;
`;

const DeletedPostMessage = styled.div`
  margin-top: 20px;
  text-align: center;
  font-weight: bold;
`;

const HeaderComponent = ({
  tweetDetails,
  collectionName,
  onImagePress,
  tweetExists,
}) => (
  <>
    <Container>
      <LeftContainerCommentHeader
        tweet={tweetDetails}
        collection={collectionName}
        tweetExists={tweetExists}
      />
      <MainContainerCommentHeader
        tweet={tweetDetails}
        onImagePress={onImagePress}
        collection={collectionName}
        tweetExists={tweetExists}
      />
    </Container>
    {!tweetExists && (
      <DeletedPostMessage>
        <AppText>This post has been deleted</AppText>
      </DeletedPostMessage>
    )}
  </>
);

function FeedDetails({ tweet, collection: collectionName }) {
  const [parsedComments, setParsedComments] = useState([]);
  const [imageViewVisible, setImageViewVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [tweetDetails, setTweetDetails] = useState(tweet);
  const [tweetExists, setTweetExists] = useState(true);
  const role = checkRole();
  const { userData } = useContext(GlobalContext);

  // console.log("tweet", tweet);

  // console.log("userData", userData);

  const [stats, setStats] = useState({
    numberOfUpvotes: tweet?.numberOfUpvotes,
    numberOfVetUpvotes: tweet?.numberOfVetUpvotes,
    numberOfTechUpvotes: tweet?.numberOfTechUpvotes,
    numberOfLikes: tweet?.numberOfLikes,
    numberOfComments: tweet?.numberOfComments,
    numberOfRetweets: tweet?.numberOfRetweets,
    numberOfBookmarks: tweet?.numberOfBookmarks,
  });

  const commentCollectionName =
    collectionName === "posts" ? "postComments" : "questionComments";

  const onImagePress = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setImageViewVisible(true);
  };

  const onCloseImageView = () => {
    setImageViewVisible(false);
    setSelectedImageUrl(null);
  };

  const db = getFirestore();
  const tweetRef = doc(collection(db, collectionName), tweet.id);
  const allUserCommentsRef = query(
    collection(db, commentCollectionName),
    where("postId", "==", tweet.id)
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(
      tweetRef,
      (doc) => {
        if (doc.exists()) {
          const newData = doc.data();
          if (
            newData.content !== tweetDetails.content ||
            JSON.stringify(newData.mediaUrls) !==
              JSON.stringify(tweetDetails.mediaUrls)
          ) {
            setTweetDetails(newData);
          }
        } else {
          setTweetExists(false);
        }
      },
      (error) => {
        console.error("Error fetching tweet: ", error);
        alert("Failed to fetch tweet details.");
      }
    );

    return () => unsubscribe();
  }, [tweet.id]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      allUserCommentsRef,
      (querySnapshot) => {
        const comments = querySnapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .filter((comment) => !comment.isDeleted)
          .sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
        setParsedComments(comments);
      },
      (error) => {
        console.error("Error fetching comments: ", error);
        alert("Failed to fetch comments.");
      }
    );

    return () => unsubscribe();
  }, [tweet.id]);

  const removeBlockedPost = (blockedCommentId) => {
    setParsedComments((comments) =>
      comments.filter((comment) => comment.id !== blockedCommentId)
    );
  };

  // console.log("parsedComments", parsedComments);

  return (
    <div style={{ width: "100%", flex: 1 }}>
      <HeaderContainer>
        <HeaderComponent
          tweetDetails={tweetDetails}
          collectionName={collectionName}
          onImagePress={onImagePress}
          tweetExists={tweetExists}
        />
      </HeaderContainer>
      <div>
        {parsedComments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            commentCollectionName={commentCollectionName}
            onRemoveBlockedPost={removeBlockedPost}
          />
        ))}
      </div>
      {(role === "Doctor" ||
        role === "LicensedTech" ||
        tweet.user.uid === userData.uid) &&
        collectionName === "questions" && (
          <NewCommentButton
            collection={collectionName}
            tweet={tweet}
            FeedDetailReplyButton={true}
            stats={stats}
          />
        )}
      {collectionName === "posts" && (
        <NewCommentButton
          collection={collectionName}
          tweet={tweet}
          FeedDetailReplyButton={true}
          stats={stats}
        />
      )}
      {imageViewVisible && (
        <CustomImageViewer
          imageUrl={selectedImageUrl}
          onClose={onCloseImageView}
        />
      )}
    </div>
  );
}

export default FeedDetails;
