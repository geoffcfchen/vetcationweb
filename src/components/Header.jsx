import React, { useEffect, useState } from "react";
import styled from "styled-components";
import logo from "../images/logo_3.svg"; // Adjust the path as necessary
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #fff; // Set this to match your header's background
`;

const Logo = styled.img`
  width: 120px; // Adjust as necessary
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuLink = styled.a`
  text-decoration: none;
  color: #333; // Adjust the color accordingly
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  color: white;
  background-color: blue; // Use your color
  border: none;
  border-radius: 5px;
`;

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
      <Logo src={logo} alt="Roo Logo" />
      <Nav>
        <MenuLink href="/vets">for Vets</MenuLink>
        <MenuLink href="/hospitals">for Hospitals</MenuLink>
        <MenuLink href="/techs">for Techs</MenuLink>
        <MenuLink href="/students">for Students</MenuLink>
        <MenuLink href="/about">About Us</MenuLink>
        <Button>Join Vetcation</Button>
        <Button>Log In</Button>
      </Nav>
      <Dropdown show={isOpen} onToggle={handleToggle}>
        {windowWidth <= 768 && (
          <Dropdown.Toggle
            as="div"
            variant="success"
            id="dropdown-basic"
            onClick={toggleDropdown}
          >
            {windowWidth <= 768 && <FontAwesomeIcon icon={faBars} />}
          </Dropdown.Toggle>
        )}

        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">for Vets</Dropdown.Item>
          <Dropdown.Item href="#/action-2">for Hospitals</Dropdown.Item>
          <Dropdown.Item href="#/action-3">for Techs</Dropdown.Item>
          <Dropdown.Item href="#/action-3">for Students</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Join Vetcation</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Log in</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </HeaderContainer>
  );
}

export default Header;
