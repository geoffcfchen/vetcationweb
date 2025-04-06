// TopNavBar.jsx

import React from "react";
import styled from "styled-components";
import { Button } from "react-bootstrap";

// Styled container for the top nav bar
const TopNavBarContainer = styled.nav`
  background-color: #111;
  padding: 1rem;
  display: flex;
  gap: 2rem;
  align-items: center;
`;

// Each link in the top nav
const TopNavLink = styled.span`
  cursor: pointer;
  color: ${(props) => (props.$active ? "#00bcd4" : "#ccc")};
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};

  &:hover {
    color: #fff;
  }
`;

// The actual component
export default function TopNavBar({
  topNavData,
  activeTopNav,
  handleTopNavClick,
  onBurgerClick,
}) {
  return (
    <TopNavBarContainer>
      {topNavData.map((navItem) => (
        <TopNavLink
          key={navItem.id}
          $active={activeTopNav === navItem.id}
          onClick={() => handleTopNavClick(navItem.id)}
        >
          {navItem.label}
        </TopNavLink>
      ))}

      {/* Hamburger button: only visible on smaller screens */}
      <Button
        variant="primary"
        className="d-md-none ms-auto"
        onClick={onBurgerClick}
      >
        ☰ Menu
      </Button>
    </TopNavBarContainer>
  );
}
