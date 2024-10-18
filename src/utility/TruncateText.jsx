// src/utility/TruncateText.jsx
import React from "react";
import styled from "styled-components";

// TruncateText Component
const TruncateText = ({ text, maxLength, style, loading = false }) => {
  if (loading) {
    return <LoadingIndicator>Loading...</LoadingIndicator>;
  }

  const safeText = text ?? "";

  const truncatedText =
    safeText.length > maxLength
      ? safeText.substring(0, maxLength) + "..."
      : safeText;

  return <Truncated style={style}>{truncatedText}</Truncated>;
};

// Styled components
const LoadingIndicator = styled.div`
  font-size: 14px;
  color: #3498db; /* Use colors.primary from your config */
`;

const Truncated = styled.p`
  font-size: 14px;
  color: #333;
  margin: 0;
`;

export default TruncateText;
