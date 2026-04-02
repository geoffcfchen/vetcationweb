// src/components/DocsPager.jsx
import React from "react";
import styled from "styled-components";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const Wrap = styled.nav`
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #2a2a2a;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    margin-top: 24px;
    padding-top: 18px;
  }
`;

const Empty = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavCard = styled.button`
  width: 100%;
  border: 1px solid #2f2f2f;
  background: #151515;
  color: #fff;
  border-radius: 14px;
  padding: 14px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: ${(p) => (p.$right ? "right" : "left")};

  &:hover {
    background: #1d1d1d;
    border-color: #4d9fec;
  }

  &:focus-visible {
    outline: 2px solid #4d9fec;
    outline-offset: 2px;
  }
`;

const TextWrap = styled.div`
  min-width: 0;
  flex: 1;
`;

const Label = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8b8b8b;
  margin-bottom: 4px;
`;

const Title = styled.div`
  font-size: 15px;
  font-weight: 700;
  line-height: 1.3;
`;

const Meta = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: #9ca3af;
`;

function PagerCard({ item, direction, onClick }) {
  if (!item) return <Empty />;

  const isNext = direction === "next";

  return (
    <NavCard
      type="button"
      onClick={() => onClick(item)}
      $right={isNext}
      aria-label={`${isNext ? "Next" : "Previous"}: ${item.label}`}
    >
      {!isNext && <FiArrowLeft size={18} />}

      <TextWrap>
        <Label>{isNext ? "Next" : "Previous"}</Label>
        <Title>{item.label}</Title>
        <Meta>{item.parentLabel || item.groupTitle}</Meta>
      </TextWrap>

      {isNext && <FiArrowRight size={18} />}
    </NavCard>
  );
}

export default function DocsPager({ previousDoc, nextDoc, onNavigate }) {
  if (!previousDoc && !nextDoc) return null;

  return (
    <Wrap aria-label="Document navigation">
      <PagerCard item={previousDoc} direction="previous" onClick={onNavigate} />
      <PagerCard item={nextDoc} direction="next" onClick={onNavigate} />
    </Wrap>
  );
}
