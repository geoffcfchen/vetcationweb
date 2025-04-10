// DocsLayout.jsx
import React, { useState, useRef, useCallback, useEffect } from "react";
import styled from "styled-components";
import { Container, Row, Col, Offcanvas } from "react-bootstrap";
import { Outlet, useNavigate, useParams } from "react-router-dom";
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
  padding: 0;
  height: calc(100vh - 60px);
  background: #1c1c1c;
  overflow-y: auto;

  @media (max-width: 768px) {
    height: 100vh; /* ✅ Reset height for mobile */
    padding-top: 60px; /* match the fixed TopNavBar height */
  }
`;

export default function DocsLayout() {
  const { topNavId = "home" } = useParams();

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
  };

  // NEW: useEffect for scroll detection on mobile
  useEffect(() => {
    const container = mainContentRef.current;
    if (!container) return;

    let lastScrollY = 0;

    function handleScroll() {
      // Only do the hide/show logic if screen is mobile sized
      if (window.innerWidth <= 768) {
        const currentScrollY = container.scrollTop;

        // If we scrolled down more than 5px from last time => hide
        if (currentScrollY - lastScrollY > 30) {
          setHideNav(true);
        }
        // If we scrolled up => show
        else if (lastScrollY - currentScrollY > 20) {
          setHideNav(false);
        }

        lastScrollY = currentScrollY;
      }
    }

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
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
