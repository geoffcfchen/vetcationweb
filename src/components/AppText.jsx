// src/components/AppText.jsx
import React, { useState } from "react";
import styled from "styled-components";

const Text = styled.p`
  font-size: ${({ fontSize }) => fontSize || "16px"};
  color: ${({ color }) => color || "black"};
  margin: 0;
`;

const LinkText = styled.a`
  color: blue;
  text-decoration: underline;
  cursor: pointer;
`;

const ExpandToggle = styled.span`
  color: #1da1f2;
  cursor: pointer;
  margin-top: 5px;
  display: inline-block;
`;

const AppText = ({
  children,
  style,
  expandable,
  numberOfLinesForExpandable = 3,
  ...otherProps
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const renderText = (text) => {
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(linkRegex);
    return parts.map((part, index) => {
      if (part.match(linkRegex)) {
        return (
          <LinkText
            href={part}
            key={index}
            target="_blank"
            rel="noopener noreferrer"
          >
            {part}
          </LinkText>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const textContent =
    typeof children === "string" ? renderText(children) : children;

  return (
    <>
      <Text
        {...otherProps}
        style={{ ...style }}
        fontSize={style?.fontSize}
        color={style?.color}
      >
        {expandable && !isExpanded && typeof children === "string"
          ? `${children
              .split(" ")
              .slice(0, numberOfLinesForExpandable)
              .join(" ")}...`
          : textContent}
      </Text>

      {expandable && (
        <ExpandToggle onClick={handleToggle}>
          {isExpanded ? "Show less" : "Show more"}
        </ExpandToggle>
      )}
    </>
  );
};

export default AppText;
