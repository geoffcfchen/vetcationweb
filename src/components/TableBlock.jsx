// components/TableBlock.jsx
import React from "react";
import styled from "styled-components";

// fades at edges hint there's more to scroll
const ScrollRegion = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid #333;
  border-radius: 8px;
  position: relative;
`;

const Note = styled.p`
  color: #aaa;
  margin-top: 0.5rem;
  line-height: 1.5;
  font-size: 0.95rem;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: ${(p) => p.$minWidth || "720px"}; /* triggers horizontal scroll */
  table-layout: auto;
  color: #ccc;
  word-break: break-word;
  overflow-wrap: anywhere; /* allow breaking long tokens */
  white-space: normal; /* let text wrap */

  caption {
    text-align: left;
    font-weight: 600;
    color: #fff;
    margin-bottom: 0.5rem;
  }

  thead th {
    position: sticky; /* sticky header on scroll */
    top: 0;
    z-index: 2;
    background: #141414;
    color: #fff;
  }

  th,
  td {
    padding: 0.75rem;
    border-bottom: 1px solid #2a2a2a;
    vertical-align: top;
    white-space: normal; /* make sure cell text wraps */
    overflow-wrap: anywhere; /* break long URLs/words if needed */
  }

  /* Optional: sticky first column if you use row headers */
  tbody th[scope="row"] {
    position: sticky;
    left: 0;
    z-index: 1;
    background: #1c1c1c;
    font-weight: 600;
    color: #fff;
    white-space: normal;
    overflow-wrap: anywhere;
  }
  /* Add this block: link styling */
  a {
    color: #4db6c5; /* your chosen colour */
    text-decoration: underline;
    word-break: break-word; /* also wrap long links */
    overflow-wrap: anywhere;
  }
  a:hover,
  a:focus {
    color: #81d4fa; /* hover/focus colour */
  }
`;

export default function TableBlock({ block }) {
  const {
    columns = [],
    rows = [],
    note, // ← add this
    minWidth,
    rowHeaders = false,
    responsive = "scroll", // "scroll" | "stack" | "auto"
    stackBreakpoint = 640,
  } = block;

  const renderCell = (value) =>
    typeof value === "string" ? (
      <span dangerouslySetInnerHTML={{ __html: value }} />
    ) : (
      <span>{value ?? ""}</span>
    );

  // helper to attach column titles for optional stacked view
  const cellProps = (col) => ({
    "data-label": col.title, // used by stacked CSS below
  });

  return (
    <>
      {/* Scrollable table (accessible default) */}
      <ScrollRegion
        role="region"
        aria-label={"Data table"}
        tabIndex={0}
        className={block.responsive !== "scroll" ? "scroll-stack" : undefined}
      >
        <StyledTable $minWidth={minWidth}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} scope="col">
                  {c.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                {columns.map((c, i) => {
                  const content = renderCell(row[c.key]);
                  if (i === 0 && rowHeaders) {
                    return (
                      <th key={c.key} scope="row">
                        {content}
                      </th>
                    );
                  }
                  return (
                    <td key={c.key} {...cellProps(c)}>
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </ScrollRegion>

      {note ? <Note dangerouslySetInnerHTML={{ __html: note }} /> : null}

      {/* Optional stacked cards for narrow screens (CSS-only) */}
      {responsive !== "scroll" && (
        <style>{`
@media (max-width: ${stackBreakpoint}px) {
 /* stop horizontal scrolling in stacked mode */
 .scroll-stack {
   overflow-x: visible;     /* no sideways scroll */
 }
  /* hide table header, present cells as blocks with inline labels */
  .scroll-stack table thead,
  .scroll-stack table tfoot { display: none; }

  .scroll-stack table,
  .scroll-stack tbody,
  .scroll-stack tr,
  .scroll-stack td,
  .scroll-stack th[scope="row"] {
    display: block;
    width: 100%;
    min-width: 0 !important; /* override the desktop min-width */
  }

  .scroll-stack tr {
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    margin: 0.75rem 0;
    background: #141414;
  }

  .scroll-stack td,
  .scroll-stack th[scope="row"] {
    border: 0;
    padding: 0.4rem 0;
    white-space: normal;       /* wrap lines on mobile cards */
    overflow-wrap: anywhere;   /* break long tokens/URLs */
  }

  .scroll-stack td::before,
  .scroll-stack th[scope="row"]::before {
    content: attr(data-label);
    display: block;
    font-weight: 600;
    color: #9aa0a6;
    margin-bottom: 0.125rem;
  }
}
        `}</style>
      )}
    </>
  );
}
