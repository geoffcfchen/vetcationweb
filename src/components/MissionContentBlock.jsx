import React from "react";

const MissionContentBlock = ({ block }) => {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <p style={{ fontWeight: "bold", color: "#1cd0b0" }}>{block.question}</p>

      <p
        style={{ marginLeft: "1rem", color: "#ccc" }}
        dangerouslySetInnerHTML={{ __html: block.answer }}
      />

      {block.example && (
        <div
          style={{
            marginLeft: "1rem",
            fontStyle: "italic",
            color: "#ccc",
          }}
          dangerouslySetInnerHTML={{
            __html: `<strong>Example:</strong> ${block.example}`,
          }}
        />
      )}

      {block.helpText && (
        <div
          style={{
            backgroundColor: "#111",
            border: "1px solid #b1dbe3",
            borderRadius: "6px",
            padding: "1rem",
            marginTop: "1rem",
            marginLeft: "1rem",
            color: "#ccc",
          }}
        >
          <strong style={{ color: "#1cd0b0" }}>
            How Vetcation Solve this problem:
          </strong>{" "}
          {block.helpText}
        </div>
      )}
    </div>
  );
};

export default MissionContentBlock;
