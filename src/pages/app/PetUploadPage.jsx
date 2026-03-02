import React from "react";
import styled from "styled-components";

export default function PetUploadPage() {
  return (
    <Card>
      <Title>Upload</Title>
      <Text>
        Next: we will add drag and drop upload and an upload queue here.
      </Text>
    </Card>
  );
}

const Card = styled.div`
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 18px;
  padding: 16px;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: #0f172a;
`;

const Text = styled.div`
  margin-top: 10px;
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
`;
