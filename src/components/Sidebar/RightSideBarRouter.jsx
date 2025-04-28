// RightSideBarRouter.jsx
import React from "react";
import { VerticalLineContainer, SidebarItemRow } from "./SidebarStyle";
import { useNavigate, useLocation } from "react-router-dom";

function RightSideBarRouter({
  docSections = [],
  activeSectionId,
  onSectionClick,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{ padding: "1rem" }}>
      <h6 style={{ marginBottom: "1rem" }}>On this page</h6>

      <VerticalLineContainer>
        {docSections.map((sec) => {
          const isActive = activeSectionId === sec.id;
          return (
            <SidebarItemRow
              key={sec.id}
              $active={isActive}
              // onClick={() => onSectionClick(sec.id)}

              onClick={() => {
                // update the URL hash
                navigate(
                  { pathname: location.pathname, hash: sec.id },
                  { replace: false }
                );
                // then smooth-scroll
                onSectionClick(sec.id);
              }}
              style={{
                cursor: "pointer",
                fontWeight: isActive ? "bold" : "normal",
                color: isActive ? "#fff" : "#ccc",
              }}
            >
              <span>{sec.title}</span>
            </SidebarItemRow>
          );
        })}
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

export default RightSideBarRouter;
