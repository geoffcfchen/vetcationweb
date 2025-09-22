// ./pages/DocsContent.jsx
import React, { useRef, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";

import BulletListBlock from "../../components/BulletListBlock";
import TrendPointsBlock from "../../components/TrendPointsBlock";
import QAContentBlock from "../../components/QAContentBlock";
import ParagraphBlock from "../../components/ParagraphBlock";
import FramedImageBlock from "../../components/FramedImageBlock";
import contentData from "../docsContentData";
import CustomContributorListBlock from "../../components/CustomContributorListBlock";
import InteractiveMapBlock from "../../components/InteractiveMapBlock";
import MissionContentBlock from "../../components/MissionContentBlock";
// Import other block components as needed

function DocsContent() {
  // Get route parameters (e.g. topNavId and docId)
  const { topNavId, docId } = useParams();
  // Use docId as the key to load the correct document data.
  const doc = contentData[topNavId]?.[docId];

  // Get layout callbacks from Outlet context
  const { registerSections, setActiveSection } = useOutletContext();

  // Set up section refs and intersection observer for highlighting
  const sectionRefs = useRef({});

  useEffect(() => {
    if (doc) {
      registerSections(doc.sections);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "0% 0% -50% 0%",
        threshold: 0.1,
      }
    );

    doc?.sections.forEach((sec) => {
      const el = sectionRefs.current[sec.id];
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      registerSections([]);
    };
  }, [doc, registerSections, setActiveSection]);

  if (!doc) {
    return <p>Document not found.</p>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>{doc.mainTitle}</h1>
      {doc.mainDescription && (
        <p
          style={{ color: "#ccc", lineHeight: "1.6", marginTop: "1rem" }}
          dangerouslySetInnerHTML={{ __html: doc.mainDescription }}
        />
      )}
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
              case "qa":
                return <QAContentBlock key={blockKey} block={block} />;
              case "root":
                return <MissionContentBlock key={blockKey} block={block} />;
              case "paragraph":
                return <ParagraphBlock key={blockKey} block={block} />;
              case "framedImage":
                return <FramedImageBlock key={blockKey} block={block} />;
              case "map":
                return <InteractiveMapBlock key={blockKey} block={block} />;
              case "customContributorList":
                return (
                  <CustomContributorListBlock key={blockKey} block={block} />
                );
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

export default DocsContent;
