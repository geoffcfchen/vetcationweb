import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop({ containerRef }) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (containerRef && containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [pathname, containerRef]);

  return null;
}

export default ScrollToTop;
