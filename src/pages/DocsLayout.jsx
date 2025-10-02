// DocsLayout.jsx
import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
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
  const suppressInitialHashRef = useRef(false);
  const { topNavId = "home" } = useParams();
  const location = useLocation(); // ← new

  const prevKeyRef = useRef(location.key);

  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [docSections, setDocSections] = useState([]);
  const [activeSectionId, setActiveSectionId] = useState(null);

  // NEW: track whether the nav should be hidden
  const [hideNav, setHideNav] = useState(false);

  const mainContentRef = useRef(null);

  const lastScrollYRef = useRef(0);

  // Wrap registerSections in useCallback so its identity is stable
  const registerSections = useCallback((sectionsArray) => {
    setDocSections(sectionsArray || []);
  }, []);

  // Similarly, wrap setActiveSection
  const setActiveSection = useCallback((sectionId) => {
    setActiveSectionId(sectionId);
  }, []);

  useLayoutEffect(() => {
    if (location.hash) return;

    const container = mainContentRef.current;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // reset baseline + start visible
      lastScrollYRef.current = 0;
      setHideNav(false);
    } else if (container) {
      container.scrollTop = 0;
      // (optional) reset any desktop baseline if you implement it
    }
  }, [location.pathname]);

  const handleTopNavClick = (navId) => {
    const item = topNavData.find((n) => n.id === navId);
    const defaultDocId = item?.defaultDocId ?? "introToVetcation";
    navigate(`/telemedicine-info/${navId}/${defaultDocId}`, {
      state: { suppressInitialHash: true },
    });
  };

  // When route changes, remember if this navigation asked us to suppress the first hash write
  useLayoutEffect(() => {
    if (prevKeyRef.current !== location.key) {
      // Any route transition → suppress the very next hash write
      suppressInitialHashRef.current = true;
      prevKeyRef.current = location.key;
    }
  }, [location.key]);

  // ✅ Clear the section on route/path change (place this BEFORE the hash-writer)
  useEffect(() => {
    setActiveSectionId(null);
  }, [location.pathname]);

  useEffect(() => {
    if (!activeSectionId) return;
    if (suppressInitialHashRef.current) {
      suppressInitialHashRef.current = false; // consume once
      return;
    }
    navigate(
      { pathname: location.pathname, hash: activeSectionId },
      { replace: true }
    );
  }, [activeSectionId, location.pathname, navigate]);
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
  // useEffect(() => {
  //   // For mobile, listen to window's scroll; desktop you can still use container scroll if needed
  //   const handleScroll = () => {
  //     if (window.innerWidth <= 768) {
  //       const currentScrollY = window.scrollY;
  //       // Using a hysteresis: scroll down > 50px triggers hide; scroll up > 30px triggers show
  //       if (currentScrollY - lastScrollY > 30) {
  //         setHideNav(true);
  //       } else if (lastScrollY - currentScrollY > 20) {
  //         setHideNav(false);
  //       }
  //       lastScrollY = currentScrollY;
  //     }
  //   };

  //   let lastScrollY = window.scrollY;
  //   if (window.innerWidth <= 768) {
  //     window.addEventListener("scroll", handleScroll);
  //   } else {
  //     // For desktop you might still use mainContentRef if needed
  //     const container = mainContentRef.current;
  //     if (container) {
  //       container.addEventListener("scroll", handleScroll);
  //     }
  //   }
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //     const container = mainContentRef.current;
  //     if (container) {
  //       container.removeEventListener("scroll", handleScroll);
  //     }
  //   };
  // }, []);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const handleScroll = () => {
      if (!isMobile) return;

      const prev = lastScrollYRef.current;
      const curr = window.scrollY;

      // hysteresis: down > 30 → hide; up > 20 → show
      if (curr - prev > 30) setHideNav(true);
      else if (prev - curr > 20) setHideNav(false);

      lastScrollYRef.current = curr; // update baseline
    };

    if (isMobile) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    } else {
      // If you later support desktop hide/show via the container:
      const container = mainContentRef.current;
      if (container) {
        container.addEventListener("scroll", handleScroll, { passive: true });
      }
      return () =>
        container && container.removeEventListener("scroll", handleScroll);
    }

    return () => window.removeEventListener("scroll", handleScroll);
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
