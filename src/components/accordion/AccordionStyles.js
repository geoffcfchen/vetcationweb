// src/components/accordion/AccordionStyles.js

import styled from "styled-components";

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
