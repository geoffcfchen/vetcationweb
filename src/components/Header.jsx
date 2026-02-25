// Header.jsx
import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import logo from "../images/plain_icon_600.png";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FiLogIn } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";

const breakpoint = 900;

// Size tokens so it is easy to tweak
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

// Button style link for "Log in"
const LoginButton = styled.button`
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 1.1rem;
  border-radius: 999px;
  border: 1px solid #4b5563;
  background: #111827;
  color: #f9fafb;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease,
    transform 0.05s ease, box-shadow 0.15s ease;

  &:hover {
    background: #ffffff;
    color: #111827;
    border-color: #2563eb;
    box-shadow: 0 6px 18px rgba(37, 99, 235, 0.4);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 3px 10px rgba(15, 23, 42, 0.75);
  }
`;

const BurgerWrap = styled.div`
  display: none;

  @media (max-width: ${breakpoint}px) {
    display: block;
    padding: 4px;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

// add this styled component
const BrandWrap = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.05;
`;

const LogoSubText = styled.span`
  margin-top: 2px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);

  @media (max-width: ${breakpoint}px) {
    font-size: 11px;
  }
`;

function Header({ onLoginClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : breakpoint + 1
  );
  const navigate = useNavigate();

  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const handleLoginClick = useCallback(
    (e) => {
      e?.preventDefault?.();
      if (onLoginClick) {
        onLoginClick();
      } else {
        navigate("/login");
      }
      setIsOpen(false);
    },
    [onLoginClick, navigate]
  );

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClickOutside = useCallback((event) => {
    if (event.target.closest("#dropdown-basic") === null) {
      setIsOpen(false);
    }
  }, []);

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
        <Logo src={logo} alt="MyPet Health logo" />
        <LogoText>MyPet Health</LogoText>
      </LogoContainer>

      {/* Desktop nav */}
      <Nav>
        <LoginButton type="button" onClick={handleLoginClick}>
          <FiLogIn />
          <span>Log in</span>
        </LoginButton>
      </Nav>

      {/* Mobile dropdown */}
      {windowWidth <= breakpoint && (
        <Dropdown show={isOpen} onToggle={setIsOpen} align="end">
          <Dropdown.Toggle
            as={BurgerWrap}
            id="dropdown-basic"
            onClick={toggleDropdown}
          >
            <FontAwesomeIcon icon={faBars} style={{ color: "#fff" }} />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleLoginClick}>Log in</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </HeaderContainer>
  );
}

export default Header;
