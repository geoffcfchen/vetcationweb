import styled, { css } from "styled-components";

/** Outer container for the entire sidebar. */
export const SidebarContainer = styled.div`
  width: 240px; /* adjust as needed */
  background-color: #0d0d0d;
  color: #fff;
  padding: 16px;
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
`;

/** Title for each group (e.g. "USER MANUAL", "CLI"). */
export const SidebarGroupTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #999;
  margin: 24px 0 8px;
`;

/**
 * A container that draws a vertical line on the left,
 * connecting all items in that group (or sub-group).
 */
export const VerticalLineContainer = styled.div`
  position: relative;
  margin-left: 0;
  padding-left: 16px;

  /* Draw the vertical line */
  &::before {
    content: "";
    position: absolute;
    left: 4px;
    top: 0;
    bottom: 0;
    width: 1px;
    background-color: #333;
  }

  /* If you want to hide the line on the top item or control line offset, adjust as needed */
`;

/**
 * A second-level container that draws a *second* vertical line,
 * creating the effect of two parallel lines when there are sub-subitems.
 */
export const SecondLevelContainer = styled.div`
  position: relative;
  margin-left: 1px;
  padding-left: 10px;

  /* First line (the parent's line) is still visible from the parent container, 
     so we draw another line for the second level: */
  &::before {
    content: "";
    position: absolute;
    left: 4px;
    top: 0;
    bottom: 0;
    width: 1px;
    background-color: #333;
  }
`;

/** A clickable row for either a parent item or sub-item. */
export const SidebarItemRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; /* arrow on the right */
  cursor: pointer;
  padding: 6px 0;
  font-size: 0.875rem;
  color: ${(props) => (props.$active ? "#fff" : "#ccc")};
  transition: color 0.2s ease;

  &:hover {
    color: #fff;
  }

  /* Optional: highlight the active item with a small colored bar or bold text */
  ${(props) =>
    props.$active &&
    css`
      font-weight: 500;
    `}
`;

/** The arrow icon on the right side, rotating if expanded. */
export const ArrowIcon = styled.span`
  font-size: 0.95rem;
  margin-left: 8px;
  transform: rotate(${(props) => (props.$isExpanded ? "90deg" : "0deg")});
  transition: transform 0.2s ease;
`;
