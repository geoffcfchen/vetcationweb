import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function SmartHtml({ html }) {
  const navigate = useNavigate();

  const onClick = useCallback(
    (e) => {
      // Only care about anchor clicks inside
      const anchor = e.target.closest && e.target.closest("a");
      if (!anchor) return;

      // Only upgrade internal links you mark explicitly
      if (anchor.dataset.router === "true") {
        e.preventDefault();

        // Support absolute and relative internal hrefs
        const url = new URL(
          anchor.getAttribute("href"),
          window.location.origin
        );

        navigate(
          { pathname: url.pathname, hash: url.hash },
          { state: { suppressInitialHash: true } }
        );
      }
    },
    [navigate]
  );

  return (
    <div
      onClick={onClick}
      // your content already includes trusted inline HTML (spans, etc.)
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
