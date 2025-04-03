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

// Top navigation bar (Home, AI Agents, Telephony, etc.)
const TopNavBar = styled.nav`
  background-color: #111;
  padding: 1rem;
  display: flex;
  gap: 2rem;
  align-items: center;
`;

// Each link in the top nav
const TopNavLink = styled.span`
  cursor: pointer;
  color: ${(props) => (props.$active ? "#00bcd4" : "#ccc")};
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};

  &:hover {
    color: #fff;
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

const BulletList = styled.ul`
  list-style: disc;
  margin: 1rem 0;
  padding-left: 1.5rem;
  color: #ccc;

  .highlight {
    font-weight: bold;
    color: #fff;
  }
`;

const BulletListItem = styled.li`
  margin-bottom: 0.5rem;
  line-height: 1.6;
`;

// =============== MOCK DATA STRUCTURES =============== //

/**
 * topNavData - array of top-level sections in the top nav bar
 * Each item has an `id` plus a display `label`.
 */
const topNavData = [
  { id: "home", label: "For veterinarians" },
  //   { id: "aiAgents", label: "AI Agents" },
  //   { id: "telephony", label: "Telephony" },
  //   { id: "recipes", label: "Recipes" },
  //   { id: "reference", label: "Reference" },
];

/**
 * sideNavData - For each topNav "id", we store an array of "groups".
 * Example: for "home", we have "Get Started" group with sub-items.
 */
const sideNavData = {
  home: [
    {
      groupTitle: "GET STARTED",
      items: [
        {
          id: "introToVetcation",
          label: "Intro to Vetcation",
        },
        {
          id: "VirtualClinic",
          label: "Setting Up Your Virtual Clinic",
        },
      ],
    },
    {
      groupTitle: "USER MANUAL",
      items: [
        {
          id: "scheduling", // parent ID
          label: "Scheduling", // label shown in sidebar
          subItems: [
            {
              id: "setMinimumNoticeTime",
              label: "Set Minimum Notice Time",
            },
            {
              id: "regularAvailability",
              label: "Regular availability",
            },
            {
              id: "specificAvailability",
              label: "Specific Availability",
            },
            {
              id: "pauseAvailability",
              label: "Pause Availability",
            },
            {
              id: "mySchedule",
              label: "Manage My Schedule",
            },
          ],
        },
        {
          id: "videoCalls",
          label: "Video Calls",
          subItems: [
            {
              id: "joinVideoCall",
              label: "Join a video call",
            },
            {
              id: "videoCallFeatures",
              label: "Call Features & Settings",
            },
            {
              id: "recordingAndConsent",
              label: "Recording & Consent",
            },
          ],
        },
        {
          id: "InquiryBasedMessager",
          label: "Inquiry-Based Messager",
          subItems: [
            {
              id: "InquiryBasedMessagerOverView",
              label: "Overview",
            },
            {
              id: "VCPRStatus",
              label: "VCPR Status",
            },
            {
              id: "StartNewCase",
              label: "Start a New Case",
            },
            {
              id: "RespondToCase",
              label: "Respond to a Case",
            },
            {
              id: "CloseCase",
              label: "Close a Case",
            },
            {
              id: "ViewCaseHistory",
              label: "View Case History",
            },
            {
              id: "MedicalNotes",
              label: "Medical Notes",
            },
          ],
        },
        {
          id: "Medical Records",
          label: "Medical Records",
          // subItems for E-prescribing basics, etc.
          subItems: [
            {
              id: "MedicalHistoryOverview",
              label: "Medical History Overview",
            },
            { id: "eprescribing", label: "E-prescribing basics" },
            {
              id: "pharmacyIntegrations",
              label: "Pharmacy / client’s choice",
            },
          ],
        },
        // ... you can add more
      ],
    },
    {
      groupTitle: "Regulatory Compliance",
      items: [
        {
          id: "Bill1399",
          label: "AB 1399 FAQ",
        },
        {
          id: "VCPR",
          label: "VCPR",
        },
        {
          id: "PrescriptionLimits",
          label: "Prescription Limits",
        },
        {
          id: "PrivacyConfidentiality",
          label: "Privacy and Confidentiality",
        },
        {
          id: "RacehorseCHRBRestrictions",
          label: "Racehorse & CHRB Restrictions",
        },
        {
          id: "RecordKeepingDocumentation",
          label: "Record-Keeping & Documentation",
        },
        {
          id: "MiscellaneousClarifications",
          label: "Miscellaneous Clarifications",
        },
      ],
    },
  ],
};

// Reuse exactly the same styles you used in Feature.jsx:
const VideoFrameContainer = styled.div`
  position: relative;
  width: 300px; /* match your iPhoneFrame's width */
  height: 600px; /* match your iPhoneFrame's height */
  margin: 2rem auto; /* center it horizontally, with some spacing */
`;

const FrameImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none; // so the frame doesn't block interactions
`;

const FramedImage = styled.img`
  position: absolute;
  top: 1.5%;
  left: 1.5%;
  width: 97%;
  height: 97%;
  object-fit: contain;
  border-radius: 30px; /* Adjust this value to match your iPhone frame’s rounded corners */
`;

