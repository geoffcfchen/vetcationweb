// ./pages/docs/IntroToVetcation.jsx
import React, { useRef, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import introToVetcationData from "../../data/docs/introToVetcationData";
import BulletListBlock from "../../components/BulletListBlock";
import TrendPointsBlock from "../../components/TrendPointsBlock";

function IntroToVetcation() {
  const doc = introToVetcationData;
  // Grab the layout callbacks from the outlet context
  const { registerSections, setActiveSection } = useOutletContext();

  // Intersection observer references
  const sectionRefs = useRef({});

  useEffect(() => {
    // 1) Let the layout know which sections we have
    registerSections(doc.sections);

    // 2) Intersection observer to highlight sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // If we want to highlight a section, call setActiveSection
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        // You can tune rootMargin or threshold
        root: null,
        rootMargin: "0% 0% -50% 0%",
        threshold: 0.1,
      }
    );

    doc.sections.forEach((sec) => {
      const el = sectionRefs.current[sec.id];
      if (el) observer.observe(el);
    });

    // Cleanup
    return () => {
      observer.disconnect();
      // Also optionally clear sections on unmount
      registerSections([]);
    };
  }, [doc.sections, registerSections, setActiveSection]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>{doc.mainTitle}</h1>

      {/* main description */}
      {doc.mainDescription && (
        <p
          style={{ color: "#ccc", lineHeight: "1.6", marginTop: "1rem" }}
          dangerouslySetInnerHTML={{ __html: doc.mainDescription }}
        />
      )}

      {/* sections */}
      {doc.sections.map((sec) => (
        <div
          key={sec.id}
          id={sec.id}
          ref={(el) => (sectionRefs.current[sec.id] = el)}
          style={{ marginBottom: "2rem" }}
        >
          <h2 style={{ marginTop: "2rem" }}>{sec.title}</h2>

          {sec.blocks.map((block, index) => {
            const blockKey = `${sec.id}-block-${index}`;
            switch (block.type) {
              case "bulletList":
                return <BulletListBlock key={blockKey} block={block} />;
              case "trendPoints":
                return <TrendPointsBlock key={blockKey} block={block} />;
              default:
                return (
                  <p key={blockKey} style={{ color: "#ccc" }}>
                    {JSON.stringify(block)}
                  </p>
                );
            }
          })}
        </div>
      ))}
    </div>
  );
}

export default IntroToVetcation;
