// Header.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import logo from "../images/plain_icon_600.png";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const breakpoint = 900;

// ——— size tokens so it’s easy to tweak ———
const SIZES = {
  headerPaddingY: "1.15rem",
  headerPaddingX: "1.5rem",
  logo: 25, // px
  logoMobile: 25,
  text: 20, // px
  textMobile: 18,
  gap: 15, // px
};

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${SIZES.headerPaddingY} ${SIZES.headerPaddingX};
  background-color: #000;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${SIZES.gap}px;
  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }
`;

const Logo = styled.img`
  width: ${SIZES.logo}px;

  @media (max-width: ${breakpoint}px) {
    width: ${SIZES.logoMobile}px;
  }
`;

const LogoText = styled.span`
  font-size: ${SIZES.text}px;
  font-weight: 800;
  color: #fff;
  line-height: 1;

  @media (max-width: ${breakpoint}px) {
    font-size: ${SIZES.textMobile}px;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 0.875rem;
  align-items: center;
  overflow: hidden;

  @media (max-width: ${breakpoint}px) {
    display: none;
  }
`;

const MenuLink = styled.a`
  text-decoration: none;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    opacity: 0.9;
  }
`;

const BurgerWrap = styled.div`
  display: none;

  @media (max-width: ${breakpoint}px) {
    display: block;
    padding: 4px; /* slightly larger tap target */
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);
  const navigate = useNavigate();

  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Close the dropdown when clicking outside of it
  const handleClickOutside = useCallback((event) => {
    if (event.target.closest("#dropdown-basic") === null) {
      setIsOpen(false);
    }
  }, []);

  // Stable handler for "resize → close"
  const handleResizeClose = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("click", handleClickOutside);
      window.addEventListener("resize", handleResizeClose);
    }
    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", handleResizeClose);
    };
  }, [isOpen, handleClickOutside, handleResizeClose]);

  const handleToggle = useCallback((nextOpen) => {
    setIsOpen(nextOpen);
  }, []);

  return (
    <HeaderContainer>
      <LogoContainer onClick={() => navigate("/")}>
        <Logo src={logo} alt="Vetcation Logo" />
        <LogoText>Vetcation</LogoText>
      </LogoContainer>

      <Nav>
        <MenuLink href="/telemedicine-info/">
          Telemedicine Documentation
        </MenuLink>
      </Nav>

      {windowWidth <= breakpoint && (
        <Dropdown show={isOpen} onToggle={handleToggle} align="end">
          <Dropdown.Toggle
            as={BurgerWrap}
            id="dropdown-basic"
            onClick={toggleDropdown}
          >
            <FontAwesomeIcon icon={faBars} style={{ color: "#fff" }} />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="/telemedicine-info">
              Telemedicine Documentation
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </HeaderContainer>
  );
}

export default Header;
