import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import colors from "../config/colors";
import GlobalContext from "../context/GlobalContext";

export default function ProfileEdiButton({ userBData }) {
  const { userData } = useContext(GlobalContext);
  const navigate = useNavigate();

  return (
    <div>
      {userBData.uid === userData.uid && (
        <button
          style={{
            backgroundColor: "white",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
          onClick={() => navigate("/profile-edit")}
        >
          <FaPencilAlt size={20} color={colors.black} />
        </button>
      )}
    </div>
  );
}
