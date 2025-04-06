import React from "react";
import styled from "styled-components";

const TrendContainer = styled.div`
  margin-bottom: 1.5rem;
  color: #ccc;
  line-height: 1.6;

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
        <p key={i} style={{ marginBottom: "1rem" }}>
          {para}
        </p>
      ))}

      <ul style={{ paddingLeft: "1.2rem" }}>
        {items.map((item, idx) => (
          <li key={idx} style={{ marginBottom: "1rem" }}>
            {item.heading && <TrendHeading>{item.heading}</TrendHeading>}

            {item.lines && item.lines.length > 0 && (
              <ul style={{ marginTop: "0.5rem", paddingLeft: "1.2rem" }}>
                {item.lines.map((line, lineIdx) => (
                  <li
                    key={lineIdx}
                    style={{ marginBottom: "0.5rem" }}
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

export default TrendPointsBlock;
