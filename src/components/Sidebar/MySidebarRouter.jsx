// MySidebarRouter.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarContainer,
  SidebarGroupTitle,
  VerticalLineContainer,
  SecondLevelContainer,
  SidebarItemRow,
  ArrowIcon,
} from "./SidebarStyle";
import sideNavData from "../../data/sideNavData";

export default function MySidebarRouter({
  activeTopNav = "home",
  closeOffcanvas = () => {},
}) {
  const [expandedItems, setExpandedItems] = useState([]);
  // Use React Router's useLocation to get current path
  const location = useLocation();

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

              // The path to this item
              const routePath = `/telemedicine-info/${activeTopNav}/${parentItem.id}`;

              if (!hasSubItems) {
                // Check if it's active
                const isActive = location.pathname === routePath;

                return (
                  <SidebarItemRow key={parentItem.id} $active={isActive}>
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
                          // Check if sub-item is active
                          const isActive = location.pathname === subRoute;

                          return (
                            <SidebarItemRow key={child.id} $active={isActive}>
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
