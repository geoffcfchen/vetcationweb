// MySidebarRouter.jsx
import React, { useState, useEffect } from "react";
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
  const location = useLocation();

  // NEW: auto-expand the parent that owns the current route
  useEffect(() => {
    const groups = sideNavData[activeTopNav] || [];
    const currentPath = location.pathname.replace(/\/$/, ""); // normalize
    const parentsToExpand = [];

    for (const group of groups) {
      for (const parent of group.items || []) {
        if (
          parent.subItems?.some(
            (child) =>
              `/telemedicine-info/${activeTopNav}/${child.id}` === currentPath
          )
        ) {
          parentsToExpand.push(parent.id);
        }
      }
    }

    // Merge with any user-toggled expands so we don’t forcibly collapse others
    setExpandedItems((prev) =>
      Array.from(new Set([...prev, ...parentsToExpand]))
    );
  }, [location.pathname, activeTopNav]);

  function handleExpandCollapse(itemId) {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
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
              const routePath = `/telemedicine-info/${activeTopNav}/${parentItem.id}`;

              if (!hasSubItems) {
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
                // NEW: highlight parent when any child is the active route
                const isChildActive = parentItem.subItems.some(
                  (child) =>
                    location.pathname ===
                    `/telemedicine-info/${activeTopNav}/${child.id}`
                );

                return (
                  <div key={parentItem.id}>
                    <SidebarItemRow
                      onClick={() => handleExpandCollapse(parentItem.id)}
                      $active={isChildActive}
                    >
                      <span>{parentItem.label}</span>
                      <ArrowIcon $isExpanded={isExpanded}>▸</ArrowIcon>
                    </SidebarItemRow>

                    {isExpanded && (
                      <SecondLevelContainer>
                        {parentItem.subItems.map((child) => {
                          const subRoute = `/telemedicine-info/${activeTopNav}/${child.id}`;
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
