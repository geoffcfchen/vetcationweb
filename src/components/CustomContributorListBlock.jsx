// CustomContributorListBlock.jsx
import React from "react";

const CustomContributorListBlock = ({ block }) => {
  // Container for all contributor cards
  const containerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1rem",
    padding: "1rem 0",
  };

  // Style for each contributor card
  const cardStyle = {
    display: "flex",

    padding: "1rem",
    border: "1px solid #444",
    borderRadius: "8px",
    backgroundColor: "#1c1c1c",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  };

  // Avatar styling: circular and sized appropriately
  const avatarStyle = {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "1rem",
    border: "2px solid #1cd0b0",
  };

  // Styling for the text container on the right side of the avatar
  const textContainerStyle = {
    flex: 1,
  };

  const nameStyle = {
    margin: 0,
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#fff",
  };

  const titleStyle = {
    margin: "0.25rem 0 0 0",
    fontSize: "1rem",
    color: "#aaa",
  };

  const descriptionStyle = {
    margin: "0.5rem 0 0 0",
    fontSize: "0.9rem",
    color: "#ccc",
  };

  return (
    <div style={containerStyle}>
      {block.contributors.map((contrib, idx) => (
        <div key={idx} style={cardStyle}>
          {contrib.image && (
            <img src={contrib.image} alt={contrib.name} style={avatarStyle} />
          )}
          <div style={textContainerStyle}>
            <h3 style={nameStyle}>{contrib.name}</h3>
            <h4 style={titleStyle}>{contrib.title}</h4>
            <p style={descriptionStyle}>{contrib.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomContributorListBlock;
