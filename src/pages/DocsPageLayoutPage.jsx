import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, Offcanvas } from "react-bootstrap";
import AccordionItem from "../components/accordion/AccordionItem";
import MySidebar from "../components/Sidebar/MySidebar";
import RightSideBar from "../components/Sidebar/RightSideBar";
import iPhoneFrame from "../images/iphone-frame_15pro.png"; // same frame image as in Feature.jsx
import { motion } from "framer-motion";
import contentData from "../data/docsContentData";
import TrendPointsBlock from "../components/TrendPointsBlock";
import BulletListBlock from "../components/BulletListBlock";
import QAContentBlock from "../components/QAContentBlock";
import ParagraphBlock from "../components/ParagraphBlock";
import FramedImageBlock from "../components/FramedImageBlock";
import TopNavBar from "../components/TopNavBar";
import topNavData from "../data/topNavData";
import sideNavData from "../data/sideNavData";

// ===================== STYLED COMPONENTS ===================== //

// A container for the entire page
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #111; /* Dark background to match the LiveKit theme */
  color: #fff;

  @media (max-width: 576px) {
    // On very small screens, remove fixed height
    min-height: auto;
  }
`;

// Middle content area
const MainContent = styled.div`
  background-color: #1c1c1c;
  padding: 2rem;
  height: 100%;
  overflow-y: auto;

  @media (max-width: 768px) {
    // If desired, reduce padding on small screens
    padding: 1rem;
  }
`;

// Right sidebar
// const RightSidebar = styled.div`
//   background-color: #1c1c1c;
//   height: 100%;
//   padding: 1rem;
//   overflow-y: auto;
// `;

// An item in the right sidebar "On this page" section
const TocItem = styled.div`
  margin-bottom: 0.5rem;
  cursor: pointer;
  color: ${(props) => (props.active ? "#fff" : "#ccc")};

  &:hover {
    color: #fff;
  }
`;

export const AccordionContainer = styled.div`
  border: 1px solid #333;
  margin-bottom: 1rem;
  border-radius: 4px;
  overflow: hidden;
`;

export const AccordionHeader = styled.div`
  background-color: #1c1c1c;
  padding: 1rem;
  cursor: pointer;
  user-select: none;
  font-weight: bold;
  color: #ccc;

  &:hover {
    background-color: #2a2a2a;
  }
`;

