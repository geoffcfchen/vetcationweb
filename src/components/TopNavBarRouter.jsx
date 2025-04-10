// TopNavBar.jsx
import React from "react";
import styled from "styled-components";
import { Button, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../images/plain_icon_600.png";

const TopNavBarContainer = styled.nav`
  background-color: transparent; /* 👈 changed from #111 to transparent */
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

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
`;

const Logo = styled.img`
  width: 25px;
`;

const LogoText = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: white;
`;

export default function TopNavBarRounter({
  topNavData,
  activeTopNav,
  handleTopNavClick,
  onBurgerClick,
}) {
  const navigate = useNavigate();

  // Derive the label of the currently active topNav item.
  // If none is active, show a fallback label.
  const activeItem = topNavData.find((item) => item.id === activeTopNav);
  const activeLabel = activeItem ? activeItem.label : "Select...";

  const handleClick = (navItem) => {
    handleTopNavClick(navItem.id);
  };

  return (
    <TopNavBarContainer>
      {/* Logo & Text (always visible) */}
      <LogoContainer onClick={() => navigate("/")}>
        <Logo src={logo} alt="Vetcation Logo" />
        <LogoText>Vetcation</LogoText>
      </LogoContainer>

      {/* Inline nav links (desktop only) */}
      <div className="d-none d-md-flex" style={{ gap: "2rem" }}>
        {topNavData.map((navItem) => (
          <TopNavLink
            key={navItem.id}
            $active={activeTopNav === navItem.id}
            onClick={() => handleClick(navItem)}
          >
            {navItem.label}
          </TopNavLink>
        ))}
      </div>

      {/* Mobile-only: Hamburger + Dropdown */}
      <div
        className="d-md-none ms-auto"
        style={{ display: "flex", gap: "1rem" }}
      >
        {/* Hamburger Button for the mobile drawer */}
        <Button variant="primary" onClick={onBurgerClick}>
          ☰ Menu
        </Button>

        {/* Dropdown for topNavData, showing active label on Toggle */}
        <Dropdown>
          <Dropdown.Menu>
            {topNavData.map((navItem) => (
              <Dropdown.Item
                key={navItem.id}
                active={activeTopNav === navItem.id}
                onClick={() => handleClick(navItem)}
              >
                {navItem.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
          <Dropdown.Toggle variant="secondary" id="topNavDataDropdown">
            {activeLabel.length > 10
              ? `${activeLabel.slice(0, 10)}…`
              : activeLabel}
          </Dropdown.Toggle>
        </Dropdown>
      </div>
    </TopNavBarContainer>
  );
}
