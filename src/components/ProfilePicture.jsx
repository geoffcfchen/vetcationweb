// src/components/ProfilePicture.jsx
import React from "react";
import styled from "styled-components";

const ProfilePictureContainer = styled.div`
  position: relative;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const ActiveDot = styled.div`
  position: absolute;
  background-color: green; // Replace with your active color
  bottom: 5%;
  right: 5%;
  width: ${({ size }) => size * 0.2}px;
  height: ${({ size }) => size * 0.2}px;
  border-radius: 50%;
  border: 2px solid #fff;
`;

const ProfilePicture = ({ onClick, userData, size = 50 }) => {
  const imageSource = userData?.photoURL || "/path-to-default-image.jpg"; // Replace with a default image path

  return (
    <ProfilePictureContainer size={size} onClick={onClick}>
      <ProfileImage src={imageSource} alt={userData?.displayName || "User"} />
      {userData?.isActive && <ActiveDot size={size} />}
    </ProfilePictureContainer>
  );
};

export default ProfilePicture;
