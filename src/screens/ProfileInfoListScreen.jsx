import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Tabs, Tab, Container, Row, Col } from "react-bootstrap";
import FollowButton from "../components/FollowButton";

// import ProfileEdiButton from "../components/ProfileEdiButton";
import GlobalContext from "../context/GlobalContext";
import useGetSingleUser from "../hooks/useGetSingleUser";
import TweetQA from "../components/Tweet/TweetQA";
import CardPet from "../components/CardPet";
import ProfilePicture from "../components/ProfilePicture";
import NameBadge from "../components/NameBadge";
import checkUserBRole from "../utility/checkUserBRole";
import checkRole from "../utility/checkRole";
import Following from "../components/Following";
import Followers from "../components/Followers";
// import NewQuestionButtonWrapper from "../components/NewQuestionButtonWrapper";
// import NewPetButton from "../components/NewPetButton";
// import NewFeedButtonWrapper from "../components/NewFeedButtonWrapper";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore"; // Import necessary Firestore functions

const ProfileInfoListScreen = ({ userId }) => {
  const { userData } = useContext(GlobalContext);
  //   const { userId } = useParams();
  const navigate = useNavigate();

  console.log("userId", userId);

  const { user: upToDateUserBData, loading } = useGetSingleUser(userId);
  //   const userBRole = checkUserBRole(upToDateUserBData);
  //   const role = checkRole();

  const [parsedPosts, setParsedPosts] = useState([]);
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [pets, setPets] = useState([]);
  const [tabKey, setTabKey] = useState("posts");

  console.log("upToDateUserBData", upToDateUserBData);

  // Fetch posts
  useEffect(() => {
    const db = getFirestore(); // Initialize Firestore
    const postsRef = collection(db, "posts");
    const postsQuery = query(
      postsRef,
      where("user.uid", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      postsQuery,
      (querySnapshot) => {
        const posts = querySnapshot.docs
          .map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
          .filter((post) => !post.isDeleted);
        setParsedPosts(posts);
      },
      (error) => {
        console.error("Error fetching posts:", error);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Fetch questions
  useEffect(() => {
    const db = getFirestore();
    const questionsRef = collection(db, "questions");
    const questionsQuery = query(
      questionsRef,
      where("user.uid", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      questionsQuery,
      (querySnapshot) => {
        const questions = querySnapshot.docs
          .map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
          .filter((question) => !question.isDeleted);
        setParsedQuestions(questions);
      },
      (error) => {
        console.error("Error fetching questions:", error);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Fetch pets
  useEffect(() => {
    const db = getFirestore();
    const petsRef = collection(db, "pets");
    const petsQuery = query(petsRef, where("owner", "==", userId));

    const unsubscribe = onSnapshot(
      petsQuery,
      (querySnapshot) => {
        const petsArray = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPets(petsArray);
      },
      (error) => {
        console.error("Error fetching pets:", error);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const username = upToDateUserBData?.userName
    ? upToDateUserBData.userName
    : upToDateUserBData?.email?.split("@")[0];

  const Header = () => (
    <Container>
      <Row className="mt-4">
        <Col xs={12} md={4} className="text-center">
          <ProfilePicture userData={upToDateUserBData} size={100} />
        </Col>
        <Col xs={12} md={8}>
          <NameBadge
            userBData={upToDateUserBData}
            nameFontSize={25}
            maxLength={50}
          />
          <div className="d-flex align-items-center my-2">
            <span className="text-muted me-2">@{username}</span>
            {/* <ProfileEdiButton userBData={upToDateUserBData} /> */}
          </div>
          <div className="d-flex flex-wrap my-2">
            <Following userBData={upToDateUserBData} />
            <Followers userBData={upToDateUserBData} />
          </div>
          <div className="d-flex flex-wrap my-2">
            <FollowButton userBData={upToDateUserBData} />
          </div>
        </Col>
      </Row>
    </Container>
  );

  // Display loading indicator or error message if data is not available
  if (loading) return <p>Loading profile...</p>;

  return (
    <div>
      {Header()}
      <Container className="mt-4">
        <Tabs
          activeKey={tabKey}
          onSelect={(k) => setTabKey(k)}
          className="mb-3"
        >
          <Tab eventKey="posts" title="Posts">
            {parsedPosts.length === 0 ? (
              <div
                className="text-center text-muted my-4"
                style={{ fontSize: "18px" }}
              >
                No posts found
              </div>
            ) : (
              parsedPosts.map((item) => (
                <TweetQA key={item.id} tweet={item} collection="posts" />
              ))
            )}
            {/* {tabKey === "posts" && <NewFeedButtonWrapper />} */}
          </Tab>
          <Tab eventKey="questions" title="Q&A">
            {parsedQuestions.length === 0 ? (
              <div
                className="text-center text-muted my-4"
                style={{ fontSize: "18px" }}
              >
                No questions found
              </div>
            ) : (
              parsedQuestions.map((item) => (
                <TweetQA key={item.id} tweet={item} collection="questions" />
              ))
            )}
            {/* {tabKey === "questions" && <NewQuestionButtonWrapper />} */}
          </Tab>
          <Tab eventKey="pets" title="Pets">
            {pets.length === 0 ? (
              <div
                className="text-center text-muted my-4"
                style={{ fontSize: "18px" }}
              >
                {userData?.uid === userId
                  ? "Add your first pet!"
                  : "No pets found"}
              </div>
            ) : (
              pets.map((item) => (
                <CardPet
                  key={item.id}
                  user={item}
                  showActions={userId === userData?.uid}
                />
              ))
            )}
            {/* {tabKey === "pets" && userId === userData?.uid && <NewPetButton />} */}
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default ProfileInfoListScreen;
