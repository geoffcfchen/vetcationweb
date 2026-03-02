import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { FiFolder, FiUpload, FiShare2 } from "react-icons/fi";

export default function PetOverviewPage() {
  const navigate = useNavigate();
  const { petId } = useParams();

  return (
    <Grid>
      <Card>
        <Title>Quick actions</Title>
        <Actions>
          <ActionButton
            type="button"
            onClick={() => navigate(`/app/pets/${petId}/upload`)}
          >
            <FiUpload /> Upload record
          </ActionButton>
          <ActionButton
            type="button"
            onClick={() => navigate(`/app/pets/${petId}/records`)}
          >
            <FiFolder /> View records
          </ActionButton>
          <ActionButton
            type="button"
            onClick={() => navigate(`/app/pets/${petId}/share`)}
          >
            <FiShare2 /> Share link
          </ActionButton>
        </Actions>
      </Card>

      <Card>
        <Title>What to do first</Title>
        <List>
          <li>Upload vaccine records</li>
          <li>Upload the most recent invoice</li>
          <li>Upload recent lab results</li>
          <li>Confirm current medications</li>
        </List>
      </Card>
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 14px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: #0f172a;
`;

const Actions = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ActionButton = styled.button`
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: #ffffff;
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f8fafc;
  }
`;

const List = styled.ul`
  margin: 10px 0 0;
  padding-left: 18px;
  color: #334155;
  font-size: 13px;
  line-height: 1.6;
`;
