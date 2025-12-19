// src/pages/EmailVerificationPage.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { auth } from "../lib/firebase";

const Page = styled.div`
  min-height: 100vh;
  background: #ffffff;
  color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 480px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  padding: 24px 20px 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 12px;
`;

const BodyText = styled.p`
  font-size: 14px;
  color: #4b5563;
  margin: 0 0 20px;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PrimaryButton = styled.button`
  width: 100%;
  border-radius: 999px;
  border: none;
  padding: 12px 18px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  background: #111827;
  color: #f9fafb;

  &:hover {
    background: #000000;
  }
`;

const SecondaryButton = styled.button`
  width: 100%;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  padding: 12px 18px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  background: #ffffff;
  color: #111827;

  &:hover {
    background: #f9fafb;
  }
`;

const SmallText = styled.p`
  margin-top: 10px;
  font-size: 12px;
  color: #6b7280;
`;

const ErrorText = styled.p`
  margin-top: 8px;
  font-size: 13px;
  color: #b91c1c;
`;

function EmailVerificationPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCheck = async () => {
    setMessage("");
    setError("");

    const user = auth.currentUser;
    if (!user) {
      setError("You are not signed in.");
      return;
    }

    try {
      await user.reload();
      if (user.emailVerified) {
        setMessage(
          "Your email is verified. You can reload the page or navigate again."
        );
        // The global auth listener + routing logic will take care of redirecting away from this page.
      } else {
        setMessage(
          "Your email is still not verified. Please click the link in your inbox."
        );
      }
    } catch (err) {
      console.error("Error checking verification:", err);
      setError("Could not check verification. Please try again.");
    }
  };

  const handleResend = async () => {
    setMessage("");
    setError("");

    const user = auth.currentUser;
    if (!user) {
      setError("You are not signed in.");
      return;
    }

    try {
      await user.sendEmailVerification();
      setMessage("Verification email sent. Please check your inbox.");
    } catch (err) {
      console.error("Error resending verification email:", err);
      setError("Could not resend verification email. Please try again.");
    }
  };

  return (
    <Page>
      <Card>
        <Title>Email verification</Title>
        <BodyText>
          Please verify your email address. Check your email for a verification
          link, then click the button below to check again.
        </BodyText>

        <ButtonRow>
          <PrimaryButton type="button" onClick={handleCheck}>
            I have verified my email
          </PrimaryButton>
          <SecondaryButton type="button" onClick={handleResend}>
            Resend verification email
          </SecondaryButton>
        </ButtonRow>

        {message && <SmallText>{message}</SmallText>}
        {error && <ErrorText>{error}</ErrorText>}
      </Card>
    </Page>
  );
}

export default EmailVerificationPage;
