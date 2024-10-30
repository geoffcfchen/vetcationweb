// src/components/PublicPosts.jsx
import React, { useState, useEffect } from "react";
import { firestore } from "../firebase"; // Import Firestore instance
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import TweetQA from "./TweetQA";

const Post = styled.div`
  padding: 15px;
  margin-bottom: 15px;
  background-color: #f5f8fa;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const PublicPosts = ({ setActiveScreen, setSelectedTweet }) => {
  const [posts, setPosts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null); // For pagination
  const [hasMore, setHasMore] = useState(true); // Track if more data is available

  useEffect(() => {
    // Fetch initial posts on mount
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const postsQuery = query(
      collection(firestore, "questions"),
      where("isPublic", "==", true),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    try {
      const querySnapshot = await getDocs(postsQuery);
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(postsData);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

      // Log to check if lastVisible is set
      console.log(
        "Last visible after initial fetch:",
        querySnapshot.docs[querySnapshot.docs.length - 1]
      );

      setHasMore(querySnapshot.docs.length === 10);
    } catch (error) {
      console.error("Error fetching public posts: ", error);
    }
  };

  const fetchMorePosts = async () => {
    console.log("Fetching more posts...");
    if (!lastVisible) {
      console.log("No more posts to fetch");
      return;
    }

    console.log("Fetching posts after lastVisible:", lastVisible);

    const postsQuery = query(
      collection(firestore, "questions"),
      where("isPublic", "==", true),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible), // Start after the last visible document
      limit(10)
    );

    try {
      const querySnapshot = await getDocs(postsQuery);

      console.log("Number of new posts fetched:", querySnapshot.docs.length);

      const newPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]); // Update last visible
      setHasMore(querySnapshot.docs.length === 10); // Check if there are more posts to fetch
    } catch (error) {
      console.error("Error fetching more public posts: ", error);
    }
  };

  return (
    // Add a scrollable div with a unique ID
    <div
      id="scrollableDiv"
      style={{ height: "100vh", overflow: "auto", padding: "0 16px" }}
    >
      <InfiniteScroll
        dataLength={posts.length} // Length of data currently loaded
        next={fetchMorePosts} // Function to fetch more data
        hasMore={hasMore} // If there are more posts to fetch
        scrollableTarget="scrollableDiv" // Set the scrollable target
        loader={<h4>Loading more posts...</h4>} // Loader to show while fetching more posts
        endMessage={<p>No more posts to display</p>} // Message to show when no more posts
      >
        {posts.map((post) => (
          <TweetQA
            key={post.id}
            collection="questions"
            tweet={post}
            setActiveScreen={setActiveScreen}
            setSelectedTweet={setSelectedTweet}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default PublicPosts;
