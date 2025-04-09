// DocsLayout.jsx
import React, { useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { Container, Row, Col, Offcanvas } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import MySidebarRouter from "../components/Sidebar/MySidebarRouter";
import RightSideBar from "../components/Sidebar/RightSideBar";
import topNavData from "../data/topNavData";
import RightSideBarRouter from "../components/Sidebar/RightSideBarRouter";
import TopNavBarRounter from "../components/TopNavBarRouter";
import ScrollToTop from "../components/ScrollToTop";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #111;
  color: #fff;
`;

export default function DocsLayout() {
  const [activeTopNav, setActiveTopNav] = useState("home");
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [docSections, setDocSections] = useState([]);
  const [activeSectionId, setActiveSectionId] = useState(null);
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
    setActiveTopNav(navId);
  };

  return (
    <PageWrapper>
      {/* Top Nav Bar */}
      <TopNavBarRounter
        topNavData={topNavData}
        activeTopNav={activeTopNav}
        handleTopNavClick={handleTopNavClick}
        onBurgerClick={() => setShowOffcanvas(true)}
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
            <MySidebarRouter activeTopNav={activeTopNav} />
          </Col>

          {/* MIDDLE CONTENT */}
          <Col
            ref={mainContentRef}
            xs={12}
            md={6}
            lg={8}
            style={{
              padding: 0,
              height: "calc(100vh - 60px)",
              background: "#1c1c1c",
              overflowY: "auto",
            }}
          >
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
            activeTopNav={activeTopNav}
            closeOffcanvas={() => setShowOffcanvas(false)}
          />
        </Offcanvas.Body>
      </Offcanvas>
    </PageWrapper>
  );
}
