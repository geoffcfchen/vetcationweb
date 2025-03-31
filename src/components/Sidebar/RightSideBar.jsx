import React from "react";
import { VerticalLineContainer, SidebarItemRow } from "./SidebarStyle"; // adjust the import path as needed

function RightSidebar({
  currentContent,
  activeSection,
  handleRightSidebarClick,
}) {
  return (
    <div style={{ padding: "1rem" }}>
      <h6 style={{ marginBottom: "1rem" }}>On this page</h6>
      <VerticalLineContainer>
        {currentContent?.sections.map((sec) => (
          <SidebarItemRow
            key={sec.id}
            $active={activeSection === sec.id}
            onClick={() => handleRightSidebarClick(sec.id)}
          >
            <span>{sec.title}</span>
          </SidebarItemRow>
        ))}
      </VerticalLineContainer>

      {/* "Is this page helpful?" block */}
      <div style={{ marginTop: "2rem" }}>
        <h6>Is this page helpful?</h6>
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
          <button
            style={{
              background: "transparent",
              border: "1px solid #444",
              color: "#ccc",
              padding: "0.5rem 1rem",
              cursor: "pointer",
            }}
            onClick={() => console.log("Yes clicked")}
          >
            Yes
          </button>
          <button
            style={{
              background: "transparent",
              border: "1px solid #444",
              color: "#ccc",
              padding: "0.5rem 1rem",
              cursor: "pointer",
            }}
            onClick={() => console.log("No clicked")}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default RightSidebar;
