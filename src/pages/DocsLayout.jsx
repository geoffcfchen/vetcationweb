// DocsLayout.jsx
import React, { useState, useRef, useCallback, useEffect } from "react";
import styled from "styled-components";
import { Container, Row, Col, Offcanvas } from "react-bootstrap";
import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import TopNavBarRounter from "../components/TopNavBarRouter"; // note: "TopNavBarRounter" name
import MySidebarRouter from "../components/Sidebar/MySidebarRouter";
import RightSideBarRouter from "../components/Sidebar/RightSideBarRouter";
import topNavData from "../data/topNavData";
import ScrollToTop from "../components/ScrollToTop";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #111;
  color: #fff;
`;

const MiddleColumn = styled.div`
  /* spacing inside the scroll container */
  padding: 16px clamp(12px, 2.5vw, 28px) 24px; /* top, horizontal, bottom */

  /* keeps content below the fixed 60px navbar on desktop */
  height: calc(100vh - 60px);
  background: #1c1c1c;
  overflow-y: auto;

  /* makes scrollIntoView() stop with a little headroom */
  scroll-padding-top: 16px;

  @media (max-width: 768px) {
    /* mobile uses window scroll; give room for fixed navbar + a little gap */
    height: auto;
    overflow-y: visible;
    padding: 76px 16px 24px; /* 60px navbar + 16px breathing space */
    scroll-padding-top: 76px;
  }
`;

export default function DocsLayout() {
  const { topNavId = "home" } = useParams();
  const location = useLocation(); // ← new

  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [docSections, setDocSections] = useState([]);
  const [activeSectionId, setActiveSectionId] = useState(null);

  // NEW: track whether the nav should be hidden
  const [hideNav, setHideNav] = useState(false);

  const mainContentRef = useRef(null);

  // Wrap registerSections in useCallback so its identity is stable
  const registerSections = useCallback((sectionsArray) => {
    setDocSections(sectionsArray || []);
  }, []);

  // Similarly, wrap setActiveSection
  const setActiveSection = useCallback((sectionId) => {
    setActiveSectionId(sectionId);
  }, []);

  const handleTopNavClick = (navId) => {
    if (navId === "home") {
      navigate(`/telemedicine-info/${navId}/introToVetcation`);
    }
    if (navId === "contributors") {
      navigate(`/telemedicine-info/${navId}/ourContributors`);
    }
    if (navId === "clinics") {
      navigate(`/telemedicine-info/${navId}/clinicIntroToVetcation`);
    }
    if (navId === "rvts") {
      navigate(`/telemedicine-info/${navId}/introToRVT`);
    }
  };

  // useEffect(() => {
  //   if (activeSectionId) {
  //     navigate(`#${activeSectionId}`, { replace: true });
  //   }
  // }, [activeSectionId, navigate]);
  useEffect(() => {
    if (activeSectionId) {
      navigate(
        { pathname: location.pathname, hash: activeSectionId },
        { replace: true }
      );
    }
  }, [activeSectionId, navigate, location.pathname]);
  // useEffect(() => {
  //   if (activeSectionId) {
  //     navigate({ hash: activeSectionId }, { replace: true });
  //   }
  // }, [activeSectionId, navigate]);

  // 2️⃣ On first render, scroll to any existing hash
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      setActiveSectionId(id);
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, []); // run only once

  // NEW: useEffect for scroll detection on mobile
  useEffect(() => {
    // For mobile, listen to window's scroll; desktop you can still use container scroll if needed
    const handleScroll = () => {
      if (window.innerWidth <= 768) {
        const currentScrollY = window.scrollY;
        // Using a hysteresis: scroll down > 50px triggers hide; scroll up > 30px triggers show
        if (currentScrollY - lastScrollY > 30) {
          setHideNav(true);
        } else if (lastScrollY - currentScrollY > 20) {
          setHideNav(false);
        }
        lastScrollY = currentScrollY;
      }
    };

    let lastScrollY = window.scrollY;
    if (window.innerWidth <= 768) {
      window.addEventListener("scroll", handleScroll);
    } else {
      // For desktop you might still use mainContentRef if needed
      const container = mainContentRef.current;
      if (container) {
        container.addEventListener("scroll", handleScroll);
      }
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
      const container = mainContentRef.current;
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <PageWrapper>
      {/* Top Nav Bar: pass hideNav as a prop */}
      <TopNavBarRounter
        topNavData={topNavData}
        activeTopNav={topNavId}
        handleTopNavClick={handleTopNavClick}
        onBurgerClick={() => setShowOffcanvas(true)}
        hideNav={hideNav} // NEW
      />

      <Container fluid style={{ flex: 1 }}>
        <Row style={{ height: "100%" }}>
          {/* LEFT SIDEBAR */}
          <Col
            xs={12}
            md={3}
            lg={2}
            className="d-none d-md-block"
            style={{
              padding: 0,
              height: "calc(100vh - 60px)",
              overflowY: "auto",
            }}
          >
            <MySidebarRouter activeTopNav={topNavId} />
          </Col>

          {/* MIDDLE CONTENT */}
          <Col as={MiddleColumn} xs={12} md={6} lg={8} ref={mainContentRef}>
            <ScrollToTop containerRef={mainContentRef} />
            <Outlet
              context={{
                registerSections,
                setActiveSection,
                scrollToSection: (sectionId) => {
                  const el = document.getElementById(sectionId);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                },
              }}
            />
          </Col>

          {/* RIGHT SIDEBAR */}
          <Col
            xs={12}
            md={3}
            lg={2}
            className="d-none d-md-block"
            style={{
              padding: 0,
              height: "calc(100vh - 60px)",
              overflowY: "auto",
            }}
          >
            <RightSideBarRouter
              docSections={docSections}
              activeSectionId={activeSectionId}
              onSectionClick={(sectionId) => {
                const el = document.getElementById(sectionId);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
            />
          </Col>
        </Row>
      </Container>

      {/* OFFCANVAS */}
      <Offcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        placement="start"
        style={{ width: "240px", backgroundColor: "#0d0d0d" }}
      >
        <Offcanvas.Header closeButton closeVariant="white" />
        <Offcanvas.Body>
          <MySidebarRouter
            activeTopNav={topNavId}
            closeOffcanvas={() => setShowOffcanvas(false)}
          />
        </Offcanvas.Body>
      </Offcanvas>
    </PageWrapper>
  );
}
