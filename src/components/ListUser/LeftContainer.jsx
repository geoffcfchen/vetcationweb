import React from "react";
import { useNavigate } from "react-router-dom";
import ProfilePicture from "../ProfilePicture";

function LeftContainer({ user, canNavigate = true }) {
  const navigate = useNavigate();

  function handlePress() {
    if (!canNavigate) return;
    // navigate("/profile-info", { state: { ProfileUser: user } });
  }

  return (
    <div>
      <ProfilePicture userData={user} size={45} onClick={handlePress} />
    </div>
  );
}

export default LeftContainer;