export const AccordionBody = styled.div`
  background-color: #000;
  color: #ccc;
  padding: 1rem;
  line-height: 1.6;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

export default function DocsPageLayoutPage() {
  // Offcanvas state
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  // Track which top-level nav is active
  const [activeTopNav, setActiveTopNav] = useState("home");
  // Track which left sidebar item is currently active
  const [activeSidebarItem, setActiveSidebarItem] =
    useState("introToVetcation");
  // For the right sidebar highlighting, store the current section ID
  const [activeSection, setActiveSection] = useState("");
  const [expandedItems, setExpandedItems] = useState([]); // list of parent IDs that are open
  const [activeItem, setActiveItem] = useState("settingUpAvailability"); // whichever is selected

  // Refs to each section in the middle column for IntersectionObserver
  const sectionRefs = useRef({});

  const closeOffcanvas = () => setShowOffcanvas(false);

  useEffect(() => {
    // We only observe the sections if we have them
    const currentSidebarData = sideNavData[activeTopNav] || [];
    let allItems = [];
    currentSidebarData.forEach((group) => {
      allItems = allItems.concat(group.items);
    });
    const contentObj = contentData[activeSidebarItem];
    if (!contentObj) return;

    // IntersectionObserver callback
    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id); // The section's ID
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      root: document.getElementById("mainContentScrollArea"),
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0.1,
    });

    // Observe each section in the current content
    contentObj.sections.forEach((sect) => {
      const el = sectionRefs.current[sect.id];
      if (el) observer.observe(el);
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [activeTopNav, activeSidebarItem]);

  // Handler for top nav
  const handleTopNavClick = (item) => {
    setActiveTopNav(item);
    // Reset left sidebar selection to something in that new group
    const firstGroup = sideNavData[item]?.[0];
    if (firstGroup) {
      setActiveSidebarItem(firstGroup.items[0].id);
    }
  };

  // Example: when user clicks on "Scheduling," toggle it in expandedItems
  function handleExpandCollapse(itemId) {
    if (expandedItems.includes(itemId)) {
      // It's currently open; close it
      setExpandedItems(expandedItems.filter((id) => id !== itemId));
    } else {
      // It's currently closed; open it
      setExpandedItems([...expandedItems, itemId]);
    }
  }

  // Example: selecting a sub-item
  function handleSelectItem(itemId) {
    setActiveItem(itemId);
    setActiveSidebarItem(itemId);
    // Ensure the middle content scrolls back to the top:
    const contentContainer = document.getElementById("mainContentScrollArea");
    if (contentContainer) {
      contentContainer.scrollTo({
        top: 0,
        behavior: "smooth", // or 'auto'
      });
    }
  }

  // Handler for left sidebar click
  const handleSidebarItemClick = (id) => {
    setActiveSidebarItem(id);
  };

  // Handler for right sidebar click — we scroll to the ID
  const handleRightSidebarClick = (sectionId) => {
    const el = sectionRefs.current[sectionId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Determine the content to display in the middle column
  const currentContent = contentData[activeSidebarItem];

  return (
    <PageWrapper>
      {/* ============== TOP NAVIGATION ============== */}
      {/* <TopNavBar>
        {topNavData.map((navItem) => (
          <TopNavLink
            key={navItem.id}
            $active={activeTopNav === navItem.id}
            onClick={() => handleTopNavClick(navItem.id)}
          >
            {navItem.label}
          </TopNavLink>
        ))}


        <Button
          variant="primary"
          className="d-md-none ms-auto" // d-md-none = hide at md+, ms-auto = push to right
          onClick={() => setShowOffcanvas(true)}
        >
          ☰ Menu
        </Button>
      </TopNavBar> */}
      <TopNavBar
        topNavData={topNavData}
        activeTopNav={activeTopNav}
        handleTopNavClick={handleTopNavClick}
        onBurgerClick={() => setShowOffcanvas(true)}
      />

      {/* ============== BODY: 3-COLUMN LAYOUT ============== */}
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
              height: "calc(100vh - 60px)", // for example, if your top nav is ~60px
              overflowY: "auto",
            }}
          >
            <MySidebar
              sideNavData={sideNavData}
              activeTopNav={activeTopNav}
              expandedItems={expandedItems}
              handleExpandCollapse={handleExpandCollapse}
              activeItem={activeSidebarItem} // or activeItem
              handleSelectItem={handleSelectItem}
              closeOffcanvas={() => {}} // optional no-op, so no error on desktop
            />
          </Col>

          {/* MIDDLE CONTENT */}
          <Col
            xs={12}
            md={6}
            lg={8}
            style={{ padding: 0, height: "calc(100vh - 60px)" }}
          >
            <MainContent id="mainContentScrollArea">
              {currentContent ? (
                <>
                  <h1>{currentContent.mainTitle}</h1>
                  {/* Render the new descriptive text if present */}
                  {currentContent.mainDescription && (
                    <p
                      style={{
                        color: "#ccc",
                        lineHeight: "1.6",
                        marginTop: "1rem",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: currentContent.mainDescription,
                      }}
                    />
                  )}

                  {currentContent.sections.map((sec) => (
                    <div
                      key={sec.id}
                      id={sec.id}
                      ref={(el) => (sectionRefs.current[sec.id] = el)}
                      style={{ marginBottom: "2rem" }}
                    >
                      <h2 style={{ marginTop: "2rem" }}>{sec.title}</h2>
                      {sec.blocks &&
                        sec.blocks.map((block, blockIndex) => {
                          const key = `${sec.id}-block-${blockIndex}`; // stable enough if you won't reorder blocks
                          switch (block.type) {
                            case "bulletList":
                              return (
                                <BulletListBlock key={key} block={block} />
                              );
                            case "qa":
                              return <QAContentBlock key={key} block={block} />;
                            case "trendPoints":
                              return (
                                <TrendPointsBlock key={key} block={block} />
                              );
                            case "paragraph":
                              return <ParagraphBlock key={key} block={block} />;
                            case "framedImage":
                              return (
                                <FramedImageBlock key={key} block={block} />
                              );
                            default:
                              return <p key={key}>{block.content}</p>;
                          }
                        })}
                    </div>
                  ))}
                </>
              ) : (
                <p>No content available.</p>
              )}
            </MainContent>
          </Col>

          {/* RIGHT SIDEBAR */}
          <Col
            xs={12}
            md={3}
            lg={2}
            className="d-none d-md-block" // hides below md, shows at md+
            style={{
              padding: 0,
              height: "calc(100vh - 60px)",
              overflowY: "auto", // add this line
            }}
          >
            <RightSideBar
              currentContent={currentContent}
              activeSection={activeSection}
              handleRightSidebarClick={handleRightSidebarClick}
            />
          </Col>
        </Row>
      </Container>
      {/* ============== OFFCANVAS for the LEFT SIDEBAR (small screens) ============== */}
      <Offcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        placement="start" // slide from left
        style={{ width: "240px", backgroundColor: "#0d0d0d" }}
      >
        <Offcanvas.Header closeButton closeVariant="white">
          {/* <Offcanvas.Title>Menu</Offcanvas.Title> */}
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Render the same MySidebar here, so it's available on small screens */}
          <MySidebar
            sideNavData={sideNavData}
            activeTopNav={activeTopNav}
            expandedItems={expandedItems}
            handleExpandCollapse={handleExpandCollapse}
            activeItem={activeSidebarItem} // or activeItem
            handleSelectItem={handleSelectItem}
            closeOffcanvas={() => setShowOffcanvas(false)} // <-- pass this
          />
        </Offcanvas.Body>
      </Offcanvas>
    </PageWrapper>
  );
}