const InnerFrame = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 20px; /* Adjust as needed */
`;

// Define the block component
function FramedImageBlock({ block }) {
  // block will contain something like:
  // {
  //   type: "framedImage",
  //   heading: "Screenshots",
  //   imageSrcs: [ ...array of image URLs... ]
  // }
  const { heading, imageSrcs = [] } = block;

  // optional: define framer variants if you want an animation
  const imageVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", duration: 0.8 },
    },
  };

  // If you do not want animations at all, either remove `motion` or
  // just pass a regular <img />. For now, let's keep them in.
  return (
    <div style={{ marginTop: "2rem" }}>
      {heading && (
        <h3 style={{ marginBottom: "1rem", color: "#fff" }}>{heading}</h3>
      )}

      {/* Container for multiple frames side-by-side (or wrapping) */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0rem",
          justifyContent: "space-evenly",
        }}
      >
        {imageSrcs.map((src, idx) => (
          <VideoFrameContainer key={idx}>
            <InnerFrame>
              <FramedImage
                variants={imageVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                src={src}
                alt={`framed-screenshot-${idx}`}
              />
            </InnerFrame>
            <FrameImage src={iPhoneFrame} alt="iPhone Frame" />
          </VideoFrameContainer>
        ))}
      </div>
    </div>
  );
}

const QAContentBlock = ({ block }) => {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <p style={{ fontWeight: "bold", color: "#00bcd4" }}>{block.question}</p>
      <p style={{ marginLeft: "1rem", color: "#ccc" }}>{block.answer}</p>
      {block.example && (
        <p style={{ marginLeft: "1rem", fontStyle: "italic", color: "#ccc" }}>
          <strong>Example:</strong> {block.example}
        </p>
      )}
      {block.helpText && (
        <div
          style={{
            backgroundColor: "#111", // darker background
            border: "1px solid #b1dbe3", // accent border
            borderRadius: "6px",
            padding: "1rem",
            marginTop: "1rem",
            marginLeft: "1rem",
            color: "#ccc",
          }}
        >
          <strong style={{ color: "#00bcd4" }}>How Vetcation Helps:</strong>{" "}
          {block.helpText}
        </div>
      )}
    </div>
  );
};

const BulletListBlock = ({ block }) => {
  return (
    <BulletList>
      {block.items.map((item, index) => {
        const { heading = "", lines = [] } = item;

        return (
          <BulletListItem key={index}>
            {heading && (
              <span style={{ fontWeight: "bold", color: "#fff" }}>
                {heading}
              </span>
            )}

            {lines.length > 0 && (
              <ul style={{ marginTop: "0.5rem", paddingLeft: "1.2rem" }}>
                {lines.map((line, lineIdx) => (
                  <li
                    key={`line-${lineIdx}`}
                    dangerouslySetInnerHTML={{ __html: line }}
                    style={{ marginBottom: "0.25rem" }}
                  />
                ))}
              </ul>
            )}
          </BulletListItem>
        );
      })}
    </BulletList>
  );
};

const TrendContainer = styled.div`
  margin-bottom: 1.5rem;
  color: #ccc;
  line-height: 1.6;

  /* Highlight style now only makes text bold */
  .highlight {
    font-weight: bold;
    color: #fff;
  }
`;

const TrendHeading = styled.span`
  font-weight: bold;
  color: #fff;
`;

const TrendPointsBlock = ({ block }) => {
  const { introParagraphs = [], items = [] } = block;

  return (
    <TrendContainer>
      {introParagraphs.map((para, i) => (
        <p key={`intro-${i}`} style={{ marginBottom: "1rem" }}>
          {para}
        </p>
      ))}

      <ul style={{ paddingLeft: "1.2rem" }}>
        {items.map((item, idx) => (
          <li key={`item-${idx}`} style={{ marginBottom: "1rem" }}>
            {item.heading && <TrendHeading>{item.heading}</TrendHeading>}

            {item.lines && item.lines.length > 0 && (
              <ul style={{ marginTop: "0.5rem", paddingLeft: "1.2rem" }}>
                {item.lines.map((line, lineIdx) => (
                  <li
                    key={`line-${lineIdx}`}
                    style={{ marginBottom: "0.5rem" }}
                    // Render HTML in each line
                    dangerouslySetInnerHTML={{ __html: line }}
                  />
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </TrendContainer>
  );
};

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
      <TopNavBar>
        {topNavData.map((navItem) => (
          <TopNavLink
            key={navItem.id}
            $active={activeTopNav === navItem.id}
            onClick={() => handleTopNavClick(navItem.id)}
          >
            {navItem.label}
          </TopNavLink>
        ))}

        {/* Hamburger button: only visible below md */}
        <Button
          variant="primary"
          className="d-md-none ms-auto" // d-md-none = hide at md+, ms-auto = push to right
          onClick={() => setShowOffcanvas(true)}
        >
          ☰ Menu
        </Button>
      </TopNavBar>

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
