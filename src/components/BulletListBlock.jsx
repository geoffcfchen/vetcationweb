// ./components/BulletListBlock.jsx
import React from "react";
import styled from "styled-components";

const BulletList = styled.ul`
  list-style: disc;
  margin: 1rem 0;
  padding-left: 1.5rem;
  color: #ccc;

  .highlight {
    font-weight: bold;
    color: #fff;
  }
`;

const BulletListItem = styled.li`
  margin-bottom: 0.5rem;
  line-height: 1.6;
`;

const BulletListBlock = ({ block }) => {
  return (
    <BulletList>
      {block.items.map((item, index) => {
        const { heading = "", lines = [] } = item;
        return (
          <BulletListItem key={index}>
            {heading && (
              <span style={{ fontWeight: "bold", color: "#fff" }}>
                {heading}
              </span>
            )}

            {lines.length > 0 && (
              <ul style={{ marginTop: "0.5rem", paddingLeft: "1.2rem" }}>
                {lines.map((line, lineIdx) => (
                  <li
                    key={`line-${lineIdx}`}
                    style={{ marginBottom: "0.25rem" }}
                    dangerouslySetInnerHTML={{ __html: line }}
                  />
                ))}
              </ul>
            )}
          </BulletListItem>
        );
      })}
    </BulletList>
  );
};

export default BulletListBlock;
