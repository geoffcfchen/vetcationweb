// src/components/accordion/AccordionItem.jsx
import React, { useState } from "react";
import {
  AccordionContainer,
  AccordionHeader,
  AccordionBody,
} from "./AccordionStyles.js";

export default function AccordionItem({ title, content }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <AccordionContainer>
      <AccordionHeader onClick={toggleOpen}>{title}</AccordionHeader>
      <AccordionBody isOpen={isOpen}>
        {Array.isArray(content) ? (
          content.map((paragraph, idx) => (
            <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />
          ))
        ) : (
          <p dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </AccordionBody>
    </AccordionContainer>
  );
}
