// ./components/ParagraphBlock.jsx
import React from "react";

const ParagraphBlock = ({ block }) => {
  return (
    <p
      style={{ marginBottom: "1.5rem", color: "#ccc" }}
      dangerouslySetInnerHTML={{ __html: block.text }}
    />
  );
};

export default ParagraphBlock;
