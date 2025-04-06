// MySidebarRouter.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  SidebarContainer,
  SidebarGroupTitle,
  VerticalLineContainer,
  SecondLevelContainer,
  SidebarItemRow,
  ArrowIcon,
} from "./SidebarStyle";

// Example sideNavData
const sideNavData = {
  home: [
    {
      groupTitle: "GET STARTED",
      items: [
        { id: "intro-to-vetcation", label: "Intro to Vetcation" },
        { id: "virtual-clinic", label: "Setting Up Your Virtual Clinic" },
      ],
    },
    // ...
  ],
};

export default function MySidebarRouter({
  activeTopNav = "home", // default if none passed
  closeOffcanvas = () => {},
}) {
  const [expandedItems, setExpandedItems] = useState([]);

  // Expand/collapse logic
  function handleExpandCollapse(itemId) {
    if (expandedItems.includes(itemId)) {
      setExpandedItems(expandedItems.filter((id) => id !== itemId));
    } else {
      setExpandedItems([...expandedItems, itemId]);
    }
  }

  const groups = sideNavData[activeTopNav] || [];

  return (
    <SidebarContainer>
      {groups.map((group) => (
        <div key={group.groupTitle}>
          <SidebarGroupTitle>{group.groupTitle}</SidebarGroupTitle>
          <VerticalLineContainer>
            {group.items.map((parentItem) => {
              const hasSubItems = parentItem.subItems?.length > 0;
              const isExpanded = expandedItems.includes(parentItem.id);

              // For the route path, we do: /telemedicine-info/<activeTopNav>/<parentItem.id>
              // e.g. /telemedicine-info/home/intro-to-vetcation
              const routePath = `/telemedicine-info/${activeTopNav}/${parentItem.id}`;

              if (!hasSubItems) {
                return (
                  <SidebarItemRow key={parentItem.id}>
                    <Link
                      to={routePath}
                      onClick={closeOffcanvas}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {parentItem.label}
                    </Link>
                  </SidebarItemRow>
                );
              } else {
                // If subItems exist
                return (
                  <div key={parentItem.id}>
                    <SidebarItemRow
                      onClick={() => handleExpandCollapse(parentItem.id)}
                    >
                      <span>{parentItem.label}</span>
                      <ArrowIcon $isExpanded={isExpanded}>▸</ArrowIcon>
                    </SidebarItemRow>
                    {isExpanded && (
                      <SecondLevelContainer>
                        {parentItem.subItems.map((child) => {
                          const subRoute = `/telemedicine-info/${activeTopNav}/${child.id}`;
                          return (
                            <SidebarItemRow key={child.id}>
                              <Link
                                to={subRoute}
                                onClick={closeOffcanvas}
                                style={{
                                  textDecoration: "none",
                                  color: "inherit",
                                }}
                              >
                                {child.label}
                              </Link>
                            </SidebarItemRow>
                          );
                        })}
                      </SecondLevelContainer>
                    )}
                  </div>
                );
              }
            })}
          </VerticalLineContainer>
        </div>
      ))}
    </SidebarContainer>
  );
}
