import React from "react";
import {
  SidebarContainer,
  SidebarGroupTitle,
  VerticalLineContainer,
  SecondLevelContainer,
  SidebarItemRow,
  ArrowIcon,
} from "./SidebarStyle";

function MySidebar({
  sideNavData,
  activeTopNav,
  expandedItems,
  handleExpandCollapse,
  activeItem,
  handleSelectItem,
  closeOffcanvas, // <----- ADD THIS
}) {
  const groups = sideNavData[activeTopNav] || [];

  // Helper function to handle clicks on an item
  function onItemClick(itemId) {
    handleSelectItem(itemId);
    // If closeOffcanvas is passed in, call it (only matters on mobile)
    if (closeOffcanvas) {
      closeOffcanvas();
    }
  }

  return (
    <SidebarContainer>
      {groups.map((group) => (
        <div key={group.groupTitle}>
          {/* Group Title (e.g. "USER MANUAL", "CLI") */}
          <SidebarGroupTitle>{group.groupTitle}</SidebarGroupTitle>

          {/* Wrap first-level items in a container with the first vertical line */}
          <VerticalLineContainer>
            {group.items.map((parentItem) => {
              const isExpanded = expandedItems.includes(parentItem.id);
              const hasSubItems = parentItem.subItems?.length > 0;
              const isActiveParent = activeItem === parentItem.id;

              // If no subItems, just render a single row
              if (!hasSubItems) {
                const isActive = activeItem === parentItem.id;
                return (
                  <SidebarItemRow
                    key={parentItem.id}
                    $active={isActive}
                    onClick={() => onItemClick(parentItem.id)} // <------
                  >
                    <span>{parentItem.label}</span>
                  </SidebarItemRow>
                );
              }

              // If it DOES have subItems
              return (
                <div key={parentItem.id}>
                  <SidebarItemRow
                    $active={isActiveParent}
                    onClick={() => {
                      // Toggle expand
                      handleExpandCollapse(parentItem.id);

                      // Optionally auto-select the first sub-subitem on expand
                      if (!isExpanded && parentItem.subItems[0]) {
                        handleSelectItem(parentItem.subItems[0].id);
                      }
                    }}
                  >
                    <span>{parentItem.label}</span>
                    {/* Arrow on the right */}
                    <ArrowIcon $isExpanded={isExpanded}>▸</ArrowIcon>
                  </SidebarItemRow>

                  {/* If expanded, show second-level container (second vertical line) */}
                  {isExpanded && (
                    <SecondLevelContainer>
                      {parentItem.subItems.map((child) => {
                        const isChildActive = activeItem === child.id;
                        return (
                          <SidebarItemRow
                            key={child.id}
                            $active={isChildActive}
                            onClick={() => onItemClick(child.id)} // <------
                          >
                            <span>{child.label}</span>
                          </SidebarItemRow>
                        );
                      })}
                    </SecondLevelContainer>
                  )}
                </div>
              );
            })}
          </VerticalLineContainer>
        </div>
      ))}
    </SidebarContainer>
  );
}

export default MySidebar;
