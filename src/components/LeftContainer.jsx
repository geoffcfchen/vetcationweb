// src/components/LeftContainer.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import ProfilePicture from "./ProfilePicture"; // Import the ProfilePicture component

const LeftContainer = ({ userB, collection }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (userB?.uid !== "AI_Assistant") {
      navigate(`/profile/${userB.uid}`); // Navigate to profile page
    }
  };

  return (
    <div>
      <ProfilePicture userData={userB} size={45} onClick={handleProfileClick} />
    </div>
  );
};

export default LeftContainer;
