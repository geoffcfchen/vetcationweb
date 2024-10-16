// src/pages/DashboardPage.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth"; // Firebase signOut function
import { auth } from "../firebase"; // Firebase auth instance

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr; // Three columns layout
  gap: 2rem;
  padding: 2rem;
  height: 100vh;
`;

const MenuContainer = styled.div`
  background-color: #f7f9fa;
  padding: 1rem;
  border-right: 1px solid #ccc;
`;

const FeedContainer = styled.div`
  background-color: #fff;
  padding: 1rem;
  border-right: 1px solid #ccc;
  overflow-y: auto;
`;

const SearchContainer = styled.div`
  background-color: #f7f9fa;
  padding: 1rem;
`;

const MenuItem = styled.div`
  padding: 10px 15px;
  margin-bottom: 10px;
  font-size: 18px;
  cursor: pointer;
  color: #1da1f2;

  &:hover {
    background-color: #e8f5fe;
    border-radius: 10px;
  }
`;

const Post = styled.div`
  padding: 15px;
  margin-bottom: 15px;
  background-color: #f5f8fa;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled.input`
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 20px;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #1da1f2;
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background-color: #0a85d9;
  }
`;

const DashboardPage = () => {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState("Home"); // State to track the selected menu

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase signOut
      navigate("/"); // Redirect to the login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const renderFeedContent = () => {
    switch (selectedMenu) {
      case "Home":
        return (
          <>
            <Post>
              <h3>@user1</h3>
              <p>This is a sample post in the Home feed.</p>
            </Post>
            <Post>
              <h3>@user2</h3>
              <p>Welcome to the Home feed. Enjoy your stay!</p>
            </Post>
          </>
        );
      case "Profile":
        return (
          <>
            <Post>
              <h3>@user1</h3>
              <p>This is your profile info. You can see your posts here.</p>
            </Post>
          </>
        );
      case "Notifications":
        return (
          <>
            <Post>
              <h3>Notification 1</h3>
              <p>You have 3 new followers!</p>
            </Post>
            <Post>
              <h3>Notification 2</h3>
              <p>Your post received 10 likes!</p>
            </Post>
          </>
        );
      default:
        return (
          <Post>
            <p>Select a menu option to see content.</p>
          </Post>
        );
    }
  };

  return (
    <DashboardContainer>
      {/* Left Side - Menu */}
      <MenuContainer>
        <MenuItem onClick={() => setSelectedMenu("Home")}>Home</MenuItem>
        <MenuItem onClick={() => setSelectedMenu("Profile")}>Profile</MenuItem>
        <MenuItem onClick={() => setSelectedMenu("Notifications")}>
          Notifications
        </MenuItem>
        <Button onClick={handleLogout}>Log Out</Button>
      </MenuContainer>

      {/* Middle - Feed (Dynamic based on selected menu) */}
      <FeedContainer>{renderFeedContent()}</FeedContainer>

      {/* Right Side - Search */}
      <SearchContainer>
        <h3>Search</h3>
        <SearchInput type="text" placeholder="Search here..." />
      </SearchContainer>
    </DashboardContainer>
  );
};

export default DashboardPage;