// TopNavBar.jsx
import React from "react";
import styled from "styled-components";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const TopNavBarContainer = styled.nav`
  background-color: #111;
  padding: 1rem;
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const TopNavLink = styled.span`
  cursor: pointer;
  color: ${(props) => (props.$active ? "#00bcd4" : "#ccc")};
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};

  &:hover {
    color: #fff;
  }
`;

export default function TopNavBarRounter({
  topNavData,
  activeTopNav,
  handleTopNavClick,
  onBurgerClick,
}) {
  const navigate = useNavigate();

  // When a top nav item is clicked, update state and navigate to a default doc route
  const handleClick = (navItem) => {
    handleTopNavClick(navItem.id);
    // Navigate to a default route for that category. For example,
    // if "clinic" is clicked, navigate to "/telemedicine-info/clinic/intro-to-vetcation".
    // You can adjust this default as needed.
    navigate(`/telemedicine-info/${navItem.id}/introToVetcation`);
  };

  return (
    <TopNavBarContainer>
      {topNavData.map((navItem) => (
        <TopNavLink
          key={navItem.id}
          $active={activeTopNav === navItem.id}
          onClick={() => handleClick(navItem)}
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
