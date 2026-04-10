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

const SIZES = {
  headerPaddingY: "1rem",
  headerPaddingX: "1.5rem",
  logo: 28,
  logoMobile: 26,
  gap: 12,
};

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${SIZES.headerPaddingY} ${SIZES.headerPaddingX};
  background: #14202a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  z-index: 20;
`;

const LogoContainer = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${SIZES.gap}px;
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 0;
  text-align: left;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;

  &:hover {
    opacity: 0.92;
    transform: translateY(-1px);
  }
`;

const Logo = styled.img`
  width: ${SIZES.logo}px;
  height: ${SIZES.logo}px;
  object-fit: contain;
  flex: 0 0 auto;

  @media (max-width: ${breakpoint}px) {
    width: ${SIZES.logoMobile}px;
    height: ${SIZES.logoMobile}px;
  }
`;

const BrandWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.05;
`;

const LogoText = styled.span`
  font-size: 1.15rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;

  @media (max-width: ${breakpoint}px) {
    font-size: 1.02rem;
  }
`;

const LogoSubText = styled.span`
  margin-top: 4px;
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(232, 217, 184, 0.9);
  letter-spacing: 0.02em;

  @media (max-width: ${breakpoint}px) {
    font-size: 0.72rem;
    margin-top: 3px;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: ${breakpoint}px) {
    display: none;
  }
`;

const NavLinkItem = styled(Link)`
  font-size: 0.98rem;
  font-weight: 600;
  color: #e8edf2;
  text-decoration: none;
  padding: 0.55rem 0.85rem;
  border-radius: 999px;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    transform 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.92);
    outline-offset: 3px;
  }
`;

const LoginButton = styled.button`
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.62rem 1.08rem;
  margin-left: 0.35rem;
  border-radius: 999px;
  border: 1px solid rgba(232, 217, 184, 0.45);
  background: #e8d9b8;
  color: #14202a;
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    transform 0.05s ease,
    box-shadow 0.15s ease;

  &:hover {
    background: #f1e6cc;
    border-color: #f1e6cc;
    box-shadow: 0 8px 18px rgba(12, 18, 24, 0.22);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 3px 10px rgba(12, 18, 24, 0.18);
  }
`;

const BurgerWrap = styled.div`
  display: none;
  color: #ffffff;

  @media (max-width: ${breakpoint}px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.06);
    cursor: pointer;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

function Header({ onLoginClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : breakpoint + 1,
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
    [onLoginClick, navigate],
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

  return (
    <HeaderContainer>
      <LogoContainer type="button" onClick={() => navigate("/")}>
        <Logo src={logo} alt="MyPet Health by Vetcation logo" />
        <BrandWrap>
          <LogoText>MyPet Health</LogoText>
          <LogoSubText>by Vetcation</LogoSubText>
        </BrandWrap>
      </LogoContainer>

      <Nav>
        <NavLinkItem to="/for-shelters/">For shelters</NavLinkItem>
        <NavLinkItem to="/mission/">Mission</NavLinkItem>
        <NavLinkItem to="/team/">Team</NavLinkItem>
        <NavLinkItem to="/telemedicine-info/clients/clientIntroToVetcation/">
          Documents
        </NavLinkItem>

        <LoginButton type="button" onClick={handleLoginClick}>
          <FiLogIn />
          <span>Log in</span>
        </LoginButton>
      </Nav>

      {windowWidth <= breakpoint && (
        <Dropdown show={isOpen} onToggle={setIsOpen} align="end">
          <Dropdown.Toggle
            as={BurgerWrap}
            id="dropdown-basic"
            onClick={toggleDropdown}
          >
            <FontAwesomeIcon icon={faBars} />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              as={Link}
              to="/for-shelters/"
              onClick={() => setIsOpen(false)}
            >
              For shelters
            </Dropdown.Item>
            <Dropdown.Item
              as={Link}
              to="/mission/"
              onClick={() => setIsOpen(false)}
            >
              Mission
            </Dropdown.Item>
            <Dropdown.Item
              as={Link}
              to="/team/"
              onClick={() => setIsOpen(false)}
            >
              Team
            </Dropdown.Item>
            <Dropdown.Item
              as={Link}
              to="/telemedicine-info/clients/clientIntroToVetcation/"
              onClick={() => setIsOpen(false)}
            >
              Documents
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLoginClick}>Log in</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </HeaderContainer>
  );
}

export default Header;
