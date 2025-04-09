// ContributorsPage.jsx
import React from "react";
import contentData from "../data/docsContentData";

const ContributorsPage = () => {
  const { list } = contentData.contributors || { list: [] };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Vetcation Contributors</h1>
      {list.length === 0 && <p>No contributors data available.</p>}
      {list.map((contributor, index) => (
        <div
          key={index}
          style={{
            marginBottom: "2rem",
            borderBottom: "1px solid #444",
            paddingBottom: "1rem",
          }}
        >
          <h2>{contributor.name}</h2>
          <h4 style={{ color: "#ccc" }}>{contributor.title}</h4>
          <p>{contributor.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ContributorsPage;
