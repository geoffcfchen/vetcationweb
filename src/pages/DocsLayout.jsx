// DocsLayout.jsx
import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Container, Row, Col, Offcanvas } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import MySidebarRouter from "../components/Sidebar/MySidebarRouter";
import RightSideBar from "../components/Sidebar/RightSideBar";
import topNavData from "../data/topNavData";
import RightSideBarRouter from "../components/Sidebar/RightSideBarRouter";

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

  // 1) docSections for the right sidebar
  const [docSections, setDocSections] = useState([]);
  // 2) activeSection ID for highlighting
  const [activeSectionId, setActiveSectionId] = useState(null);

  // We'll keep a ref to the main content container so we can scroll
  const mainContentRef = useRef(null);

  // Called by the doc page to set the sections it has
  function registerSections(sectionsArray) {
    setDocSections(sectionsArray || []);
  }

  // Called by the doc page's intersection observer to update which section is active
  function setActiveSection(sectionId) {
    setActiveSectionId(sectionId);
  }

  // Called by the right sidebar when the user clicks a section
  function scrollToSection(sectionId) {
    // We dispatch a custom event or we can store a map of refs in the layout
    // But simplest: We'll rely on the doc page to handle a "scrollToSection"
    // approach using a custom event or something similar.
    // Or see "Approach B" below for a more integrated solution.

    // For now, let's just do a quick hack:
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // If your docs use multiple top nav items
  const handleTopNavClick = (navId) => {
    setActiveTopNav(navId);
  };

  return (
    <PageWrapper>
      {/* Top Nav Bar */}
      <TopNavBar
        topNavData={topNavData}
        activeTopNav={activeTopNav}
        handleTopNavClick={handleTopNavClick}
        onBurgerClick={() => setShowOffcanvas(true)}
      />

      <Container fluid style={{ flex: 1 }}>
        <Row style={{ height: "100%" }}>
          {/* LEFT SIDEBAR (desktop) */}
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
            ref={mainContentRef} // store a ref
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
            {/*
              Provide a context object to child routes:
              - registerSections so they can set docSections
              - setActiveSection so they can set activeSectionId
              - Possibly scrollToSection, if we want the doc page to handle it. 
            */}
            <Outlet
              context={{
                registerSections,
                setActiveSection,
                scrollToSection,
              }}
            />
          </Col>

          {/* RIGHT SIDEBAR (desktop) */}
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
              onSectionClick={scrollToSection}
            />
          </Col>
        </Row>
      </Container>

      {/* OFFCANVAS (mobile) */}
      <Offcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        placement="start"
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
