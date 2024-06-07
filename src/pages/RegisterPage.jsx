import React from "react";
import styled from "styled-components";
import RegisterSection from "../components/RegisterSection";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 28px;
`;

const Description = styled.p`
  text-align: center;
  font-size: 18px;
  color: #555;
  max-width: 600px;
`;

const AppPreviewImage = styled.img`
  margin-top: 20px;
  width: 80%;
  max-width: 300px;
`;

const QRCode = styled.img`
  margin: 20px 0;
  width: 120px;
  height: 120px;
`;

function RegisterPage() {
  return (
    <>
      <RegisterSection />
    </>
  );
}

export default RegisterPage;
