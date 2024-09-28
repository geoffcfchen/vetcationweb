import React, { useEffect, useState } from "react";
import styled from "styled-components";
import logo from "../images/plain_icon_600.png"; // Adjust the path as necessary
import { Dropdown, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const breakpoint = 900;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: black;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; // Space between logo and text
  cursor: pointer; // Makes the cursor look like a pointer when hovering over this container

  &:hover {
    opacity: 0.8; // Optionally, add some visual feedback like changing the opacity
  }
`;

const Logo = styled.img`
  width: 40px; // Adjust as necessary
`;

const LogoText = styled.span`
  font-size: 24px; // Adjust size as necessary
  font-weight: bold; // Bold font
  color: white; // Text color
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  overflow: hidden; // Prevents overflow of the nav elements

  align-items: center;

  @media (max-width: ${breakpoint}px) {
    display: none;
  }
`;

const MenuLink = styled.a`
  text-decoration: none;
  color: white; // Adjust the color accordingly
  white-space: nowrap; // Prevents text from wrapping
  overflow: hidden; // Keeps the text from overflowing the nav area
  text-overflow: ellipsis; // Adds an ellipsis if the text is too long to fit
`;

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  let navigate = useNavigate();

  const handleJoinClick = () => {
    navigate("/register"); // Navigates to the register page
  };

  const handleLoginClick = () => {
    navigate("/login"); // Navigates to the login page
  };

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function toggleDropdown() {
    console.log("Toggling dropdown");
    console.log("isOpen", isOpen);
    setIsOpen(!isOpen);
  }

  // Close the dropdown when clicking outside of it
  const handleClickOutside = (event) => {
    if (event.target.closest("#dropdown-basic") === null) {
      setIsOpen(false);
    }
  };

  // Add event listeners when dropdown opens and clean up on close or component unmount
  useEffect(() => {
    if (isOpen) {
      window.addEventListener("click", handleClickOutside);
      window.addEventListener("resize", () => setIsOpen(false)); // Close on resize
    } else {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", () => setIsOpen(false));
    }

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", () => setIsOpen(false));
    };
  }, [isOpen]); // Only re-run when isOpen changes

  // Adjusted to handle boolean value directly
  const handleToggle = (newOpenState) => {
    setIsOpen(newOpenState);
  };

  return (
    <HeaderContainer>
      <LogoContainer onClick={() => navigate("/")}>
        <Logo src={logo} alt="Vetcation Logo" />
        <LogoText>Vetcation</LogoText>
      </LogoContainer>

      <Nav>
        {/* <MenuLink href="#/clients">for Pet Owners</MenuLink>
        <MenuLink href="#/vets">for Vets</MenuLink>
        <MenuLink href="#/clinics">for Hospitals</MenuLink> */}
        {/* <MenuLink href="/techs">for Techs</MenuLink> */}
        {/* <MenuLink href="/hospitals">for Hospitals</MenuLink> */}
        {/* <MenuLink href="/students">for Students</MenuLink> */}
        {/* <MenuLink href="/about">About Us</MenuLink> */}
        <Button variant="primary" onClick={handleJoinClick}>
          Join Vetcation
        </Button>
        {/* <Button variant="secondary" onClick={handleLoginClick}>
          Log In
        </Button> */}
      </Nav>

      {windowWidth <= breakpoint && (
        <Dropdown show={isOpen} onToggle={handleToggle}>
          <Dropdown.Toggle
            as="div"
            variant="success"
            id="dropdown-basic"
            onClick={toggleDropdown}
          >
            {windowWidth <= breakpoint && (
              <FontAwesomeIcon icon={faBars} style={{ color: "white" }} />
            )}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/clients">for Pet Owners</Dropdown.Item>
            <Dropdown.Item href="#/vets">for Vets</Dropdown.Item>
            {/* <Dropdown.Item href="#/vets">for Techs</Dropdown.Item> */}
            <Dropdown.Item href="#/clinics">for Hospitals</Dropdown.Item>
            {/* <Dropdown.Item onpres>Join Vetcation</Dropdown.Item> */}
            {/* <Dropdown.Item href="#/vets">Log in</Dropdown.Item> */}
          </Dropdown.Menu>
        </Dropdown>
      )}
    </HeaderContainer>
  );
}

export default Header;
