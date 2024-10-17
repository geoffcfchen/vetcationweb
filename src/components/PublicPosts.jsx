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

const Post = styled.div`
  padding: 15px;
  margin-bottom: 15px;
  background-color: #f5f8fa;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const PublicPosts = () => {
  const [posts, setPosts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null); // For pagination
  const [hasMore, setHasMore] = useState(true); // Track if more data is available

  useEffect(() => {
    // Fetch initial posts on mount
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const postsQuery = query(
      collection(firestore, "questions"), // Use collection() to specify collection path
      where("isPublic", "==", true), // Filter where isPublic is true
      orderBy("createdAt", "desc"), // Order by createdAt in descending order
      limit(10) // Limit to 10 documents
    );

    try {
      const querySnapshot = await getDocs(postsQuery); // Use getDocs() to execute the query
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(postsData); // Set the posts
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]); // Save last visible for pagination
      setHasMore(querySnapshot.docs.length === 10); // If fewer than 10 items, stop further fetch
    } catch (error) {
      console.error("Error fetching public posts: ", error);
    }
  };

  const fetchMorePosts = async () => {
    if (!lastVisible) return;

    const postsQuery = query(
      collection(firestore, "questions"), // Use collection() to specify collection path
      where("isPublic", "==", true), // Filter where isPublic is true
      orderBy("createdAt", "desc"), // Order by createdAt in descending order
      startAfter(lastVisible), // Start after the last visible document
      limit(10) // Limit to 10 documents
    );

    try {
      const querySnapshot = await getDocs(postsQuery); // Use getDocs() to execute the query
      const newPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts((prevPosts) => [...prevPosts, ...newPosts]); // Append new posts
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]); // Update last visible
      setHasMore(querySnapshot.docs.length === 10); // Check if there are more posts to fetch
    } catch (error) {
      console.error("Error fetching more public posts: ", error);
    }
  };

  return (
    <InfiniteScroll
      dataLength={posts.length} // Length of data currently loaded
      next={fetchMorePosts} // Function to fetch more data
      hasMore={hasMore} // If there are more posts to fetch
      loader={<h4>Loading more posts...</h4>} // Loader to show while fetching more posts
      endMessage={<p>No more posts to display</p>} // Message to show when no more posts
    >
      {posts.map((post) => (
        <Post key={post.id}>
          <h3>@{post.author || "Anonymous"}</h3>
          <p>{post.content}</p>
        </Post>
      ))}
    </InfiniteScroll>
  );
};

export default PublicPosts;
