// src/components/FooterQA.jsx
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import {
  FaRegComment,
  FaRegBookmark,
  FaBookmark,
  FaRegThumbsUp,
  FaThumbsUp,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import {
  getFirestore,
  doc,
  collection,
  onSnapshot,
  runTransaction,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import checkRole from "../utility/checkRole";
import updatePoints from "../utility/updatePoints";
import { saveNotificationToFirestore } from "../utility/notificationService";
import GlobalContext from "../context/GlobalContext";

const FooterContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 5px;
`;

const TapContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const IconContainerQA = styled.div`
  display: flex;
  align-items: center;
  background-color: lightblue;
  padding: 5px 7px;
  border-radius: 15px;
  margin-right: 10px;
  cursor: pointer;
`;

const NumberText = styled.span`
  margin-left: 5px;
  color: grey;
  text-align: center;
`;

const IconButton = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  cursor: pointer;
`;

const IconLabel = styled.span`
  margin-left: 5px;
  color: grey;
`;

const ReplyContainer = styled(IconContainerQA)`
  background-color: transparent;
  margin-right: 5px;
`;

// src/components/FooterQA.jsx
const FooterQA = ({
  tweet,
  collection: collectionName,
  comment = false,
  commentHeader = false,
}) => {
  const [isUpvotingInProgress, setIsUpvotingInProgress] = useState(false);
  const [isLikingInProgress, setIsLikingInProgress] = useState(false);
  const [isBookmarkingInProgress, setIsBookmarkingInProgress] = useState(false);

  const { userData } = useContext(GlobalContext);
  const [liking, setLiking] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [stats, setStats] = useState({
    numberOfUpvotes: tweet?.numberOfUpvotes || 0,
    numberOfVetUpvotes: tweet?.numberOfVetUpvotes || 0,
    numberOfTechUpvotes: tweet?.numberOfTechUpvotes || 0,
    numberOfLikes: tweet?.numberOfLikes || 0,
    numberOfComments: tweet?.numberOfComments || 0,
    numberOfRetweets: tweet?.numberOfRetweets || 0,
    numberOfBookmarks: tweet?.numberOfBookmarks || 0,
  });
  const navigate = useNavigate();

  const db = getFirestore();
  const auth = getAuth();
  const userPostRef = doc(db, collectionName, tweet.id);

  const userUpvotesRef = doc(
    db,
    collectionName,
    tweet.id,
    "upvotes",
    auth.currentUser?.uid
  );
  const allUserUpvotesRef = collection(db, collectionName, tweet.id, "upvotes");

  const userLikesRef = doc(
    db,
    collectionName,
    tweet.id,
    "likes",
    auth.currentUser?.uid
  );
  const allUserLikesRef = collection(db, collectionName, tweet.id, "likes");

  const userBookmarksRef = doc(
    db,
    collectionName,
    tweet.id,
    "bookmarks",
    auth.currentUser?.uid
  );
  const allUserBookmarksRef = collection(
    db,
    collectionName,
    tweet.id,
    "bookmarks"
  );

  const role = checkRole();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      userPostRef,
      (docSnapshot) => {
        const data = docSnapshot.data();
        setStats({
          numberOfUpvotes: data?.numberOfUpvotes || 0,
          numberOfVetUpvotes: data?.numberOfVetUpvotes || 0,
          numberOfTechUpvotes: data?.numberOfTechUpvotes || 0,
          numberOfLikes: data?.numberOfLikes || 0,
          numberOfComments: data?.numberOfComments || 0,
          numberOfRetweets: data?.numberOfRetweets || 0,
          numberOfBookmarks: data?.numberOfBookmarks || 0,
        });
      },
      (error) => {
        console.log("Error fetching post stats: ", error);
      }
    );

    return () => unsubscribe();
  }, [userPostRef]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      allUserLikesRef,
      (snapshot) => {
        const allUserLikes = snapshot.docs.map((doc) => doc.id);
        setLiking(allUserLikes.includes(auth.currentUser?.uid));
      },
      (error) => {
        console.log("Error fetching likes: ", error);
      }
    );

    return () => unsubscribe();
  }, [allUserLikesRef]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      allUserUpvotesRef,
      (snapshot) => {
        const allUserUpvotes = snapshot.docs.map((doc) => doc.id);
        setUpvoted(allUserUpvotes.includes(auth.currentUser?.uid));
      },
      (error) => {
        console.log("Error fetching upvotes: ", error);
      }
    );

    return () => unsubscribe();
  }, [allUserUpvotesRef]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      allUserBookmarksRef,
      (snapshot) => {
        const allUserBookmarks = snapshot.docs.map((doc) => doc.id);
        setBookmarked(allUserBookmarks.includes(auth.currentUser?.uid));
      },
      (error) => {
        console.log("Error fetching bookmarks: ", error);
      }
    );

    return () => unsubscribe();
  }, [allUserBookmarksRef]);

  const onUpvote = async () => {
    if (isUpvotingInProgress || isBookmarkingInProgress) return;
    setIsUpvotingInProgress(true);
    setUpvoted(true);
    setStats((prevStats) => ({
      ...prevStats,
      numberOfUpvotes: prevStats.numberOfUpvotes + 1,
    }));

    try {
      await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(userPostRef);
        if (!postDoc.exists()) {
          throw new Error("Document does not exist!");
        }
        const data = postDoc.data();
        const currentUpvotes = data.numberOfUpvotes || 0;
        const newUpvotes = currentUpvotes + 1;

        const roleField =
          role === "Doctor"
            ? "numberOfVetUpvotes"
            : role === "LicensedTech"
            ? "numberOfTechUpvotes"
            : "numberOfUpvotes";
        const currentRoleUpvotes = data[roleField] || 0;
        const newRoleUpvotes = currentRoleUpvotes + 1;

        transaction.update(userPostRef, {
          numberOfUpvotes: newUpvotes,
          [roleField]: newRoleUpvotes,
        });
        transaction.set(userUpvotesRef, { role });
        await updatePoints(tweet.user.uid, 5, "received");
        await updatePoints(userData.uid, 1, "upvote");
      });

      if (userData.uid !== tweet.user.uid) {
        await saveNotificationToFirestore(
          userData,
          tweet.user,
          "onUpvote",
          tweet,
          collectionName
        );
      }
    } catch (e) {
      console.error("Transaction failure:", e);
      setUpvoted(false);
      setStats((prevStats) => ({
        ...prevStats,
        numberOfUpvotes: prevStats.numberOfUpvotes - 1,
      }));
    }

    setIsUpvotingInProgress(false);
  };

  const onUnUpvote = async () => {
    if (isUpvotingInProgress || isBookmarkingInProgress) return;
    setIsUpvotingInProgress(true);
    setUpvoted(false);
    setStats((prevStats) => ({
      ...prevStats,
      numberOfUpvotes: prevStats.numberOfUpvotes - 1,
    }));

    try {
      await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(userPostRef);
        if (!postDoc.exists()) {
          throw new Error("Document does not exist!");
        }
        const data = postDoc.data();
        const currentUpvotes = data.numberOfUpvotes || 0;
        const newUpvotes = currentUpvotes - 1;

        const roleField =
          role === "Doctor"
            ? "numberOfVetUpvotes"
            : role === "LicensedTech"
            ? "numberOfTechUpvotes"
            : "numberOfUpvotes";
        const currentRoleUpvotes = data[roleField] || 0;
        const newRoleUpvotes = currentRoleUpvotes - 1;

        transaction.update(userPostRef, {
          numberOfUpvotes: newUpvotes,
          [roleField]: newRoleUpvotes,
        });
        transaction.delete(userUpvotesRef);
        await updatePoints(tweet.user.uid, -5, "received");
        await updatePoints(userData.uid, -1, "upvote");
      });
    } catch (e) {
      console.error("Transaction failure:", e);
      setUpvoted(true);
      setStats((prevStats) => ({
        ...prevStats,
        numberOfUpvotes: prevStats.numberOfUpvotes + 1,
      }));
    }

    setIsUpvotingInProgress(false);
  };

  const onLike = async () => {
    if (isLikingInProgress || isUpvotingInProgress) return;
    setIsLikingInProgress(true);
    setLiking(true);
    setStats((prevStats) => ({
      ...prevStats,
      numberOfLikes: prevStats.numberOfLikes + 1,
    }));

    try {
      await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(userPostRef);
        if (!postDoc.exists()) {
          throw new Error("Document does not exist!");
        }
        const data = postDoc.data();
        const currentLikes = data.numberOfLikes || 0;
        const newLikes = currentLikes + 1;

        transaction.update(userPostRef, { numberOfLikes: newLikes });
        transaction.set(userLikesRef, { role });
      });

      if (userData.uid !== tweet.user.uid) {
        await saveNotificationToFirestore(
          userData,
          tweet.user,
          "onLike",
          tweet,
          collectionName
        );
      }
    } catch (e) {
      console.error("Transaction failure:", e);
      setLiking(false);
      setStats((prevStats) => ({
        ...prevStats,
        numberOfLikes: prevStats.numberOfLikes - 1,
      }));
    }

    setIsLikingInProgress(false);
  };

  const onUnLike = async () => {
    if (isLikingInProgress || isUpvotingInProgress) return;
    setIsLikingInProgress(true);
    setLiking(false);
    setStats((prevStats) => ({
      ...prevStats,
      numberOfLikes: prevStats.numberOfLikes - 1,
    }));

    try {
      await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(userPostRef);
        if (!postDoc.exists()) {
          throw new Error("Document does not exist!");
        }
        const data = postDoc.data();
        const currentLikes = data.numberOfLikes || 0;
        const newLikes = currentLikes - 1;

        transaction.update(userPostRef, { numberOfLikes: newLikes });
        transaction.delete(userLikesRef);
      });
    } catch (e) {
      console.error("Transaction failure:", e);
      setLiking(true);
      setStats((prevStats) => ({
        ...prevStats,
        numberOfLikes: prevStats.numberOfLikes + 1,
      }));
    }

    setIsLikingInProgress(false);
  };

  const onBookmark = async () => {
    if (isBookmarkingInProgress || isUpvotingInProgress) return;
    setIsBookmarkingInProgress(true);
    setBookmarked(true);
    setStats((prevStats) => ({
      ...prevStats,
      numberOfBookmarks: prevStats.numberOfBookmarks + 1,
    }));

    try {
      await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(userPostRef);
        const userRef = doc(db, "customers", userData.uid);
        const userDoc = await transaction.get(userRef);

        if (!postDoc.exists()) {
          throw new Error("Document does not exist!");
        }

        const data = postDoc.data();
        const currentBookmarks = data.numberOfBookmarks || 0;
        const newBookmarks = currentBookmarks + 1;

        transaction.update(userPostRef, { numberOfBookmarks: newBookmarks });
        transaction.set(userBookmarksRef, { role });

        const userBookmarks = userDoc.data().questionbookmarks || [];
        transaction.update(userRef, {
          questionbookmarks: [...userBookmarks, tweet.id],
        });
      });
    } catch (e) {
      console.error("Transaction failure:", e);
      setBookmarked(false);
      setStats((prevStats) => ({
        ...prevStats,
        numberOfBookmarks: prevStats.numberOfBookmarks - 1,
      }));
    }

    setIsBookmarkingInProgress(false);
  };

  const onUnBookmark = async () => {
    if (isBookmarkingInProgress || isUpvotingInProgress) return;
    setIsBookmarkingInProgress(true);
    setBookmarked(false);
    setStats((prevStats) => ({
      ...prevStats,
      numberOfBookmarks: prevStats.numberOfBookmarks - 1,
    }));

    try {
      await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(userPostRef);
        const userRef = doc(db, "customers", userData.uid);
        const userDoc = await transaction.get(userRef);

        if (!postDoc.exists()) {
          throw new Error("Document does not exist!");
        }

        const data = postDoc.data();
        const currentBookmarks = data.numberOfBookmarks || 0;
        const newBookmarks = currentBookmarks - 1;

        transaction.update(userPostRef, { numberOfBookmarks: newBookmarks });
        transaction.delete(userBookmarksRef);

        const userBookmarks = userDoc.data().questionbookmarks || [];
        transaction.update(userRef, {
          questionbookmarks: userBookmarks.filter(
            (bookmarkId) => bookmarkId !== tweet.id
          ),
        });
      });
    } catch (e) {
      console.error("Transaction failure:", e);
      setBookmarked(true);
      setStats((prevStats) => ({
        ...prevStats,
        numberOfBookmarks: prevStats.numberOfBookmarks + 1,
      }));
    }

    setIsBookmarkingInProgress(false);
  };

  return (
    <FooterContainer>
      <TapContainer>
        {!comment &&
          role === "Client" &&
          tweet.user.uid !== userData.uid &&
          collectionName === "questions" &&
          !commentHeader && (
            <IconContainerQA
              onClick={(event) => {
                event.stopPropagation(); // Prevent the click from bubbling up to TweetQA
                navigate("/reply", {
                  state: { tweet, collection: collectionName },
                });
              }}
            >
              <FaRegComment size={15} color="black" />
              <NumberText style={{ color: "black" }}>
                Reply {stats.numberOfComments || 0}
              </NumberText>
            </IconContainerQA>
          )}

        {/* Upvote Button */}
        {(collectionName === "questions" ||
          collectionName === "questionComments") && (
          <IconButton
            onClick={(event) => {
              event.stopPropagation(); // Prevent click propagation
              upvoted ? onUnUpvote() : onUpvote();
            }}
          >
            {upvoted ? (
              <FaThumbsUp size={20} color="blue" />
            ) : (
              <FaRegThumbsUp size={20} color="grey" />
            )}
            <IconLabel>{stats.numberOfUpvotes || 0}</IconLabel>
          </IconButton>
        )}

        {/* Like Button */}
        {(collectionName === "posts" || collectionName === "postComments") && (
          <IconButton
            onClick={(event) => {
              event.stopPropagation(); // Prevent click propagation
              liking ? onUnLike() : onLike();
            }}
          >
            {liking ? (
              <FaThumbsUp size={20} color="blue" />
            ) : (
              <FaRegThumbsUp size={20} color="grey" />
            )}
            <IconLabel>{stats.numberOfLikes || 0}</IconLabel>
          </IconButton>
        )}

        {/* Bookmark Button */}
        {!comment && collectionName === "questions" && (
          <IconButton
            onClick={(event) => {
              event.stopPropagation(); // Prevent click propagation
              bookmarked ? onUnBookmark() : onBookmark();
            }}
          >
            {bookmarked ? (
              <FaBookmark size={20} color="blue" />
            ) : (
              <FaRegBookmark size={20} color="grey" />
            )}
            <IconLabel>{stats.numberOfBookmarks || 0}</IconLabel>
          </IconButton>
        )}
      </TapContainer>
    </FooterContainer>
  );
};

export default FooterQA;
